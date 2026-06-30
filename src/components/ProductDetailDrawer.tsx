import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, ShoppingBag } from "lucide-react";
import { Product } from "../types";

interface ProductDetailDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToBag: (product: Product, size: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductDetailDrawer({
  product,
  isOpen,
  onClose,
  onAddToBag,
  onToggleWishlist,
  isWishlisted
}: ProductDetailDrawerProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "");
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end" id="pdp-drawer-container">
          {/* Overlay */}
          <motion.div
            id="pdp-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/35 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.aside
            id="pdp-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-2xl h-full bg-white flex flex-col md:flex-row p-0"
          >
            {/* Close Button Floating */}
            <button
              id="close-pdp-btn"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-xs hover:bg-white text-black transition-all cursor-pointer z-10 border border-neutral-100"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>

            {/* Media Gallery Section */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-neutral-100 relative overflow-hidden flex flex-col justify-between">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700"
              />

              {/* Thumbnails indicator if alternate images are available */}
              {product.hoverImage && (
                <div className="absolute bottom-6 left-6 flex gap-2">
                  <button
                    onClick={() => setActiveImage(product.image)}
                    className={`w-12 h-16 border-2 bg-neutral-200 overflow-hidden cursor-pointer transition-all ${
                      activeImage === product.image ? "border-black scale-105" : "border-transparent"
                    }`}
                  >
                    <img src={product.image} className="w-full h-full object-cover" />
                  </button>
                  <button
                    onClick={() => setActiveImage(product.hoverImage!)}
                    className={`w-12 h-16 border-2 bg-neutral-200 overflow-hidden cursor-pointer transition-all ${
                      activeImage === product.hoverImage ? "border-black scale-105" : "border-transparent"
                    }`}
                  >
                    <img src={product.hoverImage} className="w-full h-full object-cover" />
                  </button>
                </div>
              )}
            </div>

            {/* Detail info Section */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-6 md:p-10 justify-between overflow-y-auto hide-scrollbar">
              <div className="flex flex-col gap-6 mt-12 md:mt-8">
                {/* Title and price */}
                <div className="flex flex-col gap-2">
                  {product.studio && (
                    <span className="bg-black text-white px-3 py-1 font-sans text-[10px] font-bold tracking-widest w-fit">
                      STUDIO
                    </span>
                  )}
                  {product.isNew && (
                    <span className="font-sans text-[9px] font-bold tracking-[0.2em] text-neutral-400">
                      NEW COLLECTION
                    </span>
                  )}
                  <h3 className="font-sans text-[16px] font-bold tracking-widest text-black uppercase leading-tight">
                    {product.name}
                  </h3>
                  <span className="font-sans text-[14px] text-neutral-600 font-medium">
                    {product.price.toFixed(2)} {product.currency}
                  </span>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <p className="font-sans text-xs text-neutral-500 leading-relaxed uppercase tracking-wider text-justify">
                    {product.description}
                  </p>
                </div>

                {/* Sizing selection */}
                <div className="flex flex-col gap-3">
                  <span className="font-sans text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    SELECT SIZE
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`border h-10 px-4 font-sans text-xs tracking-wider transition-all cursor-pointer ${
                          selectedSize === size
                            ? "bg-black text-white border-black font-semibold"
                            : "border-neutral-300 text-neutral-700 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 border-t border-neutral-100 pt-6 mt-6 md:mt-12">
                <button
                  id="add-to-bag-pdp"
                  onClick={() => {
                    onAddToBag(product, selectedSize);
                  }}
                  className="w-full bg-black text-white py-4 font-sans text-[11px] font-bold tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
                >
                  <ShoppingBag className="w-4 h-4" />
                  ADD TO BAG
                </button>

                <button
                  id="toggle-wishlist-pdp"
                  onClick={() => onToggleWishlist(product)}
                  className={`w-full py-4 font-sans text-[11px] font-bold tracking-widest border transition-all flex items-center justify-center gap-2 cursor-pointer uppercase ${
                    isWishlisted
                      ? "bg-neutral-100 border-neutral-200 text-black"
                      : "border-black text-black hover:bg-neutral-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-black text-black" : ""}`} />
                  {isWishlisted ? "WISHLISTED" : "ADD TO WISHLIST"}
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
