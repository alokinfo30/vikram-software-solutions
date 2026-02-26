// client/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { FaLock, FaEnvelope, FaSignInAlt, FaBuilding, FaTimes } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRememberMeChange = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    if (checked) {
      localStorage.setItem('rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address');
      return;
    }
    setForgotPasswordLoading(true);
    try {
      await API.post('/auth/forgot-password', { email: forgotPasswordEmail });
      toast.success('Password reset link sent to your email');
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/auth/login', formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        toast.success('Login successful!');

        // Redirect based on role
        switch (response.data.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'employee':
            navigate('/employee');
            break;
          case 'client':
            navigate('/client');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center via-indigo-800 bg-gradient-to-br from-blue-500 to-purple-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      {/* Animated circles */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="z-10 relative backdrop-blur-lg bg-white/70 border border-white/30 p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 border border-white/20">
            <FaBuilding className="text-4xl text-white" />
          </div>

          <div className="flex justify-center mb-2">
            <span className="inline-block bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 rounded-full shadow-lg">
              <FaLock className="text-white text-2xl sm:text-3xl" />
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Vikram Software</h1>
          <p className="text-blue-900 font-medium">Enterprise Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-blue-900">Welcome Back</h2>
            <p className="text-blue-900 text-sm mt-2">Sign in to access your dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="h-4 w-4 bg-white border border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 hover:text-blue-800 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-blue-500/50 focus:ring-offset-transparent transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base sm:text-lg font-semibold"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Test Credentials Hint */}
          <div className="mt-8 p-4 bg-white/60 border border-white/30 rounded-lg shadow-inner text-xs sm:text-sm">
            <p className="text-sm text-blue-900 font-semibold mb-3 flex items-center"> <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span> Test Credentials:</p>
            <div className="space-y-2 text-sm text-xs">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <p><span className="font-medium">Admin:</span> admin@vikram.com / admin123</p>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <p><span className="font-medium">Employee:</span> employee@vikram.com / employee123</p>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <p><span className="font-medium">Client:</span> client@vikram.com / client123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-blue-900">
          © {new Date().getFullYear()} Vikram Software Solutions. All rights reserved.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
