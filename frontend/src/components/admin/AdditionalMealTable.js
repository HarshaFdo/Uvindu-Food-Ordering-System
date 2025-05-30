import React, { useState } from 'react';
import { Edit, Trash2, Search, Filter, Plus, Eye, EyeOff, ChefHat } from 'lucide-react';

const AdditionalMealTable = ({ meals = [], onEdit, onDelete, onToggleAvailability }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Sample data if meals is empty for demonstration
  const sampleMeals = meals.length > 0 ? meals : [
    {
      id: 1,
      name: 'Extra Rice',
      price: 50,
      availability: true,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Garlic Naan',
      price: 80,
      availability: true,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Raita',
      price: 60,
      availability: false,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&crop=center'
    }
  ];

  // Filter and sort meals
  const filteredMeals = sampleMeals
    .filter(meal => {
      const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterAvailable === 'all' || 
        (filterAvailable === 'available' && meal.availability) ||
        (filterAvailable === 'unavailable' && !meal.availability);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const averagePrice = filteredMeals.length > 0 
    ? Math.round(filteredMeals.reduce((sum, meal) => sum + meal.price, 0) / filteredMeals.length)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header Section */}
      <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ChefHat className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Additional Items</h2>
              <p className="text-gray-600">Manage your side dishes and extras</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 w-full sm:w-56"
              />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none bg-white transition-all duration-200"
              >
                <option value="all">All Items</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{filteredMeals.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{filteredMeals.filter(m => m.availability).length}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-orange-600">Rs. {averagePrice}</div>
            <div className="text-sm text-gray-600">Avg Price</div>
          </div>
        </div> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Item Name
                  {sortBy === 'name' && (
                    <span className="text-orange-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-2">
                  Price
                  {sortBy === 'price' && (
                    <span className="text-orange-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Availability</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {filteredMeals.length > 0 ? (
              filteredMeals.map((meal, index) => (
                <tr key={meal.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                  <td className="px-6 py-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-200">
                      {meal.image ? (
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center">
                          <ChefHat className="w-6 h-6 text-orange-600" />
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold text-gray-900">{meal.name}</div>
                        {/* <div className="text-sm text-gray-500">Item #{index + 1}</div> */}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">Rs. {meal.price}</span>
                      {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        meal.price < 60 
                          ? 'bg-green-100 text-green-800' 
                          : meal.price < 100 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {meal.price < 60 ? 'Budget' : meal.price < 100 ? 'Standard' : 'Premium'}
                      </span> */}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleAvailability && onToggleAvailability(meal)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        meal.availability
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-md'
                          : 'bg-red-100 text-red-800 hover:bg-red-200 hover:shadow-md'
                      }`}
                    >
                      {meal.availability ? (
                        <>
                          <Eye className="w-4 h-4" />
                          Available
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Unavailable
                        </>
                      )}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit && onEdit(meal)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group/btn"
                        title="Edit item"
                      >
                        <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-150" />
                      </button>
                      
                      <button
                        onClick={() => onDelete && onDelete(meal.id)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group/btn"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-150" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                      <ChefHat className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No additional items found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm || filterAvailable !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Start by adding your first additional item like sides, drinks, or extras'
                        }
                      </p>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200">
                        <Plus className="w-4 h-4" />
                        Add First Item
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Enhanced Footer */}
      {filteredMeals.length > 0 && (
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Total: {filteredMeals.length} items
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Available: {filteredMeals.filter(m => m.availability).length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Unavailable: {filteredMeals.filter(m => !m.availability).length}
              </span>
            </div>
            
            {averagePrice > 0 && (
              <div className="text-sm text-gray-600">
                Average price: <span className="font-semibold text-orange-600">Rs. {averagePrice}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalMealTable;