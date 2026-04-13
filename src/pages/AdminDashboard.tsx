import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Package, Users, CheckCircle, AlertTriangle, TrendingUp, Shield,
  Truck, MapPin, QrCode, FileText, Eye, Blocks, Search, Clock
} from "lucide-react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CHART_GRID = "hsl(214, 32%, 91%)";
const CHART_TICK = "hsl(215, 16%, 47%)";
const AMBER = "hsl(38, 92%, 50%)";
const GREEN = "hsl(142, 71%, 45%)";

const stockData = [
  { block: "Block 1", wheat: 120, rice: 95 },
  { block: "Block 3", wheat: 85, rice: 110 },
  { block: "Block 7", wheat: 140, rice: 130 },
  { block: "Block 12", wheat: 60, rice: 75 },
  { block: "Block 15", wheat: 100, rice: 90 },
];

const anomalies = [
  { type: "Duplicate Scan", desc: "Packet PKT-8842 scanned twice at Block 7 DC", severity: "High", time: "5 min ago" },
  { type: "Geo Mismatch", desc: "Delivery at wrong location — Block 12 packet at Block 3", severity: "Critical", time: "12 min ago" },
  { type: "Quantity Mismatch", desc: "Issued 42 MT but dispatched 38 MT from Godown-2", severity: "Medium", time: "1 hr ago" },
];

const kpiData = [
  { metric: "Verified OTIF %", value: "94.7%", trend: "+2.1%" },
  { metric: "Leakage & Shrinkage %", value: "1.2%", trend: "-0.8%" },
  { metric: "CO₂ Reduction %", value: "18.5%", trend: "+3.2%" },
];

const districtView = { allocated: "6,482 MT", delivered: "6,320 MT", leakage: "1.2%", pending: 162 };

const pendingApprovals = [
  { id: "TX-78240", type: "Dispatch", from: "Central WH", qty: "50 MT", time: "10 min ago" },
  { id: "TX-78239", type: "Stock Transfer", from: "Block 3 DC", qty: "25 MT", time: "32 min ago" },
  { id: "TX-78238", type: "New Allocation", from: "P&SC Center B", qty: "40 MT", time: "1 hr ago" },
];

const pscView = [
  { name: "P&SC Alpha", dispatched: 142, delivered: 138, delays: 2, exceptions: 1 },
  { name: "P&SC Beta", dispatched: 98, delivered: 95, delays: 0, exceptions: 0 },
  { name: "P&SC Gamma", dispatched: 115, delivered: 110, delays: 3, exceptions: 2 },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState<"overview" | "analytics" | "operations">("overview");

  return (
    <Layout>
      <div className="container py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <Settings className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">System-wide monitoring, fraud detection & analytics</p>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {(["overview", "analytics", "operations"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === t ? "bg-secondary text-secondary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard icon={Users} value="35.2L" label="Total Beneficiaries" color="secondary" />
              <StatCard icon={Package} value="842 MT" label="Current Stock" delay={0.1} color="success" />
              <StatCard icon={TrendingUp} value="12,847" label="Today's Transactions" delay={0.2} color="primary" />
              <StatCard icon={AlertTriangle} value="3" label="Fraud Alerts" delay={0.3} color="warning" />
            </div>

            <div className="rounded-xl bg-card border border-destructive/20 p-5 stat-card mb-5">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Fraud & Anomaly Alerts
              </h3>
              <div className="space-y-2">
                {anomalies.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <div>
                      <p className="text-xs font-bold text-foreground">{a.type}</p>
                      <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        a.severity === "Critical" ? "bg-destructive/10 text-destructive" :
                        a.severity === "High" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                      }`}>{a.severity}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-xl bg-card p-5 stat-card border border-border">
                <h3 className="font-display font-bold text-foreground mb-3 text-sm">Stock by Block (MT)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                    <XAxis dataKey="block" tick={{ fontSize: 10 }} stroke={CHART_TICK} />
                    <YAxis tick={{ fontSize: 10 }} stroke={CHART_TICK} />
                    <Tooltip />
                    <Bar dataKey="wheat" fill={AMBER} radius={[4, 4, 0, 0]} name="Wheat" />
                    <Bar dataKey="rice" fill={GREEN} radius={[4, 4, 0, 0]} name="Rice" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="font-display font-bold text-foreground text-sm">Pending Approvals</h3>
                </div>
                <div className="divide-y divide-border">
                  {pendingApprovals.map((a) => (
                    <div key={a.id} className="p-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div>
                        <p className="font-mono text-xs text-primary font-bold">{a.id}</p>
                        <p className="text-xs text-foreground">{a.type} — {a.from}</p>
                        <p className="text-[10px] text-muted-foreground">{a.qty} · {a.time}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="rounded-lg bg-success/10 px-3 py-1.5 text-[10px] font-bold text-success hover:bg-success/20 transition-colors">Approve</button>
                        <button className="rounded-lg bg-destructive/10 px-3 py-1.5 text-[10px] font-bold text-destructive hover:bg-destructive/20 transition-colors">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "analytics" && (
          <>
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              {kpiData.map((k) => (
                <div key={k.metric} className="rounded-xl bg-card p-5 stat-card border border-border text-center">
                  <p className="text-xs font-bold text-muted-foreground">{k.metric}</p>
                  <p className="font-display text-3xl font-black text-foreground mt-1.5">{k.value}</p>
                  <p className={`text-xs font-bold mt-1 ${k.trend.startsWith("+") ? "text-success" : "text-destructive"}`}>{k.trend}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-card p-5 stat-card border border-border mb-5">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm">District View</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 rounded-lg bg-secondary/5">
                  <p className="text-xl font-black text-secondary">{districtView.allocated}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Total Allocated</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-success/5">
                  <p className="text-xl font-black text-success">{districtView.delivered}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Total Delivered</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-destructive/5">
                  <p className="text-xl font-black text-destructive">{districtView.leakage}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Leakage %</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-warning/5">
                  <p className="text-xl font-black text-warning">{districtView.pending}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Pending</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-bold text-foreground text-sm">P&SC View</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">P&SC</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Dispatched</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Delivered</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Delays</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Exceptions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pscView.map((p) => (
                      <tr key={p.name} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-2.5 text-xs font-bold">{p.name}</td>
                        <td className="px-4 py-2.5 text-xs">{p.dispatched}</td>
                        <td className="px-4 py-2.5 text-xs text-success font-bold">{p.delivered}</td>
                        <td className="px-4 py-2.5 text-xs">{p.delays > 0 ? <span className="text-warning font-bold">{p.delays}</span> : "0"}</td>
                        <td className="px-4 py-2.5 text-xs">{p.exceptions > 0 ? <span className="text-destructive font-bold">{p.exceptions}</span> : "0"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "operations" && (
          <div className="rounded-xl bg-card p-6 border border-border stat-card text-center">
            <Settings className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display text-base font-black text-foreground">Operations & Distribution Tracking</h3>
            <p className="text-xs text-muted-foreground mt-1">Admin has full access to Operator operations.</p>
            <a href="/operator" className="inline-flex mt-3 px-5 py-2 rounded-lg bg-secondary text-secondary-foreground font-bold text-xs hover:bg-secondary/90 transition-colors">
              View Operations →
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
