import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import Spinner from "./Spinner";

const AdminPackageManager = ({
  packages,
  onEdit,
  onApprove,
  onDelete,
  isLoading,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    console.log("Card clicked with ID:", id); // Check if this logs
    navigate(`/admin-product-detail/${id}`);
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the row's onClick
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner />
        {/* You can also add a spinner or other loading indicator */}
      </div>
    );
  }

  return (
    <div className="admin-package-manager">
      <table className="package-table">
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Size (kW)</th>
            <th>Price (PKR)</th>
            <th>Solution Type</th>
            <th>Buyers</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr
              key={pkg.id}
              onClick={() => handleCardClick(pkg.id)}
              className={`${
                pkg.is_approved
                  ? "border-b-2 border-[#ff6f20] bg-[#fff4e6]"
                  : "bg-white"
              } hover:bg-gray-100 cursor-pointer`}
            >
              <td>{pkg.display_name}</td>
              <td>{pkg.size}</td>
              <td>{parseFloat(pkg.price).toLocaleString()}</td>
              <td>{pkg.solution_type}</td>
              <td>{pkg.buyer_interaction_count}</td>
              <td>{pkg.is_approved ? "Approved" : "Pending Approval"}</td>
              <td>
                <button
                  className="btn edit-btn"
                  onClick={(e) => {
                    stopPropagation(e);
                    onEdit(pkg.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className={`btn approve-btn ${
                    pkg.is_approved ? "approved" : ""
                  }`}
                  onClick={(e) => {
                    stopPropagation(e);
                    onApprove(pkg.id); // Assuming this function handles toggling approval
                  }}
                >
                  {pkg.is_approved ? "Unapprove" : "Approve"}
                </button>
                <button
                  className="btn delete-btn"
                  onClick={(e) => {
                    stopPropagation(e);
                    onDelete(pkg.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPackageManager;
