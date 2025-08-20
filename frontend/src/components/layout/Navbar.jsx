import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BriefcaseIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isJobSeeker, isEmployer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Jobs', path: '/jobs', icon: BriefcaseIcon },
  ];

  const authenticatedLinks = isJobSeeker
    ? [
        { name: 'Profile', path: '/profile', icon: UserCircleIcon },
        { name: 'Dashboard', path: '/dashboard', icon: UserCircleIcon },
        { name: 'My Applications', path: '/applications', icon: BriefcaseIcon },
        { name: 'Saved Jobs', path: '/saved-jobs', icon: BriefcaseIcon },
      ]
    : isEmployer
    ? [
        { name: 'Profile', path: '/profile', icon: UserCircleIcon },
        { name: 'Dashboard', path: '/employer-dashboard', icon: UserCircleIcon },
        { name: 'Post Job', path: '/post-job', icon: BriefcaseIcon },
        { name: 'My Jobs', path: '/my-jobs', icon: BriefcaseIcon },
      ]
    : [];

  return (
    <nav className="relative bg-gradient-to-r from-violet-900 via-fuchsia-800 to-purple-900 shadow-2xl border-b border-pink-500/30 backdrop-blur-lg">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-pink-600/10 to-orange-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-cyan-400 to-pink-500 p-2 rounded-lg transform group-hover:scale-105 transition-transform">
                  <BriefcaseIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                Joby
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-white bg-gradient-to-r from-pink-600/30 to-violet-600/30 shadow-lg backdrop-blur-sm border border-pink-400/50'
                      : 'text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-violet-600/20 hover:backdrop-blur-sm hover:border hover:border-pink-400/30'
                  }`}
                >
                  <link.icon className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  {link.name}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full transition-all duration-300 ${
                    isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Search, Auth */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <Link
              to="/jobs"
              className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-cyan-600/20 rounded-lg transition-all duration-300 group backdrop-blur-sm border border-transparent hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              Search Jobs
            </Link>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2 focus:ring-offset-violet-900 transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-violet-600/20 backdrop-blur-sm border border-transparent hover:border-pink-400/30 group"
                >
                  <div className="flex items-center space-x-2">
                    {user?.avatar ? (
                      <div className="relative">
                        <img
                          className="h-8 w-8 rounded-full border-2 border-pink-400/50 group-hover:border-pink-400 transition-colors"
                          src={user.avatar}
                          alt={user.firstName}
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <UserCircleIcon className="h-8 w-8 text-slate-300 group-hover:text-white transition-colors" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    )}
                    <span className="hidden md:block text-slate-200 group-hover:text-white font-medium transition-colors">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <ChevronDownIcon className={`h-4 w-4 text-slate-300 group-hover:text-white transition-all duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl py-2 z-50 border border-pink-500/30 backdrop-blur-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-600/5 to-violet-600/5 rounded-xl"></div>
                    <div className="relative">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-pink-500/20">
                        <p className="text-sm font-medium text-white">Signed in as</p>
                        <p className="text-sm text-slate-300 truncate">{user?.firstName} {user?.lastName}</p>
                      </div>
                      
                      {authenticatedLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="group flex items-center px-4 py-3 text-sm text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-violet-600/20 transition-all duration-300"
                        >
                          <link.icon className="h-4 w-4 mr-3 text-slate-400 group-hover:text-pink-400 transition-colors" />
                          {link.name}
                        </Link>
                      ))}
                      <div className="border-t border-pink-500/20 mt-2">
                        <button
                          onClick={handleLogout}
                          className="group flex w-full items-center px-4 py-3 text-sm text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 transition-all duration-300"
                        >
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-200 hover:text-white px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-slate-600/30 backdrop-blur-sm border border-transparent hover:border-slate-500/30"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="relative px-6 py-2 text-sm font-medium text-white rounded-lg overflow-hidden group transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">Sign up</span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-violet-600/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 backdrop-blur-sm border border-transparent hover:border-pink-400/30 transition-all duration-300"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6 transform rotate-0 transition-transform duration-300" />
                ) : (
                  <Bars3Icon className="h-6 w-6 transform rotate-0 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-t border-pink-500/30 backdrop-blur-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/5 to-violet-600/5"></div>
            <div className="relative space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`group block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-pink-600/30 to-violet-600/30 text-white border border-pink-400/50 shadow-lg'
                      : 'text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-violet-600/20 hover:border hover:border-pink-400/30'
                  }`}
                >
                  <div className="flex items-center">
                    <link.icon className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                    {link.name}
                  </div>
                </Link>
              ))}
              
              {isAuthenticated && authenticatedLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="group block px-3 py-3 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-violet-600/20 transition-all duration-300 hover:border hover:border-pink-400/30"
                >
                  <div className="flex items-center">
                    <link.icon className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                    {link.name}
                  </div>
                </Link>
              ))}
              
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="group block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 transition-all duration-300 hover:border hover:border-red-400/30"
                >
                  <div className="flex items-center">
                    <span>Sign out</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;