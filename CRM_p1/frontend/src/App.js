import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import TestLogin from './components/auth/TestLogin';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/Dashboard';
import ProductList from './components/products/ProductList';
import AddProduct from './components/products/AddProduct';
import UserList from './components/users/UserList';
import UserRoles from './components/users/UserRoles';
import Reports from './components/Reports';
import ContractList from './components/contracts/ContractList';
import AddContract from './components/contracts/AddContract';
import EditContract from './components/contracts/EditContract';
import './App.css';

// eslint-disable-next-line no-unused-vars

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  return token && user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/test-login" element={<TestLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products">
              <Route path="list" element={<ProductList />} />
              <Route path="add" element={<AddProduct />} />
            </Route>
            <Route path="users">
              <Route path="list" element={<UserList />} />
              <Route path="roles" element={<UserRoles />} />
            </Route>
            <Route path="reports" element={<Reports />} />
            <Route path="contracts">
              <Route path="list" element={<ContractList />} />
              <Route path="add" element={<AddContract />} />
              <Route path="edit/:id" element={<EditContract />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 