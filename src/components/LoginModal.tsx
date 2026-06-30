import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      alert(`Account created successfully for ${email}!`);
      setIsRegister(false);
    } else {
      onLoginSuccess(email);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="login-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-4 md:p-6"
        >
          {/* Backdrop click close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            id="login-modal-card"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white max-w-md w-full p-8 md:p-12 relative z-10 flex flex-col gap-8 rounded-none border border-neutral-200"
          >
            {/* Close */}
            <button
              id="close-login-button"
              onClick={onClose}
              className="absolute top-6 right-6 p-1 hover:opacity-50 transition-opacity cursor-pointer text-black"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>

            {/* Logo */}
            <div className="text-center">
              <h2 className="font-serif text-[42px] font-bold tracking-tighter text-black leading-none">ZARA</h2>
              <p className="font-sans text-[10px] tracking-[0.2em] text-neutral-400 mt-2">SINGAPORE / SG</p>
            </div>

            {/* Title / Switcher */}
            <div className="flex border-b border-neutral-200 pb-2 gap-6 font-sans text-[11px] font-bold tracking-widest">
              <button
                id="login-tab-btn"
                onClick={() => setIsRegister(false)}
                className={`pb-2 uppercase transition-all cursor-pointer ${
                  !isRegister ? "text-black border-b-2 border-black -mb-[10px]" : "text-neutral-400 hover:text-black"
                }`}
              >
                LOG IN
              </button>
              <button
                id="register-tab-btn"
                onClick={() => setIsRegister(true)}
                className={`pb-2 uppercase transition-all cursor-pointer ${
                  isRegister ? "text-black border-b-2 border-black -mb-[10px]" : "text-neutral-400 hover:text-black"
                }`}
              >
                REGISTER
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {isRegister && (
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                    NAME
                  </label>
                  <input
                    id="login-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-black py-2 font-sans text-xs focus:outline-none uppercase tracking-wider"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  E-MAIL
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-black py-2 font-sans text-xs focus:outline-none tracking-wider"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  PASSWORD
                </label>
                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-black py-2 font-sans text-xs focus:outline-none tracking-wider"
                />
              </div>

              {!isRegister && (
                <button
                  type="button"
                  className="font-sans text-[9px] tracking-wider text-neutral-400 hover:text-black text-left self-start"
                >
                  HAVE YOU FORGOTTEN YOUR PASSWORD?
                </button>
              )}

              <button
                id="login-submit-button"
                type="submit"
                className="w-full bg-black text-white py-4 font-sans text-[11px] font-bold tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer uppercase"
              >
                {isRegister ? "CREATE ACCOUNT" : "LOG IN"}
              </button>
            </form>

            <div className="text-center font-sans text-[10px] text-neutral-400 tracking-wider">
              Need assistance?{" "}
              <a href="#" className="underline text-black">
                Contact our customer care
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
