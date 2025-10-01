import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 100,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: "",
      highlights: "",
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!authUser?.cognitoInfo?.userId) {
      throw new Error("User not found");
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "photoUrls") {
        const files = value as File[];
        files.forEach((file: File) => {
          formData.append("photos", file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    formData.append("managerCognitoId", authUser.cognitoInfo.userId);
    await createProperty(formData);
  };

  return <div>NewProperty</div>;
};

export default NewProperty;
