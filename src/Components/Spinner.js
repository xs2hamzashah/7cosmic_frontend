import React from "react";

export default function Spinner() {
  return <div className="container mx-auto px-4 py-8">
  <div className="flex items-center justify-center mb-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6F20]"></div>
  </div>
</div>;
}
