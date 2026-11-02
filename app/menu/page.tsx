'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  id: number;
  name: string;
  category: 'Starters' | 'Main Course' | 'Desserts';
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
}

export default function MenuManagementPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Starters' as 'Starters' | 'Main Course' | 'Desserts',
    price: '',
    description: '',
    image_url: '',
    is_available: true,
  });

  const fetchItems = () => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setItems(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Starters',
      price: '',
      description: '',
      image_url: '',
      is_available: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: String(item.price),
      description: item.description,
      image_url: item.image_url,
      is_available: item.is_available,
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (id: number, current: boolean) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_available: !current }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, is_available: !current } : i))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    try {
      if (editingItem) {
        const res = await fetch('/api/menu', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            description: formData.description,
            image_url: formData.image_url || undefined,
            is_available: formData.is_available,
          }),
        });
        const data = await res.json();
        if (data.success) fetchItems();
      } else {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            description: formData.description,
            image_url: formData.image_url,
            is_available: formData.is_available,
          }),
        });
        const data = await res.json();
        if (data.success) fetchItems();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Menu Management</h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              Manage food items, categories, pricing, and live availability.
            </p>
          </div>
        </div>
          <div className="flex items-center gap-space-sm sm:gap-space-md flex-wrap sm:flex-nowrap">
            <div className="relative flex items-center flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 text-secondary-text text-[20px]">
                search
              </span>
              <input
                className="w-full bg-surface-container-lowest pl-10 pr-space-md py-2.5 rounded-xl text-xs sm:text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 shadow-sm transition-all border border-borders/60"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
              />
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:bg-surface-tint transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Add Menu Item</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Starters', 'Main Course', 'Desserts'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 sm:px-space-lg py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary'
                  : 'bg-card-background text-on-surface-variant hover:bg-surface-container-high border border-borders/40'
              }`}
            >
              {cat === 'All' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-card-background rounded-2xl p-space-md shadow-sm flex flex-col justify-between gap-space-md transition-all hover:shadow-md border border-borders/60 group"
            >
              <div className="relative h-48 rounded-xl overflow-hidden bg-surface-container">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 right-2.5 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-on-surface font-semibold shadow-sm">
                  {item.category}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-on-surface">{item.name}</span>
                  <span className="text-base font-bold text-primary">₹{item.price}</span>
                </div>
                <p className="text-xs text-secondary-text line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-space-sm border-t border-borders/40">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.is_available}
                    onChange={() => handleToggleAvailability(item.id, item.is_available)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-2 text-xs font-semibold text-on-surface-variant">
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-secondary-text hover:text-on-surface transition-colors"
                    title="Edit Item"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="w-8 h-8 rounded-lg hover:bg-error-container/30 flex items-center justify-center text-secondary-text hover:text-error transition-colors"
                    title="Delete Item"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Menu Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card-background rounded-2xl p-6 w-full max-w-lg shadow-xl flex flex-col gap-4 border border-borders animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-borders">
              <span className="text-lg font-bold text-on-surface">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary-text"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Item Name *</label>
                <input
                  className="bg-background px-3 py-2 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 border border-borders/60"
                  placeholder="e.g. Malabar Fish Curry"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Category *</label>
                  <select
                    className="bg-background px-3 py-2 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 border border-borders/60"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as 'Starters' | 'Main Course' | 'Desserts',
                      })
                    }
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Price (₹) *</label>
                  <input
                    className="bg-background px-3 py-2 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 border border-borders/60"
                    placeholder="180"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    type="number"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Description</label>
                <textarea
                  className="bg-background px-3 py-2 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 resize-none border border-borders/60"
                  placeholder="Rich and flavorful dish prepared with special herbs..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Image URL</label>
                <input
                  className="bg-background px-3 py-2 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 border border-borders/60"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  type="url"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-semibold text-on-surface-variant">Available</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-borders">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-surface-container text-on-surface-variant"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-5 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-surface-tint"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

