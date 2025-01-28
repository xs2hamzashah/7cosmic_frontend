import React, { useState } from "react";

const SellerListing = ({ sellers, onSellerClick, selectedCity }) => {
  // Show all sellers if no specific city is selected or if 'All' is selected
  const filteredSellers =
    !selectedCity || selectedCity === "All"
      ? sellers
      : sellers.filter((seller) => seller.company?.city === selectedCity);

  return (
    <div className="seller-listing">
      {/* Seller table */}
      <table className="seller-table w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden my-10">
        <thead>
          <tr className="bg-[#ff6f20] text-white text-left text-sm uppercase font-semibold">
            <th className="p-4">Company Name</th>
            <th className="p-4">City</th>
            <th className="p-4">Packages</th>
            <th className="p-4">Buyers</th>
            <th className="p-4">Whatsapp Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredSellers.map((seller, index) => (
            <tr
              key={seller.id}
              onClick={() => onSellerClick(seller)}
              className="cursor-pointer hover:scale-[0.98] hover:bg-gray-100 transition transform duration-200 ease-out"
            >
              <td className="p-4 border-b border-gray-200">
                {seller.company?.name || "N/A"}
              </td>
              <td className="p-4 border-b border-gray-200">
                {seller.company?.city || "N/A"}
              </td>
              <td className="p-4 border-b border-gray-200">
                {seller.packages_count}
              </td>
              <td className="p-4 border-b border-gray-200">
                {seller.buyers_count}
              </td>
              <td className="p-4 border-b border-gray-200">
                {seller.company?.phone_number || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerListing;
