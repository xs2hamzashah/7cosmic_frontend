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
import { ProtectedRoute } from "./Components/auth/ProtectedRoute";
import { PriceList } from "./Pages/PriseList";
import { Provider } from "react-redux";
import { persister, store } from "./redux/store/store";
import { ToastProvider } from "react-toast-notifications";

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
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
            <Route
              path="/product-image-upload/:id"
              element={<ImageUploader />}
            />
            <Route
              path="/seller/price-list"
              element={
                <ProtectedRoute>
                  <PriceList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </Provider>

  );
}

export default App;

// DOMAIN: 7-solar-calculators-production.up.railway.app

// ⁠ /tools/solar-cost-calculator/10-kilo-watt-solar-cost?systemType=${data.systemType}&batteryType=tubular&voltageType=lv&structureType=iron_standard ⁠;
