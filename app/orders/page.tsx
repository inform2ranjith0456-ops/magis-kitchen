'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id?: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url?: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  order_date: string;
  total_amount: number;
  subtotal?: number;
  tax?: number;
  delivery_fee?: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  fulfillment_type?: string;
  payment_method?: string;
  delivery_address?: string;
  table_or_notes?: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Processing' | 'Completed'>('All');
  const [loading, setLoading] = useState(true);

  // Modals
  const [updateTarget, setUpdateTarget] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('Pending');
  const [viewDetailsTarget, setViewDetailsTarget] = useState<Order | null>(null);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrders(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSaveStatus = async () => {
    if (!updateTarget) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: updateTarget.order_number,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_number === updateTarget.order_number ? { ...o, status: newStatus } : o
          )
        );
      }
      setUpdateTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q);
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;

  return (
    <>
      <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Page Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Orders Overview</h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              Track, inspect, and update real-time customer kitchen orders.
            </p>
          </div>
        </div>
      </div>

      {/* Top metrics bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
          <div className="bg-card-background rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-borders/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-secondary-text uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">orders</span>
              </div>
            </div>
            <div className="mt-space-md">
              <span className="text-xl sm:text-2xl font-bold text-on-surface">{orders.length}</span>
              <span className="text-xs text-primary font-semibold ml-2">+12% today</span>
            </div>
          </div>

          <div className="bg-card-background rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-borders/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-secondary-text uppercase tracking-wider">
                Pending
              </span>
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[18px]">pending</span>
              </div>
            </div>
            <div className="mt-space-md">
              <span className="text-xl sm:text-2xl font-bold text-on-surface">{pendingCount}</span>
              <span className="text-xs text-secondary-text ml-2">Requires action</span>
            </div>
          </div>

          <div className="bg-card-background rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-borders/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-secondary-text uppercase tracking-wider">
                Processing
              </span>
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">sync</span>
              </div>
            </div>
            <div className="mt-space-md">
              <span className="text-xl sm:text-2xl font-bold text-on-surface">
                {processingCount}
              </span>
              <span className="text-xs text-secondary-text ml-2">In kitchen</span>
            </div>
          </div>

          <div className="bg-card-background rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-borders/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-secondary-text uppercase tracking-wider">
                Completed
              </span>
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">done_all</span>
              </div>
            </div>
            <div className="mt-space-md">
              <span className="text-xl sm:text-2xl font-bold text-on-surface">{completedCount}</span>
              <span className="text-xs text-primary font-semibold ml-2">Delivered</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-card-background rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md border border-borders/50">
          <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full md:w-auto flex-1">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary-text text-[20px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-space-md py-2 bg-surface text-on-surface rounded-lg outline-none focus:ring-2 focus:ring-primary/40 text-xs sm:text-sm border border-borders/40 transition-all"
                placeholder="Search by Order ID or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
              />
            </div>

            <div className="flex items-center gap-1 bg-surface p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
              {(['All', 'Pending', 'Processing', 'Completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-card-background text-on-surface shadow-sm'
                      : 'text-secondary-text hover:text-on-surface'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-space-sm w-full md:w-auto justify-end">
            <input
              type="date"
              defaultValue="2023-10-24"
              className="px-3 py-2 bg-surface text-on-surface rounded-lg outline-none text-xs border border-borders/40 font-medium"
            />
            <button
              onClick={() => alert('Exporting orders dataset...')}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-surface-tint shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-card-background rounded-xl shadow-sm overflow-hidden border border-borders/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-surface text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface text-xs sm:text-sm text-on-surface">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-primary">
                      <Link
                        href={`/orders/${o.order_number.replace('#', '')}`}
                        className="hover:underline"
                      >
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-light-sage text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {o.customer_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-on-surface">{o.customer_name}</div>
                          <div className="text-xs text-secondary-text">
                            {o.table_or_notes || `${o.items?.length || 1} items`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-secondary-text">{o.order_date}</td>
                    <td className="py-3.5 px-4 font-bold">
                      ₹{Number(o.total_amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          o.status === 'Completed'
                            ? 'bg-light-sage text-primary'
                            : o.status === 'Processing'
                            ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                            : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            o.status === 'Completed'
                              ? 'bg-primary'
                              : o.status === 'Processing'
                              ? 'bg-secondary'
                              : 'bg-tertiary'
                          }`}
                        ></span>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewDetailsTarget(o)}
                          className="p-1.5 rounded-lg hover:bg-surface text-secondary-text hover:text-on-surface transition-colors"
                          title="View Quick Modal"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => {
                            setUpdateTarget(o);
                            setNewStatus(o.status);
                          }}
                          className="px-3 py-1 rounded-lg bg-surface text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between px-4 sm:px-space-xl py-3 bg-surface/50 text-xs text-secondary-text">
            <span>
              Showing {filtered.length} of {orders.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 rounded-lg bg-card-background text-secondary-text font-semibold disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 rounded-lg bg-primary text-on-primary font-semibold">
                1
              </button>
              <button className="px-3 py-1 rounded-lg bg-card-background text-on-surface font-semibold hover:bg-surface-container">
                2
              </button>
              <button className="px-3 py-1 rounded-lg bg-card-background text-on-surface font-semibold hover:bg-surface-container">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {updateTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card-background rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col gap-4 border border-borders animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-borders">
              <h3 className="text-base font-bold text-on-surface">Update Order Status</h3>
              <button
                onClick={() => setUpdateTarget(null)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-secondary-text"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-secondary-text">
                Changing status for order <strong className="text-on-surface">{updateTarget.order_number}</strong>
              </span>
              <label className="text-xs font-semibold text-on-surface mt-2">Select New Status</label>
              <select
                className="w-full px-3 py-2 bg-surface text-on-surface rounded-lg outline-none focus:ring-2 focus:ring-primary/40 text-sm border border-borders/60"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Order['status'])}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-borders">
              <button
                onClick={() => setUpdateTarget(null)}
                className="px-4 py-2 rounded-lg bg-surface text-on-surface text-xs font-semibold hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-surface-tint"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetailsTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card-background rounded-2xl p-6 w-full max-w-lg shadow-xl flex flex-col gap-4 border border-borders animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-borders">
              <h3 className="text-base font-bold text-on-surface">
                Order {viewDetailsTarget.order_number} Details
              </h3>
              <button
                onClick={() => setViewDetailsTarget(null)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-secondary-text"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs sm:text-sm divide-y divide-surface">
              <div className="flex justify-between items-center pt-1">
                <span className="text-secondary-text">Customer:</span>
                <span className="font-semibold text-on-surface">{viewDetailsTarget.customer_name}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-secondary-text">Order Time:</span>
                <span className="text-on-surface">{viewDetailsTarget.order_date}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-secondary-text">Current Status:</span>
                <span className="font-bold text-primary">{viewDetailsTarget.status}</span>
              </div>

              <div className="pt-3">
                <span className="font-semibold text-on-surface mb-2 block">Ordered Items</span>
                <div className="bg-surface p-3 rounded-lg flex flex-col gap-2">
                  {viewDetailsTarget.items && viewDetailsTarget.items.length > 0 ? (
                    viewDetailsTarget.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span>
                          {it.quantity}x {it.item_name}
                        </span>
                        <span className="font-bold">₹{it.subtotal}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-secondary-text">Standard menu items included.</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 text-base font-bold">
                <span>Total Amount:</span>
                <span className="text-primary font-bold">
                  ₹{Number(viewDetailsTarget.total_amount).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-borders">
              <Link
                href={`/orders/${viewDetailsTarget.order_number.replace('#', '')}`}
                className="px-4 py-2 rounded-lg bg-surface text-on-surface text-xs font-semibold hover:bg-surface-container"
              >
                Go to Detailed Page
              </Link>
              <button
                onClick={() => setViewDetailsTarget(null)}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-surface-tint"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

