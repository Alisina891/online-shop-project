import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-700 text-white">
      <div className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12">
        
        {/* Brand & Description */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="https://res.cloudinary.com/dpniuvyf4/image/upload/v1749489178/my_folder/xa0bqu5wozfcpbkakzot.jpg"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full object-cover border-2 border-white"
            />
            <span className="text-white font-bold text-xl">ZoodRas</span>
          </div>
          <p className="text-blue-100 mb-4 leading-relaxed">
            Premium Quality Products at Unbeatable Prices. Discover electronics, fashion, 
            home essentials, and more with fast delivery and exceptional service.
          </p>
          <div className="flex gap-3">
            <Link href="https://facebook.com" target="_blank" className="p-2 bg-white/10 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200">
              <Image src="/images/logo/face.png" alt="Facebook" width={20} height={20} />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="p-2 bg-white/10 rounded-lg hover:bg-white hover:text-pink-600 transition-all duration-200">
              <Image src="/images/logo/insta.png" alt="Instagram" width={20} height={20} />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
          <div className="space-y-3">
            <Link href="/" className="block text-blue-100 hover:text-white transition-colors duration-200 hover:underline">
              Home
            </Link>
            <Link href="/menu" className="block text-blue-100 hover:text-white transition-colors duration-200 hover:underline">
              Shop
            </Link>
            <Link href="/about" className="block text-blue-100 hover:text-white transition-colors duration-200 hover:underline">
              About Us
            </Link>
            <Link href="/dress" className="block text-blue-100 hover:text-white transition-colors duration-200 hover:underline">
              Handmade
            </Link>
            <Link href="/frequently-asked-question" className="block text-blue-100 hover:text-white transition-colors duration-200 hover:underline">
              FAQ
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold mb-4 text-lg">Contact Info</h3>
          <div className="space-y-3 text-blue-100">
            <div>
              <p className="font-semibold text-white">Address:</p>
              <p>Covered Area: Barchi</p>
            </div>
            <div>
              <p className="font-semibold text-white">Phone:</p>
              <p>+93 728 363364</p>
            </div>
            <div>
              <p className="font-semibold text-white">Email:</p>
              <p>info@zoodras.com</p>
            </div>
            <div>
              <p className="font-semibold text-white">Support:</p>
              <p>support@zoodras.com</p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold mb-4 text-lg">Business Hours</h3>
          <div className="space-y-2 text-blue-100 mb-6">
            <div className="flex justify-between">
              <span>Saturday - Thursday:</span>
              <span className="text-white font-semibold">8 AM - 8 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Friday:</span>
              <span className="text-white font-semibold">8 AM - 4 PM</span>
            </div>
          </div>
          <Link
            href="/products"
            className="inline-flex justify-center items-center bg-white text-blue-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full text-center"
          >
            Start Shopping
          </Link>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-700">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-200 text-sm text-center md:text-left">
              © {new Date().getFullYear()} ZoodRas. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-blue-200">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/contact-us" className="hover:text-white transition-colors duration-200">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}