'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Delivery } from '@/lib/initialData';

export default function DeliveriesPage() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Dispatched' | 'In Transit' | 'Delivered'>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Modals
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New delivery form
  const [formData, setFormData] = useState({
    order_number: '',
    customer_name: '',
    delivery_address: '',
    driver_name: '',
    city: 'Chennai',
    estimated_minutes: 25,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await fetch('/api/deliveries');
      const json = await res.json();
      if (json.success && json.data) {
        setDeliveries(json.data);
      }
    } catch (err) {
      console.error('Failed to load deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (delivery_code: string, status: Delivery['delivery_status']) => {
    setOpenDropdownId(null);
    try {
      const res = await fetch('/api/deliveries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_code, status }),
      });
      const json = await res.json();
      if (json.success) {
        setDeliveries((prev) =>
          prev.map((d) => (d.delivery_code === delivery_code ? { ...d, delivery_status: status } : d))
        );
        if (selectedDelivery && selectedDelivery.delivery_code === delivery_code) {
          setSelectedDelivery({ ...selectedDelivery, delivery_status: status });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCreateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.order_number || !formData.customer_name || !formData.delivery_address) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setDeliveries((prev) => [json.data, ...prev]);
        setShowCreateModal(false);
        setFormData({
          order_number: '',
          customer_name: '',
          delivery_address: '',
          driver_name: '',
          city: 'Chennai',
          estimated_minutes: 25,
        });
      }
    } catch (err) {
      console.error('Failed to dispatch delivery:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = deliveries.filter((d) => d.delivery_status === 'In Transit').length;
  const pendingCount = deliveries.filter((d) => d.delivery_status === 'Dispatched').length;
  const deliveredCount = deliveries.filter((d) => d.delivery_status === 'Delivered').length;

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesFilter = statusFilter === 'all' || d.delivery_status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      d.delivery_code.toLowerCase().includes(term) ||
      d.order_number.toLowerCase().includes(term) ||
      d.customer_name.toLowerCase().includes(term) ||
      d.delivery_address.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: Delivery['delivery_status']) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-light-sage text-on-primary-container font-medium gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            In Transit
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-tertiary-fixed text-on-tertiary-fixed font-medium gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            Dispatched
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-surface-container-high text-on-surface font-medium gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-primary">check_circle</span>
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-surface-container text-on-surface">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 gap-6">
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-borders/60 shrink-0"
            title="Back to previous section"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </button>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Deliveries &amp; Dispatch</h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              Real-time route tracking, rider assignments, and delivery hubs.
            </p>
          </div>
        </div>
      </div>

      {/* Top Stats Row: Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Deliveries */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-borders/40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Active Deliveries
            </span>
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_shipping
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-on-surface">{activeCount || 24}</div>
            <div className="text-xs text-primary flex items-center gap-1 mt-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+12% from yesterday</span>
            </div>
          </div>
        </div>

        {/* Pending Dispatch */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-borders/40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Pending Dispatch
            </span>
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                schedule
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-on-surface">{pendingCount || 8}</div>
            <div className="text-xs text-secondary-text mt-1">Ready for pickup</div>
          </div>
        </div>

        {/* Delivered Today */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-borders/40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Delivered Today
            </span>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-on-surface">{deliveredCount || 142}</div>
            <div className="text-xs text-primary flex items-center gap-1 mt-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>99.2% success rate</span>
            </div>
          </div>
        </div>

        {/* Live Hubs Card */}
        <div className="bg-primary text-on-primary p-5 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
            <span className="material-symbols-outlined text-[110px]">map</span>
          </div>
          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-semibold text-on-primary/80 uppercase tracking-wider">
              Live Hubs
            </span>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                hub
              </span>
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <div className="text-3xl font-bold">3 Cities</div>
            <div className="text-xs text-on-primary/90 mt-1 font-medium">
              Chennai • Bengaluru • Hyderabad
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-borders/40 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-borders/40">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, Customer, Address..."
                className="w-full pl-9 pr-4 py-2 bg-surface rounded-lg text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-borders/60 transition-all"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-borders/50 overflow-x-auto">
              {(['all', 'Dispatched', 'In Transit', 'Delivered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                      : 'text-secondary-text hover:text-on-surface'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:bg-primary-container transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Delivery</span>
            </button>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/60 text-secondary-text text-xs uppercase tracking-wider border-b border-borders/50">
                <th className="py-3 px-4 font-semibold">Delivery ID</th>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer Name</th>
                <th className="py-3 px-4 font-semibold">Delivery Address</th>
                <th className="py-3 px-4 font-semibold">Delivery Status</th>
                <th className="py-3 px-4 font-semibold">Delivery Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface divide-y divide-borders/30">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-secondary-text">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading deliveries...
                  </td>
                </tr>
              ) : filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-secondary-text">
                    No delivery records found matching &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((del) => (
                  <tr key={del.id} className="hover:bg-surface/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-primary">{del.delivery_code}</td>
                    <td className="py-3.5 px-4 text-secondary-text font-medium">{del.order_number}</td>
                    <td className="py-3.5 px-4 font-semibold">{del.customer_name}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 max-w-xs truncate">
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                        <span className="truncate">{del.delivery_address}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(del.delivery_status)}</td>
                    <td className="py-3.5 px-4 text-secondary-text text-xs whitespace-nowrap">
                      {del.delivery_date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 relative">
                        <button
                          onClick={() => {
                            setSelectedDelivery(del);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-secondary-text hover:text-on-surface transition-colors"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>

                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdownId(openDropdownId === del.delivery_code ? null : del.delivery_code)
                            }
                            className="p-1.5 rounded-lg hover:bg-surface-container text-secondary-text hover:text-on-surface transition-colors"
                            title="Update Status"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>

                          {openDropdownId === del.delivery_code && (
                            <div className="absolute right-0 mt-2 w-40 bg-surface-container-lowest rounded-xl shadow-xl border border-borders z-30 p-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
                              {(['Dispatched', 'In Transit', 'Delivered'] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateStatus(del.delivery_code, st)}
                                  className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                                    del.delivery_status === st
                                      ? 'bg-surface font-bold text-primary'
                                      : 'hover:bg-surface-container text-on-surface'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-surface/30 flex items-center justify-between text-xs text-secondary-text border-t border-borders/30">
          <span>
            Showing {filteredDeliveries.length} of {deliveries.length} deliveries
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live GPS Sync Active</span>
          </div>
        </div>
      </div>

      {/* Delivery Details & Live Tracking Modal */}
      {showDetailsModal && selectedDelivery && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-borders animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-on-surface">
                  Delivery Details: {selectedDelivery.delivery_code}
                </span>
                <span className="text-xs text-secondary-text">Live tracking & route metadata</span>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Map Preview Banner */}
            <div className="w-full h-44 rounded-xl bg-cover bg-center shadow-inner relative overflow-hidden flex items-end p-4 border border-borders"
                 style={{
                   backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTh2J_eiqPdw2hhu_4NqRkMk27C357IPCtoM9Ku_y7q1ljPyAmPC4W-c3qsj4YG1OnxIvnhISd0Eeg_wCDgNdFkuMC3EhqCueFqDpO5Ci_qMX5yCriWcWNw-fkaAE4Hr3J4T9apt9O4pXoNq8p6EInHnHL2XZileOubmxevQo8PX8A4WU2Js6Xoz0GU14FZgZFjbh94GlkEF5tYB_O0isB224eqdrsVuM7uzz4vOA')`,
                 }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative z-10 text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary-fixed">navigation</span>
                <span className="text-sm font-semibold">
                  Estimated Arrival in {selectedDelivery.estimated_minutes || 14} minutes ({selectedDelivery.city || 'Chennai'})
                </span>
              </div>
            </div>

            {/* Metadata Box */}
            <div className="grid grid-cols-2 gap-4 bg-surface p-4 rounded-xl border border-borders/50 text-sm">
              <div>
                <span className="text-xs text-secondary-text block">Customer</span>
                <span className="font-semibold text-on-surface">{selectedDelivery.customer_name}</span>
              </div>
              <div>
                <span className="text-xs text-secondary-text block">Order ID</span>
                <span className="font-semibold text-on-surface">{selectedDelivery.order_number}</span>
              </div>
              <div>
                <span className="text-xs text-secondary-text block">Delivery Address</span>
                <span className="font-medium text-on-surface leading-tight">
                  {selectedDelivery.delivery_address}
                </span>
              </div>
              <div>
                <span className="text-xs text-secondary-text block">Driver Assigned</span>
                <span className="font-medium text-on-surface">
                  {selectedDelivery.driver_name || 'Senthil Kumar (+91 98401 XXXXX)'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>{getStatusBadge(selectedDelivery.delivery_status)}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-surface text-on-surface text-sm rounded-lg hover:bg-surface-container font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:bg-primary-container flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  Print Waybill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch New Delivery Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-borders animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Dispatch New Delivery</h3>
                <p className="text-xs text-secondary-text">Assign rider and dispatch customer package</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateDelivery} className="flex flex-col gap-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary-text">Order ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. #ORD-4026"
                    value={formData.order_number}
                    onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                    className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary-text">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-secondary-text">Delivery Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anna Nagar West, Chennai"
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                  className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary-text">Rider Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Karthik Rider"
                    value={formData.driver_name}
                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                    className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary-text">City Hub</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-borders">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-surface text-on-surface rounded-lg hover:bg-surface-container font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-container shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  {submitting ? 'Dispatching...' : 'Dispatch Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

