// import React, { useState, useEffect, useContext } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Pie } from "react-chartjs-2";
// import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
// import { useNavigate } from "react-router-dom";
// import { IonIcon } from "@ionic/react";
// import { pencilOutline } from "ionicons/icons";
// import { X } from "lucide-react";
// import API_BASE_URL from "../config";
// import Navbar from "../Components/Navbar";
// import SubscriptionPopup from "../Components/SubscriptionPopup";
// import CalculatorButtons from "../Components/CalculatorButtons";
// import { ProfileContext } from "../context/ProfileContext";
// import Spinner from "../Components/Spinner";

// Chart.register(ArcElement, Legend, Tooltip);

// // Buyer Numbers Modal Component
// const BuyerNumbersModal = ({ isOpen, onClose, sellerData, buyerNumbers }) => {
//   const [selectedPackage, setSelectedPackage] = useState("all");

//   if (!isOpen) return null;

//   const getFilteredNumbers = () => {
//     if (selectedPackage === "all") {
//       return buyerNumbers;
//     }

//     const selectedProduct = sellerData.products.find(
//       (product) => product.id === selectedPackage
//     );

//     return selectedProduct
//       ? selectedProduct.buyer_whatsapp_numbers.map(
//           (buyer) => buyer.whatsapp_number
//         )
//       : [];
//   };

//   const filteredNumbers = getFilteredNumbers();

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
//         <div className="p-4 border-b flex justify-between items-center">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Buyer Numbers
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="h-6 w-6 text-gray-600" />
//           </button>
//         </div>

//         <div className="p-4 border-b">
//           <select
//             value={selectedPackage}
//             onChange={(e) => setSelectedPackage(e.target.value)}
//             className="w-full p-2 border rounded-md"
//           >
//             <option value="all">All Packages</option>
//             {sellerData.products.map((product) => (
//               <option key={product.id} value={product.id}>
//                 {product.display_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="p-4 overflow-y-auto flex-1">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {filteredNumbers.length > 0 ? (
//               filteredNumbers.map((number, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-50 p-3 rounded-lg flex items-center justify-between"
//                 >
//                   <span className="font-medium text-gray-700">{number}</span>
//                   <button
//                     onClick={() => navigator.clipboard.writeText(number)}
//                     className="text-sm text-blue-600 hover:text-blue-800"
//                   >
//                     Copy
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full text-center text-gray-500 py-8">
//                 No numbers available for this package
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main SellerAnalytics Component
// const SellerAnalytics = () => {
//   const [sellerData, setSellerData] = useState(null);
//   const [totalBuyers, setTotalBuyers] = useState(0);
//   const [isSubscribed, setIsSubscribed] = useState(true);
//   const [buyerNumbers, setBuyerNumbers] = useState([]);
//   const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
//   const [companyName, setCompanyName] = useState("");
//   const [sellerEmail, setSellerEmail] = useState("");
//   const [isNumbersModalOpen, setIsNumbersModalOpen] = useState(false);
//   const navigate = useNavigate();

//   const { profileData, loading: profileLoading } = useContext(ProfileContext);

//   const isDisabled = sellerData?.products?.length >= 3;

//   useEffect(() => {
//     if (profileData && profileData.company && profileData.company.name) {
//       setCompanyName(profileData.company.name);
//       setSellerEmail(profileData.user?.email || "");
//     } else {
//       console.warn("Profile data or company information is unavailable.");
//     }
//   }, [profileData]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const response = await fetch(
//           `${API_BASE_URL}/api/listings/analytics/seller_analytics/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setSellerData(data);
//         const buyersCount = data.products.reduce(
//           (acc, product) => acc + product.buyer_interaction_count,
//           0
//         );
//         setTotalBuyers(buyersCount);

//         // Aggregate WhatsApp numbers
//         const numbers = data.products.flatMap((product) =>
//           product.buyer_whatsapp_numbers.map(
//             (whatsapp) => whatsapp.whatsapp_number
//           )
//         );
//         setBuyerNumbers(numbers);

