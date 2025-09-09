import { useGetPropertyQuery } from "@/state/api";
import { MapPin, Star } from "lucide-react";
import React from "react";

const PropertyOverview = ({ propertyId }: PropertyOverviewProps) => {
  const {
    data: property,
    isLoading,
    isError,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not found</>;
  }

  return (
    <div>
      <div className="mb-4">
        <div className="text-sm to-gray-500 mb-1">
          Indonesia / Bali /{" "}
          <span className="font-semibold text-gray-600">South Kuta</span>
        </div>
        <h1 className="text-3xl font-bold my-5">{property.name}</h1>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            {property.location?.city}, {property.location?.state},{" "}
            {property.location?.country}
          </span>
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {property.averageRating.toFixed(1)} ({property.numberOfReviews}{" "}
              Reviews)
            </span>
            <span className="text-green-600">Verified Listing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverview;
