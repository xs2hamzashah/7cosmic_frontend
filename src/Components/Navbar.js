import { FC, useState, useEffect, useRef } from "react";
// import Link from 'next/link'
// import { useRouter } from 'next/router'
import {
  Search,
  User,
  ChevronDown,
  Filter,
  PhoneIcon,
  StarIcon,
  ClipboardIcon,
  FileTextIcon,
  LogOutIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onSearch, companyName, userEmail }) => {
  const [filters, setFilters] = useState({
    query: "",
    city: "",
    size: "",
    price: "",
  });
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  // const router = useRouter()
  const dropdownRef = useRef(null);

  const handleSearch = () => {
    onSearch(filters);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        {/* Enhanced Logo Section */}
        <div className="flex-shrink-0">
          <a to="/" className="group flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl  p-2.5 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="hidden text-2xl font-bold text-gray-900 lg:block">
              7Cosmic
            </span>
          </a>
        </div>

        {/* Search Section */}
        <div className="flex flex-1 items-center gap-4 px-8">
          {/* Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search solar solutions..."
                value={filters.query}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, query: e.target.value }))
                }
                className="w-full rounded-xl border-none bg-gray-50 px-5 py-3
              shadow-sm transition-all duration-200
              focus:bg-white focus:ring-2 focus:ring-[#1B8897]/20"
              />
              <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Filters */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                {/* City Filter */}
                <div className="mb-4">
                  <label className="mb-1 block text-sm text-gray-600">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <option value="">Select City</option>
                    <option value="karachi">Karachi</option>
                    <option value="lahore">Lahore</option>
                    <option value="islamabad">Islamabad</option>
                  </select>
                </div>

                {/* Size Filter */}
                <div className="mb-4">
                  <label className="mb-1 block text-sm text-gray-600">
                    Size
                  </label>
                  <select
                    value={filters.size}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, size: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <option value="">Select Size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div className="mb-4">
                  <label className="mb-1 block text-sm text-gray-600">
                    Price Range
                  </label>
                  <select
                    value={filters.price}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <option value="">Select Range</option>
                    <option value="0-1000">$0 - $1000</option>
                    <option value="1000-5000">$1000 - $5000</option>
                    <option value="5000+">$5000+</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="rounded-lg bg-[#1B8897] px-6 py-2 text-white hover:bg-[#156D79] active:scale-[0.98]"
          >
            Search
          </button>
        </div>

        {/* User Profile */}

        {/* User Profile Section */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 rounded-lg bg-[#1B8897] px-6 py-2 text-white hover:bg-[#156D79] active:scale-[0.98] transition-all duration-200"
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {companyName || "Profile"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                  <div className="border-b border-gray-100 px-4 pb-2">
                    <p className="text-sm font-medium text-gray-900">
                      {companyName}
                    </p>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ClipboardIcon className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => navigate("/subscription")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <StarIcon className="h-4 w-4" />
                      <span>Subscription</span>
                    </button>

                    <button
                      onClick={() => navigate("/terms")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FileTextIcon className="h-4 w-4" />
                      <span>Terms & Conditions</span>
                    </button>

                    <button
                      onClick={() => navigate("/contact")}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <PhoneIcon className="h-4 w-4" />
                      <span>Contact Us</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("sellerId");
                        // setIsLoggedIn(false);
                        navigate("/login");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOutIcon className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
