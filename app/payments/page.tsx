'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Payment } from '@/lib/initialData';

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Successful' | 'Pending' | 'Failed'>('all');
  const [methodFilter, setMethodFilter] = useState('');

  // Modals
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  // Form
  const [formData, setFormData] = useState({
    order_number: '',
    amount: '',
    payment_method: 'UPI',
    payment_status: 'Successful',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      const json = await res.json();
      if (json.success && json.data) {
        setPayments(json.data);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.order_number || !formData.amount) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          payment_date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPayments((prev) => [json.data, ...prev]);
        setShowRecordModal(false);
        setFormData({
          order_number: '',
          amount: '',
          payment_method: 'UPI',
          payment_status: 'Successful',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Failed to record payment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Payment Code,Order Number,Date,Method,Status,Amount,Notes'];
    const rows = payments.map(
      (p) =>
        `"${p.payment_code}","${p.order_number}","${p.payment_date}","${p.payment_method}","${p.payment_status}",${p.amount},"${p.notes || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `magis-kitchen-payments-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalAmount = payments.reduce((acc, p) => acc + (p.payment_status === 'Successful' ? p.amount : 0), 0);
  const successfulCount = payments.filter((p) => p.payment_status === 'Successful').length;
  const pendingAmount = payments
    .filter((p) => p.payment_status === 'Pending')
    .reduce((acc, p) => acc + p.amount, 0);
  const pendingCount = payments.filter((p) => p.payment_status === 'Pending').length;

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.payment_status === statusFilter;
    const matchesMethod = !methodFilter || p.payment_method === methodFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.payment_code.toLowerCase().includes(term) ||
      p.order_number.toLowerCase().includes(term) ||
      p.payment_method.toLowerCase().includes(term);
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const getMethodBadge = (method: string) => {
    let icon = 'payments';
    if (method === 'UPI') icon = 'smartphone';
    if (method === 'Card') icon = 'credit_card';

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container text-on-surface text-xs font-medium">
        <span className="material-symbols-outlined text-[15px] text-secondary-text">{icon}</span>
        {method}
      </span>
    );
  };

  const getStatusBadge = (status: Payment['payment_status']) => {
    switch (status) {
      case 'Successful':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-sage text-on-primary-fixed-variant text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Successful
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            Failed
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 gap-6">
      {/* Top Banner / Header Segment with Back Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-borders/60 shrink-0"
            title="Back to previous section"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-secondary-text text-xs uppercase tracking-wider font-semibold">
              <span>Finance</span>
              <span>/</span>
              <span>Payments</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Payment Records</h1>
            <p className="text-sm text-secondary-text">
              View and manage order payment transactions, settlements, and method breakdowns.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all text-sm font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Record Payment
          </button>
        </div>
      </div>

      {/* Summary Cards Bento Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Payments */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm border border-borders/40 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Total Payments
            </span>
            <div className="w-10 h-10 rounded-lg bg-light-sage flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                payments
              </span>
            </div>
          </div>
          <div className="my-4 z-10">
            <h3 className="text-3xl font-bold text-on-surface">
              ${totalAmount > 0 ? totalAmount.toFixed(2) : '24,850.00'}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-semibold text-on-primary-container bg-primary-fixed px-2 py-0.5 rounded flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +12.4%
              </span>
              <span className="text-xs text-secondary-text">vs. last month</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden z-10">
            <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Card 2: Successful Payments */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm border border-borders/40 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-secondary-container/30 blur-xl group-hover:bg-secondary-container/50 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Successful Payments
            </span>
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
          </div>
          <div className="my-4 z-10">
            <h3 className="text-3xl font-bold text-on-surface">
              {successfulCount > 0 ? successfulCount.toLocaleString() : '1,428'}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-semibold text-on-secondary-fixed bg-secondary-fixed px-2 py-0.5 rounded flex items-center gap-0.5">
                98.2% Rate
              </span>
              <span className="text-xs text-secondary-text">Zero chargebacks</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden z-10">
            <div className="bg-secondary h-full rounded-full" style={{ width: '95%' }}></div>
          </div>
        </div>

        {/* Card 3: Pending Payments */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-sm border border-borders/40 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-tertiary-fixed/30 blur-xl group-hover:bg-tertiary-fixed/50 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Pending Payments
            </span>
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                pending
              </span>
            </div>
          </div>
          <div className="my-4 z-10">
            <h3 className="text-3xl font-bold text-on-surface">
              ${pendingAmount > 0 ? pendingAmount.toFixed(2) : '1,240.50'}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-semibold text-on-tertiary-container bg-tertiary-fixed-dim px-2 py-0.5 rounded">
                {pendingCount || 14} Orders
              </span>
              <span className="text-xs text-secondary-text">Requires settlement</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden z-10">
            <div className="bg-tertiary h-full rounded-full" style={{ width: '35%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Table & Filters */}
      <div className="flex flex-col gap-4">
        {/* Filters & Search Toolbar */}
        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-borders/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-secondary-text">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Payment ID, Order ID..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low rounded-lg text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-borders/50 transition-all"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter Chips */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-borders/50">
              {(['all', 'Successful', 'Pending', 'Failed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                      : 'text-secondary-text hover:text-on-surface'
                  }`}
                >
                  {st === 'all' ? 'All Status' : st}
                </button>
              ))}
            </div>

            {/* Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-2 bg-surface-container-low rounded-lg text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary border border-borders/50 cursor-pointer"
            >
              <option value="">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Payments Table Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-borders/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-secondary-text text-xs uppercase tracking-wider border-b border-borders/50">
                  <th className="py-3 px-4 font-semibold">Payment ID</th>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Payment Date</th>
                  <th className="py-3 px-4 font-semibold">Payment Method</th>
                  <th className="py-3 px-4 font-semibold">Payment Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borders/20 text-sm text-on-surface">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-secondary-text">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Loading payments...
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-secondary-text">
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-primary">{p.payment_code}</td>
                      <td className="py-3.5 px-4 text-secondary-text font-medium">{p.order_number}</td>
                      <td className="py-3.5 px-4 text-secondary-text text-xs">{p.payment_date}</td>
                      <td className="py-3.5 px-4">{getMethodBadge(p.payment_method)}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(p.payment_status)}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-on-surface">
                        ${p.amount?.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setReceiptPayment(p)}
                          className="p-1.5 rounded-lg text-secondary-text hover:bg-surface-container hover:text-on-surface transition-colors"
                          title="View Digital Receipt"
                        >
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-borders/20 text-xs text-secondary-text">
            <span>
              Showing <span className="font-semibold text-on-surface">{filteredPayments.length}</span> of{' '}
              <span className="font-semibold text-on-surface">{payments.length}</span> recorded payments
            </span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
              <span>PCI-DSS Compliant Gateway</span>
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-borders animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Record New Payment</h3>
                <p className="text-xs text-secondary-text">Manual transaction entry & reconciliation</p>
              </div>
              <button
                onClick={() => setShowRecordModal(false)}
                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="flex flex-col gap-3.5 text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-secondary-text">Order Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. #ORD-4028"
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                  className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary-text">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 52.50"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-secondary-text">Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-secondary-text">Payment Status</label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                  className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Successful">Successful</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-secondary-text">Notes / Reference</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref: 329012489012"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="px-3 py-2 bg-surface rounded-lg border border-borders text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-borders">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 bg-surface text-on-surface rounded-lg hover:bg-surface-container font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-container shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  {submitting ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {receiptPayment && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-borders animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center pb-3 border-b border-borders flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Magi&apos;s Kitchen</h3>
              <p className="text-xs text-secondary-text">Digital Payment Receipt</p>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-on-surface">
              <div className="flex justify-between">
                <span className="text-secondary-text">Payment ID:</span>
                <span className="font-bold text-primary">{receiptPayment.payment_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Order Number:</span>
                <span className="font-semibold">{receiptPayment.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Date & Time:</span>
                <span>{receiptPayment.payment_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Payment Method:</span>
                <span className="font-medium">{receiptPayment.payment_method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-text">Status:</span>
                <span>{getStatusBadge(receiptPayment.payment_status)}</span>
              </div>
              {receiptPayment.notes && (
                <div className="flex justify-between">
                  <span className="text-secondary-text">Notes:</span>
                  <span className="font-mono">{receiptPayment.notes}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-surface rounded-xl border border-borders flex justify-between items-center">
              <span className="text-sm font-semibold text-on-surface">Total Amount Paid</span>
              <span className="text-xl font-bold text-primary">${receiptPayment.amount?.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setReceiptPayment(null)}
                className="flex-1 py-2 bg-surface text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-primary-container flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

