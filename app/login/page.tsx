'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@magiskitchen.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Persist auth in cookie (for SSR/middleware) and localStorage
    document.cookie = 'magis_auth=true; path=/; max-age=2592000; SameSite=Lax';
    localStorage.setItem('magis_auth', 'true');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 250);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 w-full min-h-screen">
        {/* Left Side: Visual & Culinary Branding (Unsplash Food Background) */}
        <div className="relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-surface-container-high hidden lg:flex">
          {/* Background Image with Atmospheric Lighting */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/50 to-on-surface/20"></div>

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md">
              <span className="material-symbols-outlined text-[22px]">restaurant</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-surface tracking-tight">Magi&apos;s Kitchen</span>
              <span className="text-xs text-surface/80 font-medium">Cloud Kitchen Management Suite</span>
            </div>
          </div>

          {/* Center/Bottom Quote */}
          <div className="relative z-10 text-surface flex flex-col gap-3 max-w-lg mb-8">
            <span className="text-xs uppercase tracking-wider font-semibold text-surface/80">
              Culinary Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface leading-tight">
              Crafted for perfection, managed with effortless grace.
            </h2>
            <p className="text-sm text-surface/85 leading-relaxed">
              Experience seamless kitchen orchestration, from live order pipeline to inventory control and dispatch harmony, all in one refined space.
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="relative z-10 flex items-center gap-3 text-surface/70 text-xs">
            <span>&copy; {new Date().getFullYear()} Magi&apos;s Kitchen</span>
            <span>&bull;</span>
            <span>Operational Suite v2.4</span>
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-surface-container-lowest flex-1">
          <div className="w-full max-w-md flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                <span className="material-symbols-outlined text-[24px]">restaurant_menu</span>
              </div>
              <h1 className="text-3xl font-extrabold text-on-surface">Welcome Back</h1>
              <p className="text-sm text-secondary-text">
                Sign in to manage your kitchen operations and live orders.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Username / Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">
                  Username or Email
                </label>
                <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-primary/20 border border-borders/50">
                  <span className="material-symbols-outlined text-secondary-text text-[20px] mr-3">
                    mail
                  </span>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@magiskitchen.com"
                    className="w-full bg-transparent text-on-surface text-sm placeholder:text-secondary-text focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to admin email.')}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-primary/20 border border-borders/50">
                  <span className="material-symbols-outlined text-secondary-text text-[20px] mr-3">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-on-surface text-sm placeholder:text-secondary-text focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="p-1 rounded-lg text-secondary-text hover:text-primary hover:bg-surface-container transition-colors ml-1 focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[20px] select-none">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                  />
                  <span className="text-xs text-on-surface-variant font-medium">
                    Remember me for 30 days
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-primary text-on-primary font-semibold text-sm py-3.5 rounded-xl hover:bg-surface-tint shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            {/* Footer note */}
            <div className="text-center pt-2">
              <p className="text-xs text-secondary-text">
                Need assistance? Contact your{' '}
                <a
                  href="mailto:support@magiskitchen.com"
                  className="text-primary hover:underline font-semibold"
                >
                  System Administrator
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
