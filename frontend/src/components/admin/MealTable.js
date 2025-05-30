import React, { useState } from 'react';
import { Edit, Trash2, Search, Filter, MoreVertical, Eye, EyeOff } from 'lucide-react';

const MealTable = ({ meals = [], onEdit, onDelete, onToggleAvailability }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Sample data if meals is empty for demonstration
  const sampleMeals = meals.length > 0 ? meals : [
    {
      id: 1,
      name: 'Chicken Biryani',
      half_price: 180,
      full_price: 320,
      availability: true,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d63b?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Butter Chicken',
      half_price: 220,
      full_price: 380,
      availability: false,
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Paneer Tikka Masala',
      half_price: 160,
      full_price: 280,
      availability: true,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&h=100&fit=crop&crop=center'
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
        comparison = a.full_price - b.full_price;
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

  const handleDelete = async (id) => {
  try {
    const res = await fetch(`/api/meals/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete');
    // Refresh or remove meal from local state
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header with search and filters */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Meal Management</h2>
            <p className="text-gray-600">{filteredMeals.length} meals found</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 w-full sm:w-64"
              />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all duration-200"
              >
                <option value="all">All Meals</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Name
                  {sortBy === 'name' && (
                    <span className="text-blue-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Half Price</th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-2">
                  Full Price
                  {sortBy === 'price' && (
                    <span className="text-blue-600">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {filteredMeals.length > 0 ? (
              filteredMeals.map((meal) => (
                <tr key={meal.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-200">
                      {meal.image ? (
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-xs font-medium">No Image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{meal.name}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-gray-700 font-medium">Rs. {meal.half_price}</span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-semibold">Rs. {meal.full_price}</span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleAvailability && onToggleAvailability(meal)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        meal.availability
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {meal.availability ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Available
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Unavailable
                        </>
                      )}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit && onEdit(meal)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group/btn"
                        title="Edit meal"
                      >
                        <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-150" />
                      </button>
                      
                      <button
                        onClick={() => { 
                          console.log("Meal to delete:", meal);
                          onDelete && onDelete(meal);}}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group/btn"
                        title="Delete meal"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-150" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No meals found</h3>
                      <p className="text-gray-500">
                        {searchTerm || filterAvailable !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Get started by adding your first meal'
                        }
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer with summary */}
      {filteredMeals.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
            <span>Total: {filteredMeals.length} meals</span>
            <span>Available: {filteredMeals.filter(m => m.availability).length}</span>
            <span>Unavailable: {filteredMeals.filter(m => !m.availability).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealTable;