import React, { useState, useEffect, useRef } from "react";
import DraggableResizableImage from "./imageopts";
import { useLocation } from "react-router-dom";
import domtoimage from "dom-to-image";
import Navbar from "./navbar";

interface ImageData {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  lockAspectRatio?: boolean;
  shape?: "none" | "circle" | "hexagon";
}

const Bgframe: React.FC = () => {
  const [unit, setUnit] = useState<"cm" | "m" | "ft">("cm");
  const [c, setC] = useState<number>(0);
  const [widthInput, setWidthInput] = useState<number>(30);
  const [heightInput, setHeightInput] = useState<number>(20);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [images, setImages] = useState<ImageData[]>([]);
  const [bgImg, setBgImg] = useState<string | null>(null);
  const [imageURLs, setImageURLs] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const MAX_IMAGES = 15;
  const location = useLocation();
  const loadSaved = location.state?.loadSaved ?? false;
  const template = location.state?.template ?? null;

  const convertToPixels = (value: number, unit: string): number => {
    if (unit === "cm") return value * 0.6;
    if (unit === "m") return value * 60;
    if (unit === "ft") return value * 20;
    return value;
  };

  const pixelWidth = convertToPixels(widthInput, unit);
  const pixelHeight = convertToPixels(heightInput, unit);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const readers = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject("Failed to read file");
        reader.readAsDataURL(file); // base64!
      });
    });

    Promise.all(readers).then((fileURLs) => {
      const newImages: ImageData[] = fileURLs.map((src) => ({
        src,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotate: 0,
      }));

      setImages((prev) => {
        const combined = [...prev, ...newImages];
        setC((prev) => prev + newImages.length);
        return combined.slice(0, MAX_IMAGES);
      });
    });
  };

  const handleBgImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBgImg(reader.result as string); // Base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleURLInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImageURLs(e.target.value);
  };

  const handleURLUpload = async () => {
    const urls = imageURLs
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter(Boolean);

    const toBase64FromURL = async (url: string): Promise<string> => {
      try {
        const proxyUrl = `http://34.227.75.19:8000/proxy-image?url=${encodeURIComponent(
          url
        )}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}`);
        }

        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error(`Failed to fetch ${url}`, err);
        return ""; // fallback empty string
      }
    };

    try {
      const base64URLs = await Promise.all(urls.map(toBase64FromURL));
      const newImages: ImageData[] = base64URLs
        .filter((src) => src !== "")
        .map((src) => ({
          src,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          rotate: 0,
        }));

      setImages((prev) => {
        const combined = [...prev, ...newImages];
        setC((prev) => prev + newImages.length);
        return combined.slice(0, MAX_IMAGES);
      });
    } catch (err) {
      console.error("URL to base64 conversion failed", err);
      alert("Some URLs could not be loaded.");
    }
  };

  const rotateImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index].rotate = (updated[index].rotate + 90) % 360;
      return updated;
    });
  };

  const updateImage = (index: number, data: Partial<ImageData>) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
  };

  const deleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (selectedImageIndex === index) setSelectedImageIndex(null);
    setC((prev) => prev - 1);
  };

  const handleSaveTemplate = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      unit,
      c,
      widthInput,
      heightInput,
      bgColor,
      bgImg,
      images,
    };

    const url = loadSaved
      ? `http://34.227.75.19:8000/templates/${template._id}`
      : "http://34.227.75.19:8000/templates";

    const method = loadSaved ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      alert(
        loadSaved
          ? "Template updated successfully!"
          : "Template saved successfully!"
      );
    } catch (err) {
      alert("Error saving template.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (loadSaved && template) {
      setUnit(template.unit);
      setC(template.c ?? template.images.length); // fallback
      setWidthInput(template.widthInput);
      setHeightInput(template.heightInput);
      setBgColor(template.bgColor);
      setImages(template.images);
      setBgImg(template.bgImg);
    }
  }, [loadSaved, template]);

  const handleDownload = async () => {
    if (!frameRef.current) return;

    try {
      const dataUrl = await domtoimage.toPng(frameRef.current);
      const link = document.createElement("a");
      link.download = "template.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download image.");
    }
  };

  const handleStickerSelect = (src: string) => {
    const newSticker: ImageData = {
      src,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotate: 0,
    };
    setImages((prev) => {
      const combined = [...prev, newSticker];
      setC((prev) => prev + 1);
      return combined.slice(0, MAX_IMAGES);
    });
  };

  const handleFrameSelect = (src: string) => {
    const newSticker: ImageData = {
      src,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotate: 0,
    };
    setImages((prev) => {
      const combined = [...prev, newSticker];
      setC((prev) => prev + 1);
      return combined.slice(0, MAX_IMAGES);
    });
  };

  return (
    <>
      <Navbar
        onStickerSelect={handleStickerSelect}
        onFrameSelect={handleFrameSelect}
      />
      <div
        className="min-h-screen bg-gray-100 pt-20 flex"
        onClick={() => setSelectedImageIndex(null)}
      >
        {!isSidebarOpen && (
          <button
            className="fixed top-24 left-4 z-50 bg-white border rounded-full shadow p-2 hover:bg-gray-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        )}

        {isSidebarOpen && (
          <aside
            className="w-72 pt-15 pb-20 fixed top-12 left-0 z-40 h-screen bg-white border-r border-gray-200 p-4 shadow-md overflow-y-auto"
            aria-label="Sidebar"
          >
            <button
              className="absolute top-12 right-4 bg-white border rounded-full shadow p-2 hover:bg-gray-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Set Dimensions
              </h2>
            </div>
            <div className="space-y-4">
              {/* width */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={widthInput}
                  onChange={(e) => setWidthInput(+e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Width"
                />
              </div>
              {/* height */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={heightInput}
                  onChange={(e) => setHeightInput(+e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Height"
                />
              </div>
              {/* unit */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "cm" | "m" | "ft")}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="ft">ft</option>
                </select>
              </div>
              {/* background color */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded"
                />
              </div>
              {/* background image */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBgImage}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              {/* upload images */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              {/* image URLs */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Image URLs (comma or newline separated)
                </label>
                <textarea
                  value={imageURLs}
                  onChange={handleURLInput}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.png"
                ></textarea>
                <button
                  onClick={handleURLUpload}
                  className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Upload URLs
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Max {MAX_IMAGES} images allowed.
              </p>
              <p className="text-sm text-gray-500">Images uploaded: {c}</p>
            </div>
            <button
              onClick={handleSaveTemplate}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Save Template
            </button>
            <div>
              <button
                onClick={handleDownload}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Download as PNG
              </button>
            </div>
          </aside>
        )}

        {/* Canvas */}
        <main
          className={`flex-1 p-6 overflow-auto transition-all duration-300 ${
            isSidebarOpen ? "ml-72" : "ml-16"
          }`}
        >
          <div
            ref={frameRef}
            className="border-2 border-dashed border-gray-400 mx-auto relative rounded-lg shadow-md"
            style={{
              width: pixelWidth,
              height: pixelHeight,
              backgroundColor: bgColor,
              backgroundImage: bgImg ? `url(${bgImg})` : "none",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, index) => (
              <DraggableResizableImage
                key={index}
                index={index}
                img={img}
                onUpdate={updateImage}
                onRotate={rotateImage}
                onDelete={deleteImage}
                isSelected={selectedImageIndex === index}
                onSelect={(i) => setSelectedImageIndex(i)}
                frameWidth={pixelWidth}
                frameHeight={pixelHeight}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Bgframe;
