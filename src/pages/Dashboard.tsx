import { useState } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Activity, CheckCircle, Leaf, DollarSign, Globe, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import dashboardAnalytics from "@/assets/dashboard-analytics.png";

const kpis = [
  { icon: Users, value: "35,24,180", label: "Total Beneficiaries Served", color: "secondary" as const },
  { icon: TrendingUp, value: "6,482 MT", label: "Total Grain Distributed", color: "success" as const },
  { icon: Activity, value: "12,847", label: "Active Transactions", color: "primary" as const },
  { icon: CheckCircle, value: "94.7%", label: "OTIF Delivery Rate", color: "warning" as const },
];

const commodityData = [
  { block: "Block 1", rice: 95, wheat: 120 },
  { block: "Block 3", rice: 110, wheat: 85 },
  { block: "Block 7", rice: 130, wheat: 140 },
  { block: "Block 12", rice: 75, wheat: 60 },
  { block: "Block 15", rice: 90, wheat: 100 },
  { block: "Block 18", rice: 105, wheat: 95 },
];

const monthlyGrain = [
  { month: "Oct", volume: 5800 },
  { month: "Nov", volume: 6100 },
  { month: "Dec", volume: 5900 },
  { month: "Jan", volume: 6300 },
  { month: "Feb", volume: 6500 },
  { month: "Mar", volume: 6482 },
];

const coverageData = [
  { name: "Availed", value: 2850000, color: "hsl(142, 71%, 45%)" },
  { name: "Non-Availed", value: 674180, color: "hsl(214, 32%, 91%)" },
];

const authData = [
  { month: "Oct", regular: 4200, portability: 800 },
  { month: "Nov", regular: 4500, portability: 950 },
  { month: "Dec", regular: 4300, portability: 1100 },
  { month: "Jan", regular: 4800, portability: 1200 },
  { month: "Feb", regular: 5100, portability: 1350 },
  { month: "Mar", regular: 5200, portability: 1400 },
];

const dailyTx = [
  { day: "Mon", tx: 1820 }, { day: "Tue", tx: 2100 }, { day: "Wed", tx: 1950 },
  { day: "Thu", tx: 2300 }, { day: "Fri", tx: 2450 }, { day: "Sat", tx: 2680 }, { day: "Sun", tx: 1547 },
];

const stockAvail = [
  { item: "Wheat", qty: 420 },
  { item: "Rice", qty: 380 },
  { item: "Sugar", qty: 85 },
  { item: "Kerosene", qty: 120 },
  { item: "Pulses", qty: 65 },
];

const blockchainTx = [
  { month: "Oct", tx: 9800 },
  { month: "Nov", tx: 10500 },
  { month: "Dec", tx: 11200 },
  { month: "Jan", tx: 11800 },
  { month: "Feb", tx: 12400 },
  { month: "Mar", tx: 12847 },
];

const recentTransactions = [
  { id: "TX-78234", type: "Dispatch", from: "Central Warehouse", to: "Block 7 DC", qty: "42 MT", status: "Confirmed" },
  { id: "TX-78233", type: "Delivery", from: "Block 3 DC", to: "Beneficiaries", qty: "18 MT", status: "In Transit" },
  { id: "TX-78232", type: "Dispatch", from: "P&SC Center A", to: "Block 12 DC", qty: "35 MT", status: "Confirmed" },
  { id: "TX-78231", type: "Receipt", from: "Block 1 DC", to: "Verified", qty: "28 MT", status: "Delivered" },
  { id: "TX-78230", type: "Dispatch", from: "Central Warehouse", to: "Block 15 DC", qty: "50 MT", status: "Pending" },
];

const statusColor: Record<string, string> = {
  Confirmed: "bg-success/10 text-success",
  "In Transit": "bg-secondary/10 text-secondary",
  Delivered: "bg-success/10 text-success",
  Pending: "bg-muted text-muted-foreground",
};

const activeFeed = [
  { id: "TX-78235", action: "Grain Dispatch", node: "GodownOrg", time: "2s ago" },
  { id: "TX-78234", action: "QR Scan Verified", node: "P&SCOrg", time: "15s ago" },
  { id: "TX-78233", action: "Packet Delivered", node: "DCOrg", time: "32s ago" },
  { id: "TX-78232", action: "Stock Receipt", node: "GodownOrg", time: "1m ago" },
  { id: "TX-78231", action: "Beneficiary Auth", node: "DCOrg", time: "2m ago" },
];

const CHART_GRID = "hsl(214, 32%, 91%)";
const CHART_TICK = "hsl(215, 16%, 47%)";
const BLUE = "hsl(217, 91%, 60%)";
const DEEP_BLUE = "hsl(224, 69%, 33%)";
const TEAL = "hsl(168, 84%, 64%)";
const GREEN = "hsl(142, 71%, 45%)";
const AMBER = "hsl(38, 92%, 50%)";

