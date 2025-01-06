import { useNavigate, useParams } from "react-router-dom";
import "../CSS/PackagesList.css";

export default function PackagesList({ packages }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    // Navigate to the product detail page with the specific package ID
    navigate(`/product-detail/${id}`);
  };

  return (
    <div className="packages-list">
      <div className="cards">
        {packages.length > 0 ? (
          packages
            .filter((pkg) => pkg) // Ensure no null packages
            .map((pkg) => (
              <div
                className="card"
                onClick={() => handleCardClick(pkg.id)}
                key={pkg.id}
              >
                {/* Find the image with is_display_image: true */}
                {pkg.images && pkg.images.length > 0 ? (
                  <img
                    src={
                      pkg.images.find((image) => image.is_display_image)
                        ?.image || pkg.images[0].image // Fallback to the first image if none are marked as display
                    }
                    alt={pkg.display_name}
                  />
                ) : (
                  // Fallback placeholder image if no images are found
                  <img
                    src="/path/to/placeholder-image.jpg" // Add your placeholder image path here
                    alt="No image available"
                  />
                )}
                {/* Display other package details here */}
                <div className="card-text">
                  <h3>{pkg.display_name}</h3>
                  <p>
                    Price: <span>{pkg.price}</span>
                  </p>
                  <p>
                    Company name: <span>{pkg.company}</span>
                  </p>
                  <p>
                    City: <span>{pkg.city}</span>
                  </p>
                </div>
              </div>
            ))
        ) : (
          <p>No packages found.</p>
        )}
      </div>
    </div>
  );
}
