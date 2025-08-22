import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { formatSalary, truncateText } from '../utils/helpers';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const { featuredJobs, loading } = useJobs();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm || location) {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (location) params.append('location', location);
      navigate(`/jobs?${params.toString()}`);
    }
  };

  const stats = [
    { label: 'Active Jobs', value: '2,500+', icon: BriefcaseIcon },
    { label: 'Companies', value: '500+', icon: BuildingOfficeIcon },
    { label: 'Job Seekers', value: '10,000+', icon: UserGroupIcon },
    { label: 'Success Rate', value: '95%', icon: ChartBarIcon },
  ];

  const features = [
    {
      title: 'Smart Job Matching',
      description: 'AI-powered recommendations based on your skills and preferences.',
      icon: SparklesIcon,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Easy Applications',
      description: 'One-click apply with resume upload & tracking system.',
      icon: RocketLaunchIcon,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Company Insights',
      description: 'Get detailed company info & authentic employee reviews.',
      icon: ChartBarIcon,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Career Growth',
      description: 'Access tools and resources to grow your career faster.',
      icon: CheckCircleIcon,
      color: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djIwSDI0VjM0aDEyem0wLTM2djIwSDI0VjJoMTJ6TTM2IDM0djIwSDI0VjM0aDEyem0wLTM2djIwSDI0VjJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6 animate-fade-in">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">Dream Job</span> Today
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto animate-fade-in-up">
              Connect with top companies and opportunities tailored just for you.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-2xl animate-fade-in-up delay-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500 z-10" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-lg rounded-xl border-0 focus:ring-2 focus:ring-yellow-400 shadow-md"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500 z-10" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-lg rounded-xl border-0 focus:ring-2 focus:ring-yellow-400 shadow-md"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Search Jobs
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-green-300 hover:to-emerald-400 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 text-white font-semibold rounded-xl border-2 border-white/80 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/jobs"
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Browse All Jobs
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute -top-10 left-0 right-0 flex justify-center">
          <div className="w-72 h-72 bg-purple-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Opportunities</span></h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-picked opportunities from top companies.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredJobs.slice(0, 6).map((job, index) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          <Link to={`/jobs/${job._id}`} className="hover:text-primary-600">
                            {job.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600">{job.companyName}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-2" /> {job.location}
                      </p>
                      <p className="flex items-center text-sm text-gray-500">
                        <BriefcaseIcon className="h-4 w-4 mr-2" /> {job.type}
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{truncateText(job.description, 120)}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-semibold">{formatSalary(job.salary)}</span>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center group-hover:underline"
                      >
                        View Details <span className="ml-1">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/jobs"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:-translate-y-1"
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">TalentGrid</span>?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for your career journey in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center border border-gray-100 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-md group-hover:shadow-lg transition-shadow`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-800 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djIwSDI0VjM0aDEyem0wLTM2djIwSDI0VjJoMTJ6TTM2IDM0djIwSDI0VjM0aDEyem0wLTM2djIwSDI0VjJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who found success with TalentGrid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/jobs"
                  className="px-8 py-3 border-2 border-white/80 text-white text-lg font-semibold rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white hover:text-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Browse Jobs
                </Link>
              </>
            ) : (
              <Link
                to="/jobs"
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Opportunities
              </Link>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default Home;