import React, { useState, useEffect } from "react";
import DraggableResizableImage from "./imageopts";
import { useLocation } from "react-router-dom";

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
  const MAX_IMAGES = 10;
  const location = useLocation();
  const loadSaved = location.state?.loadSaved ?? false;

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
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    const newImages: ImageData[] = fileURLs.map((src) => ({
      src,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotate: 0,
    }));

    setImages((prev) => {
      const urlImages = prev.filter((img) => !img.src.startsWith("blob:"));
      const blobImages = prev.filter((img) => img.src.startsWith("blob:"));
      const combined = [...urlImages, ...blobImages, ...newImages];
      setC((prev) => prev + 1);
      return combined.slice(0, MAX_IMAGES);
    });
  };

  const handleBgImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBgImg(imageUrl);
    }
  };

  const handleURLInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImageURLs(e.target.value);
  };

  const handleURLUpload = () => {
    const urls = imageURLs
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter(Boolean);

    const newImages: ImageData[] = urls.map((src) => ({
      src,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotate: 0,
    }));

    setImages((prev) => {
      const blobImages = prev.filter((img) => img.src.startsWith("blob:"));
      const combined = [...blobImages, ...newImages];
      setC((prev) => prev + 1);
      return combined.slice(0, MAX_IMAGES);
    });
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

  const STORAGE_KEY = "saved_template";

  const saveToLocalStorage = (data: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const loadFromLocalStorage = (): any | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  };

  useEffect(() => {
    if (loadSaved) {
      const saved = loadFromLocalStorage();
      if (saved) {
        setUnit(saved.unit);
        setC(saved.c);
        setWidthInput(saved.widthInput);
        setHeightInput(saved.heightInput);
        setBgColor(saved.bgColor);
        setImages(saved.images);
        setBgImg(saved.bgImg);
      }
    }
  }, [loadSaved]);

  const handleSaveTemplate = () => {
    const dataToSave = {
      unit,
      c,
      widthInput,
      heightInput,
      bgColor,
      bgImg,
      images,
    };
    saveToLocalStorage(dataToSave);
    alert("Template saved!");
  };

  return (
    <div
      className="min-h-screen bg-gray-100"
      onClick={() => setSelectedImageIndex(null)}
    >
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 p-4 shadow-md overflow-y-auto"
        aria-label="Sidebar"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Set Dimensions
          </h2>
        </div>
        <div className="space-y-4">
          {/* width */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Width</label>
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
            <label className="block text-sm text-gray-600 mb-1">Height</label>
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
      </aside>

      {/* Canvas */}
      <div className="sm:ml-64 p-6">
        <div
          className="border-2 border-dashed border-gray-400 mx-auto relative"
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
      </div>
    </div>
  );
};

export default Bgframe;
