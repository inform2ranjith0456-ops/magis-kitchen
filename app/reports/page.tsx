'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type MetricType = 'sales' | 'orders' | 'efficiency' | 'fulfillment';
type IntervalType = 'daily' | 'weekly' | 'monthly' | 'ytd';
type CategoryType = 'all' | 'starters' | 'mains' | 'desserts' | 'beverages';
type ChartStyleType = 'curve' | 'bar';

interface GeneratedPoint {
  label: string;
  fullDate: string;
  value: number;
  orders: number;
  formattedValue: string;
  change: string;
  x: number;
  y: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<'month' | '30days' | 'ytd'>('month');

  // Input states for the Dynamic Graph Generator
  const [inputMetric, setInputMetric] = useState<MetricType>('sales');
  const [inputInterval, setInputInterval] = useState<IntervalType>('daily');
  const [inputCategory, setInputCategory] = useState<CategoryType>('all');
  const [inputChartStyle, setInputChartStyle] = useState<ChartStyleType>('curve');
  const [inputTarget, setInputTarget] = useState<number>(55000);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(6);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [generationKey, setGenerationKey] = useState<number>(1);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string>('Live Reactive');

  // Default overall metrics for Bento cards
  const metrics = {
    month: {
      sales: '₹2,84,500',
      salesTrend: '+12.4% from last month',
      orders: '1,420',
      ordersTrend: '+4.1% vs avg volume',
      completed: '1,385',
      fulfillmentRate: '97.5% fulfillment rate',
      pending: '35',
      avgTime: '14.2',
      prepTime: '9.5 mins',
      dispatchTime: '4.7 mins',
    },
    '30days': {
      sales: '₹3,11,200',
      salesTrend: '+9.8% vs previous period',
      orders: '1,560',
      ordersTrend: '+3.5% vs avg volume',
      completed: '1,518',
      fulfillmentRate: '97.3% fulfillment rate',
      pending: '42',
      avgTime: '14.8',
      prepTime: '9.8 mins',
      dispatchTime: '5.0 mins',
    },
    ytd: {
      sales: '₹31,28,000',
      salesTrend: '+28.5% year over year',
      orders: '15,820',
      ordersTrend: '+18.2% volume growth',
      completed: '15,480',
      fulfillmentRate: '97.9% fulfillment rate',
      pending: '340',
      avgTime: '13.9',
      prepTime: '9.1 mins',
      dispatchTime: '4.8 mins',
    },
  }[period];

