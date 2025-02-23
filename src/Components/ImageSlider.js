import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";

const ImageSlider = ({ packageData }) => {
  const images = packageData.images;

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
    <div className="relative group w-[600px] mx-auto">
      {images && images.length > 0 && (
        <div className="relative overflow-hidden rounded-lg h-[600px]">
          {/* Display the current image */}
          <img
            src={images[currentIndex].image}
            alt={`${packageData.display_name}-${currentIndex}`}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
          />

          {/* Gradient overlay for navigation buttons */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          {/* Conditional navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 
                  bg-white/20 hover:bg-white/40 rounded-full p-2 
                  transition-all duration-300 opacity-0 
                  group-hover:opacity-100 backdrop-blur-sm"
                onClick={handlePrev}
              >
                <IonIcon
                  icon={chevronBackOutline}
                  className="text-white text-2xl"
                />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 
                  bg-white/20 hover:bg-white/40 rounded-full p-2 
                  transition-all duration-300 opacity-0 
                  group-hover:opacity-100 backdrop-blur-sm"
                onClick={handleNext}
              >
                <IonIcon
                  icon={chevronForwardOutline}
                  className="text-white text-2xl"
                />
              </button>
            </>
          )}

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 
                    ${
                      index === currentIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                ></button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
