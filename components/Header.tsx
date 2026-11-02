'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState('Oct 24, 2023');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setCurrentDate(formatted);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('magis_auth');
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-4 sm:px-space-xl border-b border-borders/60 transition-all">
      <div className="flex items-center gap-space-sm sm:gap-space-md">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Back Button to move to previous section */}
        {pathname !== '/' && (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-all border border-borders/50 shadow-xs"
            title="Move to previous section"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        {/* Date Display */}
        <div className="flex items-center gap-2 text-secondary-text text-[13px] font-medium">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-space-sm sm:gap-space-md">
        {/* Notification Bell */}
        <button className="relative w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error"></span>
        </button>

        {/* User Profile & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full bg-primary hover:opacity-90 flex items-center justify-center text-on-primary text-xs font-bold transition-opacity shadow-sm"
            title="Admin Profile Menu"
          >
            GR
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-borders/60 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-borders/40">
                <p className="text-xs font-bold text-on-surface">Gokul Raj</p>
                <p className="text-[11px] text-secondary-text truncate">admin@magiskitchen.com</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">settings</span>
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-error hover:bg-error-container/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
