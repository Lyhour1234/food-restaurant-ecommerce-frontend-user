import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ShoppingBagIcon, HomeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  useEffect(() => {
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center transform transition-all hover:scale-105 duration-300">
        {/* Animated Check Icon */}
        <div className="mb-6">
          <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
            <CheckCircleIcon className="h-14 w-14 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-3 font-khmer">ទូទាត់ប្រាក់ជោគជ័យ!</h1>
        <p className="text-gray-500 mb-6 font-khmer">
          សូមអរគុណចំពោះការបញ្ជាទិញរបស់អ្នក! ម្ហូបឆ្ងាញ់របស់អ្នកនឹងត្រូវដឹកជញ្ជូនឆាប់ៗនេះ។
        </p>
        
        {orderId && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 mb-6 border border-orange-100">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DocumentTextIcon className="h-5 w-5 text-orange-500" />
              <p className="text-sm text-gray-600 font-medium font-khmer">លេខសម្គាល់ការបញ្ជាទិញ</p>
            </div>
            <p className="text-2xl font-mono font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              #{orderId}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <HomeIcon className="h-5 w-5" />
            <span className="font-khmer">ត្រឡប់ទៅទំព័រដើម</span>
          </button>
          
          <button
            onClick={() => navigate('/menu')}
            className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white transition flex items-center justify-center space-x-2"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            <span className="font-khmer">បញ្ជាទិញម្ហូបបន្ថែម</span>
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-khmer">
            អ៊ីមែលបញ្ជាក់ការបញ្ជាទិញត្រូវបានផ្ញើទៅកាន់អាសយដ្ឋានអ៊ីមែលរបស់អ្នក។
            ប្រសិនបើមានសំណួរ សូមទាក់ទងក្រុមជំនួយរបស់យើង។
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;