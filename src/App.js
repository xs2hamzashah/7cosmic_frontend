import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPackageForm from "./Pages/AddPackageForm";
import ProductDetail from "./Components/ProductDetail";
import { Login } from "./Pages/Login";
import ImageUploader from "./Components/Product-details-components/ImageUploader";
import ProductDetailList from "./Pages/ProductDetailsList";
import HomePage from "./Pages/HomePage";
import SellerAnalytics from "./Pages/SellerAnalytics";
import Signup from "./Pages/Signup";
import AdminDashboard from "./AdminDashboard";
import ResetPassword from "./Pages/ResetPassword";
import EditPackage from "./Pages/EditPackages";
import AdminProductDetail from "./Components/AdminProductDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/admin-product-detail/:id"
          element={<AdminProductDetail />}
        />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-product/:id" element={<AddPackageForm />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/seller-analytics/:id" element={<SellerAnalytics />} />
        <Route
          path="/product-detail-list/:id"
          element={<ProductDetailList />}
        />
        <Route path="/edit-product/:id" element={<EditPackage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/product-image-upload/:id" element={<ImageUploader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
