"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// User type
interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  imageUrl?: string | null;
}

// Cart Item type
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function CartDrawer({ isOpen, setIsOpen }: CartDrawerProps) {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const router = useRouter();

  const [extraNote] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // Fix: Added proper typing for reduce function
  const totalPrice = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const deliveryFee = 50;
  const finalTotal = totalPrice + deliveryFee;

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  // Load user from localStorage and check authentication
  useEffect(() => {
    const checkAuthentication = () => {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      
      if (userData && token) {
        setUser(JSON.parse(userData) as User);
      } else {
        setUser(null);
      }
    };

    if (isOpen) {
      checkAuthentication();
    }
  }, [isOpen]);

  const handleOrderConfirm = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      alert("Please login to continue with your order!");
      setIsOpen(false);
      router.push("/login");
      return;
    }

    const orderData = {
      id: Date.now(),
      orderDate: new Date().toISOString(),
      deliveryFee,
      totalPrice: finalTotal,
      extraNote,
      items: cartItems.map((item: CartItem) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
      })),
      userId: user?.id || null,
      userEmail: user?.email || null,
      status: "pending",
    };

    localStorage.setItem("pendingOrder", JSON.stringify(orderData));

    clearCart();
    setIsOpen(false);
    router.push("/orders");
  };

  const handleCheckoutClick = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      setIsOpen(false);
      router.push("/login");
      return;
    }

    handleOrderConfirm();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div 
            className="w-full sm:w-[500px] h-full bg-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Compact */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">🛒 Cart</h2>
                  <p className="text-blue-100 text-xs mt-0.5">
                    {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} • ${finalTotal.toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* User Display - Compact */}
            {user ? (
              <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-xs font-medium">
                  ✅ <span className="font-semibold">{user.email}</span>
                </span>
              </div>
            ) : (
              <div className="px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-orange-700 text-xs font-medium">
                  ⚠️ Not logged in
                </span>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/login");
                  }}
                  className="text-orange-600 hover:text-orange-800 font-semibold text-xs underline ml-1"
                >
                  Login
                </button>
              </div>
            )}

            {/* Cart List - More Compact */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm mb-6">Add some products to get started</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item: CartItem) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
                    >
                      <div className="relative flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          width={70}
                          height={70}
                          className="rounded-lg object-cover border border-gray-300"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {item.quantity}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-6 h-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center font-bold text-gray-700 text-sm"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-medium text-gray-800 text-sm">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => increaseQuantity(item.id)}
                              className="w-6 h-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center font-bold text-gray-700 text-sm"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-green-600 font-bold text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-gray-500 text-xs">
                              ${item.price} each
                            </p>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Compact */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-white border-t border-gray-200 space-y-4">
                {/* Pricing Summary - Compact */}
                <div className="space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium text-blue-700">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-green-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button - Smaller */}
                <button
                  onClick={handleCheckoutClick}
                  disabled={cartItems.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {user ? "Checkout" : "Login to Checkout"}
                </button>

                {/* Continue Shopping - Smaller */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-300 text-sm"
                >
                  ← Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}