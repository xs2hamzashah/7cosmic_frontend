import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";

const ImageSlider = ({ packageData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = packageData.images;

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
          {/* Updated image with conditional className */}
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
