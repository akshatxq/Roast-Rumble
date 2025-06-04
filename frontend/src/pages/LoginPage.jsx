"use client"

import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore.js"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { login, isLoggingIn } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors border border-purple-500/30">
                <MessageSquare className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Welcome Back, Warrior
              </h1>
              <p className="text-gray-400">Sign in to your warrior account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-300 mb-2">
              Roast Mail (Email ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="w-full px-4 py-3 pl-10 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="block text-sm font-medium text-gray-300 mb-2">
              Secret Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pl-10 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
            No clan yet?{" "}
              <Link
                to="/signup"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Create your warrior account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage