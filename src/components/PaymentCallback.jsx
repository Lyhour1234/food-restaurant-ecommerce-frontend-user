import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import api from '../api';
import toast from 'react-hot-toast';

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [manualConfirming, setManualConfirming] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      let transId = params.get('transaction_id');
      
      if (!transId) {
        setStatus('error');
        setMessage('មិនមានលេខសម្គាល់ប្រតិបត្តិការទេ');
        return;
      }
      
      setTransactionId(transId);
      
      // Try to verify up to 5 times
      for (let i = 0; i < 5; i++) {
        try {
          const response = await api.get(`/payment/status/${transId}`);
          
          if (response.data.verified && response.data.payment_status === 'success') {
            setStatus('success');
            setMessage('ការទូទាត់ប្រាក់ជោគជ័យ!');
            localStorage.removeItem('cart');
            setTimeout(() => navigate('/payment-success', { state: { orderId: response.data.order_id } }), 2000);
            return;
          }
        } catch (error) {
          console.error('Verification attempt failed:', error);
        }
        
        if (i < 4) await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setStatus('failed');
      setMessage('ការផ្ទៀងផ្ទាត់ការទូទាត់បរាជ័យ។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីបញ្ជាក់ការទូទាត់ដោយដៃ។');
    };
    
    verifyPayment();
  }, [location, navigate]);

  const handleManualConfirm = async () => {
    setManualConfirming(true);
    
    try {
      const orderResponse = await api.get(`/orders/by-transaction/${transactionId}`);
      const orderId = orderResponse.data.id;
      
      const response = await api.post(`/payment/confirm-manual/${orderId}`);
      
      if (response.data.success) {
        toast.success('បានបញ្ជាក់ការទូទាត់ដោយជោគជ័យ!');
        localStorage.removeItem('cart');
        setTimeout(() => navigate('/payment-success', { state: { orderId } }), 2000);
      }
    } catch (error) {
      toast.error('មិនអាចបញ្ជាក់ការទូទាត់បានទេ');
    } finally {
      setManualConfirming(false);
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockIcon className="h-12 w-12 text-yellow-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-600 mb-3">កំពុងផ្ទៀងផ្ទាត់</h2>
          <p className="text-gray-600 mb-6">សូមមេត្តារង់ចាំ...</p>
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-3">ទូទាត់ជោគជ័យ!</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <p className="text-sm text-gray-500">កំពុងបញ្ជូនបន្ត...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircleIcon className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-3">ទូទាត់បរាជ័យ</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="space-y-3">
          <button
            onClick={handleManualConfirm}
            disabled={manualConfirming}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition flex items-center justify-center space-x-2"
          >
            {manualConfirming ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircleIcon className="h-5 w-5" />
            )}
            <span>បញ្ជាក់ការទូទាត់ដោយដៃ</span>
          </button>
          
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition flex items-center justify-center space-x-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span>ត្រឡប់ទៅកន្ត្រក</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;