import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  Clock, 
  Star, 
  Loader2, 
  X,
  UtensilsCrossed
} from 'lucide-react';
import { restaurantService } from '../../services/api';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');

  const quickTags = ['All', 'Burgers', 'Pizzas', 'Biryani', 'Beverages', 'Drinks', 'Desserts'];

  // Search restaurants and dishes live from MongoDB
  useEffect(() => {
    let isMounted = true;

    const performSearch = async () => {
      try {
        setLoading(true);
        // Agar tag 'Drinks' hai to backend ke liye 'Beverages' query parameter pass karein
        const queryTerm = selectedTag === 'Drinks' ? 'Beverages' : (selectedTag !== 'All' ? selectedTag : '');
        const finalSearch = searchTerm.trim() || queryTerm;

        const res = await restaurantService.getAllRestaurants({
          search: finalSearch || undefined
        });

        if (isMounted) {
          if (res && res.success && Array.isArray(res.data)) {
            setRestaurants(res.data);
          } else if (Array.isArray(res)) {
            setRestaurants(res);
          } else {
            setRestaurants([]);
          }
        }
      } catch (err) {
        console.error('Error searching items:', err);
        if (isMounted) setRestaurants([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      performSearch();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedTag]);

  const handleSelectRestaurant = (restaurant: any) => {
    const targetId = restaurant.RestaurantId || restaurant.restaurantId || restaurant._id;
    if (targetId) {
      navigate(`/restaurants/${targetId}`);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24">
      {/* Top Search Header */}
      <div className="bg-white p-4 sticky top-0 z-30 border-b border-gray-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search burgers, pizzas, biryani, drinks..."
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Tags Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (selectedTag === tag) {
                  setSelectedTag('');
                } else {
                  setSelectedTag(tag);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedTag === tag
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-gray-100 text-zinc-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            <span className="text-xs font-medium">Searching live database...</span>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-zinc-400">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-zinc-800">Koi outlet ya dish nahi mili</h3>
            <p className="text-xs text-zinc-400">Dusra keyword ya "Drinks" / "Burgers" tag try karein.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Matching Outlets ({restaurants.length})
            </div>

            {restaurants.map((restaurant) => {
              const restId = restaurant.RestaurantId || restaurant.restaurantId || restaurant._id;

              return (
                <div
                  key={restId}
                  onClick={() => handleSelectRestaurant(restaurant)}
                  className="bg-white p-3 rounded-2xl border border-gray-100 shadow-soft flex gap-3.5 items-center cursor-pointer hover:border-brand-200 active:scale-99 transition"
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-black text-xs text-zinc-900 truncate">
                        {restaurant.name}
                      </h4>
                      <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-200 shrink-0">
                        <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                        <span>{restaurant.rating || 4.5}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 font-medium truncate">
                      {restaurant.cuisine}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-500" />
                        {restaurant.deliveryTime || '20-25 mins'}
                      </span>
                      <span>•</span>
                      <span>₹{restaurant.priceForTwo} for two</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};