const Dashboard = () => (
  <Layout>
    <div className="container py-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-5">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 rounded-md bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary mb-2">
            📊 Analytics
          </span>
          <h1 className="font-display text-2xl font-black text-foreground">Operational Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time analytics for the SMART PDS network — Ranchi District</p>
        </div>
        <img src={dashboardAnalytics} alt="Dashboard analytics" width={140} height={140} className="hidden md:block w-32 h-32 object-contain animate-float" />
      </motion.div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {kpis.map((k, i) => (
          <StatCard key={k.label} {...k} delay={i * 0.08} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-5 lg:grid-cols-2 mt-6">
        <div className="rounded-xl bg-card p-5 stat-card border border-border">
          <h3 className="font-display font-bold text-foreground mb-3 text-sm">Commodity Distribution (Rice & Wheat)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={commodityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis dataKey="block" tick={{ fontSize: 10 }} stroke={CHART_TICK} />
              <YAxis tick={{ fontSize: 10 }} stroke={CHART_TICK} />
              <Tooltip />
              <Bar dataKey="wheat" fill={AMBER} radius={[4, 4, 0, 0]} name="Wheat" />
              <Bar dataKey="rice" fill={GREEN} radius={[4, 4, 0, 0]} name="Rice" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-card p-5 stat-card border border-border">
          <h3 className="font-display font-bold text-foreground mb-3 text-sm">Monthly Grain Movement (MT)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyGrain}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke={CHART_TICK} />
              <YAxis tick={{ fontSize: 10 }} stroke={CHART_TICK} />
              <Tooltip />
              <Area type="monotone" dataKey="volume" stroke={BLUE} fill={`${BLUE.slice(0, -1)}, 0.12)`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-5 lg:grid-cols-3 mt-5">
        <div className="rounded-xl bg-card p-5 stat-card border border-border">
          <h3 className="font-display font-bold text-foreground mb-3 text-sm">Beneficiary Coverage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={coverageData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value">
                {coverageData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-muted-foreground mt-1">80.9% availed their entitlements</p>
        </div>
        <div className="rounded-xl bg-card p-5 stat-card border border-border">
          <h3 className="font-display font-bold text-foreground mb-3 text-sm">Transaction Authentication</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={authData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke={CHART_TICK} />
              <YAxis tick={{ fontSize: 9 }} stroke={CHART_TICK} />
              <Tooltip />
              <Bar dataKey="regular" stackId="a" fill={DEEP_BLUE} name="Regular" />
              <Bar dataKey="portability" stackId="a" fill={TEAL} name="Portability" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-card p-5 stat-card border border-border">
          <h3 className="font-display font-bold text-foreground mb-3 text-sm">Daily Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyTx}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke={CHART_TICK} />
              <YAxis tick={{ fontSize: 9 }} stroke={CHART_TICK} />
              <Tooltip />
              <Line type="monotone" dataKey="tx" stroke={BLUE} strokeWidth={2} dot={{ r: 3, fill: BLUE }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-5 lg:grid-cols-2 mt-5">
        <div className="rounded-xl bg-card p-5 stat-card border border-border">
          <h3 className="font-display font-bold text-foreground mb-3 text-sm">Stock Availability (MT)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stockAvail} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis type="number" tick={{ fontSize: 9 }} stroke={CHART_TICK} />
              <YAxis dataKey="item" type="category" tick={{ fontSize: 10 }} stroke={CHART_TICK} width={60} />
              <Tooltip />
              <Bar dataKey="qty" fill={DEEP_BLUE} radius={[0, 4, 4, 0]} name="Quantity (MT)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-card p-5 stat-card border border-border">
          <h3 className="font-display font-bold text-foreground mb-3 text-sm">Blockchain Transaction Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={blockchainTx}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke={CHART_TICK} />
              <YAxis tick={{ fontSize: 10 }} stroke={CHART_TICK} />
              <Tooltip />
              <Line type="monotone" dataKey="tx" stroke={TEAL} strokeWidth={2} dot={{ r: 3, fill: TEAL }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CO2 + Cost Efficiency */}
      <div className="grid gap-5 lg:grid-cols-2 mt-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-xl bg-card p-6 border border-success/20 stat-card"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-success" />
            </div>
            <div>
              <h3 className="font-display text-base font-black text-foreground">CO₂ Emission Reduction</h3>
              <p className="text-xs text-muted-foreground">Optimized routes & reduced trips</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-black text-success">18.5%</span>
            <span className="text-success font-bold text-sm">↓ reduction</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">240 tons CO₂ saved this quarter</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-xl bg-card p-6 border border-secondary/20 stat-card"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-display text-base font-black text-foreground">Cost Efficiency</h3>
              <p className="text-xs text-muted-foreground">Reduced leakage & operational costs</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-black text-secondary">23.1%</span>
            <span className="text-secondary font-bold text-sm">↓ cost reduction</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">₹4.2 Cr saved through leakage prevention</p>
        </motion.div>
      </div>

      {/* Active Feed + Recent Transactions */}
      <div className="grid gap-5 lg:grid-cols-3 mt-5">
        <div className="rounded-xl bg-card p-5 stat-card border border-border">
          <h3 className="font-display font-bold text-foreground mb-3 text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-secondary" /> Active Transactions
          </h3>
          <div className="space-y-2">
            {activeFeed.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-xs font-mono text-primary font-bold">{f.id}</p>
                  <p className="text-xs text-foreground">{f.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">{f.node}</p>
                  <p className="text-[10px] text-secondary font-bold">{f.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl bg-card stat-card overflow-hidden border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-bold text-foreground text-sm">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">TX ID</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">From</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">To</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Qty</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-3 py-2.5 font-mono text-xs text-primary font-bold">{tx.id}</td>
                    <td className="px-3 py-2.5 text-xs font-medium">{tx.type}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{tx.from}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{tx.to}</td>
                    <td className="px-3 py-2.5 text-xs font-medium">{tx.qty}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${statusColor[tx.status]}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default Dashboard;
