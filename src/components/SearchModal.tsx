import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowRight } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
    } else {
      const q = query.toLowerCase();
      const filtered = PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
      setResults(filtered);
    }
  }, [query]);

  // Clear query on open/close
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white/95 backdrop-blur-md z-[70] flex flex-col p-6 md:p-16"
        >
          {/* Header row */}
          <div className="flex justify-between items-center mb-16">
            <h2 className="font-serif text-[32px] font-bold tracking-tighter">ZARA</h2>
            <button
              id="close-search-button"
              onClick={onClose}
              className="p-2 hover:opacity-50 transition-opacity cursor-pointer"
            >
              <X className="w-8 h-8 stroke-[1.5]" />
            </button>
          </div>

          {/* Search Input Container */}
          <div className="max-w-4xl w-full mx-auto flex flex-col flex-grow">
            <div className="relative flex items-center border-b border-black pb-4 mb-8">
              <input
                id="search-input"
                type="text"
                autoFocus
                placeholder="ENTER SEARCH TERMS HERE..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none text-xl md:text-[24px] uppercase tracking-widest placeholder:text-neutral-300 focus:outline-none focus:ring-0 p-0 font-light"
              />
              <Search className="w-6 h-6 text-black" />
            </div>

            {/* Popular Searches when no query */}
            {query.trim() === "" ? (
              <div className="flex flex-col gap-6" id="popular-searches">
                <span className="font-sans text-[11px] font-bold tracking-widest text-neutral-400">POPULAR SEARCHES</span>
                <div className="flex flex-col gap-4 font-serif text-[18px]">
                  {["BLAZER", "LINEN", "DRESS", "BAG", "SHOES"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-left hover:pl-2 transition-all text-neutral-800 flex items-center gap-2 group w-fit cursor-pointer"
                    >
                      <span>{term}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Results Grid
              <div className="flex-grow overflow-y-auto hide-scrollbar" id="search-results">
                <span className="font-sans text-[11px] font-bold tracking-widest text-neutral-400 mb-6 block">
                  RESULTS ({results.length})
                </span>

                {results.length === 0 ? (
                  <p className="font-serif italic text-neutral-500 text-lg">No matches found for "{query}"</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                    {results.map((product) => (
                      <div
                        id={`search-result-item-${product.id}`}
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="flex flex-col gap-3 group cursor-pointer"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-sans text-[11px] font-bold tracking-wider leading-tight text-neutral-900 group-hover:underline">
                            {product.name}
                          </span>
                          <span className="font-sans text-[13px] text-neutral-500 mt-1">
                            {product.price.toFixed(2)} {product.currency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
