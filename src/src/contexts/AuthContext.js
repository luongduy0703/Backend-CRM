import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Found token in localStorage');
      // Set token cho axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Lấy thông tin user
      fetchUserInfo();
    } else {
      console.log('No token found in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      console.log('Fetching user info...');
      const response = await axios.get('/api/users/me');
      console.log('User info:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const response = await axios.post('/req/login', { email, password });
      const { token } = response.data;
      console.log('Login successful, setting token');
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await fetchUserInfo();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 