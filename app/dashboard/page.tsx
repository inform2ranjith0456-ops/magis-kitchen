'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  order_date: string;
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  items?: OrderItem[];
}

interface ChartPoint {
  label: string;
  fullLabel: string;
  amount: number;
  orders: number;
  change: string;
  x: number;
  y: number;
}

const weeklyData: ChartPoint[] = [
  { label: 'Mon', fullLabel: 'Monday, Oct 23', amount: 32400, orders: 98, change: '+5.2%', x: 0, y: 150 },
  { label: 'Tue', fullLabel: 'Tuesday, Oct 24', amount: 38900, orders: 114, change: '+7.8%', x: 133, y: 120 },
  { label: 'Wed', fullLabel: 'Wednesday, Oct 25', amount: 52100, orders: 156, change: '+14.1%', x: 266, y: 80 },
  { label: 'Thu', fullLabel: 'Thursday, Oct 26', amount: 47800, orders: 142, change: '+2.3%', x: 400, y: 90 },
  { label: 'Fri', fullLabel: 'Friday, Oct 27', amount: 44500, orders: 135, change: '-1.4%', x: 534, y: 100 },
  { label: 'Sat', fullLabel: 'Saturday, Oct 28', amount: 68200, orders: 210, change: '+19.5%', x: 666, y: 40 },
  { label: 'Sun', fullLabel: 'Sunday, Oct 29', amount: 76400, orders: 245, change: '+22.0%', x: 800, y: 20 },
];

const monthlyData: ChartPoint[] = [
  { label: 'Week 1', fullLabel: 'Week 1 (Oct 1 - Oct 7)', amount: 62000, orders: 280, change: '+4.5%', x: 0, y: 110 },
  { label: 'Week 2', fullLabel: 'Week 2 (Oct 8 - Oct 14)', amount: 98500, orders: 420, change: '+18.2%', x: 266, y: 40 },
  { label: 'Week 3', fullLabel: 'Week 3 (Oct 15 - Oct 21)', amount: 54200, orders: 230, change: '-6.1%', x: 534, y: 140 },
  { label: 'Week 4', fullLabel: 'Week 4 (Oct 22 - Oct 28)', amount: 108100, orders: 495, change: '+25.4%', x: 800, y: 30 },
];

