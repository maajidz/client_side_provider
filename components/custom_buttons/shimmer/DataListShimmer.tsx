import React from "react";

const DataListShimmer = () => {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
      <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
      <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
      <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
      <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
      <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
    </div>
  );
};

export default DataListShimmer;
