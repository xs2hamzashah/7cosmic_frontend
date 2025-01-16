import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const navigate = useNavigate();

  if (isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center mt-[17rem]">
        <h1 className="text-3xl font-bold text-[#ff6f20]">
          Sorry, you can't access this page
        </h1>
        <p className="text-gray-600 mt-4">
          You're already logged in. Please return to the homepage.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-[#ff6f20] text-white font-medium rounded-lg shadow-lg hover:bg-orange-600 transition"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return children;
};

export default GuestRoute;
