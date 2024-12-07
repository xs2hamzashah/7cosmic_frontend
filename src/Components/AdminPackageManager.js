import React from "react";

const AdminPackageManager = ({ packages, onEdit, onApprove, onDelete }) => {
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
            <tr key={pkg.id}>
              <td>{pkg.displayName}</td>
              <td>{pkg.size}</td>
              <td>{parseFloat(pkg.price).toLocaleString()}</td>
              <td>{pkg.solutionType}</td>
              <td>{pkg.buyerInteractionCount}</td>
              <td>{pkg.isApproved ? "Approved" : "Pending Approval"}</td>
              <td>
                <button className="btn edit-btn" onClick={() => onEdit(pkg.id)}>
                  Edit
                </button>
                <button
                  className={`btn approve-btn ${
                    pkg.isApproved ? "approved" : ""
                  }`}
                  onClick={() => onApprove(pkg.id)}
                >
                  {pkg.isApproved ? "Approved" : "Approve"}
                </button>
                <button
                  className="btn delete-btn"
                  onClick={() => onDelete(pkg.id)}
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
