import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AddressItem } from '../types';

interface RegisterResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  registerUser: (data: RegisterResponse) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  addAddress: (address: Omit<AddressItem, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_USER: User = {
  _id: 'usr_mock_101',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  role: 'CUSTOMER',
  addresses: [
    {
      id: 'addr_1',
      type: 'Home',
      flatNo: 'Flat 402, Sunshine Heights',
      landmark: 'Near City Park',
      area: 'Bandra West',
      city: 'Mumbai',
      pincode: '400050',
      isDefault: true,
    },
    {
      id: 'addr_2',
      type: 'Work',
      flatNo: 'Tower B, 6th Floor',
      landmark: 'Cyber Tech Hub',
      area: 'BKC',
      city: 'Mumbai',
      pincode: '400051',
      isDefault: false,
    },
  ],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('bitetown_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

 const [token, setToken] = useState<string | null>(() => {
  try {
    const saved = localStorage.getItem('bitetown_token');
    return saved && saved !== 'mock_token_active' ? saved : null;
  } catch {
    return null;
  }
});
  const isLoading = false;

  const saveUserState = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('bitetown_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('bitetown_user');
    }
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    localStorage.setItem('bitetown_token', newToken);
    saveUserState(newUser);
  };

  const registerUser = (resData: RegisterResponse) => {
    if (resData?.token && resData?.user) {
      login(resData.token, resData.user);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('bitetown_token');
    saveUserState(null);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated: User = { ...user, ...updatedFields };
    saveUserState(updated);
  };

  const addAddress = (addr: Omit<AddressItem, 'id'>) => {
    if (!user) return;
    const newAddr: AddressItem = {
      ...addr,
      id: `addr_${Date.now()}`,
    };
    const currentAddresses: AddressItem[] = user.addresses || [];
    const updatedAddresses: AddressItem[] = addr.isDefault
      ? currentAddresses.map((a: AddressItem) => ({ ...a, isDefault: false })).concat(newAddr)
      : [...currentAddresses, newAddr];

    updateUser({ addresses: updatedAddresses });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const currentAddresses: AddressItem[] = user.addresses || [];
    const filtered: AddressItem[] = currentAddresses.filter((a: AddressItem) => a.id !== id);
    updateUser({ addresses: filtered });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const currentAddresses: AddressItem[] = user.addresses || [];
    const updated: AddressItem[] = currentAddresses.map((a: AddressItem) => ({
      ...a,
      isDefault: a.id === id,
    }));
    updateUser({ addresses: updated });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        registerUser,
        logout,
        updateUser,
        addAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};