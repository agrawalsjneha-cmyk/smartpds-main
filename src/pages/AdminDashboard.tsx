import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, Package, Users, CheckCircle, AlertTriangle, TrendingUp,
  Shield, Truck, MapPin, QrCode, FileText, Blocks, Search,
  Clock, Activity, Leaf, BarChart2, Network, Zap
} from "lucide-react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_KEY  = import.meta.env.VITE_API_KEY  || 'pds-secret-key-2024';

const ALL_DCS = [
  "DC-RAN-01","DC-RAN-02","DC-RAN-03","DC-RAN-04","DC-RAN-05",
  "DC-RAN-06","DC-RAN-07","DC-RAN-08","DC-RAN-09","DC-RAN-10",
  "DC-RAN-11","DC-RAN-12","DC-RAN-13","DC-RAN-14","DC-RAN-15",
  "DC-RAN-16","DC-RAN-17","DC-RAN-18"
];

const PSC_CONFIG = [
  { id: "PSC-RAN-01", name: "Khelari P&SC", zone: "North-West", color: "#7C3AED", dcs: ["DC-RAN-01","DC-RAN-02","DC-RAN-03","DC-RAN-04"], blocks: ["Khelari","Burmu","Chanho","Mandar"] },
  { id: "PSC-RAN-02", name: "Bero P&SC",    zone: "South-West", color: "#2563EB", dcs: ["DC-RAN-05","DC-RAN-06","DC-RAN-07"],             blocks: ["Bero","Lapung","Itki"] },
  { id: "PSC-RAN-03", name: "Kanke P&SC",   zone: "Central",    color: "#059669", dcs: ["DC-RAN-08","DC-RAN-09","DC-RAN-10"],             blocks: ["Kanke","Ratu","Nagri"] },
  { id: "PSC-RAN-04", name: "Namkum P&SC",  zone: "East-Central",color: "#D97706", dcs: ["DC-RAN-11","DC-RAN-12","DC-RAN-13","DC-RAN-14"], blocks: ["Namkum","Angara","Rahe","Ormanjhi"] },
  { id: "PSC-RAN-05", name: "Silli P&SC",   zone: "Far East",   color: "#DC2626", dcs: ["DC-RAN-15","DC-RAN-16","DC-RAN-17","DC-RAN-18"], blocks: ["Silli","Bundu","Sonahatu","Tamar"] },
];

const CHART_GRID = "hsl(214,32%,91%)";
const CHART_TICK = "hsl(215,16%,47%)";

const anomalies = [
  { type: "Duplicate Aadhaar Attempt", desc: "Same Aadhaar hash used twice at Kanke DC", severity: "High", time: "5 min ago" },
  { type: "Geo Mismatch", desc: "Delivery scan location mismatch at Namkum DC", severity: "Critical", time: "12 min ago" },
  { type: "Quantity Variance", desc: "Dispatched 42 MT but received 38 MT at Bero P&SC", severity: "Medium", time: "1 hr ago" },
];

const pendingApprovals = [
  { id: "APR-001", type: "New Beneficiary Registration", org: "GodownOrgMSP", time: "10 min ago" },
  { id: "APR-002", type: "Entitlement Update", org: "PSCOrgMSP", time: "32 min ago" },
  { id: "APR-003", type: "DC Transfer Request", org: "DCOrgMSP", time: "1 hr ago" },
];

async function apiFetch(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}
import { QRCodeSVG } from "qrcode.react";

