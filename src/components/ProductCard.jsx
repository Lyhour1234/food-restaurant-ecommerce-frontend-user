import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.is_available && product.stock > 0) {
      onAddToCart(product);
      toast.success(`បានបន្ថែម ${product.name} ទៅក្នុងកន្ត្រក`, {
        duration: 2000,
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    } else {
      toast.error(`${product.name} អស់ស្តុកហើយ!`);
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'ដកចេញពីចំណូលចិត្ត' : 'បានបន្ថែមទៅក្នុងចំណូលចិត្ត');
  };

  const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop';

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden product-card cursor-pointer">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img 
            src={imageError || !product.image_url ? defaultImage : product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            onError={() => setImageError(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {!product.is_available && (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md font-khmer">
                អស់ស្តុក
              </span>
            )}
            {product.stock > 0 && product.stock < 10 && (
              <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md animate-pulse font-khmer">
                នៅសល់ {product.stock} មុខ
              </span>
            )}
          </div>
          
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition duration-300 z-10"
          >
            {isLiked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-amber-600 transition">
                {product.name}
              </h3>
              <div className="flex items-center space-x-1 mt-1">
                <div className="flex text-yellow-400">
                  <StarIcon className="h-4 w-4 fill-current" />
                  <StarIcon className="h-4 w-4 fill-current" />
                  <StarIcon className="h-4 w-4 fill-current" />
                  <StarIcon className="h-4 w-4 fill-current" />
                  <StarIcon className="h-4 w-4" />
                </div>
                <span className="text-xs text-gray-500">(24 ការវាយតម្លៃ)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {product.description || 'ម្ហូបឆ្ងាញ់ធ្វើពីគ្រឿងផ្សំស្រស់ៗ'}
          </p>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available || product.stock === 0}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              product.is_available && product.stock > 0
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span className="font-khmer">បន្ថែមទៅកន្ត្រក</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;