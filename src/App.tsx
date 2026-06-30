import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  User,
  X,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  Square,
  LogOut,
  ArrowRight,
  ArrowLeft,
  Check
} from "lucide-react";

import { Product, CartItem, FilterState } from "./types";
import { PRODUCTS, CATEGORIES } from "./data";
import SearchModal from "./components/SearchModal";
import LoginModal from "./components/LoginModal";
import CartDrawer from "./components/CartDrawer";
import ProductDetailDrawer from "./components/ProductDetailDrawer";

export default function App() {
  // Navigation / View states
  const [currentView, setCurrentView] = useState<"home" | "woman" | "man" | "kids" | "shoes-bags" | "origins" | "wishlist">("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active product for detail view
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isPdpOpen, setIsPdpOpen] = useState(false);

  // User and e-commerce states
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState<{ orderNo: string; total: number } | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter and Sorting states for Product Listing Page (PLP)
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [gridView, setGridView] = useState<2 | 4>(2);

  // Initialize with some mock cart items if empty (gives the app immediate visual life)
  useEffect(() => {
    // We can pre-fill one beautiful item to make the bag looks nice
    setCart([
      {
        product: PRODUCTS[0], // Oversized Tailored Blazer
        selectedSize: "M",
        quantity: 1
      }
    ]);
  }, []);

  // Show customized toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add to Bag action
  const handleAddToBag = (product: Product, size: string) => {
    if (!size) {
      triggerToast("PLEASE SELECT A SIZE");
      return;
    }
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, selectedSize: size, quantity: 1 }];
      }
    });
    triggerToast(`ADDED ${product.name} (SIZE ${size}) TO BAG`);
    setIsPdpOpen(false);
  };

  // Update Cart quantities
  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove Cart Item
  const handleRemoveCartItem = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
    triggerToast("ITEM REMOVED FROM BAG");
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        triggerToast(`REMOVED ${product.name} FROM WISHLIST`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        triggerToast(`ADDED ${product.name} TO WISHLIST`);
        return [...prev, product];
      }
    });
  };

  // Login handler
  const handleLoginSuccess = (email: string) => {
    setUser({ email });
    triggerToast(`LOGGED IN AS ${email.toUpperCase()}`);
  };

  const handleLogout = () => {
    setUser(null);
    triggerToast("LOGGED OUT SUCCESSFUL");
  };

  // Checkout handling
  const handleCheckout = () => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shipping = subtotal >= 150 ? 0 : 10;
    const orderNo = `SG-${Math.floor(100000 + Math.random() * 900000)}`;

    setCheckoutDetails({
      orderNo,
      total: subtotal + shipping
    });
    setCheckoutSuccess(true);
    setCart([]);
    setIsCartOpen(false);
  };

  // Filter products by active category / views
  const filteredProducts = PRODUCTS.filter((p) => {
    if (currentView === "wishlist") {
      return wishlist.some((w) => w.id === p.id);
    }
    if (currentView === "home") return true;
    return p.category === currentView;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0; // Default order
  });

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-950 selection:text-white flex flex-col relative font-sans">
      
      {/* Toast notification banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast-notification"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 text-[10px] font-bold tracking-widest z-[110] text-center uppercase shadow-xl border border-neutral-800"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col border-b ${
          currentView === "home"
            ? "bg-transparent border-transparent text-black"
            : "bg-white border-neutral-100 text-black"
        }`}
      >
        <div className="flex justify-between items-center px-4 md:px-12 py-5">
          {/* Left: Burger & Title */}
          <div className="flex items-center gap-4 md:gap-8">
            <button
              id="menu-toggle-button"
              onClick={() => setIsMenuOpen(true)}
              className="p-1 hover:opacity-50 transition-opacity cursor-pointer"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
            
            {/* Elegant Serif Zara Logo */}
            <h1
              id="logo-title"
              onClick={() => setCurrentView("home")}
              className="font-serif text-[38px] md:text-[54px] font-black tracking-tighter leading-none cursor-pointer select-none"
            >
              ZARA
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 md:gap-6 font-sans text-[11px] font-bold tracking-[0.15em]">
            <button
              id="search-trigger-btn"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1 hover:opacity-50 transition-opacity uppercase cursor-pointer"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
              <span className="hidden md:inline">SEARCH</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-[9px] text-neutral-500 uppercase">
                  {user.email.split("@")[0]}
                </span>
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="hover:opacity-50 transition-opacity cursor-pointer flex items-center gap-1"
                  title="LOG OUT"
                >
                  <LogOut className="w-4 h-4 text-black stroke-[1.5]" />
                </button>
              </div>
            ) : (
              <button
                id="login-trigger-btn"
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-1 hover:opacity-50 transition-opacity uppercase cursor-pointer"
              >
                <User className="w-5 h-5 stroke-[1.5]" />
                <span className="hidden md:inline">LOG IN</span>
              </button>
            )}

            <button
              id="wishlist-trigger-btn"
              onClick={() => setCurrentView("wishlist")}
              className="flex items-center gap-1 hover:opacity-50 transition-opacity uppercase cursor-pointer relative"
            >
              <Heart className={`w-5 h-5 stroke-[1.5] ${currentView === "wishlist" ? "fill-black" : ""}`} />
              <span className="hidden md:inline">WISHLIST</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white w-3 h-3 text-[7px] flex items-center justify-center rounded-full font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              id="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 hover:opacity-50 transition-opacity uppercase cursor-pointer relative"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className="hidden md:inline">BAG</span>
              {cart.length > 0 && (
                <span className="bg-black text-white px-1.5 py-0.5 text-[8px] font-bold leading-none">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sub-Category Bar for PLP views */}
        {currentView !== "home" && currentView !== "wishlist" && (
          <div className="bg-white border-t border-neutral-100 px-4 md:px-12 py-3 flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-500 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-6">
              <span className="text-black uppercase font-bold text-xs">
                {currentView} Collection
              </span>
              <span className="text-neutral-300">|</span>
              <span className="text-neutral-400">{sortedProducts.length} ARTICLES</span>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              {/* Grid Toggle */}
              <div className="flex items-center gap-2 border-r border-neutral-200 pr-4">
                <button
                  onClick={() => setGridView(2)}
                  className={`p-1 hover:text-black transition-colors cursor-pointer ${gridView === 2 ? "text-black" : "text-neutral-400"}`}
                  title="2 Column view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridView(4)}
                  className={`p-1 hover:text-black transition-colors cursor-pointer ${gridView === 4 ? "text-black" : "text-neutral-400"}`}
                  title="4 Column view"
                >
                  <span className="flex gap-0.5">
                    <Square className="w-2.5 h-2.5 fill-current" />
                    <Square className="w-2.5 h-2.5 fill-current" />
                  </span>
                </button>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 uppercase tracking-widest text-[10px] font-bold text-neutral-600 hover:text-black cursor-pointer py-0"
                >
                  <option value="default">SORT: RELEVANCE</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* CATEGORY DRAWER (LEFT DRAWER) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[90] flex" id="menu-drawer-wrapper">
            {/* Backdrop */}
            <motion.div
              id="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-xs"
            />

            {/* Menu container */}
            <motion.aside
              id="menu-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-sm h-full bg-white flex flex-col p-8 justify-between z-10"
            >
              <div className="flex flex-col gap-12">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif text-[32px] font-bold tracking-tighter text-black leading-none">ZARA</h2>
                  <button
                    id="close-menu-btn"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 hover:opacity-50 transition-opacity cursor-pointer text-black"
                  >
                    <X className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </div>

                {/* Primary Category List */}
                <nav className="flex flex-col gap-6" id="menu-navigation">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCurrentView(cat.id as any);
                        setIsMenuOpen(false);
                      }}
                      className={`text-left font-sans text-[20px] font-medium tracking-[0.1em] hover:pl-2 transition-all uppercase cursor-pointer flex items-center justify-between group ${
                        currentView === cat.id ? "text-black font-bold border-l-2 border-black pl-3" : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-black" />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Bottom Menu Items */}
              <div className="flex flex-col gap-6 border-t border-neutral-100 pt-8" id="menu-footer">
                <div className="flex flex-col gap-3 font-sans text-[11px] font-semibold tracking-widest text-neutral-400">
                  <button
                    onClick={() => {
                      setCurrentView("wishlist");
                      setIsMenuOpen(false);
                    }}
                    className="text-left hover:text-black transition-colors uppercase cursor-pointer"
                  >
                    MY WISHLIST ({wishlist.length})
                  </button>
                  <a href="#" className="hover:text-black transition-colors uppercase">
                    INFO & CUSTOMER SERVICE
                  </a>
                  <a href="#" className="hover:text-black transition-colors uppercase">
                    STORES & STOCKISTS
                  </a>
                </div>

                <div className="bg-neutral-50 p-4 border border-neutral-100">
                  <p className="font-serif italic text-xs text-neutral-600 mb-2">Singapore Edition</p>
                  <p className="font-sans text-[9px] text-neutral-400 tracking-wider">
                    Enjoy free shipping on all orders over 150 SGD. Returns within 30 days are fully complimentary.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* VIEWPORT AREA */}
      <main className="flex-grow pt-[80px]">
        <AnimatePresence mode="wait">
          
          {/* HOME / EDITORIAL LANDING */}
          {currentView === "home" && (
            <motion.div
              id="home-view"
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              {/* HERO SECTION 1: Oversized Tailored Blazer */}
              <section className="relative w-full h-[90vh] md:h-screen flex items-end p-8 md:p-16 overflow-hidden">
                {/* Background Image with slight dark vignette overlay */}
                <div className="absolute inset-0 z-0 bg-neutral-900">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNecPYqT3BC8NjfrvBhKELbzoTCLuiGcSWU_8U5PpWTVj6kHLegKKW6fe5e2YbgjCBZMXd2f_NZrt4RyNhLZ3mSUZRbyGSV_SPmLS-HVQzUhGlQd31yBWr5ooDZXB9RLkCW2HVKDIPdxegjrm09sqm1yKajKB0QkCEm2qxptpHgZ-JtayeWvyEn-i2vWuTLgZFkYgwu5OJufm3Rp3sZhePMo0Y_Xgx8afe3NIMIjBOQOHPTqQkPBQZgvFoCWQ7ZcklpKuHBwn_O4M"
                    alt="New arrivals background"
                    className="w-full h-full object-cover opacity-95 scale-105 hover:scale-100 transition-transform duration-[4000ms] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </div>

                <div className="relative z-10 max-w-4xl text-white flex flex-col gap-6">
                  <span className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase opacity-80">
                    SEASONAL LAUNCH / ZARA SINGAPORE
                  </span>
                  <h2 className="font-serif text-[42px] md:text-[84px] font-bold tracking-tighter leading-none uppercase">
                    THE NEW TAILORING
                  </h2>
                  <p className="font-sans text-xs md:text-sm tracking-wider uppercase max-w-lg leading-relaxed font-light opacity-90">
                    Explore minimal silhouettes, dramatic oversized shoulder blazers, and clean architectural draping cuts designed for tropical modern styling.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <button
                      id="view-collection-button-1"
                      onClick={() => setCurrentView("woman")}
                      className="bg-white text-black font-sans text-[11px] font-bold tracking-widest px-8 py-4 uppercase hover:bg-neutral-100 transition-all flex items-center gap-2 group cursor-pointer"
                    >
                      <span>VIEW WOMAN COLLECTION</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => {
                        const blazer = PRODUCTS.find((p) => p.id === "oversized-tailored-blazer");
                        if (blazer) {
                          setActiveProduct(blazer);
                          setIsPdpOpen(true);
                        }
                      }}
                      className="border border-white text-white font-sans text-[11px] font-bold tracking-widest px-8 py-4 uppercase hover:bg-white/10 transition-all cursor-pointer"
                    >
                      EXPLORE ARTICLE
                    </button>
                  </div>
                </div>
              </section>

              {/* BENTO GRID OF EDITORIAL HIGHLIGHTS */}
              <section className="bg-[#fafafa] py-20 px-4 md:px-16" id="bento-highlights">
                <div className="max-w-7xl mx-auto flex flex-col gap-12">
                  <div className="flex flex-col gap-2">
                    <span className="font-sans text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                      CURATED SELECTION
                    </span>
                    <h3 className="font-serif text-2xl md:text-4xl font-bold tracking-tight uppercase">
                      STUDIO LOOKS & ARTIFACTS
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Bento Box 1: Voluminous Linen Shirt */}
                    <div className="md:col-span-7 bg-white p-6 border border-neutral-150 flex flex-col justify-between gap-6 group">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 relative">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB45gtv_ae07of-eQ0BqtGIJG3dpROpV2uP_k6anobyGnSEQQIApj1kQ0wEv49rSjq3N4mHiVDg5ekZ-nIgaQBIZPmBajBQ5fnTfHDJwUWJoMzBCKJeIfB-1Cqi3nO3Lk8_iixH5xVVu4be4up6OcP3V1PtrmxA8tFP2X_3Bu-LuZMnWvy8FIjfpMKLhLPMqf1ALL74BbLl6IfV66Lu0JPaNmDDDO2fswdLyNXxVSxYQGSLKvcHTqEq_TWgfkduaX1QJRqO1vo2hpw"
                          alt="Linen Shirt highlight"
                          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                        />
                      </div>
                      <div className="flex justify-between items-end border-t border-neutral-100 pt-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-sans text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
                            HOT SUMMER ESCAPE
                          </span>
                          <span className="font-sans text-base font-bold text-black tracking-widest uppercase">
                            VOLUMINOUS LINEN SHIRT
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const p = PRODUCTS.find((item) => item.id === "voluminous-linen-shirt");
                            if (p) {
                              setActiveProduct(p);
                              setIsPdpOpen(true);
                            }
                          }}
                          className="p-3 bg-neutral-900 text-white hover:bg-black transition-colors rounded-none cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Bento Box 2: Geometric Shoulder Bag */}
                    <div className="md:col-span-5 bg-white p-6 border border-neutral-150 flex flex-col justify-between gap-6 group">
                      <div className="aspect-[1/1] w-full overflow-hidden bg-neutral-100 relative">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI7U0Dxk3ezTyHJY28wO7XBPUWq4M-c6sAmy2vsgmYrDSo9wWknCrWfR_QoaR0HSe9f5_v4Yeo7PyfdfJh8gij4LhjTvRqNBsVMOAEUwv3PGk2Qa_ycMeyv29GygWh9MdyVj1MTx-vmCiQXxsvNYmIXuMbrATf2f3AHNmxwm2pM431y_l00sqfk1eT_ehR2s6BwojEhqiN9fV7gWJSsgtbYp7GlDD9_fupyXLpnIouPW8wsvYpZCXDy3jL3n4A_Ug34CwkR3vXTYE"
                          alt="Geometric Bag Highlight"
                          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                        />
                      </div>
                      <div className="flex justify-between items-end border-t border-neutral-100 pt-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-sans text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
                            ESSENTIAL ARTIFACTS
                          </span>
                          <span className="font-sans text-base font-bold text-black tracking-widest uppercase">
                            GEOMETRIC SHOULDER BAG
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const p = PRODUCTS.find((item) => item.id === "leather-geometric-shoulder-bag");
                            if (p) {
                              setActiveProduct(p);
                              setIsPdpOpen(true);
                            }
                          }}
                          className="p-3 bg-neutral-900 text-white hover:bg-black transition-colors rounded-none cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Large Asymmetric Dress Background Promo */}
              <section className="relative w-full h-[80vh] flex items-center justify-center p-8 overflow-hidden text-center">
                <div className="absolute inset-0 z-0 bg-neutral-900">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe-ARgScK_xuAOPzezeP3suHB_kBuq7TaiKTDOtSpbh5J67-T0Da1DtZbk6KvBMmxYJvHgXan6k2_bYMyzgubm1gUIfvle0otTBkNHzFraDJgf8k_VxBzLAE3WtOItiV0qo1UR4NibvMwGzKUU3yuWXgrJcb1dIPJO6mQWBwjEpXhgr038OBF7yoN8JKAwVQdkCeQf7ngzqDQh1YwSzqYrMQB-WxSjDVwUdB5-ZDew_tI-UJtqjT2QU2m07KFNi_WmxCjYcTu60Cw"
                    alt="Asymmetric dress background promo"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/45" />
                </div>

                <div className="relative z-10 max-w-2xl text-white flex flex-col items-center gap-6">
                  <span className="font-sans text-[11px] font-bold tracking-[0.25em] uppercase">
                    EDITORIAL EDIT / ZARA EXPERIMENTAL
                  </span>
                  <h3 className="font-serif text-[36px] md:text-[54px] font-bold tracking-tight uppercase leading-tight">
                    ASYMMETRIC DRAPES
                  </h3>
                  <p className="font-sans text-xs tracking-widest uppercase max-w-md opacity-85 leading-relaxed">
                    Sculpted folds that move fluidly. Discover the limits of geometric tailoring with comfortable linen and high-performance blend.
                  </p>
                  <button
                    onClick={() => setCurrentView("shoes-bags")}
                    className="bg-white text-black font-sans text-[11px] font-bold tracking-widest px-8 py-4 uppercase hover:bg-neutral-100 transition-all mt-4 cursor-pointer"
                  >
                    SHOP ACCESSORIES & SHOES
                  </button>
                </div>
              </section>

              {/* HIGH FASHION LOOKS CAROUSEL */}
              <section className="py-24 px-4 md:px-16 bg-white" id="featured-carousel">
                <div className="max-w-7xl mx-auto flex flex-col gap-12">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                      <span className="font-sans text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                        STYLING INSPIRATIONS
                      </span>
                      <h3 className="font-serif text-2xl md:text-4xl font-bold tracking-tight uppercase">
                        SEASONAL HIGHLIGHTS
                      </h3>
                    </div>
                    <button
                      onClick={() => setCurrentView("woman")}
                      className="font-sans text-[11px] font-bold tracking-widest text-black flex items-center gap-2 group hover:underline cursor-pointer"
                    >
                      <span>VIEW ALL ARTICLES</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Horizontal Scroll Shelf */}
                  <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
                    {PRODUCTS.slice(4, 9).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setActiveProduct(product);
                          setIsPdpOpen(true);
                        }}
                        className="w-[280px] md:w-[350px] flex-shrink-0 snap-start group flex flex-col gap-4 cursor-pointer"
                      >
                        <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h4 className="font-sans text-[11px] font-bold tracking-widest uppercase leading-tight group-hover:underline">
                            {product.name}
                          </h4>
                          <span className="font-sans text-xs text-neutral-500 mt-1">
                            {product.price.toFixed(2)} SGD
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <footer className="bg-neutral-950 text-neutral-400 py-16 px-6 md:px-16 font-sans text-xs border-t border-neutral-900">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  <div className="flex flex-col gap-4">
                    <span className="text-white font-bold uppercase tracking-widest">HELP</span>
                    <a href="#" className="hover:text-white transition-colors">SHOP AT ZARA.COM</a>
                    <a href="#" className="hover:text-white transition-colors">PRODUCT INFO</a>
                    <a href="#" className="hover:text-white transition-colors">PAYMENT METHODS</a>
                    <a href="#" className="hover:text-white transition-colors">SHIPPING & RETURNS</a>
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="text-white font-bold uppercase tracking-widest">ABOUT US</span>
                    <a href="#" className="hover:text-white transition-colors">CAREERS</a>
                    <a href="#" className="hover:text-white transition-colors">POLICIES</a>
                    <a href="#" className="hover:text-white transition-colors">PRESS</a>
                    <a href="#" className="hover:text-white transition-colors">STORES</a>
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="text-white font-bold uppercase tracking-widest">POLICIES</span>
                    <a href="#" className="hover:text-white transition-colors">PRIVACY TERMS</a>
                    <a href="#" className="hover:text-white transition-colors">PURCHASE CONDITION</a>
                    <a href="#" className="hover:text-white transition-colors">COOKIE SETTINGS</a>
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="text-white font-serif text-2xl font-black tracking-tighter">ZARA</span>
                    <p className="text-[10px] leading-relaxed text-neutral-500 uppercase tracking-widest">
                      SINGAPORE / SG EDITION<br />
                      ALL RIGHTS RESERVED.
                    </p>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-neutral-600 tracking-wider">
                  <span>© 2026 ZARA SINGAPORE METROPOLIS CO.</span>
                  <div className="flex gap-6">
                    <a href="#" className="hover:text-neutral-400">INSTAGRAM</a>
                    <a href="#" className="hover:text-neutral-400">FACEBOOK</a>
                    <a href="#" className="hover:text-neutral-400">PINTEREST</a>
                    <a href="#" className="hover:text-neutral-400">SPOTIFY</a>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}

          {/* WISHLIST VIEW */}
          {currentView === "wishlist" && (
            <motion.div
              id="wishlist-view"
              key="wishlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-12 py-12 flex flex-col gap-8 min-h-[70vh]"
            >
              <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                    YOUR CURATED ITEMS
                  </span>
                  <h2 className="font-serif text-[32px] font-bold tracking-tight uppercase">
                    WISHLISTED ARTICLES ({wishlist.length})
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentView("home")}
                  className="font-sans text-[11px] font-bold tracking-widest text-neutral-500 hover:text-black flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK TO HOME</span>
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
                  <Heart className="w-16 h-16 stroke-[1] text-neutral-300" />
                  <p className="font-serif italic text-lg text-neutral-500">Your wishlist is currently empty</p>
                  <button
                    onClick={() => setCurrentView("woman")}
                    className="bg-black text-white px-8 py-4 font-sans text-[11px] font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    BROWSE NEW ARRIVALS
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                  {wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col gap-4 group relative"
                      id={`wishlist-item-${product.id}`}
                    >
                      <button
                        onClick={() => handleToggleWishlist(product)}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-black shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-4 h-4 stroke-[2]" />
                      </button>

                      <div
                        onClick={() => {
                          setActiveProduct(product);
                          setIsPdpOpen(true);
                        }}
                        className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-sans text-[11px] font-bold tracking-widest text-black uppercase">
                            {product.name}
                          </h4>
                        </div>
                        <span className="font-sans text-xs text-neutral-500">
                          {product.price.toFixed(2)} SGD
                        </span>

                        <button
                          onClick={() => {
                            setActiveProduct(product);
                            setIsPdpOpen(true);
                          }}
                          className="w-full border border-black py-3 font-sans text-[10px] font-bold tracking-widest hover:bg-black hover:text-white transition-all uppercase cursor-pointer"
                        >
                          SELECT SIZE & BAG
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* CATEGORY / PLP VIEWS */}
          {currentView !== "home" && currentView !== "wishlist" && (
            <motion.div
              id="category-view"
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-12 py-12 flex flex-col gap-8 min-h-[80vh]"
            >
              {sortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
                  <SlidersHorizontal className="w-12 h-12 stroke-[1] text-neutral-300" />
                  <p className="font-serif italic text-lg text-neutral-500">No articles available in this collection.</p>
                  <button
                    onClick={() => setCurrentView("home")}
                    className="border border-black px-6 py-3 font-sans text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-all cursor-pointer"
                  >
                    RETURN HOME
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-x-6 gap-y-16 transition-all duration-300 ${
                    gridView === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
                  }`}
                  id="products-grid"
                >
                  {sortedProducts.map((product) => {
                    const isWish = wishlist.some((w) => w.id === product.id);
                    return (
                      <div
                        key={product.id}
                        id={`product-card-${product.id}`}
                        className="flex flex-col gap-4 group cursor-pointer relative"
                      >
                        {/* Wishlist Icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWishlist(product);
                          }}
                          className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 hover:bg-white text-black shadow-xs hover:scale-105 transition-all cursor-pointer rounded-none border border-neutral-100"
                        >
                          <Heart className={`w-4 h-4 ${isWish ? "fill-black text-black" : "text-neutral-500"}`} />
                        </button>

                        {/* Interactive Image swap */}
                        <div
                          onClick={() => {
                            setActiveProduct(product);
                            setIsPdpOpen(true);
                          }}
                          className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 relative"
                        >
                          {/* Main Image */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
                              product.hoverImage ? "group-hover:opacity-0" : "group-hover:scale-[1.02]"
                            }`}
                          />
                          {/* Hover Image */}
                          {product.hoverImage && (
                            <img
                              src={product.hoverImage}
                              alt={`${product.name} alternate`}
                              className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />
                          )}

                          {/* Quick Add Overlay on desktop */}
                          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xs p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2 z-10 hidden md:flex">
                            <span className="font-sans text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
                              QUICK BAG
                            </span>
                            <div className="flex gap-2">
                              {product.sizes.map((sz) => (
                                <button
                                  key={sz}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToBag(product, sz);
                                  }}
                                  className="border border-neutral-300 hover:border-black font-sans text-[10px] w-8 h-8 flex items-center justify-center transition-all bg-white hover:bg-neutral-50"
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Info Row */}
                        <div
                          onClick={() => {
                            setActiveProduct(product);
                            setIsPdpOpen(true);
                          }}
                          className="flex justify-between items-start"
                        >
                          <div className="flex flex-col gap-1">
                            {product.isNew && (
                              <span className="font-sans text-[8px] font-bold tracking-wider text-neutral-400">
                                NEW
                              </span>
                            )}
                            <h3 className="font-sans text-[11px] md:text-xs font-bold tracking-wider text-black uppercase group-hover:underline">
                              {product.name}
                            </h3>
                          </div>
                          <span className="font-sans text-xs font-semibold text-neutral-700">
                            {product.price.toFixed(2)} SGD
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* CHECKOUT SUCCESS MODAL */}
      <AnimatePresence>
        {checkoutSuccess && checkoutDetails && (
          <motion.div
            id="checkout-success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              id="checkout-success-card"
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white max-w-lg w-full p-8 md:p-12 text-center flex flex-col items-center gap-6 border border-neutral-200"
            >
              <div className="w-16 h-16 bg-neutral-150 rounded-full flex items-center justify-center mb-2">
                <Check className="w-8 h-8 text-black stroke-[2]" />
              </div>

              <h2 className="font-serif text-[32px] font-bold tracking-tight text-black uppercase">
                ORDER PLACED. THANK YOU.
              </h2>

              <p className="font-sans text-xs text-neutral-500 uppercase tracking-widest max-w-sm leading-relaxed">
                We are preparing your premium parcel. A summary of confirmation and tracking metadata has been sent to your registered credentials.
              </p>

              <div className="w-full bg-neutral-50 border border-neutral-100 p-6 flex flex-col gap-3 font-sans text-[11px] tracking-wider text-left uppercase text-neutral-600">
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span>ORDER NUMBER</span>
                  <span className="font-bold text-black">{checkoutDetails.orderNo}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span>STATUS</span>
                  <span className="font-bold text-black text-xs">PROCESSING SHIPPING</span>
                </div>
                <div className="flex justify-between">
                  <span>TOTAL PAID</span>
                  <span className="font-bold text-black">{checkoutDetails.total.toFixed(2)} SGD</span>
                </div>
              </div>

              <button
                id="checkout-success-close-btn"
                onClick={() => {
                  setCheckoutSuccess(false);
                  setCurrentView("home");
                }}
                className="w-full bg-black text-white py-4 font-sans text-[11px] font-bold tracking-widest hover:bg-neutral-800 transition-colors uppercase cursor-pointer"
              >
                CONTINUE SHOPPING
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRAWER & MODAL CHANNELS */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => {
          setActiveProduct(product);
          setIsPdpOpen(true);
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      <ProductDetailDrawer
        product={activeProduct}
        isOpen={isPdpOpen}
        onClose={() => {
          setIsPdpOpen(false);
          setActiveProduct(null);
        }}
        onAddToBag={handleAddToBag}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={activeProduct ? wishlist.some((w) => w.id === activeProduct.id) : false}
      />

    </div>
  );
}
