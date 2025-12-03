import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import znlogo from '../assets/znlogo.png'

const ADMIN_EMAIL = 'admin@zenyourlife.in'
const ADMIN_PASSWORD = 'admin12345'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      // Store auth state in localStorage
      localStorage.setItem('isAdminLoggedIn', 'true')
      localStorage.setItem('adminEmail', formData.email)
      // Navigate to dashboard
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4">
      {/* Logo Section */}
      <div className="text-center mb-8 mt-10">
        <div className="flex justify-center mb-2">
          <img src={znlogo} alt="ZenYourLife" className="w-12 h-12" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">ZenYourLife</h1>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 -mt-5">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-sm text-gray-500">
            Enter your credentials to access the booking<br />system.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Email/Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your username or email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
          >
            Log In
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-5">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition">
            Forgot Password?
          </a>
        </div>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-400 mt-8">
        © 2024 ZenYourLife Admin
      </p>
    </div>
  )
}

export default Login
