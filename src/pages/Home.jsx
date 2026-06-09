import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { FireIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import api from '../api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory 
        ? `/products?category_id=${selectedCategory}`
        : '/products';
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
              : item
          );
        }
        return prevCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="animate-fadeIn">
      <Navbar cartCount={cartCount} />
      <HeroSection />
      
      <div id="menu-section" className="container mx-auto px-4 py-16">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          loading={categoryLoading}
        />
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
                <div className="h-56 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-gray-500 text-lg font-khmer">មិនមានមុខម្ហូបក្នុងប្រភេទនេះទេ</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Features Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-20 mt-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 font-khmer">
            ហេតុអ្វីជ្រើសរើស <span className="gradient-text">យើង?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 transform group-hover:rotate-12 transition duration-300 shadow-lg">
                <TruckIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-khmer">ដឹកជញ្ជូនលឿន</h3>
              <p className="text-gray-500 font-khmer">ដឹកជញ្ជូនក្នុងរយៈពេល 30 នាទី</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 transform group-hover:rotate-12 transition duration-300 shadow-lg">
                <FireIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-khmer">គ្រឿងផ្សំស្រស់ៗ</h3>
              <p className="text-gray-500 font-khmer">ស្រស់ៗ 100% ពីប្រភពក្នុងស្រុក</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 transform group-hover:rotate-12 transition duration-300 shadow-lg">
                <CreditCardIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 font-khmer">ទូទាត់ប្រកបដោយសុវត្ថិភាព</h3>
              <p className="text-gray-500 font-khmer">ប្រព័ន្ធទូទាត់ KHQR មានសុវត្ថិភាព</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;