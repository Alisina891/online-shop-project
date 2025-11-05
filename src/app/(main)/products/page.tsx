'use client'
import Image from 'next/image';
import { Eye, Heart, ShoppingCart, Star, Zap, Clock, Shield, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from "@/context/CartContext";

// Define the product interface based on your backend model
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  originalPrice?: number;
  tags?: string[];
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  products: Product[];
  message?: string;
}

export default function ProductGrid() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5071/api/food');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success && data.products) {
        // Transform backend data to match frontend structure
        const transformedProducts = data.products.map(product => ({
          ...product,
          image: product.imageUrl, // Map imageUrl to image
          // Ensure optional fields have default values
          rating: product.rating || 4.5,
          reviewCount: product.reviewCount || 0,
          discount: product.discount || 0,
          tags: product.tags || [],
          originalPrice: product.originalPrice || product.price * 1.2, // Calculate if not provided
        }));
        
        setProducts(transformedProducts);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Transform product to match cart expectations if needed
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1
    };
    
    addToCart(cartProduct);
    
    const button = e.currentTarget as HTMLButtonElement;
    button.classList.add('bg-green-600', 'scale-95');
    setTimeout(() => {
      button.classList.remove('bg-green-600', 'scale-95');
    }, 300);
  };

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const getImageSrc = (product: Product) => {
    if (imageErrors.has(product.id) || !product.imageUrl) {
      return '/images/placeholder.jpg';
    }
    return product.imageUrl;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : i < rating 
            ? 'text-yellow-400 fill-yellow-400 opacity-70'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20 w-full bg-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading premium products...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center bg-white rounded-2xl p-8 max-w-md border border-red-100 shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={fetchProducts}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (products.length === 0) return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">No Products Available</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">We&apos;re updating our collection. Please check back later for our premium products.</p>
      <button
        onClick={fetchProducts}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
      >
        Refresh Collection
      </button>
    </div>
  );

  return (
    <div className="mx-auto px-4 bg-white">
      {/* Header Stats */}
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 mb-2">
            <Truck className="w-6 h-6 text-blue-600" />
            <span>Fast Delivery</span>
          </div>
          <p className="text-gray-600 text-sm">Free shipping over $50</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 mb-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>Secure Payment</span>
          </div>
          <p className="text-gray-600 text-sm">100% protected</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 mb-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <span>24/7 Support</span>
          </div>
          <p className="text-gray-600 text-sm">Always here to help</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <div 
            key={product.id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden hover:-translate-y-2 cursor-pointer"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
              <Image
                src={getImageSrc(product)}
                alt={product.name}
                width={400}
                height={400}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                priority={index < 8}
                onError={() => handleImageError(product.id)}
              />
              
              {/* Discount Badge */}
              {product.discount && product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  -{product.discount}%
                </div>
              )}
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.tags.map((tag, tagIndex) => (
                    <div 
                      key={tagIndex}
                      className={`px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                        tag === 'HOT' ? 'bg-red-500' :
                        tag === 'NEW' ? 'bg-green-500' :
                        tag === 'SALE' ? 'bg-orange-500' :
                        tag === 'PREMIUM' ? 'bg-blue-500' :
                        tag === 'BESTSELLER' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className={`absolute top-4 left-4 flex flex-col gap-2 transition-all duration-300 ${
                hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                <button 
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <Heart 
                    className={`w-5 h-5 transition-all duration-300 ${
                      wishlist.has(product.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  />
                </button>
                <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg">
                  <Eye className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                </button>
              </div>

              {/* Add to Cart Overlay */}
              <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold py-3 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group/cart"
                >
                  <ShoppingCart className="w-4 h-4 group-hover/cart:scale-110 transition-transform" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              {/* Title */}
              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                {product.name}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                {product.description}
              </p>

              {/* Rating and Reviews */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating || 4.5)}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <Zap className="w-4 h-4" />
                  In Stock
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                {/* Quick Add to Cart */}
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-gray-200">
        <p className="text-lg text-gray-600">
          Showing <span className="text-blue-600 font-semibold">{products.length}</span> premium products
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button 
            onClick={fetchProducts}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
          >
            Refresh Products
          </button>
          <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300">
            View All Categories
          </button>
        </div>
      </div>
    </div>
  );
}