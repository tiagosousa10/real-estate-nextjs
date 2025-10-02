import React, { useState } from "react";

const ApplicationCard = ({
  application,
  userType,
  children,
}: ApplicationCardProps) => {
  const [imgSrc, setImgSrc] = useState(
    application.property.photoUrls?.[0] || "/placeholder.jpg"
  );

  const statusColor =
    application.status === "Approved"
      ? "bg-green-500"
      : application.status === "Denied"
      ? "bg-red-500"
      : "bg-yellow-500";

  const contactPerson =
    userType === "manager" ? application.tenant : application.manager;

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white mb-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-6 md:px-4 py-6 gap-6 lg:gap-4"></div>
    </div>
  );
};

export default ApplicationCard;
