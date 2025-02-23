import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import Spinner from "./Spinner";
import { IonIcon } from "@ionic/react";
import { close, checkmark, pencil, trash } from "ionicons/icons";

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
      <table className="package-table w-full table-auto border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#ff6f20] text-white text-left text-sm uppercase font-semibold">
            <th className="p-4">Package Name</th>
            <th className="p-4">Size (kW)</th>
            <th className="p-4">Price (PKR)</th>
            <th className="p-4">Solution Type</th>
            <th className="p-4">Buyers</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr
              key={pkg.id}
              onClick={() => handleCardClick(pkg.id)}
              className={`${
                pkg.approval_status?.approved
                  ? "border-b-2 border-[#ff6f20] bg-[#fff4e6]"
                  : "bg-white"
              } hover:bg-gray-100 cursor-pointer transition duration-200 ease-out`}
            >
              <td className="p-4 border-b border-gray-200">
                {pkg.display_name}
              </td>
              <td className="p-4 border-b border-gray-200">{pkg.size}</td>
              <td className="p-4 border-b border-gray-200">
                {parseFloat(pkg.price).toLocaleString()}
              </td>
              <td className="p-4 border-b border-gray-200">
                {pkg.solution_type}
              </td>
              <td className="p-4 border-b border-gray-200">
                {pkg.buyer_interaction_count}
              </td>
              <td className="p-4 border-b border-gray-200">
                {pkg.approval_status?.approved
                  ? "Approved"
                  : "Pending Approval"}
              </td>
              <td className="p-4 border-b border-gray-200 space-x-2 flex items-center justify-center">
                {/* Edit Button */}
                <button
                  className="btn edit-btn px-3 py-2 rounded-md border border-blue-500 text-blue-500 hover:border-blue-700 hover:bg-blue-100 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(pkg.id);
                  }}
                >
                  <IonIcon icon={pencil} className="text-lg" />
                </button>

                {/* Approve/Unapprove Button */}
                <button
                  className={`btn approve-btn px-3 py-2 rounded-md text-white border ${
                    pkg.approval_status?.approved
                      ? "border-red-500 bg-red-500 hover:bg-red-600"
                      : "border-green-500 bg-green-500 hover:bg-green-600"
                  } flex items-center justify-center`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove(pkg.id); // Assuming this function handles toggling approval
                  }}
                >
                  <IonIcon
                    icon={pkg.approval_status?.approved ? close : checkmark}
                    className="text-lg"
                  />
                </button>

                {/* Delete Button */}
                <button
                  className="btn delete-btn px-3 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(pkg.id);
                  }}
                >
                  <IonIcon icon={trash} className="text-lg" />
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
