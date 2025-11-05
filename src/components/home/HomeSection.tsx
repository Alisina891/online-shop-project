'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Truck, Shield, HeadphonesIcon, Award, ShoppingBag, Clock, Users, MapPin, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  rating?: number;
  discount?: number;
  originalPrice?: number;
}

interface ApiResponse {
  success: boolean;
  products: Product[];
  message?: string;
}

export default function HomeSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Payment",
      description: "100% secure payment processing"
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Quality Guarantee",
      description: "30-day money back guarantee"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      content: "Amazing quality and fast delivery! ZoodRas is my go-to online store.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Mike Chen",
      role: "Premium Member",
      content: "Best prices and excellent customer service. Highly recommended!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Emily Davis",
      role: "New Customer",
      content: "First time shopping here and I'm impressed! Will definitely come back.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    }
  ];

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: "10K+", label: "Happy Customers" },
    { icon: <ShoppingBag className="w-5 h-5" />, value: "500+", label: "Products" },
    { icon: <Clock className="w-5 h-5" />, value: "24/7", label: "Support" },
    { icon: <MapPin className="w-5 h-5" />, value: "50+", label: "Cities" }
  ];

  const heroSlides = [
    {
      title: "Premium Quality",
      subtitle: "Discover the finest collection",
      description: "Luxury products at affordable prices",
      bgGradient: "from-purple-900 via-purple-800 to-indigo-700"
    },
    {
      title: "Summer Sale",
      subtitle: "Up to 50% Off",
      description: "Limited time offers on selected items",
      bgGradient: "from-rose-900 via-pink-800 to-red-700"
    },
    {
      title: "New Arrivals",
      subtitle: "Latest Trends",
      description: "Fresh collection just arrived",
      bgGradient: "from-teal-900 via-cyan-800 to-blue-700"
    }
  ];

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5071/api/food');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success && data.products) {
        // Transform and take only first 8 products
        const transformedProducts = data.products.slice(0, 8).map(product => ({
          ...product,
          rating: product.rating || 4.5,
          discount: product.discount || 0,
          originalPrice: product.originalPrice || product.price * 1.2,
        }));
        
        setProducts(transformedProducts);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // You can set an error state here if you want to show error messages
    } finally {
      setLoading(false);
    }
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
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when component mounts
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="pt-16">
      {/* Hero Section with Slider */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full mix-blend-soft-light filter blur-xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-300 rounded-full mix-blend-soft-light filter blur-xl animate-pulse delay-1000"></div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Now Open - Shop with Confidence</span>
          </div>

          {heroSlides.map((slide) => (
            <div
              key={slide.title}
              className={`transition-all duration-1000 ${
                slide.title === heroSlides[currentSlide].title
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8 absolute'
              }`}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  {slide.title}
                </span>
              </h1>

              <p className="text-2xl md:text-3xl mb-6 text-gray-100 max-w-2xl mx-auto leading-relaxed">
                {slide.subtitle}
              </p>

              <p className="text-lg text-gray-200 mb-8 max-w-xl mx-auto">
                {slide.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  href="/products"
                  className="group relative bg-white text-gray-900 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-lg min-w-[160px]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Shop Now
                    <ShoppingCart className="w-5 h-5" />
                  </span>
                </Link>
                
                <button className="border-2 border-white text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 min-w-[160px] text-lg">
                  View Collection
                </button>
              </div>
            </div>
          ))}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center items-center gap-2 text-white mb-2">
                  {stat.icon}
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
                <div className="text-gray-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose ZoodRas?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to providing the best shopping experience with premium quality products and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="group text-center p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading featured products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Available</h3>
              <p className="text-gray-600 mb-6">We&apos;re updating our collection. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={getImageSrc(product)}
                      alt={product.name}
                      width={250}
                      height={250}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(product.id)}
                    />
                    {/* Discount Badge */}
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(product.rating || 4.5)}
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
            >
              View All Products
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don&apos;t just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className="text-gray-700 leading-relaxed text-left">
                  &apos;{testimonial.content}&apos;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-12 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Get the latest deals, new arrivals, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-transparent"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-200 text-lg whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience ZoodRas?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover why we&apos;re the preferred choice for premium shopping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-purple-600 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-lg"
            >
              Start Shopping Now
            </Link>
            <button className="border-2 border-white text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white hover:text-purple-600 transition-all duration-300 text-lg">
              Learn More About Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}