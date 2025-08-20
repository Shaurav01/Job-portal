import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { getPasswordStrength } from "../../utils/helpers";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await register(formData);
      if (result.success) {
        if (formData.role === "employer") {
          navigate("/onboarding/employer", { replace: true });
        } else {
          navigate("/onboarding/seeker", { replace: true });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="backdrop-blur-md bg-white/20 rounded-2xl shadow-xl p-8 border border-white/30">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-200">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-yellow-300 hover:text-yellow-200"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100/80 border border-red-300 rounded-md p-3 text-red-800 text-sm">
                {error}
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["jobseeker", "employer"].map((role) => (
                  <label
                    key={role}
                    className={`cursor-pointer rounded-xl p-4 text-center font-medium border transition-all ${
                      formData.role === role
                        ? "bg-yellow-400 text-black shadow-lg border-yellow-500"
                        : "bg-white/20 text-white border-white/40 hover:bg-white/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {role === "jobseeker" ? "Job Seeker" : "Employer"}
                  </label>
                ))}
              </div>
            </div>

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              {["firstName", "lastName"].map((field, i) => (
                <div key={field}>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={i === 0 ? "First Name" : "Last Name"}
                    className={`w-full rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-yellow-400 outline-none ${
                      errors[field] ? "border border-red-400" : ""
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-sm text-red-300 mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-yellow-400 outline-none ${
                  errors.email ? "border border-red-400" : ""
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-300 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-yellow-400 outline-none ${
                  errors.phone ? "border border-red-400" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-300 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-lg px-4 py-3 pr-10 bg-white/80 focus:ring-2 focus:ring-yellow-400 outline-none ${
                  errors.password ? "border border-red-400" : ""
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {formData.password && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-300/40 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength.color === "error"
                          ? "bg-red-500"
                          : passwordStrength.color === "warning"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      passwordStrength.color === "error"
                        ? "text-red-300"
                        : passwordStrength.color === "warning"
                        ? "text-yellow-300"
                        : "text-green-300"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-red-300 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-lg px-4 py-3 pr-10 bg-white/80 focus:ring-2 focus:ring-yellow-400 outline-none ${
                  errors.confirmPassword ? "border border-red-400" : ""
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-sm text-red-300 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-yellow-400 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-white">
                I agree to the{" "}
                <Link to="/terms" className="text-yellow-300 hover:underline">
                  Terms
                </Link>{" "}
                &{" "}
                <Link to="/privacy" className="text-yellow-300 hover:underline">
                  Privacy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl shadow-lg transition disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
