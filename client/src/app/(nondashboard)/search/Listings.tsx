import {
  useAddFavoritePropertieMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useRemoveFavoritePropertieMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";
import React from "react";

const Listings = () => {
  const { data: authUser } = useGetAuthUserQuery();

  const [addFavorite] = useAddFavoritePropertieMutation();
  const [removeFavorite] = useRemoveFavoritePropertieMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser) return;

    const isFavorite = authUser.userInfo.favorites.some(
      (fav) => fav.id === propertyId
    );

    if (isFavorite) {
      await removeFavorite({
        cognitoId: authUser.cognitoInfo.userId,
        propertyId,
      });
    } else {
      await addFavorite({
        cognitoId: authUser.cognitoInfo.userId,
        propertyId,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="w-full">
      <h3 className="text-sm px-4 font-bold">
        {properties.length}{" "}
        <span className="text-gray-700 font-normal">
          Places in {filters.location}
        </span>
      </h3>
      <div className="flex">
        <div className="p-4 w-full">
          {properties?.map((property) =>
            viewMode === "grid" ? <>some card</> : <>another cards</>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
