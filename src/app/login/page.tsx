'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Globe, Mail, Lock, Loader2, Code2 } from 'lucide-react'

export default function LoginPage() {
  const { login, loginWithOAuth } = useAuth()
  
  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    if (isSignUp && !name) {
      setError('Please provide a name.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      await login(email, isSignUp ? name : email.split('@')[0])
    } catch (err) {
      setError('Invalid login details. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsSubmitting(true)
    setError('')
    try {
      await loginWithOAuth(provider)
    } catch (err) {
      setError('OAuth authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 transition-colors duration-200">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10 pointer-events-none" />

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-xl flex flex-col gap-6"
      >
        {/* Title */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="font-bold text-lg text-foreground tracking-tight flex items-center gap-1.5">
              Placement OS
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isSignUp ? 'Sign up to construct your preparation dashboard' : 'Sign in to access your placement workstation'}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-2.5 mt-1">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleOAuth('google')}
            className="flex items-center justify-center gap-2.5 w-full py-2.5 border border-border hover:bg-secondary text-xs font-semibold text-foreground rounded-lg shadow-sm transition-all animate-fade-in"
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleOAuth('github')}
            className="flex items-center justify-center gap-2.5 w-full py-2.5 border border-border hover:bg-secondary text-xs font-semibold text-foreground rounded-lg shadow-sm transition-all"
          >
            <Code2 className="w-4 h-4 text-foreground" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-border" />
          <span className="flex-shrink mx-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            or
          </span>
          <div className="flex-grow border-t border-border" />
        </div>

        {/* Error message */}
        {error && (
          <div className="text-xs font-semibold text-red-500 bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          
          {/* Name for Sign Up */}
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary/30 border border-border rounded-lg pl-3 pr-4 py-2.5 text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-muted-foreground uppercase tracking-wider">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/60" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-lg pl-9 pr-4 py-2.5 text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-muted-foreground uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/60" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-lg pl-9 pr-4 py-2.5 text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow hover:opacity-95 disabled:opacity-50 transition-all mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center text-xs mt-1">
          <span className="text-muted-foreground">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-bold text-primary hover:underline focus:outline-none"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

      </motion.div>
    </div>
  )
}
