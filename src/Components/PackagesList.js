import { useNavigate, useParams } from "react-router-dom";
import "../CSS/PackagesList.css";

export default function PackagesList({ packages, lastPackageRef }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    // Navigate to the product detail page with the specific package ID
    navigate(`/product-detail/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length > 0 ? (
          packages
            .filter((pkg) => pkg)
            .map((pkg, index) => (
              <div
                key={pkg.id}
                ref={index === packages.length - 1 ? lastPackageRef : null}
                onClick={() => handleCardClick(pkg.id)}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="aspect-square overflow-hidden">
                  {pkg.images && pkg.images.length > 0 ? (
                    <img
                      src={
                        pkg.images.find((image) => image.is_display_image)
                          ?.image || pkg.images[0].image
                      }
                      alt={pkg.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/path/to/placeholder-image.jpg"
                      alt="No image available"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {pkg.display_name}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">
                      Price:{" "}
                      <span className="text-orange-500 font-semibold">
                        {pkg.price}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Company:{" "}
                      <span className="text-orange-500 font-semibold">
                        {pkg.company.name}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      City:{" "}
                      <span className="text-orange-500 font-semibold">
                        {pkg.company.city}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-base">
            No packages found.
          </div>
        )}
      </div>
    </div>
  );
}
