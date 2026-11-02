'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Customers', path: '/customers', icon: 'group' },
  { label: 'Menu Management', path: '/menu', icon: 'restaurant_menu' },
  { label: 'Orders', path: '/orders', icon: 'orders' },
  { label: 'Payments', path: '/payments', icon: 'payments' },
  { label: 'Deliveries', path: '/deliveries', icon: 'local_shipping' },
  { label: 'Reports', path: '/reports', icon: 'bar_chart' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isItemActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    document.cookie = 'magis_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    localStorage.removeItem('magis_auth');
    if (onClose) onClose();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-surface-container-low z-50 flex flex-col justify-between py-space-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="px-space-md mb-space-lg flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-space-sm" onClick={onClose}>
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[20px]">restaurant</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[17px] text-on-surface tracking-tight leading-snug">
                  Magi&apos;s Kitchen
                </span>
                <span className="text-[11px] text-secondary-text font-medium">
                  Cloud Kitchen Admin
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-secondary-text"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-space-xs px-space-md">
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-all text-[14px] ${
                    active
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      active ? 'text-on-primary-container' : 'text-secondary-text'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Options & User Status */}
        <div className="px-space-md flex flex-col gap-space-xs">
          <Link
            href="/settings"
            onClick={onClose}
            className={`flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-all text-[14px] ${
              pathname.startsWith('/settings')
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </Link>

          {/* Active Session Badge */}
          <div className="flex items-center justify-between px-space-md py-space-sm mt-space-sm bg-surface-container rounded-lg">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shrink-0">
                GR
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-on-surface truncate">
                  Gokul Raj
                </span>
                <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Active Session
                </span>
              </div>
            </div>

            {/* Logout Icon Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-secondary-text hover:text-error hover:bg-error-container/40 transition-colors"
              title="Log Out"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