//         setIsSubscribed(data.is_subscribed || false);
//       } catch (error) {
//         console.error("Error fetching seller analytics:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   if (!sellerData) return <Spinner />;

//   const handleSubscribe = () => {
//     setIsSubscribed(true);
//     setShowSubscriptionPopup(false);
//   };

//   const handleAddPackage = () => {
//     navigate("/add-product/:id");
//   };

//   const handleClick = () => {
//     if (isDisabled) {
//       toast.info("You have already added 3 packages.");
//     } else {
//       handleAddPackage();
//     }
//   };

//   const chartData = {
//     labels: sellerData.products.map((product) => product.display_name),
//     datasets: [
//       {
//         label: "Buyer Interaction Count",
//         data: sellerData.products.map(
//           (product) => product.buyer_interaction_count
//         ),
//         backgroundColor: [
//           "rgba(255, 111, 32, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(255, 206, 86, 0.6)",
//           "rgba(153, 102, 255, 0.6)",
//           "rgba(255, 159, 64, 0.6)",
//         ],
//         borderColor: [
//           "rgba(255, 111, 32, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(153, 102, 255, 1)",
//           "rgba(255, 159, 64, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         onHover: (event) => {
//           event.native.target.style.cursor = "pointer";
//         },
//         onLeave: (event) => {
//           event.native.target.style.cursor = "default";
//         },
//       },
//     },
//   };

//   const handleProductClick = (product) => {
//     if (product.buyer_whatsapp_numbers.length > 0) {
//       const numbers = product.buyer_whatsapp_numbers.map(
//         (buyer) => buyer.whatsapp_number
//       );
//       setBuyerNumbers(numbers);
//     } else {
//       setBuyerNumbers(["There is no buyer on this package."]);
//     }
//   };

//   const resetBuyerNumbers = () => {
//     const numbers = sellerData.products.flatMap((product) =>
//       product.buyer_whatsapp_numbers.map((buyer) => buyer.whatsapp_number)
//     );
//     setBuyerNumbers(numbers);
//   };

//   const handleEdit = (id) => {
//     navigate(`/edit-product/${id}`);
//   };

//   return (
//     <section className="min-h-screen bg-gray-50">
//       <Navbar
//         companyName={companyName}
//         sellerEmail={sellerEmail}
//         loading={profileLoading}
//       />
//       <ToastContainer />
//       <div className="p-6 max-w-7xl mx-auto mt-10">
//         <h2 className="text-4xl font-medium text-gray-800 mb-4">
//           Welcome Back,{""}
//           <span className="font-bold uppercase ml-4 text-[#ff6f20]">
//             {sellerData.seller_name}
//           </span>
//         </h2>

//         <div className="grid lg:grid-cols-2 gap-8">
//           <div className="bg-white p-6 rounded-lg  h-[400px] shadow-lg">
//             <h3
//               className="text-lg font-medium text-gray-700 mb-2 cursor-pointer hover:text-[#ff6f20] transition-colors"
//               onClick={() => setIsNumbersModalOpen(true)}
//             >
//               Total Buyers
//             </h3>
//             <p className="text-3xl font-bold text-[#ff6f20]">{totalBuyers}</p>
//             <h4 className="text-lg font-medium text-gray-700 mt-4">
//               Buyers per Package List
//             </h4>
//             <ul className="mt-2 space-y-2">
//               {sellerData.products.length > 0 ? (
//                 sellerData.products.map((product) => (
//                   <li
//                     key={product.id}
//                     className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
//                     onClick={() => handleProductClick(product)}
//                   >
//                     <span className="font-medium">{product.display_name}</span>
//                     <span className="text-[#ff6f20] font-semibold">
//                       {product.buyer_whatsapp_numbers.length} Buyers
//                     </span>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-sm text-gray-500 italic">
//                   You have no products.
//                 </li>
//               )}
//             </ul>
//           </div>

//           <div className="bg-white p-6 rounded-lg h-[400px] shadow-lg">
//             <Pie data={chartData} options={chartOptions} />
//           </div>
//         </div>

