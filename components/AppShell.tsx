'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }
    const isLoggedIn =
      localStorage.getItem('magis_auth') === 'true' ||
      document.cookie.includes('magis_auth=true');
    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-secondary-text font-medium">Opening Magi&apos;s Kitchen...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Drawer Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area without Upperbar */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile floating sidebar toggle button since upperbar is removed */}
        <div className="lg:hidden fixed top-3 left-3 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md shadow-md border border-borders flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        </div>

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
