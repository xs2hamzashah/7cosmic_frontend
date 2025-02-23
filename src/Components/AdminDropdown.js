import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { personOutline, logOutOutline, clipboardOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

const AdminDropdown = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDashboard = () => {
    navigate("/admin");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative my-2" ref={dropdownRef}>
      {/* Avatar Icon Button */}
      <button
        onClick={() => setIsDropdownVisible(!isDropdownVisible)}
        className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded-md 
                   hover:border-[#ff6f20] hover:text-[#ff6f20] transition-all duration-200 
                   shadow-sm hover:shadow group"
      >
        <IonIcon
          icon={personOutline}
          className="w-4 h-4 text-gray-600 group-hover:text-[#ff6f20] transition-colors"
        />
        <span className="text-xs font-medium text-gray-700 group-hover:text-[#ff6f20] transition-colors">
          Admin
        </span>
      </button>

      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
          <button
            onClick={handleDashboard}
            className="w-full px-4 py-2 text-sm text-left font-medium text-[#ff6f20] hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <IonIcon icon={clipboardOutline} />
            Dashboard
          </button>

          <div className="w-full h-px bg-gray-200 my-1"></div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <IonIcon icon={logOutOutline} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDropdown;
