import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ChevronUpDownIcon,
  FireIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import api from '../api';
import toast from 'react-hot-toast';

const Menu = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortBy, setSortBy] = useState('popular');
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  
  // Price range limits
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, priceRange, sortBy, showVegetarianOnly, showAvailableOnly, allProducts]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('មិនអាចទាញយកប្រភេទម្ហូបបានទេ');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setAllProducts(response.data);
      setProducts(response.data);
      
      const prices = response.data.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange({ min, max });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('មិនអាចទាញយកមុខម្ហូបបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...allProducts];
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }
    
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    if (showAvailableOnly) {
      filtered = filtered.filter(product => product.is_available && product.stock > 0);
    }
    
    if (showVegetarianOnly) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes('veg') ||
        product.description?.toLowerCase().includes('veg') ||
        product.name.toLowerCase().includes('vegetarian')
      );
    }
    
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }
    
    setProducts(filtered);
  };

  const addToCart = (product) => {
    if (product.is_available && product.stock > 0) {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        if (existingItem) {
          if (existingItem.quantity < product.stock) {
            toast.success(`បានបន្ថែម ${product.name} ទៀត!`);
            return prevCart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            toast.error(`នៅសល់តែ ${product.stock} មុខប៉ុណ្ណោះ!`);
            return prevCart;
          }
        }
        toast.success(`បានបន្ថែម ${product.name} ទៅកន្ត្រក!`);
        return [...prevCart, { ...product, quantity: 1 }];
      });
    } else {
      toast.error(`${product.name} អស់ស្តុកហើយ!`);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setPriceRange({ min: minPrice, max: maxPrice });
    setSortBy('popular');
    setShowVegetarianOnly(false);
    setShowAvailableOnly(true);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const sortOptions = [
    { value: 'popular', label: 'ពេញនិយមបំផុត', labelEn: 'Most Popular', icon: FireIcon },
    { value: 'price_low', label: 'តម្លៃ: ថោកទៅថ្លៃ', labelEn: 'Price: Low to High', icon: CurrencyDollarIcon },
    { value: 'price_high', label: 'តម្លៃ: ថ្លៃទៅថោក', labelEn: 'Price: High to Low', icon: CurrencyDollarIcon },
    { value: 'name_asc', label: 'ឈ្មោះ: ក ដល់ អ', labelEn: 'Name: A to Z', icon: ChevronUpDownIcon },
    { value: 'name_desc', label: 'ឈ្មោះ: អ ដល់ ក', labelEn: 'Name: Z to A', icon: ChevronUpDownIcon },
  ];

  return (
    <div className="animate-fadeIn">
      <Navbar cartCount={cartCount} />
      
      {/* Modern Hero Banner - Khmer */}
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeIn font-khmer">ម៉ឺនុយរបស់យើង</h1>
          <p className="text-xl md:text-2xl opacity-95 animate-fadeIn font-khmer">
            ស្វែងយល់ពីមុខម្ហូបឆ្ងាញ់ៗរបស់យើង
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Modern Search and Filter Bar */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl p-5 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ស្វែងរកម្ហូបដែលអ្នកចូលចិត្ត..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition font-khmer"
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative md:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer pr-10 font-khmer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 font-khmer ${
                showFilters 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>តម្រង</span>
              {(selectedCategory || showVegetarianOnly || priceRange.min > minPrice || priceRange.max < maxPrice) && (
                <span className="ml-1 bg-white text-orange-500 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {[selectedCategory, showVegetarianOnly, priceRange.min > minPrice, priceRange.max < maxPrice].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
          
          {/* Active Filters Display */}
          {(searchTerm || selectedCategory || showVegetarianOnly || !showAvailableOnly || 
            priceRange.min > minPrice || priceRange.max < maxPrice) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 font-khmer">តម្រងសកម្ម:</span>
              {searchTerm && (
                <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-khmer">
                  <span>ស្វែងរក: {searchTerm}</span>
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-800">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedCategory && categories.find(c => c.id === selectedCategory) && (
                <span className="inline-flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-khmer">
                  <span>{categories.find(c => c.id === selectedCategory)?.name}</span>
                  <button onClick={() => setSelectedCategory(null)} className="hover:text-green-800">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {showVegetarianOnly && (
                <span className="inline-flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-khmer">
                  <span>បួសតែប៉ុណ្ណោះ</span>
                  <button onClick={() => setShowVegetarianOnly(false)} className="hover:text-green-800">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {!showAvailableOnly && (
                <span className="inline-flex items-center space-x-1 bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-sm font-khmer">
                  <span>បង្ហាញអស់ស្តុក</span>
                  <button onClick={() => setShowAvailableOnly(true)} className="hover:text-yellow-800">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(priceRange.min > minPrice || priceRange.max < maxPrice) && (
                <span className="inline-flex items-center space-x-1 bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm font-khmer">
                  <span>តម្លៃ: ${priceRange.min} - ${priceRange.max}</span>
                  <button onClick={() => setPriceRange({ min: minPrice, max: maxPrice })} className="hover:text-purple-800">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium ml-2 font-khmer"
              >
                លុបទាំងអស់
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Modern Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-36 animate-slideInLeft border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-khmer">
                  តម្រង
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Categories Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 font-khmer">ប្រភេទ</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-700 font-khmer">ទាំងអស់</span>
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-gray-700 font-khmer">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 font-khmer">តម្លៃ</h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600 font-semibold">${priceRange.min}</span>
                    <span className="text-gray-400">—</span>
                    <span className="text-orange-600 font-semibold">${priceRange.max}</span>
                  </div>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              </div>
              
              {/* Dietary Filters */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 font-khmer">ចំណូលចិត្តអាហារ</h4>
                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    checked={showVegetarianOnly}
                    onChange={(e) => setShowVegetarianOnly(e.target.checked)}
                    className="text-orange-500 focus:ring-orange-500 rounded"
                  />
                  <span className="text-gray-700 font-khmer">បួសតែប៉ុណ្ណោះ</span>
                </label>
              </div>
              
              {/* Availability Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 font-khmer">ភាពអាចរកបាន</h4>
                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="text-orange-500 focus:ring-orange-500 rounded"
                  />
                  <span className="text-gray-700 font-khmer">បង្ហាញតែមុខម្ហូបដែលមានស្តុក</span>
                </label>
              </div>
              
              {/* Filter Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium font-khmer"
                >
                  កំណត់ឡើងវិញ
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition font-medium font-khmer"
                >
                  អនុវត្ត
                </button>
              </div>
            </div>
          )}
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 font-khmer">
                ឃើញ <span className="font-bold text-orange-600 text-lg">{products.length}</span> មុខម្ហូប
              </p>
              {!showFilters && (
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium font-khmer"
                >
                  <FunnelIcon className="h-5 w-5" />
                  <span>បង្ហាញតម្រង</span>
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
                    <div className="h-56 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <div className="text-7xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-khmer">មិនឃើញមុខម្ហូប</h3>
                <p className="text-gray-500 mb-6 font-khmer">សូមសាកល្បងកែតម្រូវតម្រងរបស់អ្នក</p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105 font-khmer"
                >
                  លុបតម្រងទាំងអស់
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modern Featured Section - Khmer */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 mt-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500 rounded-full filter blur-3xl opacity-10"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-pulse font-khmer">ឃ្លានអាហារហើយ?</h2>
          <p className="text-xl mb-8 opacity-90 font-khmer">បញ្ជាទិញឥឡូវនេះ និងទទួលបានម្ហូបឆ្ងាញ់ៗដឹកដល់ផ្ទះ!</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105 font-khmer"
          >
            បញ្ជាទិញឥឡូវនេះ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;