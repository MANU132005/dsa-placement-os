'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { resetPasswordAction } from '@/app/actions/authActions'
import { Mail, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const router = useRouter()

  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !confirmPassword) return
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const res = await resetPasswordAction({ email, password, confirmPassword })
      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        setError(res.error || 'Password reset failed.')
      }
    } catch (err) {
      setError('Connection failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 transition-colors duration-200">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10 pointer-events-none" />

      {/* Reset Card */}
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
            <span className="font-bold text-lg text-foreground tracking-tight">
              Placement OS
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-2">
            Reset your password
          </h2>
          <p className="text-xs text-muted-foreground">
            Provide your account email and specify a new secure password
          </p>
        </div>

        {/* Error/Success messages */}
        {error && (
          <div className="text-xs font-semibold text-red-500 bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-center animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="text-xs font-semibold text-emerald-600 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-center animate-fade-in">
            Password reset successful! Redirecting to login...
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-muted-foreground uppercase tracking-wider">Account Email</label>
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

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/60" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-lg pl-9 pr-4 py-2.5 text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/60" />
              <input
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-lg pl-9 pr-4 py-2.5 text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow hover:opacity-95 disabled:opacity-50 transition-all mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs mt-1">
          <Link href="/login" className="font-bold text-primary hover:underline">
            Back to Login
          </Link>
        </div>

      </motion.div>
    </div>
  )
}
