import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout', { state: { cart, total } });
    }
  };

  const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop';

  return (
    <div className="animate-fadeIn">
      <Navbar cartCount={cartCount} />
      
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-orange-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-khmer">បន្តការដើរទិញ</span>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 font-khmer">កន្ត្រកទិញទំនិញ</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <div className="text-7xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 font-khmer">កន្ត្រករបស់អ្នកទទេ</h3>
                  <p className="text-gray-500 mb-6 font-khmer">អ្នកមិនទាន់បានបន្ថែមទំនិញណាមួយនៅឡើយទេ</p>
                  <Link to="/" className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-block font-khmer">
                    មើលម៉ឺនុយ
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <ShoppingBagIcon className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 font-khmer">កន្ត្រករបស់អ្នក</h2>
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold font-khmer">
                        {cartCount} មុខ
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 hover:bg-gray-50 transition p-2 rounded-xl">
                          {/* Product Image */}
                          <div className="w-20 h-20 flex-shrink-0">
                            <img 
                              src={item.image_url || defaultImage} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-xl shadow-md"
                              onError={(e) => {
                                e.target.src = defaultImage;
                              }}
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 font-khmer">{item.name}</h3>
                            <p className="text-orange-500 font-semibold text-sm">${item.price.toFixed(2)} នីមួយៗ</p>
                            {(item.selectedSize || item.selectedCrust) && (
                              <div className="mt-1 text-xs text-gray-500">
                                {item.selectedSize && <span className="mr-2">ទំហំ: {item.selectedSize}</span>}
                                {item.selectedCrust && <span>នំប៉័ង: {item.selectedCrust}</span>}
                              </div>
                            )}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                            >
                              <MinusIcon className="h-4 w-4 text-gray-600" />
                            </button>
                            
                            <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                            >
                              <PlusIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                          
                          {/* Price and Remove */}
                          <div className="flex items-center space-x-4">
                            <div className="font-bold text-gray-800 min-w-[80px] text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 transition flex items-center justify-center"
                            >
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-2xl font-bold">
                        <span className="text-gray-800 font-khmer">សរុប</span>
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 sticky top-24 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 font-khmer">សង្ខេបការបញ្ជាទិញ</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span className="font-khmer">សរុបរង ({cartCount} មុខ)</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 text-sm">
                      <span className="font-khmer">ថ្លៃដឹកជញ្ជូន</span>
                      <span className="font-semibold">ឥតគិតថ្លៃ</span>
                    </div>
                    <div className="border-t border-dashed pt-4">
                      <div className="flex justify-between text-2xl font-bold">
                        <span className="text-gray-800 font-khmer">សរុប</span>
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition transform hover:scale-105 font-khmer"
                  >
                    បន្តទៅបង់ប្រាក់
                  </button>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CreditCardIcon className="h-4 w-4" />
                        <span className="font-khmer">ទូទាត់ប្រកបដោយសុវត្ថិភាព</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TruckIcon className="h-4 w-4" />
                        <span className="font-khmer">ដឹកជញ្ជូនឥតគិតថ្លៃ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;