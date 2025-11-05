'use client'
import Link from "next/link";
import { ShoppingCart, Star, Truck, Shield, Clock, Heart } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Shopping",
      description: "Your data and payments are always protected"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Curated selection of high-quality products"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Support",
      description: "We're here to help you anytime"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ZoodRas
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your trusted destination for premium products and exceptional shopping experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              Start Shopping
            </Link>
            <Link
              href="/about"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Abrishom?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to making your shopping experience simple, secure, and satisfying
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple About Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Story
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            At Abrishom, we believe that everyone deserves access to quality products at fair prices. 
            Founded with a passion for excellence and customer satisfaction, we&apos;ve built a platform 
            where quality meets convenience.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Our carefully curated collection features products that we truly believe in, 
            and our dedicated team works tirelessly to ensure your shopping experience is seamless from start to finish.
          </p>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers and discover the Abrishom difference today.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Explore Our Products
          </Link>
        </div>
      </section>
    </main>
  );
}