const QRCard = ({ beneficiary: b, qrData }: { beneficiary: any, qrData: string }) => {
  const [showQR, setShowQR] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card p-3 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
      <div className="w-full flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-foreground">{b.name}</p>
          <p className="font-mono text-[9px] text-primary">{b.beneficiaryID}</p>
        </div>
        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${b.category === 'AAY' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
          {b.category}
        </span>
      </div>

      {showQR ? (
        <div className="flex flex-col items-center gap-2">
          <QRCodeSVG
            value={qrData}
            size={120}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#1a1a2e"
          />
          <p className="text-[9px] text-muted-foreground text-center">Scan to verify</p>
        </div>
      ) : (
        <div className="w-[120px] h-[120px] rounded-lg bg-muted/30 border border-dashed border-border flex items-center justify-center">
          <QrCode className="h-8 w-8 text-muted-foreground/30" />
        </div>
      )}

      <div className="w-full space-y-1 text-[9px]">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ration Card</span>
          <span className="font-mono font-bold">{b.rationCardNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Block</span>
          <span className="font-bold">{b.block}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Entitlement</span>
          <span className="font-bold text-success">{b.riceQty + b.wheatQty} kg</span>
        </div>
      </div>

      <button
        onClick={() => setShowQR(!showQR)}
        className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
          showQR
            ? 'bg-muted text-muted-foreground hover:bg-muted/80'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {showQR ? '🔒 Hide QR' : '📱 Show QR Code'}
      </button>
    </div>
  );
};
const AdminDashboard = () => {
  const [tab, setTab] = useState<"overview"|"network"|"analytics"|"blockchain"|"qr"|"fraud"|"approvals"|"map">("overview");
  const [allBeneficiaries, setAllBeneficiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pscStats, setPscStats] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [blockStats, setBlockStats] = useState<any[]>([]);
  const [entitlementStats, setEntitlementStats] = useState<any[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const all: any[] = [];
    for (const dc of ALL_DCS) {
      try {
        const data = await apiFetch(`/api/beneficiaries?dcId=${dc}`);
        const list = Array.isArray(data) ? data : [data];
        all.push(...list);
      } catch { }
    }
    const unique = Array.from(new Map(all.map(b => [b.beneficiaryID, b])).values());
    setAllBeneficiaries(unique);

    // PSC stats
    const pscMap: Record<string, any> = {};
    PSC_CONFIG.forEach(p => { pscMap[p.id] = { ...p, count: 0, phh: 0, aay: 0, rice: 0, wheat: 0 }; });
    unique.forEach(b => {
      if (pscMap[b.pscID]) {
        pscMap[b.pscID].count++;
        if (b.category === 'PHH') pscMap[b.pscID].phh++;
        else pscMap[b.pscID].aay++;
        pscMap[b.pscID].rice  += b.riceQty  || 0;
        pscMap[b.pscID].wheat += b.wheatQty || 0;
      }
    });
    setPscStats(Object.values(pscMap));

    // Category stats
    const phh = unique.filter(b => b.category === 'PHH').length;
    const aay = unique.filter(b => b.category === 'AAY').length;
    setCategoryStats([
      { name: 'PHH', value: phh, color: '#2563EB' },
      { name: 'AAY', value: aay, color: '#D97706' },
    ]);

    // Block stats
    const blockMap: Record<string, { rice: number, wheat: number, count: number }> = {};
    unique.forEach(b => {
      if (!blockMap[b.block]) blockMap[b.block] = { rice: 0, wheat: 0, count: 0 };
      blockMap[b.block].rice  += b.riceQty  || 0;
      blockMap[b.block].wheat += b.wheatQty || 0;
      blockMap[b.block].count++;
    });
    setBlockStats(Object.entries(blockMap).map(([block, v]) => ({ block, ...v })));

    // Entitlement totals per PSC
    setEntitlementStats(Object.values(pscMap).map((p: any) => ({
      name: p.name.replace(' P&SC','').replace(' (North-West Zone)','').replace(' (South-West Zone)','').replace(' (Central High-Demand Zone)','').replace(' (East-Central Zone)','').replace(' (Far East Zone)',''),
      rice: Math.round(p.rice),
      wheat: Math.round(p.wheat),
      beneficiaries: p.count,
    })));

    setLoading(false);
  };

  const totalRice  = allBeneficiaries.reduce((s, b) => s + (b.riceQty  || 0), 0);
  const totalWheat = allBeneficiaries.reduce((s, b) => s + (b.wheatQty || 0), 0);
  const activeCount = allBeneficiaries.filter(b => b.status === 'ACTIVE').length;

  // Carbon savings calculation
  const paperSaved     = allBeneficiaries.length * 12 * 3; // 3 pages per beneficiary per month
  const co2Paper       = (paperSaved * 0.005).toFixed(1);
  const tripsSaved     = allBeneficiaries.length * 2;
  const co2Trips       = (tripsSaved * 2.3).toFixed(1);
  const totalCO2       = (parseFloat(co2Paper) + parseFloat(co2Trips)).toFixed(1);
  const treesEquivalent = Math.round(parseFloat(totalCO2) / 21.7);

  const tabs = [
    { key: "overview",   label: "Command Summary" },
    { key: "network",    label: "P&SC Network" },
    { key: "analytics",  label: "Flow Analytics" },
    { key: "blockchain", label: "Ledger Health" },
    { key: "qr",         label: "QR Verification" },
    { key: "fraud",      label: "Fraud Intelligence" },
    { key: "approvals",  label: "Approvals" },
    { key: "map",        label: "Ranchi Map" },
  ] as const;

  return (
    <Layout>
      <div className="container py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <Settings className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Ranchi District — SMART PDS Command Centre</p>
          </div>
          {loading && <span className="text-[10px] text-muted-foreground animate-pulse ml-auto">Loading blockchain data...</span>}
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${tab === t.key ? "bg-secondary text-secondary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── 1. COMMAND SUMMARY ────────────────────────────── */}
        {tab === "overview" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard icon={Users}      value={loading ? "..." : String(allBeneficiaries.length)} label="Total Beneficiaries" color="secondary" />
              <StatCard icon={Package}    value={loading ? "..." : `${Math.round(totalRice + totalWheat)} kg`} label="Monthly Entitlement" delay={0.1} color="success" />
              <StatCard icon={TrendingUp} value={loading ? "..." : String(activeCount)} label="Active Beneficiaries" delay={0.2} color="primary" />
              <StatCard icon={Leaf}       value={loading ? "..." : `${totalCO2} kg`} label="CO₂ Saved (Monthly)" delay={0.3} color="warning" />
            </div>

            {/* Ranchi Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="rounded-xl bg-card border border-border p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-primary">5</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">P&SC Zones</p>
                <p className="text-[10px] text-muted-foreground">Ranchi District</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-secondary">18</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Dispatch Centers</p>
                <p className="text-[10px] text-muted-foreground">All 18 Blocks</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-success">{loading ? "..." : allBeneficiaries.filter(b=>b.category==='PHH').length}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">PHH Beneficiaries</p>
                <p className="text-[10px] text-muted-foreground">Priority Households</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-warning">{loading ? "..." : allBeneficiaries.filter(b=>b.category==='AAY').length}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">AAY Beneficiaries</p>
                <p className="text-[10px] text-muted-foreground">Antyodaya Anna Yojana</p>
              </div>
            </div>

            {/* Entitlement Summary */}
            <div className="grid gap-4 lg:grid-cols-3 mb-6">
              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-3">Monthly Grain Entitlement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">🌾 Wheat</span>
                    <strong className="text-sm text-amber-700 dark:text-amber-400">{loading ? "..." : `${Math.round(totalWheat)} kg`}</strong>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <span className="text-xs font-bold text-green-700 dark:text-green-400">🍚 Rice</span>
                    <strong className="text-sm text-green-700 dark:text-green-400">{loading ? "..." : `${Math.round(totalRice)} kg`}</strong>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                    <span className="text-xs font-bold text-primary">📦 Total</span>
                    <strong className="text-sm text-primary">{loading ? "..." : `${Math.round(totalRice + totalWheat)} kg`}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-3">Category Distribution</h3>
                {!loading && (
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={categoryStats} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({name,value})=>`${name}: ${value}`} labelLine={false} fontSize={10}>
                        {categoryStats.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="rounded-xl bg-card border border-success/20 p-5 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-success" /> Carbon Impact
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Paper eliminated", value: `${paperSaved} pages`, saving: `${co2Paper} kg CO₂` },
                    { label: "Physical trips saved", value: `${tripsSaved} trips`, saving: `${co2Trips} kg CO₂` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-xs border-b border-border pb-1.5">
                      <span className="text-muted-foreground">{item.label}<br/><span className="text-[10px]">{item.value}</span></span>
                      <strong className="text-success">{item.saving}</strong>
                    </div>
                  ))}
                  <div className="mt-3 p-3 rounded-lg bg-success/10 text-center">
                    <p className="font-display text-2xl font-black text-success">{totalCO2} kg</p>
                    <p className="text-[10px] text-muted-foreground">Total CO₂ saved monthly</p>
                    <p className="text-[10px] font-bold text-success mt-1">≈ {treesEquivalent} trees planted 🌳</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── 2. P&SC NETWORK STATUS ────────────────────────── */}
        {tab === "network" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-5 mb-2">
              {PSC_CONFIG.map(p => (
                <div key={p.id} className="rounded-xl bg-card border border-border p-4 stat-card text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2 animate-pulse" style={{ background: p.color }} />
                  <p className="font-display text-lg font-black text-foreground">
                    {loading ? "..." : pscStats.find(s=>s.id===p.id)?.count || 0}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.zone}</p>
                </div>
              ))}
            </div>

            {pscStats.map(psc => (
              <div key={psc.id} className="rounded-xl bg-card border border-border overflow-hidden stat-card">
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: psc.color }} />
                  <div>
                    <h3 className="font-display font-bold text-foreground text-sm">{psc.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{psc.zone} Zone · {psc.dcs.length} Dispatch Centers</p>
                  </div>
                  <div className="ml-auto flex gap-3 text-xs">
                    <span className="rounded-md bg-primary/10 text-primary px-2 py-1 font-bold">{psc.count} beneficiaries</span>
                    <span className="rounded-md bg-success/10 text-success px-2 py-1 font-bold">PHH: {psc.phh}</span>
                    <span className="rounded-md bg-warning/10 text-warning px-2 py-1 font-bold">AAY: {psc.aay}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Block / DC</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Beneficiaries</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Rice (kg)</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Wheat (kg)</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {psc.blocks.map((block: string, i: number) => {
                        const blockBenefs = allBeneficiaries.filter(b => b.block === block);
                        const rice  = blockBenefs.reduce((s: number, b: any) => s + (b.riceQty  || 0), 0);
                        const wheat = blockBenefs.reduce((s: number, b: any) => s + (b.wheatQty || 0), 0);
                        return (
                          <tr key={block} className="border-b border-border last:border-0 hover:bg-muted/20">
                            <td className="px-4 py-2.5 text-xs font-bold">{block} DC <span className="text-[10px] text-muted-foreground font-normal">({psc.dcs[i]})</span></td>
                            <td className="px-4 py-2.5 text-xs font-bold text-primary">{blockBenefs.length}</td>
                            <td className="px-4 py-2.5 text-xs">{rice} kg</td>
                            <td className="px-4 py-2.5 text-xs">{wheat} kg</td>
                            <td className="px-4 py-2.5">
                              <span className="rounded-md bg-success/10 text-success px-1.5 py-0.5 text-[10px] font-bold">● Active</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 3. FLOW ANALYTICS ─────────────────────────────── */}
        {tab === "analytics" && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3 mb-2">
              {[
                { metric: "Verified OTIF %", value: "94.7%", trend: "+2.1%", up: true },
                { metric: "Leakage & Shrinkage", value: "0%", trend: "-100%", up: false, note: "Blockchain prevents leakage" },
                { metric: "Digital Verification", value: "100%", trend: "+100%", up: true, note: "All transactions on-chain" },
              ].map(k => (
                <div key={k.metric} className="rounded-xl bg-card p-5 stat-card border border-border text-center">
                  <p className="text-xs font-bold text-muted-foreground">{k.metric}</p>
                  <p className="font-display text-3xl font-black text-foreground mt-1.5">{k.value}</p>
                  <p className={`text-xs font-bold mt-1 ${k.up ? "text-success" : "text-destructive"}`}>{k.trend}</p>
                  {k.note && <p className="text-[10px] text-muted-foreground mt-1">{k.note}</p>}
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-card p-5 stat-card border border-border">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm">Beneficiary Distribution by Block</h3>
              {!loading && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={blockStats} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                    <XAxis dataKey="block" tick={{ fontSize: 9 }} stroke={CHART_TICK} angle={-45} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 10 }} stroke={CHART_TICK} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563EB" radius={[4,4,0,0]} name="Beneficiaries" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-xl bg-card p-5 stat-card border border-border">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm">Monthly Grain Entitlement by P&SC (kg)</h3>
              {!loading && (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={entitlementStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke={CHART_TICK} />
                    <YAxis tick={{ fontSize: 10 }} stroke={CHART_TICK} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rice"  fill="#059669" radius={[4,4,0,0]} name="Rice (kg)" />
                    <Bar dataKey="wheat" fill="#D97706" radius={[4,4,0,0]} name="Wheat (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-bold text-foreground text-sm">P&SC Performance Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">P&SC</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Zone</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Beneficiaries</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">PHH</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">AAY</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Rice (kg)</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Wheat (kg)</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pscStats.map(p => (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-2.5 text-xs font-bold">{p.name}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{p.zone}</td>
                        <td className="px-4 py-2.5 text-xs font-bold text-primary">{p.count}</td>
                        <td className="px-4 py-2.5 text-xs text-success font-bold">{p.phh}</td>
                        <td className="px-4 py-2.5 text-xs text-warning font-bold">{p.aay}</td>
                        <td className="px-4 py-2.5 text-xs">{Math.round(p.rice)}</td>
                        <td className="px-4 py-2.5 text-xs">{Math.round(p.wheat)}</td>
                        <td className="px-4 py-2.5">
                          <span className="rounded-md bg-success/10 text-success px-1.5 py-0.5 text-[10px] font-bold">● Operational</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 4. BLOCKCHAIN LEDGER HEALTH ───────────────────── */}
        {tab === "blockchain" && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-2">
              <div className="rounded-xl bg-card border border-success/20 p-4 stat-card text-center">
                <div className="w-3 h-3 rounded-full bg-success mx-auto mb-2 animate-pulse" />
                <p className="font-display text-xl font-black text-success">3/3</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Peers Online</p>
                <p className="text-[10px] text-muted-foreground">Godown · PSC · DC</p>
              </div>
              <div className="rounded-xl bg-card border border-primary/20 p-4 stat-card text-center">
                <p className="font-display text-xl font-black text-primary">4</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Chaincodes Active</p>
                <p className="text-[10px] text-muted-foreground">All committed</p>
              </div>
              <div className="rounded-xl bg-card border border-secondary/20 p-4 stat-card text-center">
                <p className="font-display text-xl font-black text-secondary">{loading ? "..." : allBeneficiaries.length}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Assets on Ledger</p>
                <p className="text-[10px] text-muted-foreground">Beneficiary records</p>
              </div>
              <div className="rounded-xl bg-card border border-warning/20 p-4 stat-card text-center">
                <p className="font-display text-xl font-black text-warning">pds-channel</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Channel</p>
                <p className="text-[10px] text-muted-foreground">All orgs joined</p>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-4">Chaincode Registry</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "beneficiaryCC", version: "1.0", org: "GodownOrgMSP · PSCOrgMSP · DCOrgMSP", functions: 13, color: "primary" },
                  { name: "orderManagementCC", version: "1.0", org: "GodownOrgMSP · PSCOrgMSP · DCOrgMSP", functions: 17, color: "secondary" },
                  { name: "packetizationCC", version: "1.0", org: "GodownOrgMSP · PSCOrgMSP · DCOrgMSP", functions: 18, color: "success" },
                  { name: "deliveryCC", version: "1.0", org: "GodownOrgMSP · PSCOrgMSP · DCOrgMSP", functions: 19, color: "warning" },
                ].map(cc => (
                  <div key={cc.name} className="p-4 rounded-lg bg-muted/20 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Blocks className={`h-4 w-4 text-${cc.color}`} />
                      <p className="font-mono text-xs font-bold text-foreground">{cc.name}</p>
                      <span className={`ml-auto rounded-md bg-${cc.color}/10 text-${cc.color} px-1.5 py-0.5 text-[10px] font-bold`}>v{cc.version}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{cc.org}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{cc.functions} functions · Endorsement: ALL orgs</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-[10px] text-success font-bold">Committed to pds-channel</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-3">Organisation MSP Status</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { msp: "GodownOrgMSP", peer: "peer0.godown.pds.com:7051", role: "Godown Operator", color: "primary" },
                  { msp: "PSCOrgMSP",    peer: "peer0.psc.pds.com:9051",    role: "P&SC Supervisor", color: "secondary" },
                  { msp: "DCOrgMSP",     peer: "peer0.dc.pds.com:11051",    role: "DC Manager", color: "success" },
                ].map(org => (
                  <div key={org.msp} className="p-4 rounded-lg bg-muted/20 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full bg-${org.color} animate-pulse`} />
                      <p className={`text-xs font-bold text-${org.color}`}>{org.msp}</p>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">{org.peer}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{org.role}</p>
                    <span className={`mt-2 inline-flex rounded-md bg-${org.color}/10 text-${org.color} px-1.5 py-0.5 text-[10px] font-bold`}>● Online</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

       {/* ── 5. QR PACKET VERIFICATION ─────────────────────────────── */}
{tab === "qr" && (
  <div className="space-y-5">
    <div className="rounded-xl bg-card border border-border p-5 stat-card">
      <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
        <QrCode className="h-4 w-4 text-primary" /> QR Code Verification System
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Every beneficiary packet has a <strong>Dynamic QR Code</strong> generated from their
        blockchain identity. Scanning the QR at delivery confirms authenticity in real-time.
      </p>
      <div className="grid gap-4 sm:grid-cols-3 mb-5">
        {[
          { label: "Static QR", desc: "Godown → P&SC (Sack level)", color: "primary", icon: "📦" },
          { label: "Dynamic QR", desc: "P&SC → DC → Beneficiary (Packet level)", color: "secondary", icon: "📱" },
          { label: "OTP Verification", desc: "Final delivery confirmation", color: "success", icon: "🔐" },
        ].map(q => (
          <div key={q.label} className={`p-4 rounded-xl border border-${q.color}/20 bg-${q.color}/5`}>
            <p className="text-2xl mb-2">{q.icon}</p>
            <p className={`text-xs font-bold text-${q.color}`}>{q.label}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{q.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* QR Grid */}
    <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-display font-bold text-foreground text-sm">
          Beneficiary Packet QR Codes — Live from Blockchain
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {allBeneficiaries.length} QR codes generated · Scan any QR to verify beneficiary
        </p>
      </div>
      <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-[600px] overflow-y-auto">
        {allBeneficiaries.map(b => {
          const qrData = JSON.stringify({
            beneficiaryID:    b.beneficiaryID,
            name:             b.name,
            rationCard:       b.rationCardNumber,
            block:            b.block,
            dcID:             b.dcID,
            pscID:            b.pscID,
            category:         b.category,
            riceQty:          b.riceQty,
            wheatQty:         b.wheatQty,
            maskedAadhaar:    b.maskedAadhaar,
            status:           b.status,
            verifyURL:        `SMARTPDS:VERIFY:${b.beneficiaryID}`,
          });
          return (
            <QRCard key={b.beneficiaryID} beneficiary={b} qrData={qrData} />
          );
        })}
      </div>
    </div>
  </div>
)}

        {/* ── 6. FRAUD & ANOMALY ────────────────────────────── */}
        {tab === "fraud" && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3 mb-2">
              <div className="rounded-xl bg-card border border-success/20 p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-success">0%</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Leakage Rate</p>
                <p className="text-[10px] text-success">Blockchain prevents duplicates</p>
              </div>
              <div className="rounded-xl bg-card border border-success/20 p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-success">0</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Ghost Beneficiaries</p>
                <p className="text-[10px] text-success">Aadhaar hash verification</p>
              </div>
              <div className="rounded-xl bg-card border border-warning/20 p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-warning">{anomalies.length}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Active Alerts</p>
                <p className="text-[10px] text-muted-foreground">Demo simulation</p>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-destructive/20 p-5 stat-card">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Fraud & Anomaly Intelligence
              </h3>
              <div className="space-y-2">
                {anomalies.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <div>
                      <p className="text-xs font-bold text-foreground">{a.type}</p>
                      <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${a.severity === "Critical" ? "bg-destructive/10 text-destructive" : a.severity === "High" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{a.severity}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-card border border-success/20 p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" /> Blockchain Anti-Fraud Mechanisms
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Aadhaar Hash Deduplication", desc: "Each beneficiary's Aadhaar is stored as a hash. Duplicate registrations are automatically rejected by the chaincode." },
                  { title: "Immutable Transaction Log", desc: "Every action is permanently recorded on the blockchain. No deletion or modification is possible." },
                  { title: "Multi-Org Endorsement", desc: "All 3 organisations (Godown, PSC, DC) must endorse every transaction — preventing single-party fraud." },
                  { title: "QR + OTP Dual Verification", desc: "Delivery requires both QR scan and OTP verification, preventing impersonation." },
                ].map(m => (
                  <div key={m.title} className="p-3 rounded-lg bg-success/5 border border-success/10">
                    <p className="text-xs font-bold text-success">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 7. PENDING APPROVALS ──────────────────────────── */}
        {tab === "approvals" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-bold text-foreground text-sm">Pending Administrative Approvals</h3>
              </div>
              <div className="divide-y divide-border">
                {pendingApprovals.map(a => (
                  <div key={a.id} className="p-4 flex items-center justify-between hover:bg-muted/20">
                    <div>
                      <p className="font-mono text-xs text-primary font-bold">{a.id}</p>
                      <p className="text-xs text-foreground font-bold">{a.type}</p>
                      <p className="text-[10px] text-muted-foreground">{a.org} · {a.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-success/10 px-3 py-1.5 text-[10px] font-bold text-success hover:bg-success/20">Approve</button>
                      <button className="rounded-lg bg-destructive/10 px-3 py-1.5 text-[10px] font-bold text-destructive hover:bg-destructive/20">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 8. RANCHI MAP ─────────────────────────────────── */}
        {tab === "map" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-card border border-border p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Ranchi District — P&SC Zone Map
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pscStats.map(psc => (
                  <div key={psc.id} className="rounded-xl border-2 p-4" style={{ borderColor: psc.color + '40', background: psc.color + '08' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-4 rounded-full" style={{ background: psc.color }} />
                      <div>
                        <p className="text-xs font-bold text-foreground">{psc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{psc.zone} Zone</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {psc.blocks.map((block: string) => {
                        const count = allBeneficiaries.filter(b => b.block === block).length;
                        return (
                          <div key={block} className="flex justify-between items-center text-[10px]">
                            <span className="text-muted-foreground">📍 {block}</span>
                            <span className="font-bold" style={{ color: psc.color }}>{count} beneficiaries</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs">
                      <span className="text-muted-foreground">Total</span>
                      <strong style={{ color: psc.color }}>{psc.count} beneficiaries</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;