import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [manualConfirming, setManualConfirming] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      let transId = params.get('transaction_id');
      
      console.log('Payment callback - Transaction ID:', transId);
      
      if (!transId) {
        setStatus('error');
        setMessage('មិនមានលេខសម្គាល់ប្រតិបត្តិការទេ');
        return;
      }
      
      setTransactionId(transId);
      
      try {
        const response = await api.get(`/payment/status/${transId}`);
        console.log('Verification response:', response.data);
        
        if (response.data.verified && response.data.payment_status === 'success') {
          setStatus('success');
          setMessage('ការទូទាត់ប្រាក់ជោគជ័យ! ការបញ្ជាទិញរបស់អ្នកត្រូវបានបញ្ជាក់។');
          toast.success('ទូទាត់ប្រាក់ជោគជ័យ!');
          
          localStorage.removeItem('cart');
          
          setTimeout(() => {
            navigate('/payment-success', { 
              state: { orderId: response.data.order_id }
            });
          }, 3000);
        } else {
          setStatus('failed');
          setMessage('ការផ្ទៀងផ្ទាត់ការទូទាត់បរាជ័យ។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីបញ្ជាក់ការទូទាត់ដោយដៃ។');
          setOrderId(response.data.order_id);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('កំហុសក្នុងការផ្ទៀងផ្ទាត់ការទូទាត់។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីបញ្ជាក់ការទូទាត់ដោយដៃ។');
      }
    };
    
    verifyPayment();
  }, [location, navigate]);

  const handleManualConfirm = async () => {
    setManualConfirming(true);
    
    try {
      let orderIdToUpdate = orderId;
      
      if (!orderIdToUpdate && transactionId) {
        try {
          const orderResponse = await api.get(`/orders/by-transaction/${transactionId}`);
          orderIdToUpdate = orderResponse.data.id;
        } catch (err) {
          console.error('Error finding order:', err);
        }
      }
      
      if (orderIdToUpdate) {
        const response = await api.post(`/payment/confirm-manual/${orderIdToUpdate}`);
        
        if (response.data.success) {
          toast.success('បានបញ្ជាក់ការទូទាត់ដោយជោគជ័យ!');
          localStorage.removeItem('cart');
          
          setTimeout(() => {
            navigate('/payment-success', { 
              state: { orderId: orderIdToUpdate }
            });
          }, 2000);
        } else {
          toast.error('មិនអាចបញ្ជាក់ការទូទាត់បានទេ');
        }
      } else {
        toast.error('មិនអាចរកឃើញការបញ្ជាទិញ');
      }
    } catch (error) {
      console.error('Manual confirmation error:', error);
      toast.error('មិនអាចបញ្ជាក់ការទូទាត់បានទេ');
    } finally {
      setManualConfirming(false);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'verifying':
        return {
          icon: '⏳',
          title: 'កំពុងផ្ទៀងផ្ទាត់ការទូទាត់',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        };
      case 'success':
        return {
          icon: '✅',
          title: 'ទូទាត់ប្រាក់ជោគជ័យ!',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'failed':
        return {
          icon: '❌',
          title: 'ទូទាត់ប្រាក់បរាជ័យ',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          icon: '⚠️',
          title: 'កំហុស',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className={`max-w-md w-full ${display.bgColor} rounded-2xl shadow-xl p-8 text-center animate-fadeIn`}>
        <div className="text-7xl mb-4">{display.icon}</div>
        <h2 className={`text-2xl md:text-3xl font-bold ${display.color} mb-3 font-khmer`}>{display.title}</h2>
        <p className="text-gray-600 mb-6 font-khmer leading-relaxed">{message}</p>
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-600"></div>
            <p className="text-sm text-gray-500 font-khmer">សូមមេត្តារង់ចាំ...</p>
          </div>
        )}
        
        {(status === 'failed' || status === 'error') && (
          <div className="space-y-3">
            <button
              onClick={handleManualConfirm}
              disabled={manualConfirming}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105 font-khmer disabled:opacity-50"
            >
              {manualConfirming ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>កំពុងដំណើរការ...</span>
                </div>
              ) : (
                'បញ្ជាក់ការទូទាត់ដោយដៃ'
              )}
            </button>
            
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105 font-khmer"
            >
              ត្រឡប់ទៅកន្ត្រក
            </button>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 font-khmer">កំពុងបញ្ជូនបន្តទៅការបញ្ជាក់ការបញ្ជាទិញ...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;