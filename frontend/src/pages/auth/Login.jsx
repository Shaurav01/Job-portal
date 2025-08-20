import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(formData);
      if (result.success) {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute top-40 -right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">
          Welcome Back 👋
        </h2>
        <p className="mt-2 text-sm text-white/80">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-yellow-300 hover:text-yellow-200 transition"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 sm:p-8 border border-white/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3 animate-pulse">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm pr-10 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-pink-500 border-gray-300 rounded focus:ring-pink-400"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-pink-600 hover:text-pink-500"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 text-base font-semibold rounded-lg shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-2 text-sm text-gray-500">Or continue with</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg shadow-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="h-5 w-5 bg-white rounded-full"
              />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg shadow-md text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 transition"
            >
              <img
                src="https://www.svgrepo.com/show/349576/twitter.svg"
                alt="Twitter"
                className="h-5 w-5 bg-white rounded-full"
              />
              Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
