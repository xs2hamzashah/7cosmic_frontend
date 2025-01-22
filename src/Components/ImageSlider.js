import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";

const ImageSlider = ({ packageData }) => {
  const images = packageData.images;

  // Find the index of the image with `is_display_image` set to true
  const defaultIndex = images.findIndex((image) => image.is_display_image) || 0;

  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="detail-box">
      {images && images.length > 0 && (
        <div className="slider-container">
          {/* Display the current image */}
          <img
            src={images[currentIndex].image}
            alt={`${packageData.display_name}-${currentIndex}`}
            className="slider-image slider-image-active"
          />

          {/* Conditional navigation buttons */}
          {images.length > 1 && (
            <>
              <div
                className="slider-button slider-button-prev"
                onClick={handlePrev}
              >
                <IonIcon icon={chevronBackOutline} />
              </div>
              <div
                className="slider-button slider-button-next"
                onClick={handleNext}
              >
                <IonIcon icon={chevronForwardOutline} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
