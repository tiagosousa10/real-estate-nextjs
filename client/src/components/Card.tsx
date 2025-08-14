import { Heart } from "lucide-react";
import Image from "next/image";
import React from "react";

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton,
  propertyLink,
}: CardProps) => {
  const [imgSrc, setImgSrc] = React.useState(
    property.photoUrls?.[0] || "/placeholder.jpg"
  );
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full mb-5">
      <div className="relative">
        <div className="w-full h-48 relative">
          <Image
            src={imgSrc}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {property.isPetsAllowed && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Pets Allowed
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Parking Included
            </span>
          )}
        </div>
        {showFavoriteButton && (
          <button
            className="absolute bottom-4 right-4 bg-white hover:bg-white/90 rounded-full p-2 cursor-pointer"
            onClick={onFavoriteToggle}
          >
            <Heart
              className={`size-5 ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
