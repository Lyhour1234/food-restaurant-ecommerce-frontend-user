import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FireIcon,
  SparklesIcon,
  TruckIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu-section");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Modern Abstract Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-amber-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-md">
              <FireIcon className="h-4 w-4" />
              <span className="font-khmer text-sm sm:text-base">
                បញ្ចុះតម្លៃ 20% សម្រាប់ការបញ្ជាទិញដំបូង
              </span>
            </div>

            {/* Title - Proper Khmer spacing */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.3] lg:leading-[1.2]">
              <div className="text-gray-800 font-khmer mb-2">
                ភីហ្សាឆ្ងាញ់
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-khmer">
                ដឹកជញ្ជូនលឿន
              </div>
            </h1>

            {/* Description - Proper Khmer text */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 font-khmer leading-relaxed">
              បទពិសោធន៍ភីហ្សាឆ្ងាញ់ គ្រឿងផ្សំស្រស់ៗ រូបមន្តពិតប្រាកដ
              និងការដឹកជញ្ជូនលឿនទាន់ចិត្ត
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToMenu}
                className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <SparklesIcon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span className="font-khmer">បញ្ជាទិញឥឡូវនេះ</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/menu")}
                className="group border-2 border-orange-500 text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <TruckIcon className="h-5 w-5" />
                <span className="font-khmer">មើលម៉ឺនុយ</span>
              </button>
            </div>

            {/* Stats - Proper Khmer numbers */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto lg:mx-0">
              <div className="text-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">៥០+</div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-khmer">
                  មុខម្ហូប
                </div>
              </div>

              <div className="text-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">១០០០+</div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-khmer">
                  អតិថិជនសប្បាយចិត្ត
                </div>
              </div>

              <div className="text-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">៣០នាទី</div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-khmer">
                  មធ្យមភាគដឹកជញ្ជូន
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Decorative rings */}
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-200 to-red-200 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-300 to-red-300 rounded-full blur-md opacity-30"></div>

              {/* Main Image */}
              <div className="relative bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop"
                  alt="ម្ហូបឆ្ងាញ់"
                  className="rounded-xl w-80 h-80 object-cover"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl px-3 py-2 shadow-lg animate-bounce">
                <div className="flex items-center space-x-2">
                  <FireIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-bold text-gray-800 font-khmer">
                    ក្តៅៗ
                  </span>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -left-4 bg-white rounded-xl px-3 py-2 shadow-lg animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center space-x-2">
                  <TruckIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-bold text-gray-800 font-khmer">
                    ដឹកលឿន
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
