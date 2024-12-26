import React, { useState } from "react";

const SellerListing = ({ sellers, onSellerClick, selectedCity }) => {
  // Show all sellers if no specific city is selected or if 'All' is selected
  const filteredSellers =
    !selectedCity || selectedCity === "All"
      ? sellers
      : sellers.filter((seller) => seller.company?.city === selectedCity);

  console.log("Selected City:", selectedCity);

  return (
    <div className="seller-listing">
      {/* Seller table */}
      <table className="seller-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Company Name</th>
            <th>City</th>
            <th>Packages</th>
            <th>Buyers</th>
            <th>Whatsapp Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredSellers.map((seller, index) => (
            <tr
              key={seller.id}
              onClick={() => onSellerClick(seller)}
              style={{ cursor: "pointer" }}
            >
              <td>{index + 1}</td>
              <td>{seller.company?.name || "N/A"}</td>
              <td>{seller.company?.city || "N/A"}</td>
              <td>{seller.packages}</td>
              <td>{seller.buyers}</td>
              <td>{seller.company?.phone_number || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerListing;
