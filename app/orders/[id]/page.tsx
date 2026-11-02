'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/lib/initialData';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Order['status']>('preparing');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      try {
        const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setOrder(json.data);
          setStatus(json.data.status);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleSaveStatus = async () => {
    if (!order) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, order_number: order.order_number, status }),
      });
      const json = await res.json();
      if (json.success) {
        setOrder({ ...order, status });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'preparing':
        return (
          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Preparing
          </span>
        );
      case 'ready':
        return (
          <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Ready for Delivery
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-surface-container-high text-on-surface rounded-full text-xs font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">done_all</span>
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-xs font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">cancel</span>
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-xs font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-secondary-text text-sm">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-6xl text-secondary-text">receipt_long</span>
        <h2 className="text-2xl font-bold text-on-surface">Order Not Found</h2>
        <p className="text-secondary-text text-center max-w-md">
          Could not locate order with ID &quot;{orderId}&quot;. It may have been deleted or the link is incorrect.
        </p>
        <Link
          href="/orders"
          className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Orders
        </Link>
      </div>
    );
  }

  const initials = order.customer_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 gap-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors border border-borders/60"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back
          </button>
          <span className="text-secondary-text">/</span>
          <span className="font-semibold text-on-surface">{order.order_number}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            title="Print Invoice / Ticket"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Invoice
          </button>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Order['status'])}
              className="bg-surface-container-low text-on-surface text-sm font-medium px-3 py-2 rounded-lg outline-none cursor-pointer hover:bg-surface-container border border-borders transition-colors shadow-sm"
            >
              <option value="pending">Status: Pending</option>
              <option value="preparing">Status: Preparing</option>
              <option value="ready">Status: Ready for Delivery</option>
              <option value="completed">Status: Completed</option>
              <option value="cancelled">Status: Cancelled</option>
            </select>
          </div>

          <button
            onClick={handleSaveStatus}
            disabled={saving}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {saveSuccess ? 'check' : 'save'}
            </span>
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (2 cols): Items List & Pricing Breakdown */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card-background rounded-xl p-5 sm:p-6 shadow-sm border border-borders/50 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-secondary-text text-xs uppercase tracking-wider font-semibold">
                  Order Items
                </span>
                <h3 className="text-lg font-bold text-on-surface mt-0.5">Items in this Order</h3>
              </div>
              <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-semibold">
                {order.items?.length || 0} items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-secondary-text text-xs border-b border-borders uppercase">
                    <th className="pb-3 font-semibold">Item Name</th>
                    <th className="pb-3 font-semibold text-center">Qty</th>
                    <th className="pb-3 font-semibold text-right">Unit Price</th>
                    <th className="pb-3 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-on-surface divide-y divide-borders/60">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="py-3.5 flex items-center gap-3">
                          {it.image_url ? (
                            <img
                              src={it.image_url}
                              alt={it.item_name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-borders"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                              <span className="material-symbols-outlined text-[20px]">restaurant</span>
                            </div>
                          )}
                          <div>
                            <span className="font-semibold block text-on-surface">{it.item_name}</span>
                            <span className="text-xs text-secondary-text">Kitchen Speciality Recipe</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-center font-medium">{it.quantity}</td>
                        <td className="py-3.5 text-right text-secondary-text">
                          ${it.unit_price?.toFixed(2)}
                        </td>
                        <td className="py-3.5 text-right font-semibold text-on-surface">
                          ${it.subtotal?.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-secondary-text">
                        No item records attached to this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Price Calculations */}
            <div className="flex flex-col items-end gap-2 pt-4 border-t border-borders">
              <div className="flex justify-between w-64 text-sm text-secondary-text">
                <span>Subtotal</span>
                <span className="font-medium text-on-surface">${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64 text-sm text-secondary-text">
                <span>Tax (8%)</span>
                <span>${order.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64 text-sm text-secondary-text">
                <span>Delivery Fee</span>
                <span>${order.delivery_fee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64 text-lg font-bold text-on-surface pt-3 border-t border-borders">
                <span>Total Amount</span>
                <span className="text-primary">${order.total_amount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (1 col): Overview & Customer Details */}
        <div className="flex flex-col gap-6">
          {/* Order Overview Card */}
          <div className="bg-card-background rounded-xl p-5 sm:p-6 shadow-sm border border-borders/50 flex flex-col gap-4">
            <div>
              <span className="text-secondary-text text-xs uppercase tracking-wider font-semibold">
                Overview
              </span>
              <h3 className="text-lg font-bold text-on-surface mt-0.5">Order Details</h3>
            </div>

            <div className="flex flex-col divide-y divide-borders/40 text-sm">
              <div className="flex justify-between items-center py-2.5">
                <span className="text-secondary-text">Order ID</span>
                <span className="font-semibold text-on-surface">{order.order_number}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-secondary-text">Order Date</span>
                <span className="font-medium text-on-surface">{order.order_date || order.created_at || 'Oct 24, 2023'}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-secondary-text">Current Status</span>
                <div>{getStatusBadge(order.status)}</div>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-secondary-text">Payment Type</span>
                <span className="font-medium text-on-surface">{order.payment_method}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-secondary-text">Fulfillment</span>
                <span className="font-medium text-on-surface">{order.fulfillment_type}</span>
              </div>
              {order.table_or_notes && (
                <div className="flex flex-col gap-1 py-2.5">
                  <span className="text-secondary-text">Special Instructions</span>
                  <span className="font-normal text-on-surface bg-surface-container-low p-2 rounded-lg text-xs">
                    {order.table_or_notes}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="bg-card-background rounded-xl p-5 sm:p-6 shadow-sm border border-borders/50 flex flex-col gap-4">
            <div>
              <span className="text-secondary-text text-xs uppercase tracking-wider font-semibold">
                Client
              </span>
              <h3 className="text-lg font-bold text-on-surface mt-0.5">Customer Information</h3>
            </div>

            <div className="flex items-center gap-3.5 pt-1">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-base shrink-0">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-on-surface">{order.customer_name}</span>
                <span className="text-xs text-secondary-text">{order.customer_email || 'Verified Customer'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 pt-3 border-t border-borders text-sm">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-secondary-text mt-0.5">phone</span>
                <div className="flex flex-col">
                  <span className="text-xs text-secondary-text">Phone Number</span>
                  <span className="text-on-surface font-medium">{order.customer_phone || '+91 98400 12345'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-secondary-text mt-0.5">location_on</span>
                <div className="flex flex-col">
                  <span className="text-xs text-secondary-text">Delivery Address</span>
                  <span className="text-on-surface font-medium leading-relaxed">
                    {order.delivery_address || 'Chennai Central Hub Kitchen Pickup'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

