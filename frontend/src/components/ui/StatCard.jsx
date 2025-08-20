import React from "react";

const StatCard = ({ label, value, sublabel, icon: Icon, color = "primary" }) => {
  const colorMap = {
    primary: "text-blue-600 bg-blue-50",
    success: "text-green-600 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50",
    error: "text-red-600 bg-red-50",
    gray: "text-gray-600 bg-gray-100",
  };

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left: Labels & Values */}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-3xl sm:text-4xl font-bold text-gray-900 animate-fadeIn">
            {value}
          </p>
          {sublabel && (
            <p className="mt-1 text-sm text-gray-500">{sublabel}</p>
          )}
        </div>

        {/* Right: Icon */}
        {Icon && (
          <div
            className={`p-3 rounded-full ${colorMap[color] || colorMap.primary} shadow-sm`}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
