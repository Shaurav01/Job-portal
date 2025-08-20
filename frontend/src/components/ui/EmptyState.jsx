import React from "react";
import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react"; // nice empty state icon

const EmptyState = ({
  title = "Nothing here yet",
  description = "There is no data to display right now.",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      {/* Icon */}
      <div className="p-4 bg-blue-50 rounded-full shadow-sm">
        <FolderOpen className="w-12 h-12 text-blue-500" />
      </div>

      {/* Title */}
      <h3 className="mt-6 text-2xl font-bold text-gray-900">{title}</h3>

      {/* Description */}
      <p className="mt-2 text-gray-600 max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      {/* Optional Action */}
      {action && (
        <div className="mt-6 flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
