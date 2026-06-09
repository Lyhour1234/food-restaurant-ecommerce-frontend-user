import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, XMarkIcon, Bars3Icon, HomeIcon, ClipboardDocumentIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Navbar = ({ cartCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'ទំព័រដើម', labelEn: 'Home', icon: HomeIcon },
    { path: '/menu', label: 'ម៉ឺនុយ', labelEn: 'Menu', icon: ClipboardDocumentIcon },
    { path: '/contact', label: 'ទំនាក់ទំនង', labelEn: 'Contact', icon: PhoneIcon },
  ];

  // Logo URL
  const logoUrl = 'https://png.pngtree.com/png-clipart/20250703/original/pngtree-pizza-logo-transparent-image-free-for-online-download-png-image_21265162.png';
  const fallbackLogo = 'https://cdn-icons-png.flaticon.com/512/1046/1046780.png';

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 md:space-x-3 group"
          >
            {/* Logo Image */}
            <div className="w-10 h-10 md:w-12 md:h-12 relative">
              <img 
                src={logoError ? fallbackLogo : logoUrl}
                alt="Pizza Logo"
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                onError={() => setLogoError(true)}
              />
            </div>
            
            {/* Brand Name */}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent font-khmer leading-tight">
                Pizza Cambodia
              </span>
              <span className="text-xs text-gray-500 font-khmer hidden sm:block"></span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 transition duration-200 group"
              >
                <link.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium font-khmer">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="relative group"
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-amber-100 transition duration-200">
                <ShoppingCartIcon className="h-5 w-5 text-gray-700 group-hover:text-amber-600 transition" />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5 text-gray-700" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slideInLeft">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="h-5 w-5 text-gray-500 group-hover:text-amber-600" />
                  <span className="text-gray-700 group-hover:text-amber-600 font-medium font-khmer">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;