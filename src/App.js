import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPackageForm from "./Pages/AddPackageForm";
import ProductDetail from "./Components/ProductDetail";
import { Login } from "./Pages/Login";
import SellerDashboard from "./SellerDashboard";
import ImageUploader from "./Components/Product-details-components/ImageUploader";
import ProductDetailList from "./Pages/ProductDetailsList";
import HomePage from "./Pages/HomePage";
import SellerAnalytics from "./Components/SellerAnalytics";
import Signup from "./Pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-product/:id" element={<AddPackageForm />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller-analytics" element={<SellerAnalytics />} />
        <Route
          path="/product-detail-list/:id"
          element={<ProductDetailList />}
        />
        <Route path="/product-image-upload/:id" element={<ImageUploader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// DOMAIN: 7-solar-calculators-production.up.railway.app

// ⁠ /tools/solar-cost-calculator/10-kilo-watt-solar-cost?systemType=${data.systemType}&batteryType=tubular&voltageType=lv&structureType=iron_standard ⁠;
