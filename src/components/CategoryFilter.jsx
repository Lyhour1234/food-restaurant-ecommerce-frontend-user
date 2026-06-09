import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, loading }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center md:text-left font-khmer">
        រកមើលតាមប្រភេទ
      </h2>
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 font-khmer ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ទាំងអស់
        </button>
        
        {loading ? (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-24 h-10 bg-gray-100 rounded-full animate-pulse"></div>
            ))}
          </div>
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 font-khmer ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;