  // Dynamic Generator: Calculate graph dataset based on current user inputs
  const generatedData = useMemo(() => {
    const categoryMultipliers: Record<CategoryType, number> = {
      all: 1.0,
      mains: 0.62,
      starters: 0.23,
      desserts: 0.11,
      beverages: 0.04,
    };
    const catMultiplier = categoryMultipliers[inputCategory];

    let labels: string[] = [];
    let fullDates: string[] = [];
    let rawValues: number[] = [];
    let ordersList: number[] = [];
    let changes: string[] = [];

    if (inputInterval === 'daily') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      fullDates = [
        'Monday, Oct 23',
        'Tuesday, Oct 24',
        'Wednesday, Oct 25',
        'Thursday, Oct 26',
        'Friday, Oct 27',
        'Saturday, Oct 28',
        'Sunday, Oct 29',
      ];
      if (inputMetric === 'sales') {
        rawValues = [32400, 38900, 52100, 47800, 44500, 68200, 76400].map((v) => Math.round(v * catMultiplier));
      } else if (inputMetric === 'orders') {
        rawValues = [104, 118, 156, 142, 135, 210, 245].map((v) => Math.round(v * catMultiplier));
      } else if (inputMetric === 'efficiency') {
        rawValues = [14.2, 13.8, 15.5, 14.1, 13.9, 17.2, 16.8];
      } else {
        rawValues = [97.5, 98.2, 96.8, 97.9, 98.4, 96.2, 97.1];
      }
      ordersList = [104, 118, 156, 142, 135, 210, 245].map((v) => Math.round(v * catMultiplier));
      changes = ['+5.2%', '+7.8%', '+14.1%', '+2.3%', '-1.4%', '+19.5%', '+22.0%'];
    } else if (inputInterval === 'weekly') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      fullDates = ['Oct 1 - Oct 7', 'Oct 8 - Oct 14', 'Oct 15 - Oct 21', 'Oct 22 - Oct 28'];
      if (inputMetric === 'sales') {
        rawValues = [220000, 265000, 248000, 312000].map((v) => Math.round(v * catMultiplier));
      } else if (inputMetric === 'orders') {
        rawValues = [710, 840, 790, 995].map((v) => Math.round(v * catMultiplier));
      } else if (inputMetric === 'efficiency') {
        rawValues = [14.5, 14.0, 14.3, 13.8];
      } else {
        rawValues = [97.1, 97.8, 97.4, 98.2];
      }
      ordersList = [710, 840, 790, 995].map((v) => Math.round(v * catMultiplier));
      changes = ['+4.2%', '+12.5%', '-3.1%', '+21.4%'];
    } else if (inputInterval === 'monthly') {
      labels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      fullDates = ['May 2023', 'June 2023', 'July 2023', 'August 2023', 'September 2023', 'October 2023'];
      if (inputMetric === 'sales') {
        rawValues = [940000, 1020000, 1150000, 1080000, 1260000, 1420000].map((v) => Math.round(v * catMultiplier));
      } else if (inputMetric === 'orders') {
        rawValues = [3050, 3280, 3650, 3420, 4010, 4520].map((v) => Math.round(v * catMultiplier));
      } else if (inputMetric === 'efficiency') {
        rawValues = [15.1, 14.8, 14.4, 14.6, 14.1, 13.9];
      } else {
        rawValues = [96.5, 96.8, 97.2, 97.0, 97.6, 97.9];
      }
      ordersList = [3050, 3280, 3650, 3420, 4010, 4520].map((v) => Math.round(v * catMultiplier));
      changes = ['+3.1%', '+8.5%', '+12.7%', '-6.0%', '+16.6%', '+12.7%'];
    } else {
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      fullDates = ['Q1 (Jan - Mar)', 'Q2 (Apr - Jun)', 'Q3 (Jul - Sep)', 'Q4 (Oct - Dec)'];
      if (inputMetric === 'sales') {
        rawValues = [2850000, 3210000, 3540000, 4280000].map((v) => Math.round(v * catMultiplier));
      } else if (inputMetric === 'orders') {
        rawValues = [9150, 10200, 11300, 13600].map((v) => Math.round(v * catMultiplier));
      } else if (inputMetric === 'efficiency') {
        rawValues = [15.4, 14.8, 14.3, 13.9];
      } else {
        rawValues = [96.2, 96.9, 97.4, 98.0];
      }
      ordersList = [9150, 10200, 11300, 13600].map((v) => Math.round(v * catMultiplier));
      changes = ['+8.4%', '+12.6%', '+10.3%', '+20.9%'];
    }

    const minVal = Math.min(...rawValues);
    const maxVal = Math.max(...rawValues);
    const valRange = maxVal - minVal || 1;

    const points: GeneratedPoint[] = labels.map((lbl, idx) => {
      const val = rawValues[idx];
      const count = labels.length;
      const x = count === 1 ? 400 : Math.round(40 + (idx / (count - 1)) * 720);
      // Normalized between y = 175 (bottom) and y = 35 (top)
      const y = Math.round(175 - ((val - minVal) / valRange) * 140);

      let formatted = '';
      if (inputMetric === 'sales') {
        formatted = `₹${val.toLocaleString()}`;
      } else if (inputMetric === 'orders') {
        formatted = `${val.toLocaleString()} Orders`;
      } else if (inputMetric === 'efficiency') {
        formatted = `${val} mins`;
      } else {
        formatted = `${val}%`;
      }

      return {
        label: lbl,
        fullDate: fullDates[idx],
        value: val,
        orders: ordersList[idx],
        formattedValue: formatted,
        change: changes[idx],
        x,
        y,
      };
    });

