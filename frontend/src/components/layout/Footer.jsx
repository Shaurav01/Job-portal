import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    // 'For Job Seekers': [
    //   { name: 'Browse Jobs', path: '/jobs' },
    //   { name: 'Create Profile', path: '/register' },
    //   { name: 'Career Advice', path: '/career-advice' },
    //   { name: 'Salary Guide', path: '/salary-guide' },
    // ],
    // 'For Employers': [
    //   { name: 'Post a Job', path: '/post-job' },
    //   { name: 'Browse Candidates', path: '/candidates' },
    //   { name: 'Pricing', path: '/pricing' },
    //   { name: 'Recruitment Tools', path: '/tools' },
    // ],
    'Company': [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
    'Support': [
      { name: 'Help Center', path: '/help' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Contact Support', path: '/support' },
      { name: 'Community', path: '/community' },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-br from-violet-900 via-fuchsia-800 to-purple-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-600/30 via-violet-800/40 to-purple-900"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="group">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-cyan-400 to-pink-500 p-2 rounded-lg">
                    <BriefcaseIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  TalentGrid
                </span>
              </div>
            </div>
            
            <p className="text-slate-300 leading-relaxed max-w-md text-lg">
              Connect talented professionals with amazing opportunities. 
              <span className="block mt-2 text-slate-400">
                Find your dream job or hire the perfect candidate.
              </span>
            </p>
            
            <div className="flex space-x-5">
              {[
                {
                  name: 'Facebook',
                  path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                  hoverColor: 'hover:text-blue-400'
                },
                {
                  name: 'Twitter',
                  path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
                  hoverColor: 'hover:text-emerald-400'
                },
                {
                  name: 'LinkedIn',
                  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                  hoverColor: 'hover:text-orange-400'
                }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`group relative p-3 rounded-full bg-slate-800/60 text-slate-300 ${social.hoverColor} transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-violet-600/20 backdrop-blur-sm border border-pink-500/30 hover:border-pink-400/60 hover:shadow-lg hover:shadow-pink-500/25`}
                  aria-label={social.name}
                >
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-6">
              <h3 className="relative text-sm font-bold text-white tracking-wider uppercase mb-6 pb-2">
                {category}
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group relative text-slate-200 hover:text-white transition-all duration-300 text-sm inline-block hover:scale-105"
                    >
                      <span className="relative z-10">{link.name}</span>
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 via-pink-500 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-gradient-to-r from-transparent via-pink-500/50 to-transparent">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-800/40 to-transparent rounded-lg"></div>
            <div className="relative flex flex-col md:flex-row justify-between items-center py-6 px-6 rounded-lg backdrop-blur-sm">
              <p className="text-slate-200 text-sm flex items-center space-x-2">
                <span>© {currentYear} TalentGrid. All rights reserved.</span>
                <span className="hidden md:inline-block w-1 h-1 bg-pink-400 rounded-full"></span>
                <span className="hidden md:inline text-xs text-pink-300">Made with ❤️ for job seekers</span>
              </p>
              <div className="mt-4 md:mt-0 flex space-x-8">
                {[
                  { name: 'Privacy Policy', path: '/privacy' },
                  { name: 'Terms of Service', path: '/terms' },
                  { name: 'Cookie Policy', path: '/cookies' }
                ].map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    className="group text-slate-200 hover:text-white text-sm transition-all duration-300 relative hover:scale-105"
                  >
                    {item.name}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-cyan-400 via-pink-500 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300"></div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent"></div>
    </footer>
  );
};

export default Footer;