import { useNavigate, useParams } from "react-router-dom";
import React from "react";

const AdminPackageManager = ({ packages, onEdit, onApprove, onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    console.log('Card clicked with ID:', id);  // Check if this logs
    navigate(`/admin-product-detail/${id}`);
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the row's onClick
  };

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
            <tr onClick={() => handleCardClick(pkg.id)} key={pkg.id}>
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
                    onApprove(pkg.id);
                  }}
                >
                  {pkg.is_approved ? "Approved" : "Approve"}
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
