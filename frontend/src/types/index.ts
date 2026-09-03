export interface CustomizationOption {
  name: string;
  price: number;
}

export interface CustomizationGroup {
  title: string;
  type: 'single' | 'multiple';
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Fast Food' | 'Meals' | 'Snacks' | 'Beverages';
  image: string;
  isVeg: boolean;
  rating?: number;
  isBestseller?: boolean;
  spiceLevel?: 1 | 2 | 3;
  calories?: number;
  customization?: CustomizationGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceForTwo: number;
  image: string;
  featured?: boolean;
  isExpress?: boolean;
  address?: string;
  isActive?: boolean;
  fssaiLicense?: string;
  menu: MenuItem[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  RestaurantId: string;
  selectedAddons?: string[];
}

export interface AddressItem {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  flatNo: string;
  landmark: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

// Backward compatibility alias for api.ts
export type Address = AddressItem;

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id?: string;
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  address: string;
  items: OrderItem[];
  paymentMethod?: string;
  cookingNotes?: string[];
  deliveryNotes?: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'CUSTOMER' | 'ADMIN';
  addresses?: AddressItem[];
}