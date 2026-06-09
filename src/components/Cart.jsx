import React from 'react';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Cart = ({ cart, updateQuantity, removeFromCart }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const defaultImage = 'https://via.placeholder.com/60x60?text=Food';

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <ShoppingBagIcon className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4">
              {/* Product Image */}
              <div className="w-16 h-16 flex-shrink-0">
                <img 
                  src={item.image_url || defaultImage} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
              </div>
              
              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm">${item.price.toFixed(2)} each</p>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 rounded-md hover:bg-gray-100 transition"
                >
                  <MinusIcon className="h-4 w-4 text-gray-600" />
                </button>
                
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-md hover:bg-gray-100 transition"
                >
                  <PlusIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              {/* Price and Remove */}
              <div className="flex items-center space-x-4">
                <div className="font-semibold text-gray-800 min-w-[70px] text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 rounded-md hover:bg-red-50 transition"
                >
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-xl font-bold">
            <span className="text-gray-800">Total</span>
            <span className="text-red-600">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;