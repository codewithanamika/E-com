import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import Editproduct from './pages/Editproduct';
import SyncFakeStoreToFirestore from './components/SyncFakeStoreToFirestore';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<ProductPage />} />
      <Route path="/cart" element={ <CartPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/edit-product/:id" element={<Editproduct />} />
      <Route path="/sync-products" element={<SyncFakeStoreToFirestore />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      <Route path="/admin/orders/:id" element={<AdminOrders />} />
      <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />


    </Routes>
    </>
  )
}

export default App
