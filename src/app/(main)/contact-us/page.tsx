'use client';
import React from 'react';
import FadeInItem from '@/components/ui/FadeInItem';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { Phone, Clock, Heart } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <FadeInItem delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch with <span className="text-blue-600">ZoodRass</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re here to help you with any questions about our products or services. 
              Your satisfaction is our priority.
            </p>
          </FadeInItem>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Details */}
          <FadeInItem delay={0.2}>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">00937 283 63364</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaWhatsapp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                    <p className="text-gray-600">Available 24/7 for quick support</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Working Hours</h3>
                    <p className="text-gray-600">Sat - Thu: 8 AM - 8 PM</p>
                    <p className="text-gray-600">Friday: 8 AM - 4 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInItem>

          {/* Quick Actions */}
          <FadeInItem delay={0.3}>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
              
              <div className="space-y-4">
                <Link 
                  href="/products" 
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Browse Products</h3>
                    <p className="text-gray-600 text-sm">Explore our premium collection</p>
                  </div>
                </Link>

                <Link 
                  href="/dress" 
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Handmade Collection</h3>
                    <p className="text-gray-600 text-sm">Discover unique handmade items</p>
                  </div>
                </Link>
              </div>
            </div>
          </FadeInItem>
        </div>

        {/* WhatsApp CTA */}
        <FadeInItem delay={0.4}>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-center text-white shadow-xl">
            <div className="max-w-md mx-auto">
              <FaWhatsapp className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Quick Help via WhatsApp</h3>
              <p className="mb-6 text-green-100">
                Get instant support for product inquiries, orders, or any questions
              </p>
              <Link
                href="https://wa.me/+93728363364"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-green-600 font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <FaWhatsapp className="w-5 h-5" />
                Message Us on WhatsApp
              </Link>
            </div>
          </div>
        </FadeInItem>

        {/* About Abrishom */}
        <FadeInItem delay={0.5}>
          <div className="text-center mt-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About ZoodRass</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              ZoodRass is your trusted partner for quality products and exceptional service. 
              We&apos;re committed to bringing you the best shopping experience with carefully 
              curated products and dedicated customer support.
            </p>
          </div>
        </FadeInItem>
      </div>
    </main>
  );
}