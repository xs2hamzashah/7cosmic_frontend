import React from "react";

const SellerListing = ({ sellers }) => {
  return (
    <div className="seller-listing">
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
          {sellers.map((seller) => (
            <tr key={seller.id}>
              <td>{seller.id}</td>
              <td>{seller.companyName}</td>
              <td>{seller.city}</td>
              <td>{seller.packages}</td>
              <td>{seller.buyers}</td>
              <td>{seller.whatsappNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerListing;
