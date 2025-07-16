// Navbar.tsx
import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

const defaultStickers = [
  "https://cdn-icons-png.flaticon.com/256/6280/6280036.png",
  "https://cdn-icons-png.flaticon.com/256/9155/9155640.png",
  "https://cdn-icons-png.flaticon.com/256/7516/7516586.png",
  "https://cdn-icons-png.flaticon.com/256/6439/6439929.png",
  "https://cdn-icons-png.flaticon.com/256/7600/7600410.png",
];

const defaultFrames = ["/f1.png", "/f2.png", "/t1.png"];

interface NavbarProps {
  onStickerSelect: (src: string) => void;
  onFrameSelect: (src: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onStickerSelect, onFrameSelect }) => {
  const [isStickerOpen, setStickerOpen] = useState(false);
  const [isFrameOpen, setFrameOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-14 bg-white shadow flex items-center justify-between px-4 z-50">
        <h1 className="text-xl font-bold">MiAlter</h1>
        <div className="space-x-4">
          <button
            onClick={() => setStickerOpen(true)}
            className="text-blue-600 hover:underline"
          >
            Stickers
          </button>
          <button
            onClick={() => setFrameOpen(true)}
            className="text-blue-600 hover:underline"
          >
            Frames
          </button>
        </div>
      </nav>

      {/* Stickers Dialog */}
      <Dialog
        open={isStickerOpen}
        onClose={() => setStickerOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white rounded p-6 space-y-4">
            <DialogTitle className="text-lg font-bold">
              Choose a Sticker
            </DialogTitle>
            <div className="grid grid-cols-3 gap-4">
              {defaultStickers.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="sticker"
                  className="h-20 w-20 object-contain cursor-pointer border hover:scale-105 transition"
                  onClick={() => {
                    onStickerSelect(src);
                    setStickerOpen(false);
                  }}
                />
              ))}
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded">
              Add New Sticker
            </button>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Frames Dialog */}
      <Dialog
        open={isFrameOpen}
        onClose={() => setFrameOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white rounded p-6 space-y-4">
            <DialogTitle className="text-lg font-bold">
              Choose a Frame
            </DialogTitle>
            <div className="grid grid-cols-3 gap-4">
              {defaultFrames.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="frame"
                  className="h-20 w-20 object-contain cursor-pointer border hover:scale-105 transition"
                  onClick={() => {
                    onFrameSelect(src);
                    setFrameOpen(false);
                  }}
                />
              ))}
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded">
              Add New Frame
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Navbar;
