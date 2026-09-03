import axios from 'axios';

// Vite static replacement ke sath robust Render production fallback
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://bitefoodbackend.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 1. AUTH SERVICES ---
export const authApi = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// --- 2. ADMIN SERVICES ---
export const adminApi = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getRestaurants: async () => {
    const response = await api.get('/admin/restaurants');
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
};

// --- 3. CUSTOMER ORDER SERVICE ---
export const placeRealOrder = async (orderPayload: any) => {
  const response = await api.post('/orders', orderPayload);
  return response.data;
};

// --- 4. RESTAURANT SERVICES ---
export const restaurantService = {
  getAllRestaurants: async (params?: { cuisine?: string; vegOnly?: boolean; search?: string }) => {
    const response = await api.get('/restaurants', { params });
    return response.data;
  },
  getRestaurantDetails: async (id: string) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },
  getMenu: async (restaurantId: string) => {
    const response = await api.get(`/menu/restaurant/${restaurantId}`);
    return response.data;
  },
  toggleItemStock: async (restaurantId: string, itemId: string) => {
    const response = await api.patch(`/menu/restaurant/${restaurantId}/item/${itemId}/toggle`);
    return response.data;
  },
  addMenuItem: async (restaurantId: string, dishData: any) => {
    const response = await api.post(`/menu/restaurant/${restaurantId}/item`, dishData);
    return response.data;
  },
};

export default api;