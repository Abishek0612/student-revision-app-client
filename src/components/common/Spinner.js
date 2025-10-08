import React from "react";

function Spinner() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="border-t-4 border-blue-500 border-solid rounded-full animate-spin h-16 w-16"></div>
    </div>
  );
}

export default Spinner;