//         {/* <div className="mt-8">
//           <h2
//             className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-[#ff6f20]"
//             onClick={() => setIsNumbersModalOpen(true)}
//           >
//             Aggregated Buyer Numbers
//           </h2>
//           <p className="text-sm text-gray-500 mt-2">
//             Click to view all {buyerNumbers.length} buyer numbers
//           </p>
//         </div> */}

//         <div className="calculator">
//           <CalculatorButtons />
//         </div>

// <<<<<<< HEAD
//         <div className="whatsapp-info">
//           <h2>Buyers per package list</h2>
//           <ul>
//             {sellerData.products.map((product) => (
//               <li key={product.id} className="whatsapp-item">
//                 <p>
//                   {product.display_name}:{" "}
//                   <span>{product.buyer_whatsapp_numbers.length} Buyers</span>
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="packages-cards">
//           {sellerData.products.map((product) => {
//             const displayImagePath =
//               product.images.find((img) => img.is_display_image)?.image ||
//               product.images[0]?.image;
//             const displayImage = displayImagePath
//               ? `${API_BASE_URL}${displayImagePath}`
//               : null;

//             return (
//               <>
//                 <h2>Packages List</h2>
//                 <ul>
//                   <li key={product.id} className="package-card">
//                     <div className="img">
//                       {displayImage ? (
//                         <img src={displayImage} alt={product.display_name} />
//                       ) : (
//                         <p>No Image Available</p>
//                       )}
//                     </div>
//                     <div className="package-card-text">
//                       <h3>{product.display_name}</h3>
//                       <p>Price: ${product.price}</p>
//                     </div>
//                   </li>
//                 </ul>
//               </>
//             );
//           })}
// =======
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold text-gray-800">Packages List</h2>
//           <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//             {sellerData.products.map((product) => {
//               const displayImagePath =
//                 product.images.find((img) => img.is_display_image)?.image ||
//                 product.images[0]?.image;

//               return (
//                 <li
//                   key={product.id}
//                   className="package-card relative bg-white shadow-lg rounded-lg p-4 mb-4"
//                 >
//                   <div
//                     className="absolute bottom-4 right-4 px-2 py-1 rounded-md text-white text-sm font-medium"
//                     style={{
//                       backgroundColor: product.approval_status?.approved
//                         ? "#149921"
//                         : "#F39C12",
//                     }}
//                   >
//                     {product.approval_status?.approved
//                       ? "Approved"
//                       : "Pending.."}
//                   </div>

//                   <div className="img mb-4">
//                     {displayImagePath ? (
//                       <img
//                         src={displayImagePath}
//                         alt={product.display_name}
//                         className="w-full h-40 object-cover rounded-md"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-center">
//                         No Image Available
//                       </p>
//                     )}
//                   </div>

//                   <div className="package-card-text mb-4">
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {product.display_name}
//                     </h3>
//                     <p className="text-gray-600">Price: ${product.price}</p>
//                   </div>

//                   <button
//                     onClick={(e) => {
//                       handleEdit(product.id);
//                     }}
//                     className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ff6f20] text-[#ff6f20] rounded-md hover:bg-[#ff6f20] hover:text-white transition duration-300"
//                   >
//                     <IonIcon icon={pencilOutline} />
//                     Edit
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
// >>>>>>> 366ab0e78369100c3baf76f08bd9c2d26dabf8a3

//           <button
//             onClick={handleClick}
//             className="mt-6 bg-[#ff6f20] text-white px-4 py-2 rounded-md shadow-lg hover:bg-orange-600 transition"
//           >
//             Add New Package
//           </button>
//         </div>
//       </div>

//       <BuyerNumbersModal
//         isOpen={isNumbersModalOpen}
//         onClose={() => setIsNumbersModalOpen(false)}
//         sellerData={sellerData}
//         buyerNumbers={buyerNumbers}
//       />

//       {showSubscriptionPopup && (
//         <SubscriptionPopup
//           onClose={() => setShowSubscriptionPopup(false)}
//           onSubscribe={handleSubscribe}
//         />
//       )}
//     </section>
//   );
// };

