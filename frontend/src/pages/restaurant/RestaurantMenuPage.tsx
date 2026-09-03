import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  X, 
  UploadCloud,
  Check
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isVeg: boolean;
  inStock: boolean;
  image: string;
}

export const RestaurantMenuPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([
    {
      id: 'item-1',
      name: 'Farmhouse Special Pizza',
      category: 'Pizzas',
      price: 399,
      description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom',
      isVeg: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'item-2',
      name: 'BBQ Chicken Feast',
      category: 'Pizzas',
      price: 499,
      description: 'Loaded with barbecue chicken, crispy onion rings and melted gouda',
      isVeg: false,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'item-3',
      name: 'Cheesy Garlic Breadsticks',
      category: 'Sides',
      price: 149,
      description: 'Freshly baked dough sticks stuffed with melted cheddar and herb butter',
      isVeg: true,
      inStock: false,
      image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'item-4',
      name: 'Choco Lava Cake',
      category: 'Desserts',
      price: 119,
      description: 'Warm chocolate cake with molten center',
      isVeg: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Dish Form State
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('Pizzas');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishDescription, setNewDishDescription] = useState('');
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);
  const [newDishImage, setNewDishImage] = useState('');

  const categories = ['All', 'Pizzas', 'Sides', 'Beverages', 'Desserts'];

  // Toggle In Stock / Out of Stock
  const toggleStock = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  // Delete Dish
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle Add Item Submit
  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName || !newDishPrice) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newDishName,
      category: newDishCategory,
      price: Number(newDishPrice),
      description: newDishDescription || 'Freshly prepared specialty dish.',
      isVeg: newDishIsVeg,
      inStock: true,
      image: newDishImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewDishName('');
    setNewDishPrice('');
    setNewDishDescription('');
    setNewDishImage('');
    setNewDishIsVeg(true);
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Menu & Inventory Control</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Toggle live dish availability, update prices, or add new recipes</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black shadow-md shadow-brand-500/20 active:scale-98 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-zinc-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-4 flex flex-col justify-between gap-4 transition shadow-soft ${
              item.inStock ? 'border-gray-100' : 'border-gray-200 bg-gray-50/75 opacity-70'
            }`}
          >
            <div className="flex gap-3.5">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-md border flex items-center justify-center bg-white ${
                    item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  />
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-xs text-zinc-900 truncate">{item.name}</h3>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-zinc-400 hover:text-rose-500 transition cursor-pointer p-0.5"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-medium">
                  {item.description}
                </p>
                <div className="text-xs font-black text-zinc-900 pt-0.5">₹{item.price}</div>
              </div>
            </div>

            {/* In-Stock Toggle Button */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className={`text-[11px] font-bold ${item.inStock ? 'text-emerald-600' : 'text-zinc-400'}`}>
                {item.inStock ? 'In Stock (Live)' : 'Out of Stock'}
              </span>

              <button
                onClick={() => toggleStock(item.id)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                  item.inStock ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    item.inStock ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-zinc-900">Add Menu Dish</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItemSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Dish Title</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Paneer Butter Masala Roll"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Pizzas">Pizzas</option>
                    <option value="Sides">Sides</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="e.g. 299"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Image URL</label>
                <div className="relative">
                  <UploadCloud className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={newDishImage}
                    onChange={(e) => setNewDishImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDishDescription}
                  onChange={(e) => setNewDishDescription(e.target.value)}
                  placeholder="Ingredients, flavor notes, crust details..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Dietary Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDishIsVeg(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      newDishIsVeg
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-gray-50 text-zinc-600 border-gray-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Pure Veg</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDishIsVeg(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      !newDishIsVeg
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-gray-50 text-zinc-600 border-gray-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    <span>Non-Veg</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-zinc-700 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Dish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};