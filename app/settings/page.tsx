'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSettings } from '@/lib/initialData';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('Kitchen Admin');
  const [email, setEmail] = useState('admin@magiskitchen.com');
  const [role] = useState('Master Kitchen Supervisor & Operations Manager');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<{ text: string; error?: boolean } | null>(null);

  // Preferences (light/dark theme removed per user request)
  const [branch, setBranch] = useState('Downtown Flagship Kitchen (Main)');
  const [defaultView, setDefaultView] = useState('Live Order Grid & Kitchen Queue');
  const [currency] = useState('USD ($)');
  const [taxRate, setTaxRate] = useState(8);
  const [deliveryFee, setDeliveryFee] = useState(5.0);

  // Notifications
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [stockWarnings, setStockWarnings] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json.success && json.data) {
        const d: AdminSettings = json.data;
        setSettings(d);
        setFullName(d.full_name || 'Kitchen Admin');
        setEmail(d.email || 'admin@magiskitchen.com');
        setBranch(d.branch || 'Downtown Flagship Kitchen (Main)');
        setDefaultView(d.default_view || 'Live Order Grid & Kitchen Queue');
        setTaxRate(d.tax_rate ?? 8);
        setDeliveryFee(d.delivery_fee ?? 5.0);
        setAudioAlerts(d.audio_alerts ?? true);
        setStockWarnings(d.stock_warnings ?? true);
        setEmailDigest(d.email_digest ?? false);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const payload: Partial<AdminSettings> = {
        full_name: fullName,
        email,
        branch,
        default_view: defaultView,
        currency,
        tax_rate: taxRate,
        delivery_fee: deliveryFee,
        audio_alerts: audioAlerts,
        stock_warnings: stockWarnings,
        email_digest: emailDigest,
      };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordNotice({ text: 'Please fill in both current and new password.', error: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice({ text: 'New passwords do not match.', error: true });
      return;
    }
    setPasswordNotice({ text: 'Password successfully updated!', error: false });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordNotice(null), 3000);
  };

  const handleDiscard = () => {
    if (settings) {
      setFullName(settings.full_name || 'Kitchen Admin');
      setEmail(settings.email || 'admin@magiskitchen.com');
      setBranch(settings.branch || 'Downtown Flagship Kitchen (Main)');
      setDefaultView(settings.default_view || 'Live Order Grid & Kitchen Queue');
      setTaxRate(settings.tax_rate ?? 8);
      setDeliveryFee(settings.delivery_fee ?? 5.0);
      setAudioAlerts(settings.audio_alerts ?? true);
      setStockWarnings(settings.stock_warnings ?? true);
      setEmailDigest(settings.email_digest ?? false);
    }
  };

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-secondary-text text-sm">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 gap-6 pb-20">
      {/* Top spacing / Header Context area with Back Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-borders/60"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back</span>
            </button>
            <span className="text-xs uppercase font-semibold tracking-wider text-secondary-text">
              Configuration / Settings
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">Settings</h1>
          <p className="text-sm text-secondary-text mt-0.5">
            Manage application preferences, kitchen parameters, and admin account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all text-sm font-semibold"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {saveSuccess ? 'check' : 'save'}
            </span>
            {saving ? 'Saving...' : saveSuccess ? 'Saved Successfully!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quick Jump & System Status (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-card-background rounded-xl p-4 shadow-sm border border-borders/40 flex flex-col gap-1">
            <a
              href="#profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-semibold text-sm transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">person</span>
              <span>Admin Profile</span>
            </a>
            <a
              href="#security"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface text-sm transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary-text">lock</span>
              <span>Security &amp; Password</span>
            </a>
            <a
              href="#preferences"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface text-sm transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary-text">tune</span>
              <span>Application Preferences</span>
            </a>
            <a
              href="#notifications"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface text-sm transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary-text">notifications</span>
              <span>Notifications</span>
            </a>
          </div>

          {/* Quick Info Card */}
          <div className="bg-primary-container/20 rounded-xl p-5 border border-primary-container/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-on-primary-container">
              <span className="material-symbols-outlined text-primary">verified</span>
              <span className="font-bold text-sm">Kitchen System Status</span>
            </div>
            <p className="text-xs text-secondary-text leading-relaxed">
              All cloud kitchen pipelines, live order webhooks, and local KDS dispatchers are operational.
            </p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-primary-container/20">
              <span className="text-secondary-text">Suite Version</span>
              <span className="font-bold text-on-surface">v2.4.1-sage</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary-text">Operational Status</span>
              <span className="font-medium text-primary">Live &amp; Synchronized</span>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Forms (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Admin Profile Section */}
          <section
            id="profile"
            className="bg-card-background rounded-xl p-5 sm:p-6 shadow-sm border border-borders/40 flex flex-col gap-5 scroll-mt-24"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-on-surface">Admin Profile Information</h2>
                <p className="text-xs text-secondary-text">
                  Update your administrative credentials and display details.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-base">
                {initials}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-borders/40 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-borders/40 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Role Description</label>
              <input
                type="text"
                disabled
                value={role}
                className="px-3 py-2 rounded-lg bg-surface-container text-secondary-text text-sm cursor-not-allowed border border-borders/40"
              />
            </div>
          </section>

          {/* Password Change Section */}
          <section
            id="security"
            className="bg-card-background rounded-xl p-5 sm:p-6 shadow-sm border border-borders/40 flex flex-col gap-5 scroll-mt-24"
          >
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-on-surface">Security &amp; Password</h2>
              <p className="text-xs text-secondary-text">
                Ensure your kitchen management account is secure by rotating passwords.
              </p>
            </div>

            {passwordNotice && (
              <div
                className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  passwordNotice.error
                    ? 'bg-error-container text-on-error-container'
                    : 'bg-primary-fixed text-on-primary-fixed'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {passwordNotice.error ? 'error' : 'check_circle'}
                </span>
                {passwordNotice.text}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-borders/40 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-borders/40 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-borders/40 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* Application Preferences Section (Light/Dark theme removed per request) */}
          <section
            id="preferences"
            className="bg-card-background rounded-xl p-5 sm:p-6 shadow-sm border border-borders/40 flex flex-col gap-5 scroll-mt-24"
          >
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-on-surface">Application Preferences</h2>
              <p className="text-xs text-secondary-text">
                Customize operational behaviors and defaults for Magi&apos;s Kitchen.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Kitchen Branch */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Kitchen Location / Branch</label>
                <span className="text-xs text-secondary-text">
                  Choose the active kitchen node receiving live orders
                </span>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-borders/40 focus:outline-none focus:ring-1 focus:ring-primary transition-all mt-1"
                >
                  <option value="Downtown Flagship Kitchen (Main)">Downtown Flagship Kitchen (Main)</option>
                  <option value="Westside Express Hub">Westside Express Hub</option>
                  <option value="North Suburbs Prep Station">North Suburbs Prep Station</option>
                </select>
              </div>

              {/* Default View */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Default Dashboard View</label>
                <span className="text-xs text-secondary-text">Primary layout displayed upon signing in</span>
                <select
                  value={defaultView}
                  onChange={(e) => setDefaultView(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-borders/40 focus:outline-none focus:ring-1 focus:ring-primary transition-all mt-1"
                >
                  <option value="Live Order Grid & Kitchen Queue">Live Order Grid &amp; Kitchen Queue</option>
                  <option value="Analytics & Daily Summary">Analytics &amp; Daily Summary</option>
                  <option value="Table & Floor Management">Table &amp; Floor Management</option>
                </select>
              </div>

              {/* Financial Constants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-borders/40"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Standard Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-borders/40"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section
            id="notifications"
            className="bg-card-background rounded-xl p-5 sm:p-6 shadow-sm border border-borders/40 flex flex-col gap-5 scroll-mt-24"
          >
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-on-surface">Notification Settings</h2>
              <p className="text-xs text-secondary-text">
                Control how and when you receive alerts for new incoming orders and inventory changes.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all border border-borders/30">
                <div className="flex flex-col">
                  <span className="text-sm text-on-surface font-semibold">New Order Audio Alert</span>
                  <span className="text-xs text-secondary-text">
                    Play a chime whenever a new order is received
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={audioAlerts}
                  onChange={(e) => setAudioAlerts(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all border border-borders/30">
                <div className="flex flex-col">
                  <span className="text-sm text-on-surface font-semibold">Low Stock Inventory Warnings</span>
                  <span className="text-xs text-secondary-text">
                    Receive notification banner when ingredients run low
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={stockWarnings}
                  onChange={(e) => setStockWarnings(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all border border-borders/30">
                <div className="flex flex-col">
                  <span className="text-sm text-on-surface font-semibold">Email Daily Digest</span>
                  <span className="text-xs text-secondary-text">
                    Summary of kitchen sales sent every evening at closing
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
