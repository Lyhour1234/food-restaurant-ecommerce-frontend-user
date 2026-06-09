import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CreditCardIcon, UserIcon, PhoneIcon, EnvelopeIcon, TruckIcon } from '@heroicons/react/24/outline';
import api from '../api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total: cartTotal } = location.state || { cart: [], total: 0 };
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
  });
  const [loading, setLoading] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div>
        <Navbar cartCount={0} />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div className="text-7xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-khmer">កន្ត្រករបស់អ្នកទទេ</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition font-khmer"
            >
              បន្តការដើរទិញ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.customer_name.trim()) {
      toast.error('សូមបញ្ចូលឈ្មោះរបស់អ្នក');
      return false;
    }
    if (!formData.customer_email.trim()) {
      toast.error('សូមបញ្ចូលអ៊ីមែលរបស់អ្នក');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email)) {
      toast.error('សូមបញ្ចូលអ៊ីមែលឲ្យបានត្រឹមត្រូវ');
      return false;
    }
    if (!formData.customer_phone.trim()) {
      toast.error('សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក');
      return false;
    }
    if (formData.customer_phone.length < 8) {
      toast.error('សូមបញ្ចូលលេខទូរស័ព្ទឲ្យបានត្រឹមត្រូវ');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const orderData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          selected_size: item.selectedSize || null,
          selected_crust: item.selectedCrust || null
        }))
      };
      
      console.log('Creating order:', orderData);
      
      const orderResponse = await api.post('/orders', orderData);
      const order = orderResponse.data;
      
      // Use the deployed frontend URL for callback
      const callbackUrl = process.env.REACT_APP_PAYMENT_CALLBACK_URL || `${window.location.origin}/payment-callback`;
      
      const paymentResponse = await api.post('/payment/create-session', {
        order_id: order.id,
        success_url: `${callbackUrl}?transaction_id=${order.transaction_id}`
      });
      
      localStorage.removeItem('cart');
      window.location.href = paymentResponse.data.redirect_url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.detail || 'បរាជ័យក្នុងការបញ្ជាទិញ សូមព្យាយាមម្តងទៀត');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <Navbar cartCount={cartCount} />
      
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-orange-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition mb-6 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-khmer">ត្រឡប់ទៅកន្ត្រក</span>
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 font-khmer">ទូទាត់ប្រាក់</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 font-khmer">ព័ត៌មានដឹកជញ្ជូន</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold font-khmer">ឈ្មោះពេញ *</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition font-khmer"
                      placeholder="ឧទាហរណ៍: សុខ សុខា"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold font-khmer">អាសយដ្ឋានអ៊ីមែល *</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="customer_email"
                      required
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold font-khmer">លេខទូរស័ព្ទ *</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="customer_phone"
                      required
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                      placeholder="០៩៧ ៨៧៨៩ ០០១"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-khmer"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>កំពុងដំណើរការ...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <CreditCardIcon className="h-5 w-5" />
                      <span>បង់ប្រាក់ ${cartTotal.toFixed(2)}</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 h-fit sticky top-24 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-khmer">សង្ខេបការបញ្ជាទិញ</h2>
              
              <div className="max-h-80 overflow-y-auto space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className={`pb-3 ${index !== cart.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <span className="font-semibold text-orange-600">{item.quantity}x</span>
                        <span className="ml-2 text-gray-700 font-khmer">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {(item.selectedSize || item.selectedCrust) && (
                      <div className="mt-1 ml-7 text-xs text-gray-500">
                        {item.selectedSize && <span className="mr-2 font-khmer">ទំហំ: {item.selectedSize}</span>}
                        {item.selectedCrust && <span className="font-khmer">នំប៉័ង: {item.selectedCrust}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800 font-khmer">សរុប</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <TruckIcon className="h-5 w-5" />
                  <span className="text-sm font-semibold font-khmer">ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញទាំងអស់!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;