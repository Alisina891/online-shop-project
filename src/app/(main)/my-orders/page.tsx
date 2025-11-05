// app/my-orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type OrderItem = {
  productId: number;
  quantity: number;
  price: number;
  productImageUrl: string;
  productName: string;
  name?: string;
  image?: string;
};

type OrderData = {
  id: number;
  orderDate: string;
  deliveryFee: number;
  totalPrice: number;
  extraNote: string;
  items: OrderItem[];
  status: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  userId: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
};

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  imageUrl?: string;
};

// تابع کمکی برای تماس API با مدیریت خطا
const fetchOrdersFromAPI = async (token: string): Promise<OrderData[]> => {
  try {
    const response = await fetch("http://localhost:5071/api/orders/user/my-orders", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const loadOrdersFromLocalStorage = async (userObj: User): Promise<OrderData[]> => {
    console.log("🔄 Loading orders from localStorage as fallback...");
    const latestOrder = localStorage.getItem("latestOrder");
    const pendingOrder = localStorage.getItem("pendingOrder");
    
    const ordersList: OrderData[] = [];
    
    if (latestOrder) {
      try {
        const order = JSON.parse(latestOrder);
        // تبدیل به ساختار مورد انتظار
        const formattedOrder: OrderData = {
          ...order,
          email: order.customerEmail || "",
          phone: order.customerPhone || "",
          address: order.shippingAddress ? order.shippingAddress.split(',')[0] : "",
          city: order.shippingAddress ? order.shippingAddress.split(',')[1]?.trim() : "",
          zipCode: "",
          status: order.status || "confirmed",
          items: order.items || [],
          userId: userObj.id
        };
        ordersList.push(formattedOrder);
        console.log("✅ Loaded latestOrder from localStorage");
      } catch (e) {
        console.error("❌ Error parsing latestOrder:", e);
      }
    }
    
    if (pendingOrder) {
      try {
        const order = JSON.parse(pendingOrder);
        const formattedOrder: OrderData = {
          ...order,
          email: order.customerEmail || "",
          phone: order.customerPhone || "",
          address: order.shippingAddress ? order.shippingAddress.split(',')[0] : "",
          city: order.shippingAddress ? order.shippingAddress.split(',')[1]?.trim() : "",
          zipCode: "",
          status: order.status || "pending",
          items: order.items || [],
          userId: userObj.id
        };
        ordersList.push(formattedOrder);
        console.log("✅ Loaded pendingOrder from localStorage");
      } catch (e) {
        console.error("❌ Error parsing pendingOrder:", e);
      }
    }
    
    console.log("📦 Total orders from localStorage:", ordersList.length);
    return ordersList;
  };

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        console.log("🔄 Starting to fetch orders...");
        
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");

        if (!userData || !token) {
          console.log("❌ No user data or token, redirecting to login");
          router.push("/login");
          return;
        }

        const userObj: User = JSON.parse(userData);
        setUser(userObj);

        // سعی کن از API اصلی بگیریم
        try {
          const ordersData = await fetchOrdersFromAPI(token);
          console.log("✅ Orders fetched from API:", ordersData);
          setOrders(ordersData);
        } catch {
          console.log("❌ API failed, trying alternative endpoint...");
          
          // تلاش با endpoint جایگزین
          try {
            const alternativeResponse = await fetch("http://localhost:5071/api/orders", {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (alternativeResponse.ok) {
              const allOrders: OrderData[] = await alternativeResponse.json();
              // فیلتر کردن سفارش‌های کاربر جاری
              const userOrders = allOrders.filter((order: OrderData) => order.userId === userObj.id);
              console.log("✅ Orders from alternative endpoint:", userOrders);
              setOrders(userOrders);
            } else {
              throw new Error("Alternative endpoint also failed");
            }
          } catch {
            console.log("❌ All API attempts failed, using localStorage");
            const localStorageOrders = await loadOrdersFromLocalStorage(userObj);
            setOrders(localStorageOrders);
          }
        }

      } catch (error) {
        console.error("💥 Final error:", error);
        setError("Unable to load orders from server");
        
        // اگر user هنوز ست نشده، دوباره از localStorage بخوان
        const userData = localStorage.getItem("user");
        if (userData) {
          const userObj: User = JSON.parse(userData);
          const localStorageOrders = await loadOrdersFromLocalStorage(userObj);
          setOrders(localStorageOrders);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [router]); // فقط router به عنوان dependency

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
      default:
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "✅";
      case "shipped":
        return "🚚";
      case "delivered":
        return "📦";
      case "cancelled":
        return "❌";
      case "pending":
      default:
        return "⏳";
    }
  };

  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getShippingAddress = (order: OrderData): string => {
    if (order.address && order.city) {
      return `${order.address}, ${order.city}${order.zipCode ? `, ${order.zipCode}` : ''}`;
    }
    return "Shipping address not available";
  };

  const retryFetchOrders = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setOrders([]);
    
    try {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!userData || !token) {
        router.push("/login");
        return;
      }

      
      // دوباره از API تلاش کن
      const ordersData = await fetchOrdersFromAPI(token);
      setOrders(ordersData);
    } catch {
      // اگر API شکست خورد، از localStorage استفاده کن
      const userData = localStorage.getItem("user");
      if (userData) {
        const userObj: User = JSON.parse(userData);
        const localStorageOrders = await loadOrdersFromLocalStorage(userObj);
        setOrders(localStorageOrders);
        setError("Using local storage as backup");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-32">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login to view your orders</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 pt-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            My Orders 📦
          </h1>
          <p className="text-gray-600 text-lg">View your order history and track your purchases</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3 text-yellow-700">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div className="flex-1">
                <span className="font-medium">{error}</span>
                <p className="text-sm text-yellow-600 mt-1">
                  {orders.length > 0 
                    ? "Showing orders from local storage." 
                    : "The server has configuration issues. Please contact support."
                  }
                </p>
              </div>
              <button
                onClick={retryFetchOrders}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{user.email}</h3>
                <p className="text-gray-600 text-sm">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                  {error && orders.length > 0 && " (from local storage)"}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center bg-white rounded-3xl shadow-xl p-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">
              {error ? "Server Configuration Issue" : "No Orders Found"}
            </h3>
            <p className="text-gray-500 mb-8">
              {error 
                ? "There's a technical issue with the server. Please try again later or contact support."
                : "Start shopping to see your orders here!"
              }
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {formatStatus(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Ordered on {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${order.totalPrice.toFixed(2)}</p>
                      <p className="text-gray-500 text-sm">Total Amount</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg">Order Items ({order.items.length})</h4>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-200">
                        <div className="relative">
                          <Image
                            src={item.productImageUrl || item.image || "/placeholder.jpg"}
                            alt={item.productName || item.name || "Product"}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover border border-gray-200"
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800">{item.productName || item.name || "Product"}</h5>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                            <span className="text-green-600 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 p-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Shipping Information</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📍 {getShippingAddress(order)}</p>
                        {order.phone && <p>📞 {order.phone}</p>}
                        {order.email && <p>✉️ {order.email}</p>}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Order Summary</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Items total:</span>
                          <span>${(order.totalPrice - order.deliveryFee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery fee:</span>
                          <span>${order.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-800 border-t pt-1">
                          <span>Total:</span>
                          <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {order.extraNote && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h6 className="font-semibold text-blue-800 text-sm mb-1">Special Instructions:</h6>
                      <p className="text-blue-700 text-sm">{order.extraNote}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Info */}
        <div className="text-center mt-8">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {error ? "Server Issue Detected" : "Need help with your order?"}
            </h3>
            <p className="text-gray-600 mb-4">
              {error 
                ? "There's a technical configuration issue with the orders server. Our team has been notified."
                : "Contact our customer support team"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200">
                📞 Contact Support
              </button>
              {error && (
                <button
                  onClick={retryFetchOrders}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  🔄 Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}