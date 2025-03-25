import React from "react";

const DashboardShimmer = () => {
  return (
    <div className=" animate-pulse grid grid-cols-2 gap-3">
      {[
        ...Array(6).map((_, index) => (
          <div className="flex flex-col gap-3" key={index}>
            <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
          </div>
        )),
      ]}
    </div>
  );
};

export default DashboardShimmer;
