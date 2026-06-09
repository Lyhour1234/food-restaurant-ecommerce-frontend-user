import React, { useState } from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  UserIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  CameraIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import api from '../api';

const Contact = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await api.post('/contact', formData);
      toast.success('បានផ្ញើសារដោយជោគជ័យ! យើងនឹងទាក់ទងអ្នកវិញឆាប់ៗ។');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('មិនអាចផ្ញើសារបានទេ។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'ទូរស័ព្ទ',
      details: ['+855 12 345 678', '+855 98 765 432'],
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: EnvelopeIcon,
      title: 'អ៊ីមែល',
      details: ['info@pizzacambodia.com', 'support@pizzacambodia.com'],
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MapPinIcon,
      title: 'អាសយដ្ឋាន',
      details: ['ផ្លូវ ២១៥, សង្កាត់ទួលស្វាយព្រៃ', 'ភ្នំពេញ, កម្ពុជា'],
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: ClockIcon,
      title: 'ម៉ោងបើក',
      details: ['ចន្ទ - សុក្រ: ៨:០០ - ២២:០០', 'សៅរ៍ - អាទិត្យ: ៩:០០ - ២៣:០០'],
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: ShareIcon, url: 'https://facebook.com', color: 'bg-blue-600' },
    { name: 'Telegram', icon: ChatBubbleLeftRightIcon, url: 'https://t.me', color: 'bg-sky-500' },
    { name: 'Instagram', icon: CameraIcon, url: 'https://instagram.com', color: 'bg-pink-600' },
    { name: 'Website', icon: LinkIcon, url: 'https://pizzacambodia.com', color: 'bg-gray-700' }
  ];

  return (
    <div className="animate-fadeIn">
      <Navbar cartCount={cartCount} />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn font-khmer">ទំនាក់ទំនងពួកយើង</h1>
          <p className="text-lg md:text-xl opacity-95 animate-fadeIn font-khmer">
            យើងខ្ញុំសូមស្វាគមន៍រាល់មតិកែលម្អ និងសំណួររបស់អ្នក
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`w-16 h-16 ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <info.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-khmer">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-600 text-sm font-khmer">{detail}</p>
              ))}
            </div>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 font-khmer">ផ្ញើសារមកពួកយើង</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                    ឈ្មោះពេញ *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition font-khmer"
                      placeholder="ឧទាហរណ៍: សុខ សុខា"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                    អ៊ីមែល *
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                  លេខទូរស័ព្ទ
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition font-khmer"
                    placeholder="០៩៧ ៨៧៨៩ ០០១"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                  ប្រធានបទ
                </label>
                <div className="relative">
                  <ChatBubbleOvalLeftIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition font-khmer"
                    placeholder="បញ្ចូលប្រធានបទ"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                  សារ *
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition font-khmer"
                  placeholder="សូមបញ្ចូលសាររបស់អ្នក..."
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-khmer flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>កំពុងផ្ញើ...</span>
                  </>
                ) : (
                  <>
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    <span>ផ្ញើសារ</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Map and Social Links */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <MapIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 font-khmer">ទីតាំងរបស់យើង</h2>
                </div>
              </div>
              <div className="h-80 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15637.912627524863!2d104.892166!3d11.556374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109517375932d9f%3A0x2a6b3b7c2f5c8b6!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Pizza Cambodia Location"
                ></iframe>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600 font-khmer flex items-center justify-center space-x-2">
                  <MapPinIcon className="h-4 w-4 text-orange-500" />
                  <span>ផ្លូវ ២១៥, សង្កាត់ទួលស្វាយព្រៃ, ភ្នំពេញ, កម្ពុជា</span>
                </p>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center font-khmer">តាមដានពួកយើង</h2>
              <div className="flex justify-center space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-md`}
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center justify-center space-x-2 text-orange-600">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  <span className="text-sm font-semibold font-khmer">យើងខ្ញុំរីករាយនឹងជួយអ្នករាល់គ្នា!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 mt-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-khmer">សំណួរដែលគេសួរញឹកញាប់</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-bold text-orange-600 mb-2 font-khmer">តើអាចបញ្ជាទិញតាមរយៈអ្វីខ្លះ?</h3>
              <p className="text-gray-600 font-khmer">អ្នកអាចបញ្ជាទិញតាមរយៈគេហទំព័ររបស់យើង តាមរយៈទូរស័ព្ទ ឬតាមរយៈបណ្តាញសង្គមរបស់យើង។</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-bold text-orange-600 mb-2 font-khmer">តើមានថ្លៃដឹកជញ្ជូនទេ?</h3>
              <p className="text-gray-600 font-khmer">ការដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញទាំងអស់នៅក្នុងរាជធានីភ្នំពេញ!</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-bold text-orange-600 mb-2 font-khmer">តើត្រូវចំណាយពេលប៉ុន្មានដើម្បីទទួលបានម្ហូប?</h3>
              <p className="text-gray-600 font-khmer">ជាធម្មតាយើងដឹកជញ្ជូនក្នុងរយៈពេល ៣០-៤៥ នាទី អាស្រ័យលើទីតាំងរបស់អ្នក។</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-bold text-orange-600 mb-2 font-khmer">តើមានការធានាគុណភាពម្ហូបទេ?</h3>
              <p className="text-gray-600 font-khmer">បាទ/ចាស! យើងខ្ញុំធានាគុណភាពម្ហូប ១០០% ជាមួយគ្រឿងផ្សំស្រស់ៗ និងសុវត្ថិភាព។</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;