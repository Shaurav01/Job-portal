import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import JobCard from "../components/ui/JobCard";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import { useDebounce } from "../hooks/useDebounce";

const Jobs = () => {
  const { jobs, loading, error, pagination, loadJobs, categories } = useJobs();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get("search") || "");
  const [locationFilter, setLocationFilter] = useState(params.get("location") || "");
  const [type, setType] = useState(params.get("type") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [salaryMin, setSalaryMin] = useState(params.get("salaryMin") || "");
  const [salaryMax, setSalaryMax] = useState(params.get("salaryMax") || "");
  const [sort, setSort] = useState(params.get("sort") || "newest");

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const currentParams = new URLSearchParams();
    if (debouncedSearch) currentParams.set("search", debouncedSearch);
    if (locationFilter) currentParams.set("location", locationFilter);
    if (type) currentParams.set("type", type);
    if (category) currentParams.set("category", category);
    if (salaryMin) currentParams.set("salaryMin", salaryMin);
    if (salaryMax) currentParams.set("salaryMax", salaryMax);
    if (sort) currentParams.set("sort", sort);

    navigate({ pathname: "/jobs", search: currentParams.toString() }, { replace: true });

    loadJobs({
      search: debouncedSearch,
      location: locationFilter,
      type,
      category,
      salaryMin,
      salaryMax,
      sort,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, locationFilter, type, category, salaryMin, salaryMax, sort]);

  const handlePageChange = (page) => {
    loadJobs({
      search: debouncedSearch,
      location: locationFilter,
      type,
      category,
      salaryMin,
      salaryMax,
      sort,
      page,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
        🔍 Find Your Dream Job
      </h1>

      {/* Filters */}
      <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search by title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <input
            type="text"
            placeholder="Location (e.g., Remote, New York)"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="">All Categories</option>
            {(categories || []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Salary"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <input
            type="number"
            placeholder="Max Salary"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Filters bottom row */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{pagination.total}</span> results found
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSearch("");
                setLocationFilter("");
                setType("");
                setCategory("");
                setSalaryMin("");
                setSalaryMax("");
                setSort("newest");
              }}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
            >
              Clear Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="salary-desc">💰 Salary: High to Low</option>
              <option value="salary-asc">💰 Salary: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      {loading ? (
        <LoadingSpinner className="py-12" />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 shadow-sm">
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Try adjusting your filters or search keywords to find more jobs."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              current={pagination.current}
              pages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Jobs;
