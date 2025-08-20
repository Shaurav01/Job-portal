import React from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, BriefcaseIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { truncateText, formatSalary } from "../../utils/helpers";

const JobCard = ({ job, footer, onSave }) => {
  if (!job) return null;

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Top section: Title + Save */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            <Link
              to={`/jobs/${job._id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {job.title}
            </Link>
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            {job.companyName || job.company?.name || "Company"}
          </p>
        </div>

        {onSave && (
          <button
            onClick={() => onSave(job._id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all"
          >
            <BookmarkIcon className="h-4 w-4" />
            Save
          </button>
        )}
      </div>

      {/* Job details */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
          {job.location || "Remote"}
        </div>
        <div className="flex items-center">
          <BriefcaseIcon className="h-4 w-4 mr-1 text-gray-400" />
          {job.type || "Full-time"}
        </div>
      </div>

      {/* Description */}
      {job.description && (
        <p className="mt-4 text-gray-700 text-sm leading-relaxed">
          {truncateText(job.description, 140)}
        </p>
      )}

      {/* Salary + View button */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-blue-600 font-semibold text-sm sm:text-base">
          {formatSalary(job.salary)}
        </div>
        <Link
          to={`/jobs/${job._id}`}
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all"
        >
          View Details →
        </Link>
      </div>

      {/* Footer slot (optional) */}
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default JobCard;
