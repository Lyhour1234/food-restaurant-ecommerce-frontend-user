import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon, 
  MinusIcon, 
  PlusIcon,
  TruckIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import api from '../api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedCrust, setSelectedCrust] = useState('thin');

  const sizes = [
    { name: 'តូច', nameEn: 'Small', value: 'small', price: 0, multiplier: 0.8 },
    { name: 'មធ្យម', nameEn: 'Medium', value: 'medium', price: 0, multiplier: 1 },
    { name: 'ធំ', nameEn: 'Large', value: 'large', price: 5, multiplier: 1.3 },
    { name: 'ធំពិសេស', nameEn: 'Extra Large', value: 'extra_large', price: 8, multiplier: 1.5 }
  ];

  const crusts = [
    { name: 'ស្តើង', nameEn: 'Thin Crust', value: 'thin', price: 0 },
    { name: 'ក្រាស់', nameEn: 'Thick Crust', value: 'thick', price: 2 },
    { name: 'ដាក់ឈីស', nameEn: 'Stuffed Crust', value: 'stuffed', price: 3 },
    { name: 'គ្មានជាតិស្អិត', nameEn: 'Gluten Free', value: 'gluten_free', price: 4 }
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      
      if (response.data.category_id) {
        const relatedResponse = await api.get(`/products?category_id=${response.data.category_id}&limit=4`);
        setRelatedProducts(relatedResponse.data.filter(p => p.id !== parseInt(id)).slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('មិនឃើញមុខម្ហូប');
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const getFinalPrice = () => {
    let basePrice = product?.price || 0;
    const size = sizes.find(s => s.value === selectedSize);
    const crust = crusts.find(c => c.value === selectedCrust);
    
    if (size) basePrice = basePrice * size.multiplier;
    if (crust) basePrice += crust.price;
    
    return basePrice;
  };

  const addToCart = () => {
    if (product.is_available && product.stock > 0) {
      const finalPrice = getFinalPrice();
      const sizeObj = sizes.find(s => s.value === selectedSize);
      const crustObj = crusts.find(c => c.value === selectedCrust);
      
      const cartItem = {
        id: product.id,
        name: product.name,
        price: finalPrice,
        original_price: product.price,
        image_url: product.image_url,
        stock: product.stock,
        quantity: quantity,
        selectedSize: sizeObj?.nameEn || 'Medium',
        selectedCrust: crustObj?.nameEn || 'Thin Crust',
        totalPrice: finalPrice * quantity
      };
      
      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => 
          item.id === product.id && 
          item.selectedSize === cartItem.selectedSize && 
          item.selectedCrust === cartItem.selectedCrust
        );
        
        if (existingItemIndex !== -1) {
          const existingItem = prevCart[existingItemIndex];
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity <= product.stock) {
            const updatedCart = [...prevCart];
            updatedCart[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
              totalPrice: finalPrice * newQuantity
            };
            toast.success(`បានបន្ថែម ${product.name} ចំនួន ${quantity} ទៀត!`);
            return updatedCart;
          } else {
            toast.error(`នៅសល់តែ ${product.stock} មុខប៉ុណ្ណោះ!`);
            return prevCart;
          }
        }
        
        toast.success(`បានបន្ថែម ${product.name} ទៅកន្ត្រក!`);
        return [...prevCart, cartItem];
      });
    } else {
      toast.error(`${product.name} អស់ស្តុកហើយ!`);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'ដកចេញពីចំណូលចិត្ត' : 'បានបន្ថែមទៅក្នុងចំណូលចិត្ត');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('ចម្លងលីងជោគជ័យ!');
    } catch (err) {
      toast.error('ចម្លងលីងមិនជោគជ័យ');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const finalPrice = getFinalPrice();

  if (loading) {
    return (
      <div>
        <Navbar cartCount={cartCount} />
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar cartCount={cartCount} />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🍕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-khmer">មិនឃើញមុខម្ហូប</h2>
          <Link to="/menu" className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl inline-block font-khmer">
            ត្រឡប់ទៅម៉ឺនុយ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <Navbar cartCount={cartCount} />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition mb-6 group"
          >
            <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-khmer">ត្រឡប់ក្រោយ</span>
          </button>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image Section - Single Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop'} 
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Product Info Section */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-khmer">{product.name}</h1>
                  <button
                    onClick={handleLike}
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition hover:scale-110"
                  >
                    {isLiked ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center flex-wrap gap-3 mt-2">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <StarSolidIcon className="h-5 w-5" />
                      <StarSolidIcon className="h-5 w-5" />
                      <StarSolidIcon className="h-5 w-5" />
                      <StarSolidIcon className="h-5 w-5" />
                      <StarIcon className="h-5 w-5" />
                    </div>
                    <span className="ml-2 text-sm text-gray-600 font-khmer">(១២៨ ការវាយតម្លៃ)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600 font-khmer">មានស្តុក</span>
                  </div>
                </div>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  ${finalPrice.toFixed(2)}
                </span>
                {finalPrice !== product.price && (
                  <span className="text-gray-400 line-through">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2 font-khmer">សេចក្តីពិពណ៌នា</h3>
                <p className="text-gray-600 leading-relaxed font-khmer">
                  {product.description || 'បទពិសោធន៍ម្ហូបឆ្ងាញ់ៗ គ្រឿងផ្សំស្រស់ៗ រូបមន្តពិតប្រាកដ'}
                </p>
              </div>
              
              {/* Size Selection */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 font-khmer">ជ្រើសរើសទំហំ</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`px-5 py-2 rounded-xl font-semibold transition-all duration-200 font-khmer ${
                        selectedSize === size.value
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-500'
                      }`}
                    >
                      {size.name}
                      {size.price > 0 && <span className="text-xs ml-1">(+${size.price})</span>}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Crust Selection */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 font-khmer">ជ្រើសរើសនំប៉័ង</h3>
                <div className="flex flex-wrap gap-3">
                  {crusts.map((crust) => (
                    <button
                      key={crust.value}
                      onClick={() => setSelectedCrust(crust.value)}
                      className={`px-5 py-2 rounded-xl font-semibold transition-all duration-200 font-khmer ${
                        selectedCrust === crust.value
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-500'
                      }`}
                    >
                      {crust.name}
                      {crust.price > 0 && <span className="text-xs ml-1">(+${crust.price})</span>}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 font-khmer">ចំនួន</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-white rounded-xl border border-gray-200 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      <MinusIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      <PlusIcon className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 font-khmer">នៅសល់ {product.stock} មុខ</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={addToCart}
                  disabled={!product.is_available || product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span className="font-khmer">បន្ថែមទៅកន្ត្រក</span>
                </button>
                <button
                  onClick={handleShare}
                  className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition group"
                >
                  <ShareIcon className="h-5 w-5 text-gray-600 group-hover:text-orange-500 transition" />
                </button>
              </div>
              
              {/* Delivery Info */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TruckIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600 font-khmer">ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញលើស $30</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ClockIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 font-khmer">រយៈពេលដឹកជញ្ជូន: ៣០-៤៥ នាទី</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <ShieldCheckIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600 font-khmer">ទូទាត់ប្រកបដោយសុវត្ថិភាពជាមួយ KHQR</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-khmer">មុខម្ហូបដែលអ្នកប្រហែលជាចូលចិត្ត</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <Link 
                    key={relatedProduct.id} 
                    to={`/product/${relatedProduct.id}`}
                    className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 font-khmer">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-orange-500 font-bold text-lg">${relatedProduct.price.toFixed(2)}</p>
                        <span className="text-xs text-orange-500 font-semibold font-khmer">មើលបន្ថែម →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;