    const sum = rawValues.reduce((a, b) => a + b, 0);
    const avg = Math.round((sum / rawValues.length) * 10) / 10;
    const peak = points.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), points[0]);
    const lowest = points.reduce((prev, curr) => (curr.value < prev.value ? curr : prev), points[0]);

    // Target benchmark coordinate
    const targetY = Math.max(20, Math.min(185, Math.round(175 - ((inputTarget - minVal) / valRange) * 140)));

    // Spline curve path
    let curvePath = '';
    if (points.length > 0) {
      curvePath = `M ${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cx1 = p0.x + (p1.x - p0.x) / 2;
        const cy1 = p0.y;
        const cx2 = p0.x + (p1.x - p0.x) / 2;
        const cy2 = p1.y;
        curvePath += ` C ${cx1},${cy1} ${cx2},${cy2} ${p1.x},${p1.y}`;
      }
    }

    const areaPath = curvePath
      ? `${curvePath} L ${points[points.length - 1].x},190 L ${points[0].x},190 Z`
      : '';

    return {
      points,
      minVal,
      maxVal,
      sum,
      avg,
      peak,
      lowest,
      targetY,
      curvePath,
      areaPath,
    };
  }, [inputMetric, inputInterval, inputCategory, inputTarget]);

  // Handle Generate Graph action button
  const handleGenerateGraph = () => {
    setGenerationKey((k) => k + 1);
    setSelectedPointIndex(generatedData.points.length - 1);
    const now = new Date();
    setLastGeneratedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Adjust default target when metric changes
  const handleMetricChange = (newMetric: MetricType) => {
    setInputMetric(newMetric);
    if (newMetric === 'sales') {
      setInputTarget(inputInterval === 'daily' ? 55000 : inputInterval === 'weekly' ? 260000 : 1200000);
    } else if (newMetric === 'orders') {
      setInputTarget(inputInterval === 'daily' ? 160 : inputInterval === 'weekly' ? 800 : 3500);
    } else if (newMetric === 'efficiency') {
      setInputTarget(14.0);
    } else {
      setInputTarget(97.5);
    }
  };

  const activeInspectPoint =
    hoveredPointIndex !== null
      ? generatedData.points[hoveredPointIndex]
      : selectedPointIndex !== null && selectedPointIndex < generatedData.points.length
      ? generatedData.points[selectedPointIndex]
      : generatedData.points[generatedData.points.length - 1];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Period/Date,Value,Orders,Growth',
        ...generatedData.points.map((p) => `"${p.fullDate}","${p.formattedValue}",${p.orders},"${p.change}"`),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `magis-kitchen-${inputMetric}-${inputInterval}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 gap-6">
      {/* Top Bar / Header Info with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <span className="text-xs uppercase font-semibold tracking-wider text-secondary-text block">
              Analytics &amp; Intelligence
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Kitchen Performance Reports</h1>
            <p className="text-sm text-secondary-text">
              Generate custom analytics graphs, inspect sales curves, and track fulfillment metrics.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-surface-container-low rounded-lg p-1 border border-borders/50">
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                period === 'month'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod('30days')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                period === '30days'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setPeriod('ytd')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                period === 'ytd'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Year to Date
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-surface-tint shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Generated Data
          </button>
        </div>
      </div>

      {/* Summary Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-borders/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Total Sales
            </span>
            <div className="w-10 h-10 rounded-lg bg-light-sage flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-on-surface">{metrics.sales}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>{metrics.salesTrend}</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-borders/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-lg bg-light-sage flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">orders</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-on-surface">{metrics.orders}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-secondary-text font-medium">
              <span className="material-symbols-outlined text-[16px]">remove</span>
              <span>{metrics.ordersTrend}</span>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-borders/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Completed Orders
            </span>
            <div className="w-10 h-10 rounded-lg bg-light-sage flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-on-surface">{metrics.completed}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>{metrics.fulfillmentRate}</span>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-borders/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-on-surface">{metrics.pending}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-medium">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Requires attention</span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC GRAPH GENERATOR SECTION BASED ON INPUTS */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-borders/60 p-5 sm:p-7 flex flex-col gap-6">
        {/* Section Title & Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borders/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[22px]">auto_graph</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                  Dynamic Performance Graph Generator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  Custom Input Engine
                </span>
              </div>
              <p className="text-xs text-secondary-text">
                Customize inputs below to generate dynamic performance curves with real-time value inspection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-secondary-text self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Status: <strong className="text-on-surface">{lastGeneratedAt}</strong></span>
          </div>
        </div>

        {/* INPUT CONTROLS PANEL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-surface-container-low/70 p-4 sm:p-5 rounded-xl border border-borders/50">
          {/* Input 1: Metric */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">analytics</span>
              Metric
            </label>
            <select
              value={inputMetric}
              onChange={(e) => handleMetricChange(e.target.value as MetricType)}
              className="w-full bg-surface-container-lowest border border-borders/70 text-on-surface text-xs sm:text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="sales">Sales Revenue (₹)</option>
              <option value="orders">Order Volume (Count)</option>
              <option value="efficiency">Avg Prep Speed (Mins)</option>
              <option value="fulfillment">Fulfillment Rate (%)</option>
            </select>
          </div>

          {/* Input 2: Time Horizon / Frequency */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">date_range</span>
              Timeline Range
            </label>
            <select
              value={inputInterval}
              onChange={(e) => setInputInterval(e.target.value as IntervalType)}
              className="w-full bg-surface-container-lowest border border-borders/70 text-on-surface text-xs sm:text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="daily">Daily (Last 7 Days)</option>
              <option value="weekly">Weekly (Last 4 Weeks)</option>
              <option value="monthly">Monthly (Last 6 Months)</option>
              <option value="ytd">Quarterly (Year to Date)</option>
            </select>
          </div>

          {/* Input 3: Menu Category Focus */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">restaurant_menu</span>
              Category Division
            </label>
            <select
              value={inputCategory}
              onChange={(e) => setInputCategory(e.target.value as CategoryType)}
              className="w-full bg-surface-container-lowest border border-borders/70 text-on-surface text-xs sm:text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Divisions (Full Kitchen)</option>
              <option value="mains">Main Courses (62% vol)</option>
              <option value="starters">Starters &amp; Appetizers</option>
              <option value="desserts">Desserts &amp; Confections</option>
              <option value="beverages">Beverages &amp; Refreshments</option>
            </select>
          </div>

          {/* Input 4: Chart Style View */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">brush</span>
              Graph Format
            </label>
            <div className="flex items-center bg-surface-container-lowest border border-borders/70 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setInputChartStyle('curve')}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  inputChartStyle === 'curve'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-secondary-text hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">show_chart</span>
                Curve
              </button>
              <button
                type="button"
                onClick={() => setInputChartStyle('bar')}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  inputChartStyle === 'bar'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-secondary-text hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">bar_chart</span>
                Bars
              </button>
            </div>
          </div>

          {/* Input 5: Action Button / Generate Trigger */}
          <div className="flex flex-col gap-1.5 justify-end">
            <button
              type="button"
              onClick={handleGenerateGraph}
              className="w-full bg-primary hover:bg-surface-tint text-on-primary font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Generate Graph</span>
            </button>
          </div>
        </div>

        {/* GENERATED GRAPH METRICS SUMMARY BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low/40 p-3.5 rounded-xl border border-borders/40">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-secondary-text uppercase">
              {inputMetric === 'sales' ? 'Total Period Sales' : inputMetric === 'orders' ? 'Total Orders' : 'Average Rate'}
            </span>
            <span className="text-base sm:text-lg font-bold text-on-surface">
              {inputMetric === 'sales'
                ? `₹${generatedData.sum.toLocaleString()}`
                : inputMetric === 'orders'
                ? `${generatedData.sum.toLocaleString()} orders`
                : `${generatedData.avg}${inputMetric === 'efficiency' ? ' mins' : '%'}`}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-secondary-text uppercase">Peak High</span>
            <span className="text-base sm:text-lg font-bold text-primary">
              {generatedData.peak?.formattedValue} ({generatedData.peak?.label})
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-secondary-text uppercase">Lowest Dip</span>
            <span className="text-base sm:text-lg font-bold text-secondary-text">
              {generatedData.lowest?.formattedValue} ({generatedData.lowest?.label})
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-secondary-text uppercase">Target Benchmark</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={inputTarget}
                onChange={(e) => setInputTarget(Number(e.target.value) || 0)}
                className="w-24 bg-surface-container-lowest border border-borders/80 rounded px-1.5 py-0.5 text-xs font-bold text-on-surface focus:outline-none"
              />
              <span className="text-[10px] text-secondary-text">Goal</span>
            </div>
          </div>
        </div>

        {/* CLICKED POINT INSPECTION CARD */}
        {activeInspectPoint && (
          <div className="bg-light-sage/60 border border-primary/20 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[18px]">ads_click</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-secondary-text font-bold uppercase tracking-wider">
                  Inspecting Data Point
                </span>
                <span className="text-sm font-extrabold text-on-surface">
                  {activeInspectPoint.fullDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5 sm:gap-8">
              <div className="flex flex-col">
                <span className="text-[11px] text-secondary-text font-medium">Metric Value</span>
                <span className="text-base font-extrabold text-primary">
                  {activeInspectPoint.formattedValue}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-secondary-text font-medium">Volume</span>
                <span className="text-sm font-bold text-on-surface">
                  {activeInspectPoint.orders} Orders
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-secondary-text font-medium">Variance</span>
                <span
                  className={`text-xs font-bold flex items-center ${
                    activeInspectPoint.change.startsWith('+') ? 'text-primary' : 'text-error'
                  }`}
                >
                  {activeInspectPoint.change}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC SVG GRAPH CANVAS */}
        <div key={generationKey} className="w-full h-80 relative flex flex-col justify-between pt-4 select-none">
          {/* Background Grid Lines & Benchmark Line */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="w-full h-[1px] bg-borders border-dashed border-t flex justify-end pr-2 text-[10px] text-secondary-text">
              High: {generatedData.maxVal.toLocaleString()}
            </div>
            <div className="w-full h-[1px] bg-borders border-dashed border-t"></div>
            <div className="w-full h-[1px] bg-borders border-dashed border-t"></div>
            <div className="w-full h-[1px] bg-borders border-dashed border-t flex justify-end pr-2 text-[10px] text-secondary-text">
              Low: {generatedData.minVal.toLocaleString()}
            </div>
            <div className="w-full h-[1px] bg-borders border-t"></div>
          </div>

          <div className="w-full h-64 relative z-10 flex items-end">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="reportGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#456648" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#456648" stopOpacity="0.0" />
                </linearGradient>
                <filter id="reportGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#456648" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Target Benchmark Line */}
              {generatedData.targetY >= 20 && generatedData.targetY <= 185 && (
                <g className="pointer-events-none">
                  <line
                    x1="20"
                    y1={generatedData.targetY}
                    x2="780"
                    y2={generatedData.targetY}
                    stroke="#b45309"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    opacity="0.75"
                  />
                  <text
                    x="775"
                    y={generatedData.targetY - 5}
                    textAnchor="end"
                    fill="#b45309"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    Goal: {inputTarget.toLocaleString()}
                  </text>
                </g>
              )}

              {/* Render either Curve or Bars based on inputChartStyle */}
              {inputChartStyle === 'curve' ? (
                <>
                  {/* Shaded Area Under Curve */}
                  <path d={generatedData.areaPath} fill="url(#reportGrad)" className="transition-all duration-300" />

                  {/* Spline Curve Line */}
                  <path
                    d={generatedData.curvePath}
                    fill="none"
                    stroke="#456648"
                    strokeLinecap="round"
                    strokeWidth="4"
                    filter="url(#reportGlow)"
                    className="transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedPointIndex((prev) => ((prev ?? 0) + 1) % generatedData.points.length);
                    }}
                  />

                  {/* Active Point Guideline */}
                  {activeInspectPoint && (
                    <line
                      x1={activeInspectPoint.x}
                      y1={activeInspectPoint.y}
                      x2={activeInspectPoint.x}
                      y2={190}
                      stroke="#456648"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="pointer-events-none transition-all duration-150"
                    />
                  )}

                  {/* Active Point Floating Tooltip on Canvas */}
                  {activeInspectPoint && (
                    <g
                      transform={`translate(${Math.max(70, Math.min(730, activeInspectPoint.x))}, ${Math.max(
                        35,
                        activeInspectPoint.y - 12
                      )})`}
                      className="pointer-events-none transition-all duration-150"
                    >
                      <rect
                        x="-70"
                        y="-30"
                        width="140"
                        height="26"
                        rx="6"
                        fill="#1e2c1e"
                        fillOpacity="0.95"
                        stroke="#456648"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-13"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {activeInspectPoint.label}: {activeInspectPoint.formattedValue}
                      </text>
                      <polygon points="-4,-4 4,-4 0,1" fill="#1e2c1e" />
                    </g>
                  )}

                  {/* Curve Data Points */}
                  {generatedData.points.map((point, index) => {
                    const isSelected =
                      index === (hoveredPointIndex !== null ? hoveredPointIndex : selectedPointIndex);
                    return (
                      <g key={point.label} className="cursor-pointer">
                        {/* Generous Clickable Hit Area */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="26"
                          fill="transparent"
                          onClick={() => setSelectedPointIndex(index)}
                          onMouseEnter={() => setHoveredPointIndex(index)}
                          onMouseLeave={() => setHoveredPointIndex(null)}
                        />

                        {/* Selected Pulsing Ring */}
                        {isSelected && (
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="14"
                            fill="#456648"
                            fillOpacity="0.3"
                            className="animate-ping pointer-events-none"
                          />
                        )}

                        {/* Point Marker */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={isSelected ? '7' : '5'}
                          fill={isSelected ? '#456648' : '#ffffff'}
                          stroke="#456648"
                          strokeWidth={isSelected ? '3' : '2'}
                          className="transition-all duration-150 pointer-events-none"
                        />
                      </g>
                    );
                  })}
                </>
              ) : (
                /* Bar Chart Columns */
                generatedData.points.map((point, index) => {
                  const isSelected =
                    index === (hoveredPointIndex !== null ? hoveredPointIndex : selectedPointIndex);
                  const barWidth = Math.max(24, Math.min(60, 600 / generatedData.points.length));
                  const barHeight = Math.max(10, 190 - point.y);

                  return (
                    <g
                      key={point.label}
                      className="cursor-pointer group"
                      onClick={() => setSelectedPointIndex(index)}
                      onMouseEnter={() => setHoveredPointIndex(index)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    >
                      {/* Bar Rectangle */}
                      <rect
                        x={point.x - barWidth / 2}
                        y={point.y}
                        width={barWidth}
                        height={barHeight}
                        rx="6"
                        fill={isSelected ? '#456648' : '#789b79'}
                        opacity={isSelected ? 1 : 0.75}
                        className="transition-all duration-200 hover:opacity-100"
                      />
                      {/* Value label on top of bar */}
                      <text
                        x={point.x}
                        y={point.y - 8}
                        textAnchor="middle"
                        fill={isSelected ? '#456648' : '#71786e'}
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {point.formattedValue}
                      </text>
                    </g>
                  );
                })
              )}
            </svg>
          </div>

          {/* Interactive X-Axis Clickable Buttons */}
          <div className="flex justify-between text-xs text-secondary-text pt-2 font-medium">
            {generatedData.points.map((point, index) => {
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

      {/* Additional Section: Category Value Split & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average Price By Category */}
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl shadow-sm border border-borders/50 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Average Price By Category</h2>
            <p className="text-xs text-secondary-text mt-0.5">Mean ticket value per menu section</p>
          </div>

          <div className="flex flex-col gap-5 my-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-on-surface">Starters</span>
                <span className="text-secondary-text text-xs">₹350 avg</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-on-surface">Main Course</span>
                <span className="text-secondary-text text-xs">₹850 avg</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-on-surface">Desserts</span>
                <span className="text-secondary-text text-xs">₹280 avg</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-on-surface">Beverages</span>
                <span className="text-secondary-text text-xs">₹180 avg</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-3.5 rounded-lg flex items-center justify-between border border-borders/50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
              <span className="text-xs text-on-surface font-medium">
                Main courses drive 62% of total kitchen revenue volume.
              </span>
            </div>
          </div>
        </div>

        {/* Top Selling Items Table (2 cols) */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-5 sm:p-6 rounded-xl shadow-sm border border-borders/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Top Performing Kitchen Items</h2>
              <span className="text-xs text-secondary-text">Ranked by volume &amp; culinary demand</span>
            </div>
            <span className="text-xs font-semibold text-primary">Live Leaderboard</span>
          </div>

          <div className="flex flex-col divide-y divide-borders/40">
            {/* Item 1 */}
            <div className="flex items-center justify-between py-3.5 hover:bg-surface-container-low px-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-borders shadow-sm"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80')`,
                  }}
                ></div>
                <div>
                  <div className="font-bold text-on-surface text-sm">Truffle Herb Risotto</div>
                  <span className="text-xs text-secondary-text">Main Course • 420 orders</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-on-surface text-sm">₹1,24,000</div>
                <span className="text-xs text-primary font-semibold">+15% this week</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between py-3.5 hover:bg-surface-container-low px-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-borders shadow-sm"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=200&q=80')`,
                  }}
                ></div>
                <div>
                  <div className="font-bold text-on-surface text-sm">Artisan Garlic Bruschetta</div>
                  <span className="text-xs text-secondary-text">Starters • 350 orders</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-on-surface text-sm">₹68,500</div>
                <span className="text-xs text-primary font-semibold">+8% this week</span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center justify-between py-3.5 hover:bg-surface-container-low px-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-borders shadow-sm"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=200&q=80')`,
                  }}
                ></div>
                <div>
                  <div className="font-bold text-on-surface text-sm">Molten Lava Cake</div>
                  <span className="text-xs text-secondary-text">Desserts • 310 orders</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-on-surface text-sm">₹42,000</div>
                <span className="text-xs text-secondary-text font-medium">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
