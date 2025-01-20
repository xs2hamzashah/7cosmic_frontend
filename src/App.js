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
import ProfilePage from "./Pages/ProfilePage";
import TermsAndConditions from "./Pages/TermsAndCondition";
import { Contact } from "lucide-react";
import ContactUsPage from "./Pages/ContactUsPage";
import SubscriptionPlan from "./Pages/SubscriptionPlan";
import AdminProductDetail from "./Components/AdminProductDetail";
import GuestRoute from "./Components/GuestRoute";
import AdminRoute from "./Components/AdminRoute";

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ProfileProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product-detail/:id" element={<ProductDetail />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/sign-up"
                element={
                  <GuestRoute>
                    <Signup />
                  </GuestRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route path="/add-product/:id" element={<AddPackageForm />} />
              <Route
                path="/product-detail-list/:id"
                element={<ProductDetailList />}
              />
              <Route
                path="/admin-product-detail/:id"
                element={<AdminProductDetail />}
              />
              <Route path="/seller-analytics" element={<SellerAnalytics />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/subscription-page" element={<SubscriptionPlan />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/edit-product/:id" element={<EditPackage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
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
        </ProfileProvider>
      </ToastProvider>
    </Provider>
  );
}

export default App;