export default function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(6);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const currentDataset = chartPeriod === 'weekly' ? weeklyData : monthlyData;
  const activeIndex = hoveredPointIndex !== null ? hoveredPointIndex : selectedPointIndex;
  const activePoint = currentDataset[Math.min(activeIndex, currentDataset.length - 1)] || currentDataset[0];

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrders(data.data.slice(0, 5));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickStatus = async (orderNumber: string, newStatus: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.order_number === orderNumber ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <span className="text-secondary-text text-xs uppercase tracking-wider font-semibold">
              Kitchen Operations
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Dashboard</h1>
            <p className="text-sm text-secondary-text">
              Overview of your kitchen operations, real-time analytics, and recent culinary requests.
            </p>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <button className="flex items-center gap-2 px-space-md py-2 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-container-highest transition-all text-xs sm:text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Last 7 Days</span>
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
            <button
              onClick={() => alert('Exporting dashboard report to CSV...')}
              className="flex items-center gap-2 px-space-md py-2 bg-primary text-on-primary rounded-lg hover:bg-surface-tint transition-all text-xs sm:text-sm font-medium shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden group hover:shadow-md transition-all border border-borders/50">
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary-text font-bold uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-10 h-10 rounded-xl bg-light-sage flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">orders</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-space-sm">
                <span className="text-2xl font-bold text-on-surface">1,248</span>
                <span className="text-xs text-primary font-semibold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  +12.4%
                </span>
              </div>
              <span className="text-xs text-secondary-text">vs. previous week</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden group hover:shadow-md transition-all border border-borders/50">
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary-text font-bold uppercase tracking-wider">
                Total Sales
              </span>
              <div className="w-10 h-10 rounded-xl bg-light-sage flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-space-sm">
                <span className="text-2xl font-bold text-on-surface">₹3,42,800</span>
                <span className="text-xs text-primary font-semibold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  +8.1%
                </span>
              </div>
              <span className="text-xs text-secondary-text">vs. previous week</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden group hover:shadow-md transition-all border border-borders/50">
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary-text font-bold uppercase tracking-wider">
                Total Customers
              </span>
              <div className="w-10 h-10 rounded-xl bg-light-sage flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-space-sm">
                <span className="text-2xl font-bold text-on-surface">342</span>
                <span className="text-xs text-primary font-semibold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  +4.3%
                </span>
              </div>
              <span className="text-xs text-secondary-text">New active patrons</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden group hover:shadow-md transition-all border border-borders/50">
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary-text font-bold uppercase tracking-wider">
                Menu Items
              </span>
              <div className="w-10 h-10 rounded-xl bg-light-sage flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-space-sm">
                <span className="text-2xl font-bold text-on-surface">24</span>
                <span className="text-xs text-secondary-text font-medium">All active</span>
              </div>
              <span className="text-xs text-secondary-text">Across 3 categories</span>
            </div>
          </div>
        </div>

        {/* Sales Overview Line Chart Section - Dynamic & Interactive */}
        <div className="bg-surface-container-lowest p-5 sm:p-space-xl rounded-xl shadow-sm flex flex-col gap-space-lg border border-borders/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">Sales Overview</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  Interactive
                </span>
              </div>
              <p className="text-xs sm:text-sm text-secondary-text">
                Click any point or section on the curve below to inspect exact sales &amp; volume values.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
                <button
                  onClick={() => {
                    setChartPeriod('weekly');
                    setSelectedPointIndex(6);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    chartPeriod === 'weekly'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Weekly (7 Days)
                </button>
                <button
                  onClick={() => {
                    setChartPeriod('monthly');
                    setSelectedPointIndex(3);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    chartPeriod === 'monthly'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Monthly (4 Weeks)
                </button>
              </div>
            </div>
          </div>

          {/* Active Clicked Point Metric Display Badge */}
          <div className="bg-surface-container-low/80 border border-borders rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[20px]">insights</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary-text font-semibold uppercase tracking-wider">
                    Selected Data Point
                  </span>
                  <span className="text-[11px] font-bold text-primary px-2 py-0.5 bg-light-sage rounded-full">
                    {activePoint.fullLabel}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-extrabold text-on-surface">
                    ₹{activePoint.amount.toLocaleString()}
                  </span>
                  <span
                    className={`text-xs font-bold flex items-center ${
                      activePoint.change.startsWith('+') ? 'text-primary' : 'text-error'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {activePoint.change.startsWith('+') ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                    {activePoint.change}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <div className="flex flex-col">
                <span className="text-secondary-text text-[11px]">Orders Volume</span>
                <span className="font-bold text-on-surface">{activePoint.orders} completed</span>
              </div>
              <div className="h-8 w-[1px] bg-borders/60"></div>
              <div className="flex flex-col">
                <span className="text-secondary-text text-[11px]">Avg Ticket</span>
                <span className="font-bold text-primary">
                  ₹{Math.round(activePoint.amount / activePoint.orders).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Chart Visualization Area */}
          <div className="w-full h-80 relative flex flex-col justify-between pt-4 select-none">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="w-full h-[1px] bg-borders border-dashed border-t flex justify-end pr-2 text-[10px] text-secondary-text">₹80k</div>
              <div className="w-full h-[1px] bg-borders border-dashed border-t flex justify-end pr-2 text-[10px] text-secondary-text">₹60k</div>
              <div className="w-full h-[1px] bg-borders border-dashed border-t flex justify-end pr-2 text-[10px] text-secondary-text">₹40k</div>
              <div className="w-full h-[1px] bg-borders border-dashed border-t flex justify-end pr-2 text-[10px] text-secondary-text">₹20k</div>
              <div className="w-full h-[1px] bg-borders border-t"></div>
            </div>

            <div className="w-full h-64 relative z-10 flex items-end">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 800 200"
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#789b79" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#789b79" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#456648" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Shaded Area Under Curve */}
                <path
                  d={
                    chartPeriod === 'weekly'
                      ? 'M 0,150 C 133,120 266,80 400,90 C 534,100 666,40 800,20 L 800,200 L 0,200 Z'
                      : 'M 0,110 C 266,40 534,140 800,30 L 800,200 L 0,200 Z'
                  }
                  fill="url(#salesGradient)"
                  className="transition-all duration-300"
                />

                {/* Main Dynamic Line Curve */}
                <path
                  d={
                    chartPeriod === 'weekly'
                      ? 'M 0,150 C 133,120 266,80 400,90 C 534,100 666,40 800,20'
                      : 'M 0,110 C 266,40 534,140 800,30'
                  }
                  fill="none"
                  stroke="#456648"
                  strokeLinecap="round"
                  strokeWidth="4"
                  filter="url(#glow)"
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    // Clicking anywhere along curve cycles or highlights current
                    setSelectedPointIndex((prev) => (prev + 1) % currentDataset.length);
                  }}
                />

                {/* Active Point Vertical Guideline */}
                <line
                  x1={activePoint.x}
                  y1={activePoint.y}
                  x2={activePoint.x}
                  y2={200}
                  stroke="#456648"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="transition-all duration-200 pointer-events-none"
                />

                {/* Active Point Hover/Click Floating Tooltip on SVG */}
                <g
                  transform={`translate(${Math.max(60, Math.min(740, activePoint.x))}, ${Math.max(
                    35,
                    activePoint.y - 12
                  )})`}
                  className="pointer-events-none transition-all duration-200"
                >
                  <rect
                    x="-65"
                    y="-32"
                    width="130"
                    height="28"
                    rx="8"
                    fill="#1e2c1e"
                    fillOpacity="0.95"
                    stroke="#456648"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="-14"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {activePoint.label}: ₹{activePoint.amount.toLocaleString()}
                  </text>
                  <polygon
                    points="-5,-4 5,-4 0,2"
                    fill="#1e2c1e"
                  />
                </g>

                {/* Data Points on the Curve */}
                {currentDataset.map((point, index) => {
                  const isSelected = index === (hoveredPointIndex !== null ? hoveredPointIndex : selectedPointIndex);
                  return (
                    <g key={point.label} className="cursor-pointer">
                      {/* Generous invisible click & hover target around every point */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="28"
                        fill="transparent"
                        onClick={() => setSelectedPointIndex(index)}
                        onMouseEnter={() => setHoveredPointIndex(index)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />

                      {/* Selected Pulsing Glow Ring */}
                      {isSelected && (
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="14"
                          fill="#456648"
                          fillOpacity="0.25"
                          className="animate-ping pointer-events-none"
                        />
                      )}

                      {/* Point Circle */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={isSelected ? '7' : '5'}
                        fill={isSelected ? '#456648' : '#ffffff'}
                        stroke="#456648"
                        strokeWidth={isSelected ? '3' : '2.5'}
                        className="transition-all duration-150 pointer-events-none"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-Axis Labels - Clickable to inspect values */}
            <div className="flex justify-between text-xs text-secondary-text pt-2 font-medium">
              {currentDataset.map((point, index) => {
                const isSelected = index === (hoveredPointIndex !== null ? hoveredPointIndex : selectedPointIndex);
                return (
                  <button
                    key={point.label}
                    onClick={() => setSelectedPointIndex(index)}
                    onMouseEnter={() => setHoveredPointIndex(index)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm scale-105'
                        : 'text-secondary-text hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {point.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Grid: Recent Orders & Food Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl items-start">
          {/* Recent Orders (2 Cols) */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-5 sm:p-space-xl rounded-xl shadow-sm flex flex-col gap-space-lg border border-borders/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">Recent Orders</h2>
                <p className="text-xs sm:text-sm text-secondary-text">
                  Latest culinary requests awaiting fulfillment
                </p>
              </div>
              <Link
                href="/orders"
                className="text-primary text-xs sm:text-sm font-semibold hover:underline flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-borders text-secondary-text text-xs uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-borders/40 text-on-surface">
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-surface-container-low/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-semibold text-primary">{o.order_number}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-light-sage text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {o.customer_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <span className="font-medium text-xs sm:text-sm">{o.customer_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-secondary-text text-xs">{o.order_date}</td>
                      <td className="py-3 px-3 font-semibold text-xs sm:text-sm">
                        ₹{Number(o.total_amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            o.status === 'Completed'
                              ? 'bg-light-sage text-primary'
                              : o.status === 'Processing'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-error-container text-on-error-container'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-secondary-text hover:text-on-surface"
                            title="Quick View"
                          >
                            <span className="material-symbols-outlined text-[17px]">visibility</span>
                          </button>
                          <button
                            onClick={() =>
                              handleQuickStatus(
                                o.order_number,
                                o.status === 'Completed'
                                  ? 'Pending'
                                  : o.status === 'Pending'
                                  ? 'Processing'
                                  : 'Completed'
                              )
                            }
                            className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-primary"
                            title="Advance Status"
                          >
                            <span className="material-symbols-outlined text-[17px]">check_circle</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Food Categories (1 Col) */}
          <div className="bg-surface-container-lowest p-5 sm:p-space-xl rounded-xl shadow-sm flex flex-col gap-space-lg border border-borders/50">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-on-surface">Food Categories</h2>
              <p className="text-xs sm:text-sm text-secondary-text">Popular menu divisions</p>
            </div>

            <div className="flex flex-col gap-space-sm">
              {/* Category 1 */}
              <Link
                href="/menu"
                className="flex items-center gap-space-md p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0 shadow-sm"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVvSRFQG8PBxV-fFe9aOjth57o07dulxBPBaNstj51HnOC5yuHrXYftIUlpC9COhrQkWLLv7CGiGbF6tHoomHbB3i72UKIKFP59FGk4pYceuugmHmmGSDSfygZ521RqhuNFKo2ykFVG6uz3l7Lihdhs4HC51uQCNjAR4E7np0qOk_0GPAe9xfE5nnV9J8YvU8w9Psrs9WTvnFwWgQ8XuI-kC7LSF6P__YXBZ074nc')",
                  }}
                ></div>
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    Starters
                  </span>
                  <span className="text-xs text-secondary-text">8 items available</span>
                </div>
                <span className="material-symbols-outlined text-secondary-text group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </Link>

              {/* Category 2 */}
              <Link
                href="/menu"
                className="flex items-center gap-space-md p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0 shadow-sm"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA07028MC_dTxNFT5Oa7VtXjwZ6t_etRwt2zznDItDq26LmZ-_Yyu7jcuSuRxFjzXdJQELDLZtLJaxS-IlgKKcrLI_T6MGtUdGV6n0K_i4YaxyEti77MnTdquHEwqP_EN_3HK0IZrz0oR-eAgqhAmh4JmlNAeU0R02y1ImcdvdC19mWVEvI62xF8Lz5_3nUpV00TXO71t_hxxcBDDTn-Vq9weG8_Dv0MYce4HnZK4s')",
                  }}
                ></div>
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    Main Course
                  </span>
                  <span className="text-xs text-secondary-text">12 items available</span>
                </div>
                <span className="material-symbols-outlined text-secondary-text group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </Link>

              {/* Category 3 */}
              <Link
                href="/menu"
                className="flex items-center gap-space-md p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0 shadow-sm"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAx8PM3R3AOAl7QkkPlWs9wAvYHVuAjTQ0-gJyiuxEqfMgPXdhDuq4mH-DcfHE1AGdEUySLOFJ-xuR8RLZwfLqa1v_s6VdMFhzOYySXF0b_JwtDGgxVmg0IpeTOyPxlCy75PvCEwAD4SzIAatw_ztplmwWajoj_YHRaBWz9TZOAiC5m9Dmc8mynF-UCBGeEbcNrxGtOQ6XJT7_HB8JP62R08HNUp5gZ0fSv5d9r7T4')",
                  }}
                ></div>
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    Desserts
                  </span>
                  <span className="text-xs text-secondary-text">4 items available</span>
                </div>
                <span className="material-symbols-outlined text-secondary-text group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </Link>
            </div>

            <Link
              href="/menu"
              className="w-full py-2.5 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-all text-xs sm:text-sm font-semibold text-center block"
            >
              Manage Full Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col gap-4 border border-borders animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-borders">
              <h3 className="text-lg font-bold text-on-surface">
                Order {selectedOrder.order_number} Details
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary-text"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-text">Customer:</span>
                <span className="font-semibold text-on-surface">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Order Time:</span>
                <span className="text-on-surface">{selectedOrder.order_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Status:</span>
                <span className="font-bold text-primary">{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-borders">
                <span className="font-semibold text-on-surface">Total Amount:</span>
                <span className="text-lg font-bold text-primary">
                  ₹{Number(selectedOrder.total_amount).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                href={`/orders/${selectedOrder.order_number.replace('#', '')}`}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high"
              >
                Full Order View
              </Link>
              <button
                onClick={() => setSelectedOrder(null)}
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

