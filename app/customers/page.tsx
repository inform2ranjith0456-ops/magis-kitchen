'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  id: number;
  customer_code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const fetchCustomers = () => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCustomers(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingCustomer) {
        const res = await fetch('/api/customers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCustomer.id, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          fetchCustomers();
        }
      } else {
        const res = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          fetchCustomers();
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/customers?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      c.customer_code.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Top Header */}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Customers Directory</h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              Manage your registered customers and review their preferences.
            </p>
          </div>
        </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-sm hover:bg-surface-tint transition-all self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Add Customer</span>
          </button>
        </div>

        {/* Quick Stats Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md sm:gap-space-lg">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-borders/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
                Total Registered
              </span>
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-sm">
              <span className="text-2xl sm:text-3xl font-bold text-on-surface">
                {1280 + customers.length}
              </span>
              <span className="text-xs text-primary font-semibold">+12% this month</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-borders/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
                Active This Week
              </span>
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-sm">
              <span className="text-2xl sm:text-3xl font-bold text-on-surface">342</span>
              <span className="text-xs text-secondary-text">Regular diners</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-borders/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
                Avg. Order Value
              </span>
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-sm">
              <span className="text-2xl sm:text-3xl font-bold text-on-surface">₹1,450</span>
              <span className="text-xs text-primary font-semibold">+4.2%</span>
            </div>
          </div>
        </div>

        {/* Customer Table Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-borders/50">
          {/* Toolbar */}
          <div className="p-4 sm:p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md border-b border-borders/40">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary-text text-[20px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-space-md py-2 bg-surface-container-low rounded-lg text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all border border-borders/40"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
              />
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <button
                onClick={() => alert('Filter options applied')}
                className="flex items-center gap-2 px-3 py-2 bg-surface-container-low text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                <span>Filter</span>
              </button>
              <button
                onClick={() => alert('Exporting customers directory to CSV...')}
                className="flex items-center gap-2 px-3 py-2 bg-surface-container-low text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low text-secondary-text text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 sm:px-space-lg">Customer ID</th>
                  <th className="py-3 px-4 sm:px-space-lg">Customer Name</th>
                  <th className="py-3 px-4 sm:px-space-lg">Phone</th>
                  <th className="py-3 px-4 sm:px-space-lg">Email</th>
                  <th className="py-3 px-4 sm:px-space-lg">Address</th>
                  <th className="py-3 px-4 sm:px-space-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borders/30 text-xs sm:text-sm text-on-surface">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-4 sm:px-space-lg font-mono text-secondary-text">
                      {c.customer_code}
                    </td>
                    <td className="py-3 px-4 sm:px-space-lg font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-light-sage text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {c.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:px-space-lg text-secondary-text">{c.phone}</td>
                    <td className="py-3 px-4 sm:px-space-lg text-secondary-text">{c.email}</td>
                    <td className="py-3 px-4 sm:px-space-lg text-secondary-text truncate max-w-xs">
                      {c.address}
                    </td>
                    <td className="py-3 px-4 sm:px-space-lg text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-secondary-text hover:text-on-surface"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="w-8 h-8 rounded-lg hover:bg-error-container/30 flex items-center justify-center text-secondary-text hover:text-error"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 sm:p-space-lg flex items-center justify-between text-secondary-text text-xs border-t border-borders/30">
            <span>
              Showing {filtered.length} of {customers.length} registered customers
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="px-3 py-1 rounded-md bg-surface-container-low text-on-surface font-semibold disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 rounded-md bg-primary text-on-primary font-semibold">
                1
              </button>
              <button className="px-3 py-1 rounded-md bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container">
                2
              </button>
              <button className="px-3 py-1 rounded-md bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col border border-borders animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-b border-borders/40">
              <span className="text-base font-bold text-on-surface">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary-text"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Customer Name *</label>
                <input
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-borders/40"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Phone Number</label>
                <input
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-borders/40"
                  placeholder="e.g. +1 (555) 234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  type="tel"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Email Address</label>
                <input
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-borders/40"
                  placeholder="e.g. aarav@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Delivery Address</label>
                <textarea
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none border border-borders/40"
                  placeholder="Street address, city, state, zip"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-surface-tint shadow-sm"
                >
                  {editingCustomer ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl overflow-hidden flex flex-col p-6 text-center gap-4 border border-borders animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Delete Customer?</h3>
              <p className="text-xs text-secondary-text mt-1">
                Are you sure you want to remove <strong>{deleteTarget.name}</strong> from the database? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 rounded-lg text-xs font-semibold text-on-surface bg-surface-container-low hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-error text-on-error text-xs font-semibold hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

