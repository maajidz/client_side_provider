import React from "react";

const DemographicsShimmer = () => {
  return (
    <div className="flex border-gray-100 border group p-6 py-4 flex-1 rounded-lg animate-pulse">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 w-10 bg-gray-200"></div>
        </div>
        <div className="flex flex-col gap-6">
          {[...Array(4)].map((_, index) => (
            <div className="flex gap-1 flex-col" key={index}>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemographicsShimmer;
