import React from "react";

const AccordionShimmerCard = () => {
  return (
    <div className="flex flex-row justify-between border rounded-md w-full p-3 animate-pulse">
      <div className="space-y-2 w-full">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-4 bg-gray-300 rounded w-3/4"></div>
        ))}
      </div>
      <div className="flex space-x-2">
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default AccordionShimmerCard;
