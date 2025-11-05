import { useEffect } from "react";
import Link from "next/link";
import FadeInSection from "./FadeInItem";
import { usePathname } from "next/navigation";
import { 
  Home, 
  ShoppingBag, 
  PlusCircle, 
  Users, 
  Phone
} from "lucide-react";

export default function HoverDiv({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // English menu items with Lucide icons
  const navItems = [
    { key: 'home', label: 'Home', href: '/', icon: Home },
    { key: 'shop', label: 'Shop', href: '/products', icon: ShoppingBag },
    { key: 'add-product', label: 'Add Product', href: '/add-product', icon: PlusCircle },
    { key: 'about', label: 'About Us', href: '/about', icon: Users },
    { key: 'contact', label: 'Contact Us', href: '/contact-us', icon: Phone },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div className="block md:hidden z-40">
      {isOpen && (
        <div 
          className="fixed inset-0 h-full w-full bg-black/30 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={handleBackdropClick}
        >
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r border-gray-200">
            {/* Header Space */}
            <div className="pt-20"></div>
            
            <div className="w-full px-6">
              <div className="flex flex-col gap-3 py-4">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  const IconComponent = item.icon;
                  return (
                    <FadeInSection key={item.key} delay={index * 0.1}>
                      <Link
                        href={item.href}
                        onClick={handleNavClick}
                        className="flex items-center cursor-pointer group p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-sm"
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <IconComponent 
                          className={`w-6 h-6 transition-all duration-300 ${
                            isActive 
                              ? 'text-blue-600' 
                              : 'text-gray-600 group-hover:text-blue-600'
                          }`}
                        />
                        <span className={`ml-4 font-semibold transition-all duration-300 ${
                          isActive 
                            ? 'text-blue-700' 
                            : 'text-gray-700 group-hover:text-blue-600'
                        }`}>
                          {item.label}
                        </span>
                        
                        {/* Active Indicator */}
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                        )}
                      </Link>
                    </FadeInSection>
                  )
                })}
              </div>

              {/* Additional Links */}
              <div className="border-t border-gray-200 pt-6 mt-4">
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={handleNavClick}
                    className="flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-green-50 group"
                  >
                    <Users className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-all duration-300" />
                    <span className="ml-4 font-semibold text-gray-700 group-hover:text-green-600 transition-all duration-300">
                      Login
                    </span>
                  </Link>
                  
                  <Link
                    href="/signup"
                    onClick={handleNavClick}
                    className="flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 group"
                  >
                    <PlusCircle className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-all duration-300" />
                    <span className="ml-4 font-semibold text-gray-700 group-hover:text-blue-600 transition-all duration-300">
                      Sign Up
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}