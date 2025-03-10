import React from "react";

const TableShimmer = () => {
  return (
    <div className="animate-in flex flex-col gap-3">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="flex flex-col gap-3 border p-4 rounded-md h-full">
        <div className="h-10 bg-gray-300 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
};

export default TableShimmer;
