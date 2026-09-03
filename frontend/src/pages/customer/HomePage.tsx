import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  Star, 
  Loader2, 
  MapPin, 
  Sparkles, 
  UtensilsCrossed, 
  User,
  ChevronRight
} from 'lucide-react';
import { restaurantService } from '../../services/api';

// 10 Guaranteed Backup Restaurants with full items (Burgers, Pizzas, Biryani, Drinks, Desserts)
const BACKUP_RESTAURANTS = [
  {
    RestaurantId: 'rest_1',
    name: 'The Food Haven & Cafe',
    cuisine: 'Multi-Cuisine, Burgers, Drinks',
    rating: 4.8,
    deliveryTime: '20-25 mins',
    priceForTwo: 450,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80',
    featured: true,
  },
  {
    RestaurantId: 'rest_2',
    name: 'Royal Spice & Biryani House',
    cuisine: 'Biryani, North Indian, Beverages',
    rating: 4.6,
    deliveryTime: '30-35 mins',
    priceForTwo: 550,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80',
    featured: false,
  },
  {
    RestaurantId: 'rest_3',
    name: 'The Burger Club & Brews',
    cuisine: 'American Burgers, Fries, Shakes',
    rating: 4.5,
    deliveryTime: '20-25 mins',
    priceForTwo: 400,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&q=80',
    featured: true,
  },
  {
    RestaurantId: 'rest_4',
    name: 'Pizza Gusto & Italian Oven',
    cuisine: 'Italian, Pizzas, Coolers',
    rating: 4.7,
    deliveryTime: '25-30 mins',
    priceForTwo: 500,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80',
    featured: false,
  },
  {
    RestaurantId: 'rest_5',
    name: 'The Wok Box - Asian Street',
    cuisine: 'Asian Street Food, Noodles, Drinks',
    rating: 4.4,
    deliveryTime: '20-30 mins',
    priceForTwo: 350,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80',
    featured: false,
  },
  {
    RestaurantId: 'rest_6',
    name: 'Dosa Junction & Filter Coffee',
    cuisine: 'South Indian, Biryani, Beverages',
    rating: 4.7,
    deliveryTime: '15-20 mins',
    priceForTwo: 250,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&q=80',
    featured: false,
  },
  {
    RestaurantId: 'rest_7',
    name: 'Kolkata Kathi Rolls Corner',
    cuisine: 'Rolls, Fast Food, Drinks',
    rating: 4.3,
    deliveryTime: '15-25 mins',
    priceForTwo: 300,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700&q=80',
    featured: false,
  },
  {
    RestaurantId: 'rest_8',
    name: 'Haldiram Sweets & Chaat',
    cuisine: 'Street Food, Desserts, Shakes',
    rating: 4.6,
    deliveryTime: '20-25 mins',
    priceForTwo: 300,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&q=80',
    featured: false,
  },
  {
    RestaurantId: 'rest_9',
    name: 'Belgian Waffle & Shake Co.',
    cuisine: 'Desserts, Waffles, Thick Shakes',
    rating: 4.8,
    deliveryTime: '20-25 mins',
    priceForTwo: 350,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=700&q=80',
    featured: true,
  },
  {
    RestaurantId: 'rest_10',
    name: 'Green Goddess Healthy Bowls',
    cuisine: 'Healthy Salads, Fresh Juices, Bowls',
    rating: 4.6,
    deliveryTime: '25-30 mins',
    priceForTwo: 500,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80',
    featured: false,
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<any[]>(BACKUP_RESTAURANTS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', emoji: '🍽️' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Biryani', emoji: '🍲' },
    { name: 'Beverages', emoji: '🥤' },
    { name: 'Desserts', emoji: '🍰' },
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await restaurantService.getAllRestaurants({
          cuisine: activeCategory !== 'All' ? activeCategory : undefined,
        });

        if (isMounted) {
          const list = res?.data || res?.restaurants || (Array.isArray(res) ? res : []);
          if (Array.isArray(list) && list.length > 0) {
            setRestaurants(list);
          } else if (activeCategory === 'All') {
            setRestaurants(BACKUP_RESTAURANTS);
          } else {
            // Local fallback filter if DB returns empty
            const filtered = BACKUP_RESTAURANTS.filter((r) =>
              r.cuisine.toLowerCase().includes(activeCategory.toLowerCase())
            );
            setRestaurants(filtered.length > 0 ? filtered : BACKUP_RESTAURANTS);
          }
        }
      } catch (err) {
        console.error('API Error, using fail-safe data:', err);
        if (isMounted) {
          setRestaurants(BACKUP_RESTAURANTS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRestaurants();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const handleRestaurantClick = (restaurant: any) => {
    const targetId = restaurant.RestaurantId || restaurant.restaurantId || restaurant._id || 'rest_1';
    navigate(`/restaurants/${targetId}`);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 space-y-4">
      {/* 1. Header with Location & Profile Action */}
      <div className="bg-white p-3.5 mx-4 mt-3 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-zinc-900">Delivering To</span>
              <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.2 rounded font-bold">HOME</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium truncate max-w-[180px]">
              Bandra West, Mumbai
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-zinc-700 flex items-center justify-center transition cursor-pointer shadow-2xs border border-gray-200/60"
        >
          <User className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Search Bar */}
      <div className="px-4">
        <button
          onClick={() => navigate('/search')}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-xs text-zinc-400 shadow-2xs text-left cursor-pointer hover:border-gray-300 transition"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-zinc-400" />
            <span>Search dishes, burgers, drinks or cuisines...</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300" />
        </button>
      </div>

      {/* 3. Special Offer Card */}
      <div className="mx-4 p-4 rounded-3xl bg-gradient-to-r from-brand-500 to-amber-500 text-white shadow-lg shadow-brand-500/20 flex items-center justify-between">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> Exclusive Today
          </span>
          <h2 className="text-base font-black leading-tight">Get 50% OFF up to ₹120</h2>
          <p className="text-[11px] text-white/90">Use code BITEFOOD on your order</p>
        </div>
        <span className="text-4xl">🍔</span>
      </div>

      {/* 4. Food Category Filters */}
      <div className="px-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.name
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-gray-200/80 text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. All Restaurants List */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <UtensilsCrossed className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-black text-zinc-900">
              {activeCategory === 'All' ? 'All Restaurants Nearby' : `${activeCategory} Outlets`}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-zinc-400">
            {restaurants.length} Kitchens Open
          </span>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            <span className="text-xs font-medium">Loading kitchens...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants.map((restaurant) => {
              const restId = restaurant.RestaurantId || restaurant.restaurantId || restaurant._id || 'rest_1';

              return (
                <div
                  key={restId}
                  onClick={() => handleRestaurantClick(restaurant)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-soft cursor-pointer hover:border-brand-200 active:scale-99 transition group"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {restaurant.featured && (
                      <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Top Rated
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] font-bold text-zinc-800 shadow-xs">
                      <Clock className="w-3 h-3 text-brand-500" />
                      <span>{restaurant.deliveryTime || '25-30 mins'}</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm text-zinc-900 group-hover:text-brand-600 transition truncate">
                        {restaurant.name}
                      </h4>
                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-emerald-200 shrink-0">
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        <span>{restaurant.rating || 4.5}</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium line-clamp-1">
                      {restaurant.cuisine}
                    </p>
                    <div className="pt-1 text-[11px] font-bold text-zinc-400">
                      ₹{restaurant.priceForTwo} for two
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