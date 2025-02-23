import { useNavigate, useParams } from "react-router-dom";
import "../CSS/PackagesList.css";
import {
  ArrowUpRight,
  Battery,
  Building2,
  MapPin,
  Shield,
  Star,
  Sun,
} from "lucide-react";
import ProductCard from "./card/ProductCard";

export default function PackagesList({ packages, lastPackageRef }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    // Navigate to the product detail page with the specific package ID
    navigate(`/product-detail/${id}`);
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)}Lac`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}k`;
    }
    return price;
  };

  const TempProductCard = ({ pkg }) => {
    return (
      <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100">
        {/* Image Container with Padding */}
        <div className="p-4 overflow-hidden">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
            {pkg.images?.length > 0 ? (
              <div className="absolute inset-0">
                <img
                  src={
                    pkg.images.find((image) => image.is_display_image)?.image ||
                    pkg.images[0].image
                  }
                  alt={pkg.display_name}
                  className="w-full h-full object-cover rounded-xl transform-gpu transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center">
                <Sun className="w-12 h-12 text-gray-300" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title & Specs */}
          <div>
            <h3 className="text-base font-medium text-gray-900 line-clamp-2">
              {pkg.display_name}
            </h3>
          </div>

          {/* Redesigned Company Info */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-[#2ecc71]/5 to-transparent">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-[#2ecc71] flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform">
                <span className="text-sm font-bold text-white">
                  {pkg.company.name[0]}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#2ecc71]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                {pkg.company.name}
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ecc71]" />
              </p>
              <p className="text-xs text-gray-500">{pkg.company.city}</p>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="text-sm text-gray-500">Price</span>
              <p className="text-base font-semibold text-[#2ecc71]">
                PKR {formatPrice(pkg.price)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/product-detail/${pkg.id}`)}
                className="px-3 py-1.5 text-xs font-medium bg-[#2ecc71] text-white rounded-lg hover:bg-[#27ae60] transition-colors"
              >
                Details
              </button>
              <button className="px-3 py-1.5 text-xs font-medium bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors flex items-center gap-1">
                <svg fill="none" viewBox="0 0 24 24">
                  <g fill="#0F0F0F">
                    <path d="M6.014 8.006c.114-.904 1.289-2.132 2.22-1.996V6.01c.907.172 1.625 1.734 2.03 2.436.286.509.1 1.025-.167 1.243-.361.29-.926.692-.808 1.095C9.5 11.5 12 14 13.23 14.711c.466.269.804-.44 1.092-.804.21-.28.726-.447 1.234-.171.759.442 1.474.956 2.135 1.534.33.276.408.684.179 1.115-.403.76-1.569 1.76-2.415 1.557C13.976 17.587 8 15.27 6.08 8.558c-.108-.318-.08-.438-.066-.552Z" />
                    <path
                      fillRule="evenodd"
                      d="M12 23c-1.224 0-1.9-.131-3-.5l-2.106 1.053A2 2 0 0 1 4 21.763V19.5c-2.153-2.008-3-4.323-3-7.5C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11Zm-6-4.37-.636-.593C3.691 16.477 3 14.733 3 12a9 9 0 1 1 9 9c-.986 0-1.448-.089-2.364-.396l-.788-.264L6 21.764V18.63Z"
                      clipRule="evenodd"
                    />
                  </g>
                </svg>
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {packages.length > 0 ? (
        packages
          .filter((pkg) => pkg)
          .map((item, index) => <ProductCard item={item} />)
      ) : (
        <div className="col-span-full min-h-[400px] flex flex-col items-center justify-center">
          <Sun className="w-16 h-16 text-[#2ecc71] mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Packages Available
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            We're currently updating our inventory. Check back soon for new
            solar packages.
          </p>
        </div>
      )}
    </div>
  );
}
