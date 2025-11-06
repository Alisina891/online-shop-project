'use client'
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import MenuDive from "./menuButton/HoverDiv";
import FadeInSection from "./FadeInItemNav";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, LogIn } from "lucide-react";
import Cart from "@/components/home/CartDrawer";
import { useCart } from "@/context/CartContext";

// Define types for cart items
interface CartItem {
  id: string;
  quantity: number;
}

const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "My Orders", href: "/my-orders" },
  { name: "Add Product", href: "/add-product" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact-us" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { cartItems } = useCart();

  const handleClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Hide/Show header on scroll
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down & past 100px - hide header
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show header
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader, { passive: true });

      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [lastScrollY]);

  const totalItems = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  return (
    <>
      <MenuDive isOpen={isOpen} setIsOpen={setIsOpen} />
      <Cart isOpen={cartIsOpen} setIsOpen={setCartIsOpen} />

      <motion.header
        className="fixed top-0 left-0 right-0 flex justify-between items-center w-full bg-white shadow-sm border-b border-gray-200 max-md:pl-[6vw] md:pl-[3vw] lg:pl-[4vw] py-3 z-40"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.3
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0
        }}
      >
        
        {/* Mobile Menu Icon */}
        <button className="md:hidden" onClick={handleClick} aria-label="Open menu">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="x-icon"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <XMarkIcon className="w-7 h-7 text-gray-700" />
              </motion.div>
            ) : (
              <motion.div
                key="bars-icon"
                initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Bars3Icon className="w-7 h-7 text-gray-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Logo and Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://res.cloudinary.com/dpniuvyf4/image/upload/v1749489178/my_folder/xa0bqu5wozfcpbkakzot.jpg"
              alt="Logo"
              loading="lazy"
              width={80}
              height={80}
              className="rounded-full h-12 w-12 min-w-12 object-cover border-2 border-blue-200"
            />
          </Link>

          {/* Navigation Links - All in one line */}
          <div className="flex gap-6">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <FadeInSection key={item.name} delay={index * 0.1}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-[15px] font-semibold transition-all duration-300 hover:text-blue-600 relative ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </FadeInSection>
              );
            })}
          </div>
        </nav>

        {/* Cart and Auth Buttons */}
        <div className="flex items-center gap-4 max-md:mr-[6vw] md:mr-[4vw] lg:mr-[2vw]">
          {/* Cart Icon */}
          <motion.div
            onClick={() => setCartIsOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative cursor-pointer p-2"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors" />
            <motion.span
              className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full font-semibold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {totalItems}
            </motion.span>
          </motion.div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Login Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </motion.div>

            {/* Signup Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/signup"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <User className="w-4 h-4" />
                Sign Up
              </Link>
            </motion.div>
          </div>

          {/* Mobile User Menu */}
          <div className="md:hidden relative">
            <motion.button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300"
            >
              <User className="w-5 h-5 text-white" />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[160px] py-2 z-50"
                >
                  {/* Login Option */}
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>

                  {/* Signup Option */}
                  <Link
                    href="/signup"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border-t border-gray-100"
                  >
                    <User className="w-4 h-4" />
                    Sign Up
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </>
  );
}