// export default SellerAnalytics;

import React, { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { pencilOutline } from "ionicons/icons";
import { X } from "lucide-react";
import API_BASE_URL from "../config";
import Navbar from "../Components/Navbar";
import SubscriptionPopup from "../Components/SubscriptionPopup";
import CalculatorButtons from "../Components/CalculatorButtons";
import { ProfileContext } from "../context/ProfileContext";
import Spinner from "../Components/Spinner";

Chart.register(ArcElement, Legend, Tooltip);

// Buyer Numbers Modal Component
const BuyerNumbersModal = ({ isOpen, onClose, sellerData, buyerNumbers }) => {
  const [selectedPackage, setSelectedPackage] = useState("all");

  if (!isOpen) return null;

  const getFilteredNumbers = () => {
    if (selectedPackage === "all") {
      return buyerNumbers;
    }

    const selectedProduct = sellerData.products.find(
      (product) => product.id === selectedPackage
    );

    return selectedProduct
      ? selectedProduct.buyer_whatsapp_numbers.map(
          (buyer) => buyer.whatsapp_number
        )
      : [];
  };

  const filteredNumbers = getFilteredNumbers();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Buyer Numbers
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4 border-b">
          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">All Packages</option>
            {sellerData.products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.display_name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredNumbers.length > 0 ? (
              filteredNumbers.map((number, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg flex items-center justify-between"
                >
                  <span className="font-medium text-gray-700">{number}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(number)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Copy
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                No numbers available for this package
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main SellerAnalytics Component
const SellerAnalytics = () => {
  const [sellerData, setSellerData] = useState(null);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [buyerNumbers, setBuyerNumbers] = useState([]);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [isNumbersModalOpen, setIsNumbersModalOpen] = useState(false);
  const navigate = useNavigate();

  const { profileData, loading: profileLoading } = useContext(ProfileContext);

  const isDisabled = sellerData?.products?.length >= 3;

  useEffect(() => {
    if (profileData && profileData.company && profileData.company.name) {
      setCompanyName(profileData.company.name);
      setSellerEmail(profileData.user?.email || "");
    } else {
      console.warn("Profile data or company information is unavailable.");
    }
  }, [profileData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${API_BASE_URL}/api/listings/analytics/seller_analytics/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSellerData(data);
        const buyersCount = data.products.reduce(
          (acc, product) => acc + product.buyer_interaction_count,
          0
        );
        setTotalBuyers(buyersCount);

        // Aggregate WhatsApp numbers
        const numbers = data.products.flatMap((product) =>
          product.buyer_whatsapp_numbers.map(
            (whatsapp) => whatsapp.whatsapp_number
          )
        );
        setBuyerNumbers(numbers);

        setIsSubscribed(data.is_subscribed || false);
      } catch (error) {
        console.error("Error fetching seller analytics:", error);
      }
    };

    fetchData();
  }, []);

  if (!sellerData) return <Spinner />;

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setShowSubscriptionPopup(false);
  };

  const handleAddPackage = () => {
    navigate("/add-product/:id");
  };

  const handleClick = () => {
    if (isDisabled) {
      toast.info("You have already added 3 packages.");
    } else {
      handleAddPackage();
    }
  };

  const chartData = {
    labels: sellerData.products.map((product) => product.display_name),
    datasets: [
      {
        label: "Buyer Interaction Count",
        data: sellerData.products.map(
          (product) => product.buyer_interaction_count
        ),
        backgroundColor: [
          "rgba(255, 111, 32, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 111, 32, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        onHover: (event) => {
          event.native.target.style.cursor = "pointer";
        },
        onLeave: (event) => {
          event.native.target.style.cursor = "default";
        },
      },
    },
  };

  const handleProductClick = (product) => {
    if (product.buyer_whatsapp_numbers.length > 0) {
      const numbers = product.buyer_whatsapp_numbers.map(
        (buyer) => buyer.whatsapp_number
      );
      setBuyerNumbers(numbers);
    } else {
      setBuyerNumbers(["There is no buyer on this package."]);
    }
  };

  const resetBuyerNumbers = () => {
    const numbers = sellerData.products.flatMap((product) =>
      product.buyer_whatsapp_numbers.map((buyer) => buyer.whatsapp_number)
    );
    setBuyerNumbers(numbers);
  };

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <Navbar
        companyName={companyName}
        sellerEmail={sellerEmail}
        loading={profileLoading}
      />
      <ToastContainer />
      <div className="p-6 max-w-7xl mx-auto mt-10">
        <h2 className="text-4xl font-medium text-gray-800 mb-4">
          Welcome Back,{""}
          <span className="font-bold uppercase ml-4 text-[#ff6f20]">
            {sellerData.seller_name}
          </span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg  h-[400px] shadow-lg">
            <h3
              className="text-lg font-medium text-gray-700 mb-2 cursor-pointer hover:text-[#ff6f20] transition-colors"
              onClick={() => setIsNumbersModalOpen(true)}
            >
              Total Buyers
            </h3>
            <p className="text-3xl font-bold text-[#ff6f20]">{totalBuyers}</p>
            <h4 className="text-lg font-medium text-gray-700 mt-4">
              Buyers per Package List
            </h4>
            <ul className="mt-2 space-y-2">
              {sellerData.products.length > 0 ? (
                sellerData.products.map((product) => (
                  <li
                    key={product.id}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                    onClick={() => handleProductClick(product)}
                  >
                    <span className="font-medium">{product.display_name}</span>
                    <span className="text-[#ff6f20] font-semibold">
                      {product.buyer_whatsapp_numbers.length} Buyers
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 italic">
                  You have no products.
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg h-[400px] shadow-lg">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* <div className="mt-8">
          <h2
            className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-[#ff6f20]"
            onClick={() => setIsNumbersModalOpen(true)}
          >
            Aggregated Buyer Numbers
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Click to view all {buyerNumbers.length} buyer numbers
          </p>
        </div> */}

        <div className="calculator">
          <CalculatorButtons />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">Packages List</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {sellerData.products.map((product) => {
              const displayImagePath =
                product.images.find((img) => img.is_display_image)?.image ||
                product.images[0]?.image;

              return (
                <li
                  key={product.id}
                  className="package-card relative bg-white shadow-lg rounded-lg p-4 mb-4"
                >
                  <div
                    className="absolute bottom-4 right-4 px-2 py-1 rounded-md text-white text-sm font-medium"
                    style={{
                      backgroundColor: product.approval_status?.approved
                        ? "#149921"
                        : "#F39C12",
                    }}
                  >
                    {product.approval_status?.approved
                      ? "Approved"
                      : "Pending.."}
                  </div>

                  <div className="img mb-4">
                    {displayImagePath ? (
                      <img
                        src={displayImagePath}
                        alt={product.display_name}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    ) : (
                      <p className="text-gray-500 text-center">
                        No Image Available
                      </p>
                    )}
                  </div>

                  <div className="package-card-text mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.display_name}
                    </h3>
                    <p className="text-gray-600">Price: ${product.price}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      handleEdit(product.id);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ff6f20] text-[#ff6f20] rounded-md hover:bg-[#ff6f20] hover:text-white transition duration-300"
                  >
                    <IonIcon icon={pencilOutline} />
                    Edit
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            onClick={handleClick}
            className="mt-6 bg-[#ff6f20] text-white px-4 py-2 rounded-md shadow-lg hover:bg-orange-600 transition"
          >
            Add New Package
          </button>
        </div>
      </div>

      <BuyerNumbersModal
        isOpen={isNumbersModalOpen}
        onClose={() => setIsNumbersModalOpen(false)}
        sellerData={sellerData}
        buyerNumbers={buyerNumbers}
      />

      {showSubscriptionPopup && (
        <SubscriptionPopup
          onClose={() => setShowSubscriptionPopup(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </section>
  );
};

export default SellerAnalytics;
