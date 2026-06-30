import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const shippingCost = subtotal === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : 10.0;
  const total = subtotal + shippingCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end" id="cart-drawer-container">
          {/* Overlay */}
          <motion.div
            id="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/35 backdrop-blur-xs"
          />

          {/* Drawer content */}
          <motion.aside
            id="cart-drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md h-full bg-white flex flex-col p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-black stroke-[1.5]" />
                <span className="font-sans text-[12px] font-bold tracking-[0.2em] uppercase">
                  SHOPPING BAG ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1 hover:opacity-50 transition-opacity cursor-pointer text-black"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto hide-scrollbar flex flex-col gap-6" id="cart-items-list">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-[1]" />
                  <p className="font-serif italic text-neutral-500">Your shopping bag is empty</p>
                  <button
                    onClick={onClose}
                    className="font-sans text-[10px] font-bold tracking-widest border border-black px-6 py-2 uppercase hover:bg-black hover:text-white transition-all cursor-pointer"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${idx}`}
                    className="flex gap-4 border-b border-neutral-100 pb-6"
                    id={`cart-item-${item.product.id}-${item.selectedSize}`}
                  >
                    <div className="w-20 h-28 bg-neutral-100 flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-sans text-[11px] font-bold tracking-wider text-black uppercase max-w-[80%]">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                            className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 stroke-[1.5]" />
                          </button>
                        </div>
                        <span className="font-sans text-[10px] tracking-widest text-neutral-400 uppercase">
                          SIZE: {item.selectedSize}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-black h-8 text-black">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-neutral-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-sans text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-neutral-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-sans text-xs font-bold">
                          {(item.product.price * item.quantity).toFixed(2)} SGD
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-neutral-200 pt-6 mt-4 flex flex-col gap-4" id="cart-summary">
                <div className="flex flex-col gap-2 font-sans text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>SUBTOTAL</span>
                    <span>{subtotal.toFixed(2)} SGD</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>SHIPPING</span>
                    <span>{shippingCost === 0 ? "FREE" : `${shippingCost.toFixed(2)} SGD`}</span>
                  </div>
                  {shippingCost > 0 && (
                    <span className="text-[10px] text-neutral-400 italic">
                      Spend {(freeShippingThreshold - subtotal).toFixed(2)} SGD more for FREE shipping
                    </span>
                  )}
                  <div className="flex justify-between font-bold text-black border-t border-neutral-100 pt-3 text-sm">
                    <span>TOTAL ESTIMATED</span>
                    <span>{total.toFixed(2)} SGD</span>
                  </div>
                </div>

                <button
                  id="cart-checkout-btn"
                  onClick={onCheckout}
                  className="w-full bg-black text-white py-4 font-sans text-[11px] font-bold tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer uppercase"
                >
                  PROCESS ORDER
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
