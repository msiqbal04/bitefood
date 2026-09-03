import mongoose from 'mongoose';
import { Restaurant } from '../models/Restaurant';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Exact match with server port 5001 configuration
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bitefood';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Seeding...');

    const createRichMenu = (idPrefix: string) => [
      {
        dishId: `${idPrefix}_b1`,
        name: 'Crispy Veggie Crunch Burger',
        description: 'Golden spiced patty, crunchy lettuce, cheddar cheese, and signature dressing.',
        price: 159,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80',
        isVeg: true,
        inStock: true,
        isAvailable: true,
      },
      {
        dishId: `${idPrefix}_b2`,
        name: 'Classic Smokey Chicken Burger',
        description: 'Tender grilled chicken breast, smoked chipotle sauce, and pickles in a brioche bun.',
        price: 249,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
        isVeg: false,
        inStock: true,
        isAvailable: true,
      },
      {
        dishId: `${idPrefix}_p1`,
        name: 'Farmhouse Veg Delight Pizza',
        description: 'Fresh bell peppers, crisp sweetcorn, red onions, mushrooms, and melted mozzarella.',
        price: 369,
        category: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
        isVeg: true,
        inStock: true,
        isAvailable: true,
      },
      {
        dishId: `${idPrefix}_p2`,
        name: 'Spicy Barbecue Chicken Pizza',
        description: 'Smoked chicken morsels, barbecue glaze, sliced jalapenos, and gouda cheese.',
        price: 449,
        category: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
        isVeg: false,
        inStock: true,
        isAvailable: true,
      },
      {
        dishId: `${idPrefix}_bir1`,
        name: 'Dum Handi Paneer Biryani',
        description: 'Fragrant basmati rice slow-cooked with cottage cheese, whole spices, and saffron.',
        price: 289,
        category: 'Biryani',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
        isVeg: true,
        inStock: true,
        isAvailable: true,
      },
      {
        dishId: `${idPrefix}_bir2`,
        name: 'Royal Hyderabadi Chicken Biryani',
        description: 'Dum-cooked chicken thigh with caramelized onions, fresh mint, and ghee aromatics.',
        price: 349,
        category: 'Biryani',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80',
        isVeg: false,
        inStock: true,
        isAvailable: true,
      },
      {
        dishId: `${idPrefix}_dr1`,
        name: 'Blue Curacao Mojito Cooler',
        description: 'Chilled sparkling soda with fresh crushed mint leaves, lime wedge, and curacao syrup.',
        price: 119,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80',
        isVeg: true,
        inStock: true,
        isAvailable: true,
      },
      {
        dishId: `${idPrefix}_dr2`,
        name: 'Belgian Chocolate Thick Shake',
        description: 'Rich dark cocoa blended with dense whole milk, topped with chocolate crumbs.',
        price: 149,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80',
        isVeg: true,
        inStock: true,
        isAvailable: true,
      },
      {
        dishId: `${idPrefix}_ds1`,
        name: 'Warm Choco Lava Cake',
        description: 'Decadent chocolate sponge cake filled with a gooey, molten liquid chocolate core.',
        price: 109,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
        isVeg: true,
        inStock: true,
        isAvailable: true,
      }
    ];

    const top10Restaurants = [
      { id: 'rest_1', name: 'The Food Haven & Cafe', cuisine: 'Multi-Cuisine, Burgers, Drinks', area: 'Bandra West', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80', rating: 4.8 },
      { id: 'rest_2', name: 'Royal Spice & Biryani House', cuisine: 'Biryani, North Indian, Beverages', area: 'Andheri East', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80', rating: 4.6 },
      { id: 'rest_3', name: 'The Burger Club & Brews', cuisine: 'American Burgers, Fries, Shakes', area: 'Powai', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&q=80', rating: 4.5 },
      { id: 'rest_4', name: 'Pizza Gusto & Italian Oven', cuisine: 'Italian, Pizzas, Coolers', area: 'Juhu', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80', rating: 4.7 },
      { id: 'rest_5', name: 'The Wok Box - Asian Street', cuisine: 'Asian Street Food, Noodles, Drinks', area: 'Malad West', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80', rating: 4.4 },
      { id: 'rest_6', name: 'Dosa Junction & Filter Coffee', cuisine: 'South Indian, Biryani, Beverages', area: 'Matunga', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&q=80', rating: 4.7 },
      { id: 'rest_7', name: 'Kolkata Kathi Rolls Corner', cuisine: 'Rolls, Fast Food, Drinks', area: 'Versova', img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700&q=80', rating: 4.3 },
      { id: 'rest_8', name: 'Haldiram Sweets & Chaat', cuisine: 'Street Food, Desserts, Shakes', area: 'Vile Parle', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&q=80', rating: 4.6 },
      { id: 'rest_9', name: 'Belgian Waffle & Shake Co.', cuisine: 'Desserts, Waffles, Thick Shakes', area: 'Khar West', img: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=700&q=80', rating: 4.8 },
      { id: 'rest_10', name: 'Green Goddess Healthy Bowls', cuisine: 'Healthy Salads, Fresh Juices, Bowls', area: 'Worli', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80', rating: 4.6 },
    ];

    const restaurantDocuments = top10Restaurants.map((res, index) => ({
      RestaurantId: res.id,
      restaurantId: res.id,
      name: res.name,
      cuisine: res.cuisine,
      rating: res.rating,
      deliveryTime: '20-25 mins',
      priceForTwo: 350 + (index % 3) * 50,
      image: res.img,
      featured: index < 3,
      isExpress: true,
      address: `${res.area}, Mumbai`,
      fssaiLicense: `11521045000${index + 100}`,
      isActive: true,
      location: { lat: 19.076 + index * 0.002, lng: 72.877 + index * 0.002 },
      menu: createRichMenu(res.id),
    }));

    try {
      await mongoose.connection.collection('restaurants').drop();
    } catch {
      // ignore
    }

    await Restaurant.insertMany(restaurantDocuments);
    console.log(`✅ Success: Exactly ${restaurantDocuments.length} Restaurants seeded with full complete menus!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();