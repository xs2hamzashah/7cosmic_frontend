import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPackageForm from "./Pages/AddPackageForm";
import ProductDetail from "./Components/ProductDetail";
import { Login } from "./Pages/Login";
import { ProfileProvider } from "./context/ProfileContext";
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

import { Calculator } from "./Pages/solar-cost-calculator";
import SolarCostCalculator from "./Pages/tools/solar-cost-calculator";

import ProfilePage from "./Pages/ProfilePage";
import TermsAndConditions from "./Pages/TermsAndCondition";
import { Contact } from "lucide-react";
import ContactUsPage from "./Pages/ContactUsPage";
import SubscriptionPlan from "./Pages/SubscriptionPlan";
import AdminProductDetail from "./Components/AdminProductDetail";
import GuestRoute from "./Components/GuestRoute";
import AdminRoute from "./Components/AdminRoute";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ProfileProvider>
          <BrowserRouter>
            <Routes>
              {/* Home and Authentication */}
              <Route path="/" element={<HomePage />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="/admin-product-detail/:id"
                element={<AdminProductDetail />}
              />

              {/* Protected and Guest Routes */}
              <Route
                path="/seller/price-list"
                element={
                  <ProtectedRoute>
                    <PriceList />
                  </ProtectedRoute>
                }
              />

              {/* Product and Seller Routes */}
              <Route path="/add-product/:id" element={<AddPackageForm />} />
              <Route path="/edit-product/:id" element={<EditPackage />} />
              <Route path="/product-detail/:id" element={<ProductDetail />} />
              <Route
                path="/product-detail-list/:id"
                element={<ProductDetailList />}
              />
              <Route path="/seller-analytics" element={<SellerAnalytics />} />
              <Route
                path="/seller-analytics/:id"
                element={<SellerAnalytics />}
              />

              {/* Profile and Info Pages */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/subscription-page" element={<SubscriptionPlan />} />

              {/* Solar Tools */}
              <Route path="/solar-energy-calculator" element={<Calculator />} />
              <Route path="/seller/calculator" element={<Calculator />} />
              <Route
                path="/tools/solar-cost-calculator/:id"
                element={<SolarCostCalculator />}
              />
              {/* <Route
                path="/product-image-upload/:id"
                element={<ImageUploader />}
              /> */}
            </Routes>
          </BrowserRouter>
        </ProfileProvider>
      </ToastProvider>
    </Provider>
  );
}

export default App;
