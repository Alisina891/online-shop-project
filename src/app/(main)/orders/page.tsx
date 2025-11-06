"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type OrderItem = {
  productId: number;
  quantity: number;
  price: number;
  name: string;
  image: string;
};

type OrderData = {
  id: number;
  orderDate: string;
  deliveryFee: number;
  totalPrice: number;
  extraNote: string;
  items: OrderItem[];
  status: string;
  userId?: number | null;
  userEmail?: string | null;
};

type CustomerInfo = {
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
};

type UserData = {
  email: string;
  // Add other user properties as needed
};

export default function OrdersPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const processingSteps = [
    "Validating order information...",
    "Processing payment details...",
    "Confirming shipping address...",
    "Finalizing your order...",
    "Order confirmed successfully!"
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email || ""
      }));
    }

    const storedOrder = localStorage.getItem("pendingOrder");
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setOrder(parsedOrder);
    } else {
      const latestOrder = localStorage.getItem("latestOrder");
      if (latestOrder) {
        const parsedOrder = JSON.parse(latestOrder);
        setOrder(parsedOrder);
      }
    }
    setLoading(false);
  }, []);

  // Fix 2: Added processingSteps.length to dependency array
  const processSteps = useCallback(() => {
    setProcessingStep(prev => {
      if (prev < processingSteps.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [processingSteps.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showProcessingModal && isSubmitting) {
      interval = setInterval(processSteps, 1500);
    }
    return () => clearInterval(interval);
  }, [showProcessingModal, isSubmitting, processSteps]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.zipCode) {
      setError("Please fill in all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setShowProcessingModal(true);
    setProcessingStep(0);
    setError(null);

    try {
      if (!order) {
        throw new Error("No order data found");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const orderData = {
        deliveryFee: order.deliveryFee,
        totalPrice: order.totalPrice,
        extraNote: order.extraNote,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        zipCode: customerInfo.zipCode,
        items: order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      console.log("📤 Sending order data to backend:", orderData);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("https://jobship-backend-8.onrender.com/api/orders", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderData),
      });

      console.log("📡 Response status:", res.status);

      if (!res.ok) {
        const responseClone = res.clone();
        let errorMessage = "Failed to place order";
        
        try {
          const errorData = await responseClone.json();
          errorMessage = errorData.message || errorMessage;
          console.error("❌ Backend error:", errorData);
        } catch {
          // Fix 3: Removed unused jsonError variable
          try {
            const errorText = await res.text();
            errorMessage = errorText || errorMessage;
            console.error("❌ Backend error text:", errorText);
          } catch (textError) {
            console.error("❌ Could not read response body:", textError);
            errorMessage = `Server error: ${res.status} ${res.statusText}`;
          }
        }
        
        if (res.status === 401) {
          errorMessage = "Please log in to place an order";
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await res.json();
      console.log("✅ Order created successfully:", responseData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const confirmedOrder = {
        ...order,
        id: responseData.id,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.zipCode}`,
        status: "confirmed"
      };
     
      localStorage.setItem("latestOrder", JSON.stringify(confirmedOrder));
      localStorage.removeItem("pendingOrder");

      setOrder(confirmedOrder);
      setShowProcessingModal(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error placing order:", error);
      setShowProcessingModal(false);
      
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("log in")) {
          setError("Please log in to place an order");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setError(error.message);
        }
      } else {
        setError("There was an error placing your order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOkClick = () => {
    setShowSuccessModal(false);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Order Found</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t find any pending orders. Start shopping to place your first order!</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = order.totalPrice - order.deliveryFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 pt-32">
      {/* Processing Modal */}
      {showProcessingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-scale-in">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-pulse">
              Processing Your Order
            </h2>

            <div className="space-y-3 mb-6">
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                    index <= processingStep
                      ? "bg-green-50 text-green-700 scale-105"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index <= processingStep
                      ? "bg-green-500 text-white animate-pulse"
                      : "bg-gray-300 text-gray-600"
                  }`}>
                    {index < processingStep ? "✓" : index + 1}
                  </div>
                  <span className={`font-medium ${
                    index <= processingStep ? "text-green-800" : "text-gray-600"
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
              ></div>
            </div>

            <p className="text-gray-600 text-sm">
              Please wait while we process your order...
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Order Confirmed! 🎉
            </h2>
            
            <div className="space-y-3 mb-6">
              <p className="text-gray-600 text-lg leading-relaxed">
                Thank you for your order!
              </p>
              <p className="text-green-600 font-semibold text-lg">
                Order #{order.id}
              </p>
              <p className="text-gray-500 text-sm">
                A confirmation email has been sent to {customerInfo.email}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-500 text-left">
                <p>📦 Estimated delivery: 24-48 hours</p>
                <p>📍 Shipping to: {customerInfo.city}</p>
              </div>
            </div>

            {/* New Button - View My Orders */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/my-orders"); // یا مسیر مناسب برای دیدن سفارشات
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 mb-3 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              View My Orders
            </button>

            {/* Existing Continue Shopping Button */}
            <button
              onClick={handleOkClick}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 text-lg shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Complete Your Order
          </h1>
          <p className="text-lg text-gray-600">
            Please provide your shipping information to complete the order
          </p>
          
          {currentUser && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="text-sm font-medium">Logged in as: {currentUser.email}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3 text-red-700">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Shipping Information
              </h2>
              
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={customerInfo.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                      placeholder="10001"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 mt-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Complete Order - ${order.totalPrice.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-semibold">#{order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${
                    order.status === 'pending' ? 'text-orange-500' : 'text-green-500'
                  }`}>
                    {order.status === 'pending' ? 'Pending Confirmation' : 'Confirmed'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Items ({order.items.length})</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {order.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image || "https://res.cloudinary.com/dpniuvyf4/image/upload/v1749489178/my_folder/xa0bqu5wozfcpbkakzot.jpg"}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm">
                          {item.name}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                          <p className="text-green-600 font-semibold text-xs">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-green-600">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {order.extraNote && (
              <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  Special Instructions
                </h3>
                <p className="text-gray-700 text-sm bg-blue-50 rounded-lg p-3">{order.extraNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
      `}</style>
    </div>
  );
}