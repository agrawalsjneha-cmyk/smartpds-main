import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck, Truck, QrCode, Package, CheckCircle,
  Search, Blocks, MapPin, AlertTriangle, Leaf, BarChart2,
  Activity, Shield, Clock, Navigation
} from "lucide-react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Input } from "@/components/ui/input";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
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
  { id:"PSC-RAN-01", name:"Chanho P&SC",  zone:"North-West",  color:"#8e15e6", dcs:["DC-RAN-01","DC-RAN-02","DC-RAN-03","DC-RAN-04"], blocks:["Khelari","Burmu","Chanho","Mandar"] },
  { id:"PSC-RAN-02", name:"Bero P&SC",     zone:"South-West",  color:"#1581e7", dcs:["DC-RAN-05","DC-RAN-06","DC-RAN-07"],             blocks:["Bero","Lapung","Itki"] },
  { id:"PSC-RAN-03", name:"Kanke P&SC",    zone:"Central",     color:"#05620e", dcs:["DC-RAN-08","DC-RAN-09","DC-RAN-10"],             blocks:["Kanke","Ratu","Nagri"] },
  { id:"PSC-RAN-04", name:"Angara P&SC",   zone:"East-Central",color:"#eb8c1f", dcs:["DC-RAN-11","DC-RAN-12","DC-RAN-13","DC-RAN-14"], blocks:["Namkum","Angara","Rahe","Ormanjhi"] },
  { id:"PSC-RAN-05", name:"Sonahatu P&SC",    zone:"Far East",    color:"#d816a7", dcs:["DC-RAN-15","DC-RAN-16","DC-RAN-17","DC-RAN-18"], blocks:["Silli","Bundu","Sonahatu","Tamar"] },
];

const DC_NAMES: Record<string,string> = {
  "DC-RAN-01":"Khelari DC",  "DC-RAN-02":"Burmu DC",    "DC-RAN-03":"Chanho DC",
  "DC-RAN-04":"Mandar DC",   "DC-RAN-05":"Bero DC",     "DC-RAN-06":"Lapung DC",
  "DC-RAN-07":"Itki DC",     "DC-RAN-08":"Kanke DC",    "DC-RAN-09":"Ratu DC",
  "DC-RAN-10":"Nagri DC",    "DC-RAN-11":"Namkum DC",   "DC-RAN-12":"Angara DC",
  "DC-RAN-13":"Rahe DC",     "DC-RAN-14":"Ormanjhi DC", "DC-RAN-15":"Silli DC",
  "DC-RAN-16":"Bundu DC",    "DC-RAN-17":"Sonahatu DC", "DC-RAN-18":"Tamar DC",
};

const PSC_NAMES: Record<string,string> = {
  "PSC-RAN-01":"Chanho P&SC","PSC-RAN-02":"Bero P&SC",
  "PSC-RAN-03":"Kanke P&SC",  "PSC-RAN-04":"Angara P&SC","PSC-RAN-05":"Sonahatu P&SC",
};

const statusColor: Record<string,string> = {
  CREATED:   "bg-warning/10 text-warning",
  APPROVED:  "bg-primary/10 text-primary",
  PACKETIZED:"bg-secondary/10 text-secondary",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const CHART_GRID = "hsl(214,32%,91%)";
const CHART_TICK = "hsl(215,16%,47%)";

const vehicleData = [
  { id:"VH-001", driver:"Ramesh Kumar",  mobile:"98XXXX1234", from:"Godown-1 (FCI)", to:"Chanho P&SC", status:"In Transit", progress:65,  eta:"25 min", load:"42 MT", capacity:"50 MT", seal:"SL-4521", gps:"Active",   routeId:"RT-NW-01", lastUpdated:"09:15 AM", delayReason:"" },
  { id:"VH-002", driver:"Suresh Yadav",  mobile:"97XXXX5678", from:"Chanho P&SC",   to:"Kanke DC",     status:"Delivered",  progress:100, eta:"Done",   load:"28 MT", capacity:"35 MT", seal:"SL-4520", gps:"Active",   routeId:"RT-C-02",  lastUpdated:"08:52 AM", delayReason:"" },
  { id:"VH-003", driver:"Mohan Singh",   mobile:"96XXXX9012", from:"Godown-2 (SWC)", to:"Namkum DC",    status:"Delayed",    progress:30,  eta:"1.5 hr", load:"35 MT", capacity:"45 MT", seal:"SL-4519", gps:"Active",   routeId:"RT-EC-03", lastUpdated:"08:10 AM", delayReason:"Road blockage at NH-23" },
  { id:"VH-004", driver:"Ajay Prasad",   mobile:"95XXXX3456", from:"Bero P&SC",      to:"Silli DC",     status:"Loading",    progress:0,   eta:"45 min", load:"50 MT", capacity:"55 MT", seal:"SL-4518", gps:"Inactive", routeId:"RT-FE-04", lastUpdated:"07:30 AM", delayReason:"" },
];

const dispatchLog = [
  { id:"DSP-4521", dest:"Chanho P&SC", qty:"42 MT", time:"09:15 AM", status:"Dispatched", vehicle:"JH-01-AB-1234", driver:"Raj Kumar",   seal:"SL-4521" },
  { id:"DSP-4520", dest:"Kanke DC",     qty:"28 MT", time:"08:45 AM", status:"In Transit",  vehicle:"JH-01-CD-5678", driver:"Sunil Oraon", seal:"SL-4520" },
  { id:"DSP-4519", dest:"Namkum DC",    qty:"35 MT", time:"08:10 AM", status:"Delivered",   vehicle:"JH-01-EF-9012", driver:"Mohan Das",   seal:"SL-4519" },
  { id:"DSP-4518", dest:"Silli DC",     qty:"50 MT", time:"07:30 AM", status:"Delivered",   vehicle:"JH-01-GH-3456", driver:"Vikram Singh",seal:"SL-4518" },
];

const inventoryLedger = [
  { location:"Godown-1 (FCI)", type:"FCI",  stockIn:450, stockOut:380, balance:70,  lat:"23.3441°N", lng:"85.3096°E" },
  { location:"Godown-2 (SWC)", type:"SWC",  stockIn:320, stockOut:290, balance:30,  lat:"23.3601°N", lng:"85.3300°E" },
  { location:"Chanho P&SC",   type:"P&SC", stockIn:280, stockOut:265, balance:15,  lat:"23.3500°N", lng:"85.3200°E" },
  { location:"Kanke DC",       type:"DC",   stockIn:180, stockOut:175, balance:5,   lat:"23.3700°N", lng:"85.3400°E" },
];

// Monthly grain movement data (Mar-May 2026)
const monthlyGrainData = [
  { month:"Mar 2026", rice:1240, wheat:310, total:1550 },
  { month:"Apr 2026", rice:1380, wheat:345, total:1725 },
  { month:"May 2026", rice:0,    wheat:0,   total:0    },
];

// Daily transaction volume
const dailyTxData = [
  { day:"Apr 29", txns:45 },
  { day:"Apr 30", txns:38 },
  { day:"May 1",  txns:52 },
  { day:"May 2",  txns:41 },
  { day:"May 3",  txns:29 },
  { day:"May 4",  txns:63 },
  { day:"May 5",  txns:0  },
];

const stockAvailability = [
  { item:"Rice",  available:320, required:450 },
  { item:"Wheat", available:180, required:250 },
];

const blockchainEvents = [
  { chaincode:"BeneficiaryCC",   action:"VerifyBeneficiary",    time:"09:45:12", tx:"TX-A1B2" },
  { chaincode:"OrderCC",         action:"CreateOrder",          time:"09:43:05", tx:"TX-C3D4" },
  { chaincode:"PacketizationCC", action:"GeneratePacketQR",     time:"09:41:33", tx:"TX-E5F6" },
  { chaincode:"DispatchCC",      action:"CreateDispatch",       time:"09:39:22", tx:"TX-G7H8" },
  { chaincode:"DeliveryCC",      action:"VerifyOTPDelivery",    time:"09:37:11", tx:"TX-I9J0" },
  { chaincode:"AuditCC",         action:"FlagException",        time:"09:35:44", tx:"TX-K1L2" },
];

async function apiFetch(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers:{ 'Content-Type':'application/json','X-API-Key':API_KEY },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data;
}

const OperatorDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [allOrders,      setAllOrders]      = useState<any[]>([]);
  const [allBenefs,      setAllBenefs]      = useState<any[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [ordSearch,      setOrdSearch]      = useState("");
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [selectedOrder,  setSelectedOrder]  = useState<any>(null);
  const [orderHistory,   setOrderHistory]   = useState<any[]>([]);
  const [trackId,        setTrackId]        = useState("");
  const [trackResult,    setTrackResult]    = useState<any>(null);
  const [trackLoading,   setTrackLoading]   = useState(false);
  const [trackError,     setTrackError]     = useState("");

  useEffect(() => { loadAllData(); }, []);

  useEffect(() => {
    if (!ordSearch.trim()) { setFilteredOrders(allOrders); return; }
    const q = ordSearch.toLowerCase();
    setFilteredOrders(allOrders.filter(o =>
      o.orderID?.toLowerCase().includes(q) ||
      o.beneficiaryID?.toLowerCase().includes(q) ||
      o.rationCardNumber?.toLowerCase().includes(q) ||
      o.dcID?.toLowerCase().includes(q)
    ));
  }, [ordSearch, allOrders]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [benefResults, orderResults] = await Promise.all([
        Promise.all(ALL_DCS.map(dc =>
          apiFetch(`/api/beneficiaries?dcId=${dc}`)
            .then((d:any) => Array.isArray(d) ? d : [d])
            .catch(() => [] as any[])
        )),
        Promise.all(ALL_DCS.map(dc =>
          apiFetch(`/api/orders/dc/${dc}/202505`)
            .then((d:any) => Array.isArray(d) ? d : [d])
            .catch(() => [] as any[])
        ))
      ]);

      const rawBenefs = benefResults.flat();
      const uniqueBenefs = Array.from(new Map(rawBenefs.map((b:any) => [b.beneficiaryID, b])).values());
      setAllBenefs(uniqueBenefs);

      const rawOrders = orderResults.flat();
      const uniqueOrders = Array.from(new Map(rawOrders.map((o:any) => [o.orderID, o])).values());
      (uniqueOrders as any[]).sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAllOrders(uniqueOrders as any[]);
      setFilteredOrders(uniqueOrders as any[]);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderHistory = async (orderId: string) => {
    try {
      const data = await apiFetch(`/api/orders/${orderId}/history`);
      setOrderHistory(Array.isArray(data) ? data : [data]);
    } catch { setOrderHistory([]); }
  };

  const handleTrack = async () => {
    if (!trackId.trim()) return;
    setTrackLoading(true);
    setTrackError("");
    setTrackResult(null);
    try {
      const data = await apiFetch(`/api/orders/${trackId.trim()}`);
      setTrackResult(data);
    } catch (err:any) {
      setTrackError(err.message || "Order not found");
    } finally {
      setTrackLoading(false);
    }
  };

  // Computed stats
  const totalOrders    = allOrders.length;
  const createdOrders  = allOrders.filter(o => o.orderStatus === 'CREATED').length;
  const approvedOrders = allOrders.filter(o => o.orderStatus === 'APPROVED').length;
  const noOrderBenefs  = allBenefs.length - totalOrders;
  const totalRice      = allOrders.reduce((s,o) => s + (o.requestedRiceQty  || 0), 0);
  const totalWheat     = allOrders.reduce((s,o) => s + (o.requestedWheatQty || 0), 0);

  // Chart data derived from real blockchain data
  const pscChartData = PSC_CONFIG.map(p => ({
    name: p.name.replace(' P&SC','').replace(' (North-West Zone)','').replace(' (South-West Zone)','').replace(' (Central High-Demand Zone)','').replace(' (East-Central Zone)','').replace(' (Far East Zone)',''),
    orders:  allOrders.filter(o => o.pscID === p.id).length,
    rice:    Math.round(allOrders.filter(o => o.pscID === p.id).reduce((s,o) => s+(o.requestedRiceQty||0),0)),
    wheat:   Math.round(allOrders.filter(o => o.pscID === p.id).reduce((s,o) => s+(o.requestedWheatQty||0),0)),
    color:   p.color,
  }));

  const orderStatusData = [
    { name:'CREATED',   value: createdOrders,                                    color:'#bb44d5' },
    { name:'APPROVED',  value: approvedOrders,                                   color:'#36c1eb' },
    { name:'DELIVERED', value: allOrders.filter(o=>o.orderStatus==='DELIVERED').length, color:'#0bc038' },
    { name:'CANCELLED', value: allOrders.filter(o=>o.orderStatus==='CANCELLED').length, color:'#aa0a3f' },
  ].filter(d => d.value > 0);

  const benefCoverageData = [
    { name:'Orders Placed', value: totalOrders,   color:'#bb44d5' },
    { name:'Yet to Order',  value: noOrderBenefs, color:'#36c1eb' },
  ];

  const demandData = [
    { month:'Mar 2026', rice:1240, wheat:310 },
    { month:'Apr 2026', rice:1380, wheat:345 },
    { month:'May 2026', rice:Math.round(totalRice), wheat:Math.round(totalWheat) },
  ];

  // Update monthly grain data with real May data
  monthlyGrainData[2].rice  = Math.round(totalRice);
  monthlyGrainData[2].wheat = Math.round(totalWheat);
  monthlyGrainData[2].total = Math.round(totalRice + totalWheat);

  const tabs = [
    { key:"summary",       label:"📊 Command Summary" },
    { key:"alerts",        label:"🚨 Alerts" },
    { key:"demand",        label:"📈 Demand Aggregation" },
    { key:"psc",           label:"🏢 P&SC Network" },
    { key:"orders",        label:"📋 Orders" },
    { key:"packetization", label:"📦 Packetization" },
    { key:"inventory",     label:"🏭 Inventory" },
    { key:"dispatch",      label:"🚛 Dispatch" },
    { key:"vehicles",      label:"🚗 Vehicle Tracking" },
    { key:"blockchain",    label:"⛓ Blockchain" },
    { key:"traceability",  label:"🔍 Traceability" },
  ] as const;

  return (
    <Layout>
      <div className="container py-6">
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
            <ClipboardCheck className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-foreground">Operator Dashboard</h1>
            <p className="text-xs text-muted-foreground">Ranchi District — SMART PDS Operations Centre</p>
          </div>
          {loading && <span className="text-[10px] text-muted-foreground animate-pulse ml-auto">Loading blockchain data...</span>}
        </motion.div>

        {/* KPI Strip */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-5">
          <StatCard icon={Package}        value={loading?"...":String(totalOrders)}    label="Total Orders"         color="primary" />
          <StatCard icon={ClipboardCheck} value={loading?"...":String(createdOrders)}  label="Pending Approval"     color="warning"   delay={0.1} />
          <StatCard icon={CheckCircle}    value={loading?"...":String(approvedOrders)} label="Approved"             color="success"   delay={0.2} />
          <StatCard icon={Truck}          value={loading?"...":String(noOrderBenefs)}  label="Yet to Order"         color="secondary" delay={0.3} />
          <StatCard icon={QrCode}         value={loading?"...":`${Math.round(totalRice+totalWheat)}kg`} label="Total Grain Demand" color="primary" delay={0.4} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab===t.key?"bg-secondary text-secondary-foreground shadow-sm":"bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── 1. COMMAND SUMMARY ──────────────────────────── */}
        {activeTab === "summary" && (
          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* P&SC Orders Bar Chart */}
              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-3">P&SC-wise Orders — May 2026</h3>
                {!loading && (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={pscChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                      <XAxis dataKey="name" tick={{ fontSize:9 }} stroke={CHART_TICK} />
                      <YAxis tick={{ fontSize:10 }} stroke={CHART_TICK} />
                      <Tooltip />
                      <Bar dataKey="orders" name="Orders" radius={[4,4,0,0]}>
                        {pscChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Order Status Pie */}
              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-3">Order Status Breakdown</h3>
                {!loading && orderStatusData.length > 0 && (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={orderStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value}) => `${name}: ${value}`} labelLine={false} fontSize={9}>
                        {orderStatusData.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Monthly Grain Movement Line Chart */}
              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-3">Monthly Grain Movement Trend (Mar–May 2026)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyGrainData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                    <XAxis dataKey="month" tick={{ fontSize:9 }} stroke={CHART_TICK} />
                    <YAxis tick={{ fontSize:10 }} stroke={CHART_TICK} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rice"  stroke="#ee27dd" strokeWidth={2} name="Rice (kg)"  dot={{ r:4 }} />
                    <Line type="monotone" dataKey="wheat" stroke="#6c0991" strokeWidth={2} name="Wheat (kg)" dot={{ r:4 }} />
                    <Line type="monotone" dataKey="total" stroke="#0e9f3e" strokeWidth={2} name="Total (kg)" dot={{ r:4 }} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Beneficiary Coverage Donut */}
              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-3">Beneficiary Coverage — May 2026</h3>
                {!loading && (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={benefCoverageData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" label={({name,value}) => `${value}`} labelLine={false} fontSize={10}>
                          {benefCoverageData.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-center p-2 rounded-lg bg-primary/5">
                        <p className="font-display text-lg font-black text-primary">{totalOrders}</p>
                        <p className="text-[10px] text-muted-foreground">Orders Placed</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-warning/5">
                        <p className="font-display text-lg font-black text-warning">{noOrderBenefs}</p>
                        <p className="text-[10px] text-muted-foreground">Yet to Order</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Commodity Distribution Bar Chart */}
              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-3">Commodity Distribution by P&SC (kg)</h3>
                {!loading && (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={pscChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                      <XAxis dataKey="name" tick={{ fontSize:9 }} stroke={CHART_TICK} />
                      <YAxis tick={{ fontSize:10 }} stroke={CHART_TICK} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rice"  fill="#059669" radius={[4,4,0,0]} name="Rice (kg)" />
                      <Bar dataKey="wheat" fill="#D97706" radius={[4,4,0,0]} name="Wheat (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Daily Transaction Volume Line Chart */}
              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-3">Daily Transaction Volume</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dailyTxData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                    <XAxis dataKey="day" tick={{ fontSize:9 }} stroke={CHART_TICK} />
                    <YAxis tick={{ fontSize:10 }} stroke={CHART_TICK} />
                    <Tooltip />
                    <Area type="monotone" dataKey="txns" stroke="#2563EB" fill="#2563EB20" strokeWidth={2} name="Transactions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stock Availability Chart */}
            <div className="rounded-xl bg-card border border-border p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-3">Stock Availability vs Requirement</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={stockAvailability} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                  <XAxis type="number" tick={{ fontSize:9 }} stroke={CHART_TICK} />
                  <YAxis dataKey="item" type="category" tick={{ fontSize:10 }} stroke={CHART_TICK} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="available" fill="#ab14e6" radius={[0,4,4,0]} name="Available" />
                  <Bar dataKey="required"  fill="#11a7e2" radius={[0,4,4,0]} name="Required"  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── 2. OPERATIONAL ALERTS ───────────────────────── */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-card border border-warning/20 p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-warning">{createdOrders}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Orders Pending Approval</p>
              </div>
              <div className="rounded-xl bg-card border border-secondary/20 p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-secondary">{noOrderBenefs}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Beneficiaries Yet to Order</p>
              </div>
              <div className="rounded-xl bg-card border border-destructive/20 p-4 stat-card text-center">
                <p className="font-display text-2xl font-black text-destructive">1</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Vehicle Delayed</p>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-warning/20 p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" /> Operational Alerts
              </h3>
              <div className="space-y-2">
                {[
                  { type:"Pending Approval", desc:`${createdOrders} orders awaiting PSC approval for May 2026`, severity:"High", time:"Now" },
                  { type:"Coverage Gap",     desc:`${noOrderBenefs} beneficiaries have not placed orders for May 2026`, severity:"Medium", time:"Now" },
                  { type:"Vehicle Delay",    desc:"VH-003 delayed on RT-EC-03 — Road blockage at NH-23", severity:"High", time:"15 min ago" },
                  { type:"Stock Alert",      desc:"Wheat stock at 72% of requirement — consider reorder", severity:"Medium", time:"1 hr ago" },
                ].map((a,i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                    <div>
                      <p className="text-xs font-bold text-foreground">{a.type}</p>
                      <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${a.severity==='High'?'bg-warning/10 text-warning':'bg-muted text-muted-foreground'}`}>{a.severity}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 3. DEMAND AGGREGATION ───────────────────────── */}
        {activeTab === "demand" && (
          <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { label:"Total Rice Demand",      value:`${Math.round(totalRice)} kg`,           color:"success" },
                { label:"Total Wheat Demand",     value:`${Math.round(totalWheat)} kg`,          color:"warning" },
                { label:"Total Grain Demand",     value:`${Math.round(totalRice+totalWheat)} kg`,color:"primary" },
                { label:"Beneficiaries Ordered",  value:String(totalOrders),                     color:"secondary" },
                { label:"Beneficiaries Pending",  value:String(noOrderBenefs),                   color:"destructive" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl bg-card border border-${s.color}/20 p-4 stat-card text-center`}>
                  <p className={`font-display text-xl font-black text-${s.color}`}>{s.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Demand Column Chart */}
            <div className="rounded-xl bg-card border border-border p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-3">Monthly Demand Aggregation — Mar to May 2026 (kg)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                  <XAxis dataKey="month" tick={{ fontSize:10 }} stroke={CHART_TICK} />
                  <YAxis tick={{ fontSize:10 }} stroke={CHART_TICK} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rice"  fill="#059669" radius={[4,4,0,0]} name="Rice (kg)" />
                  <Bar dataKey="wheat" fill="#D97706" radius={[4,4,0,0]} name="Wheat (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* P&SC Demand Table */}
            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-bold text-foreground text-sm">P&SC-wise Demand Summary — May 2026</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">P&SC</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Zone</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Blocks</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Orders</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Rice Required</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Wheat Required</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Total Grain</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Packets Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PSC_CONFIG.map(p => {
                      const pscOrders = allOrders.filter(o => o.pscID === p.id);
                      const rice  = Math.round(pscOrders.reduce((s,o) => s+(o.requestedRiceQty||0),0));
                      const wheat = Math.round(pscOrders.reduce((s,o) => s+(o.requestedWheatQty||0),0));
                      return (
                        <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-2.5 text-xs font-bold">{p.name}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{p.zone}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{p.blocks.join(', ')}</td>
                          <td className="px-4 py-2.5 text-xs font-bold text-primary">{pscOrders.length}</td>
                          <td className="px-4 py-2.5 text-xs text-success font-bold">{rice} kg</td>
                          <td className="px-4 py-2.5 text-xs text-warning font-bold">{wheat} kg</td>
                          <td className="px-4 py-2.5 text-xs font-bold">{rice+wheat} kg</td>
                          <td className="px-4 py-2.5">
                            <span className="rounded-md bg-warning/10 text-warning px-1.5 py-0.5 text-[10px] font-bold">{pscOrders.length} pending</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 4. P&SC NETWORK STATUS ──────────────────────── */}
        {activeTab === "psc" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-5">
              {PSC_CONFIG.map(p => {
                const count = allOrders.filter(o => o.pscID === p.id).length;
                return (
                  <div key={p.id} className="rounded-xl bg-card border border-border p-4 stat-card text-center">
                    <div className="w-3 h-3 rounded-full mx-auto mb-2 animate-pulse" style={{ background:p.color }} />
                    <p className="font-display text-xl font-black text-foreground">{loading?"...":count}</p>
                    <p className="text-[10px] font-bold text-muted-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.zone}</p>
                  </div>
                );
              })}
            </div>

            {PSC_CONFIG.map(p => {
              const pscOrders = allOrders.filter(o => o.pscID === p.id);
              return (
                <div key={p.id} className="rounded-xl bg-card border border-border overflow-hidden stat-card">
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:p.color }} />
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground text-sm">{p.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{p.zone} Zone · {p.dcs.length} Dispatch Centers</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-md bg-primary/10 text-primary px-2 py-1 text-[10px] font-bold">{pscOrders.length} orders</span>
                      <span className="rounded-md bg-success/10 text-success px-2 py-1 text-[10px] font-bold">{Math.round(pscOrders.reduce((s,o)=>s+(o.requestedRiceQty||0),0))} kg rice</span>
                      <span className="rounded-md bg-warning/10 text-warning px-2 py-1 text-[10px] font-bold">{Math.round(pscOrders.reduce((s,o)=>s+(o.requestedWheatQty||0),0))} kg wheat</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Block / DC</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Orders</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Rice (kg)</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Wheat (kg)</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">QR Status</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.blocks.map((block, i) => {
                          const dcId = p.dcs[i];
                          const dcOrders = allOrders.filter(o => o.dcID === dcId);
                          const rice  = Math.round(dcOrders.reduce((s,o) => s+(o.requestedRiceQty||0),0));
                          const wheat = Math.round(dcOrders.reduce((s,o) => s+(o.requestedWheatQty||0),0));
                          return (
                            <tr key={block} className="border-b border-border last:border-0 hover:bg-muted/20">
                              <td className="px-4 py-2.5 text-xs font-bold">{block} DC <span className="text-[10px] text-muted-foreground font-normal">({dcId})</span></td>
                              <td className="px-4 py-2.5 text-xs font-bold text-primary">{dcOrders.length}</td>
                              <td className="px-4 py-2.5 text-xs text-success">{rice}</td>
                              <td className="px-4 py-2.5 text-xs text-warning">{wheat}</td>
                              <td className="px-4 py-2.5">
                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${dcOrders.length>0?'bg-warning/10 text-warning':'bg-muted text-muted-foreground'}`}>
                                  {dcOrders.length>0?'⏳ Pending':'—'}
                                </span>
                              </td>
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
              );
            })}
          </div>
        )}

        {/* ── 5. ORDERS ───────────────────────────────────── */}
        {activeTab === "orders" && (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid gap-3 grid-cols-3">
                <div className="rounded-xl bg-card border border-warning/20 p-3 text-center stat-card">
                  <p className="font-display text-2xl font-black text-warning">{loading?"...":createdOrders}</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1">Pending Approval</p>
                </div>
                <div className="rounded-xl bg-card border border-success/20 p-3 text-center stat-card">
                  <p className="font-display text-2xl font-black text-success">{loading?"...":approvedOrders}</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1">Approved</p>
                </div>
                <div className="rounded-xl bg-card border border-secondary/20 p-3 text-center stat-card">
                  <p className="font-display text-2xl font-black text-secondary">{loading?"...":noOrderBenefs}</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1">Yet to Order</p>
                </div>
              </div>

              <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-foreground text-sm">Order Intake — May 2026</h3>
                    <p className="text-[10px] text-muted-foreground">Real orders · Hyperledger Fabric · pds-channel</p>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Search..." className="rounded-lg h-8 text-xs w-40"
                      value={ordSearch} onChange={e => setOrdSearch(e.target.value)} />
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-md self-center">{filteredOrders.length}</span>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card z-10">
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Order ID</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Ration Card</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">DC</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Rice</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Wheat</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Cat</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">QR</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">OTP</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={9} className="px-4 py-8 text-center text-xs text-muted-foreground animate-pulse">Loading orders from blockchain...</td></tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr><td colSpan={9} className="px-4 py-8 text-center text-xs text-muted-foreground">No orders found</td></tr>
                      ) : filteredOrders.map(o => (
                        <tr key={o.orderID}
                          className={`border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${selectedOrder?.orderID===o.orderID?'bg-primary/5':''}`}
                          onClick={() => { setSelectedOrder(o); loadOrderHistory(o.orderID); }}>
                          <td className="px-3 py-2.5 font-mono text-[10px] text-primary font-bold">{o.orderID}</td>
                          <td className="px-3 py-2.5 font-mono text-[10px]">{o.rationCardNumber}</td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground">{DC_NAMES[o.dcID]||o.dcID}</td>
                          <td className="px-3 py-2.5 text-xs font-bold text-success">{o.requestedRiceQty}kg</td>
                          <td className="px-3 py-2.5 text-xs font-bold text-warning">{o.requestedWheatQty}kg</td>
                          <td className="px-3 py-2.5">
                            <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${o.category==='AAY'?'bg-warning/10 text-warning':'bg-primary/10 text-primary'}`}>{o.category}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${o.qrCodeID?'bg-success/10 text-success':'bg-warning/10 text-warning'}`}>
                              {o.qrCodeID?'✓ Gen':'⏳ Pending'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">⏳ Pending</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${statusColor[o.orderStatus]||'bg-muted text-muted-foreground'}`}>{o.orderStatus}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Beneficiaries without orders */}
              <div className="rounded-xl bg-card border border-warning/20 p-4 stat-card">
                <h3 className="font-display font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" /> Beneficiaries Yet to Place Order
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  <strong className="text-warning">{noOrderBenefs}</strong> of <strong>{allBenefs.length}</strong> beneficiaries have not ordered for May 2026
                </p>
                <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground">Ration Card</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground">Block</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={4} className="px-4 py-4 text-center text-xs animate-pulse text-muted-foreground">Loading...</td></tr>
                      ) : allBenefs.filter(b => !allOrders.find(o => o.beneficiaryID===b.beneficiaryID)).map(b => (
                        <tr key={b.beneficiaryID} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-2 text-xs font-bold">{b.name}</td>
                          <td className="px-3 py-2 font-mono text-[10px]">{b.rationCardNumber}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{b.block}</td>
                          <td className="px-3 py-2">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${b.category==='AAY'?'bg-warning/10 text-warning':'bg-primary/10 text-primary'}`}>{b.category}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Detail Panel */}
            <div className="space-y-4">
              <div className="rounded-xl bg-card border border-border stat-card overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-display font-bold text-foreground text-sm">Order Details</h3>
                </div>
                {!selectedOrder ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">Click an order to view details</div>
                ) : (
                  <div className="p-4 space-y-2">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-3">
                      <p className="font-mono text-xs font-bold text-primary">{selectedOrder.orderID}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{selectedOrder.allocationMonth} · {selectedOrder.category}</p>
                    </div>
                    {[
                      { label:"Beneficiary ID",  value:selectedOrder.beneficiaryID },
                      { label:"Ration Card",     value:selectedOrder.rationCardNumber },
                      { label:"Family Count",    value:selectedOrder.familyCount },
                      { label:"P&SC",            value:PSC_NAMES[selectedOrder.pscID]||selectedOrder.pscID },
                      { label:"DC",              value:DC_NAMES[selectedOrder.dcID]||selectedOrder.dcID },
                      { label:"Rice Requested",  value:`${selectedOrder.requestedRiceQty} kg` },
                      { label:"Wheat Requested", value:`${selectedOrder.requestedWheatQty} kg` },
                      { label:"Total",           value:`${selectedOrder.requestedRiceQty+selectedOrder.requestedWheatQty} kg` },
                      { label:"Address",         value:selectedOrder.addressSnapshot },
                      { label:"Created By",      value:selectedOrder.createdByOrg },
                      { label:"Created At",      value:new Date(selectedOrder.createdAt).toLocaleString() },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-xs border-b border-border pb-1.5">
                        <span className="text-muted-foreground">{item.label}</span>
                        <strong className="text-foreground text-right max-w-[55%] break-all">{item.value}</strong>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${statusColor[selectedOrder.orderStatus]||'bg-muted text-muted-foreground'}`}>{selectedOrder.orderStatus}</span>
                    </div>
                  </div>
                )}
              </div>
              {selectedOrder && orderHistory.length > 0 && (
                <div className="rounded-xl bg-card border border-border stat-card overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-display font-bold text-foreground text-sm">Order History</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {orderHistory.map((h:any,i:number) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/20">
                        <Blocks className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold">{i===orderHistory.length-1?'✅ Created':'📝 Updated'}</p>
                          <p className="font-mono text-[9px] text-muted-foreground">{h.TxId?.slice(0,20)}...</p>
                          <p className="text-[9px] text-muted-foreground">{new Date(h.Timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 6. PACKETIZATION ────────────────────────────── */}
        {activeTab === "packetization" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-card border border-border p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-secondary" /> Packetization Pipeline
              </h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                  { step:"Order Approved",       count:approvedOrders, color:"primary",   icon:"✅" },
                  { step:"Packet Created",        count:0,              color:"secondary", icon:"📦" },
                  { step:"Dynamic QR Generated",  count:0,              color:"warning",   icon:"📱" },
                  { step:"Dispatched to DC",          count:0,              color:"success",   icon:"🗂" },
                  { step:"Ready for Delivery",    count:0,              color:"success",   icon:"🚛" },
                ].map((s,i,arr) => (
                  <div key={s.step} className="flex items-center gap-2 flex-shrink-0">
                    <div className={`rounded-xl border border-${s.color}/20 bg-${s.color}/5 p-4 text-center w-36`}>
                      <p className="text-2xl mb-1">{s.icon}</p>
                      <p className={`font-display text-xl font-black text-${s.color}`}>{loading?"...":s.count}</p>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1">{s.step}</p>
                    </div>
                    {i < arr.length-1 && <span className="text-muted-foreground text-lg">→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-card border border-warning/20 p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-3">Packetization Status</h3>
              <div className="p-4 rounded-lg bg-warning/5 border border-warning/20 text-center">
                <p className="text-sm font-bold text-warning">⏳ Awaiting PSC Approval</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {createdOrders} orders are pending PSC approval before packetization can begin.
                  Once approved, packets will be created with Dynamic QR codes at the P&SC level.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="p-2 rounded-lg bg-card border border-border text-center">
                    <p className="font-display text-lg font-black text-warning">{createdOrders}</p>
                    <p className="text-[10px] text-muted-foreground">Pending Approval</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border text-center">
                    <p className="font-display text-lg font-black text-success">{approvedOrders}</p>
                    <p className="text-[10px] text-muted-foreground">Approved</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border text-center">
                    <p className="font-display text-lg font-black text-primary">0</p>
                    <p className="text-[10px] text-muted-foreground">Packets Created</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 7. INVENTORY ────────────────────────────────── */}
        {activeTab === "inventory" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-bold text-foreground text-sm">Inventory Ledger</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Location</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Type</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Stock In</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Stock Out</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Balance</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Geo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryLedger.map(i => (
                      <tr key={i.location} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-3 py-2.5 text-xs font-bold">{i.location}</td>
                        <td className="px-3 py-2.5"><span className="rounded-md bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-bold">{i.type}</span></td>
                        <td className="px-3 py-2.5 text-xs">{i.stockIn} MT</td>
                        <td className="px-3 py-2.5 text-xs">{i.stockOut} MT</td>
                        <td className="px-3 py-2.5 text-xs font-bold text-secondary">{i.balance} MT</td>
                        <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{i.lat}, {i.lng}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-5 stat-card">
              <h3 className="font-display font-bold text-foreground text-sm mb-3">Stock Availability Chart</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stockAvailability} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                  <XAxis type="number" tick={{ fontSize:9 }} stroke={CHART_TICK} />
                  <YAxis dataKey="item" type="category" tick={{ fontSize:10 }} stroke={CHART_TICK} width={60} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="available" fill="#059669" radius={[0,4,4,0]} name="Available" />
                  <Bar dataKey="required"  fill="#DC2626" radius={[0,4,4,0]} name="Required"  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── 8. DISPATCH ─────────────────────────────────── */}
        {activeTab === "dispatch" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-card p-5 border border-secondary/20 stat-card">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm">Create Dispatch</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground">From Godown</label>
                  <select className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs mt-1">
                    <option>Godown-1 (FCI)</option>
                    <option>Godown-2 (SWC)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground">To P&SC</label>
                  <select className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs mt-1">
                    {Object.values(PSC_NAMES).map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground">Vehicle No.</label>
                  <Input placeholder="JH-01-XX-XXXX" className="rounded-lg mt-1 h-8 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground">Seal Number</label>
                  <Input placeholder="SL-XXXX" className="rounded-lg mt-1 h-8 text-xs" />
                </div>
              </div>
              <button className="mt-3 px-4 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-bold text-xs hover:bg-secondary/90">
                Create Dispatch
              </button>
            </div>

            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-bold text-foreground text-sm">Dispatch Log</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">ID</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Destination</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Qty</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Vehicle</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Seal No.</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Time</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">QR Status</th>
                      <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchLog.map(d => (
                      <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-3 py-2.5 font-mono text-[10px] text-primary font-bold">{d.id}</td>
                        <td className="px-3 py-2.5 text-xs">{d.dest}</td>
                        <td className="px-3 py-2.5 text-xs font-medium">{d.qty}</td>
                        <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{d.vehicle}</td>
                        <td className="px-3 py-2.5 font-mono text-[10px]">{d.seal}</td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground">{d.time}</td>
                        <td className="px-3 py-2.5">
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${d.status==='Delivered'?'bg-success/10 text-success':'bg-warning/10 text-warning'}`}>
                            {d.status==='Delivered'?'✓ Scanned':'⏳ Pending'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${d.status==='Delivered'?'bg-success/10 text-success':d.status==='In Transit'?'bg-secondary/10 text-secondary':'bg-warning/10 text-warning'}`}>{d.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 9. VEHICLE TRACKING ─────────────────────────── */}
        {activeTab === "vehicles" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label:"Total",    value:vehicleData.length,                                    color:"border" },
                { label:"In Transit",value:vehicleData.filter(v=>v.status==="In Transit").length, color:"secondary/20" },
                { label:"Delayed",  value:vehicleData.filter(v=>v.status==="Delayed").length,    color:"destructive/20" },
                { label:"Delivered",value:vehicleData.filter(v=>v.status==="Delivered").length,  color:"success/20" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl bg-card border border-${s.color} p-4 text-center stat-card`}>
                  <p className="font-display text-2xl font-black text-foreground">{s.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {vehicleData.map(v => (
              <div key={v.id} className="rounded-xl bg-card border border-border p-4 stat-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Truck className={`h-4 w-4 ${v.status==="In Transit"?"text-secondary":v.status==="Delayed"?"text-destructive":v.status==="Loading"?"text-warning":"text-success"}`} />
                    <span className="font-mono text-xs font-bold text-primary">{v.id}</span>
                    <span className="text-xs text-muted-foreground">· {v.driver}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">· {v.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${v.gps==='Active'?'bg-success/10 text-success':'bg-muted text-muted-foreground'}`}>
                      📡 GPS {v.gps}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${v.status==="Delivered"?"bg-success/10 text-success":v.status==="Delayed"?"bg-destructive/10 text-destructive":v.status==="Loading"?"bg-warning/10 text-warning":"bg-secondary/10 text-secondary"}`}>{v.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[10px]">
                  <div className="rounded-lg bg-muted/20 p-2">
                    <p className="text-muted-foreground">Route ID</p>
                    <p className="font-bold font-mono">{v.routeId}</p>
                  </div>
                  <div className="rounded-lg bg-muted/20 p-2">
                    <p className="text-muted-foreground">Seal Number</p>
                    <p className="font-bold font-mono">{v.seal}</p>
                  </div>
                  <div className="rounded-lg bg-muted/20 p-2">
                    <p className="text-muted-foreground">Capacity / Load</p>
                    <p className="font-bold">{v.load} / {v.capacity}</p>
                  </div>
                  <div className="rounded-lg bg-muted/20 p-2">
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-bold">{v.lastUpdated}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" /> {v.from} → {v.to}
                  <span className="ml-auto flex items-center gap-1"><Clock className="h-3 w-3" /> ETA: {v.eta}</span>
                  <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> Expected: {v.eta}</span>
                </div>

                {v.delayReason && (
                  <div className="mb-2 p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                    <p className="text-[10px] text-destructive font-bold">⚠ Delay Reason: {v.delayReason}</p>
                  </div>
                )}

                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${v.status==="Delivered"?"bg-success":v.status==="Delayed"?"bg-destructive":v.status==="Loading"?"bg-warning":"bg-secondary"}`}
                    style={{ width:`${v.progress}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-right">{v.progress}% complete</p>
              </div>
            ))}
          </div>
        )}

        {/* ── 10. BLOCKCHAIN ACTIVITY ─────────────────────── */}
        {activeTab === "blockchain" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-foreground text-sm">Blockchain Order Activity — Real Transactions</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">orderManagementCC · pds-channel · May 2026</p>
                </div>
                <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-1 rounded-md animate-pulse">● Live</span>
              </div>
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-xs text-muted-foreground animate-pulse">Loading...</div>
                ) : allOrders.slice(0,20).map(o => (
                  <div key={o.orderID} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Blocks className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">orderManagementCC · CreateOrder</p>
                      <p className="text-[10px] text-muted-foreground">{DC_NAMES[o.dcID]||o.dcID} · {o.category} · {o.requestedRiceQty+o.requestedWheatQty}kg · RC:{o.rationCardNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-primary font-bold">{o.orderID}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(o.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chaincode Events */}
            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-bold text-foreground text-sm">SMART PDS Chaincode Events</h3>
              </div>
              <div className="p-4 space-y-2">
                {blockchainEvents.map((e,i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">{e.chaincode}</p>
                      <p className="text-[10px] text-muted-foreground">{e.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-secondary font-bold">{e.tx}</p>
                      <p className="text-[10px] text-muted-foreground">{e.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 11. TRACEABILITY ────────────────────────────── */}
        {activeTab === "traceability" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-card p-5 stat-card border border-border">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" /> Order Traceability
              </h3>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter Order ID e.g. ORD-JH-RAN-202505-E3AB1377"
                  className="rounded-lg h-9 max-w-lg"
                  value={trackId}
                  onChange={e => setTrackId(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && handleTrack()}
                />
                <button onClick={handleTrack}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                  {trackLoading?"Searching...":"Track"}
                </button>
              </div>

              {trackError && <p className="text-xs text-destructive">{trackError}</p>}

              {trackResult && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-muted/20 p-4">
                    <h4 className="text-xs font-bold text-foreground mb-3">Order Details</h4>
                    {[
                      { label:"Order ID",    value:trackResult.orderID },
                      { label:"Beneficiary", value:trackResult.beneficiaryID },
                      { label:"Ration Card", value:trackResult.rationCardNumber },
                      { label:"Month",       value:trackResult.allocationMonth },
                      { label:"Rice",        value:`${trackResult.requestedRiceQty} kg` },
                      { label:"Wheat",       value:`${trackResult.requestedWheatQty} kg` },
                      { label:"P&SC",        value:PSC_NAMES[trackResult.pscID]||trackResult.pscID },
                      { label:"DC",          value:DC_NAMES[trackResult.dcID]||trackResult.dcID },
                      { label:"Address",     value:trackResult.addressSnapshot },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-xs border-b border-border pb-1.5 mb-1.5">
                        <span className="text-muted-foreground">{item.label}</span>
                        <strong className="text-right max-w-[60%]">{item.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg bg-muted/20 p-4">
                    <h4 className="text-xs font-bold text-foreground mb-3">Delivery Pipeline</h4>
                    {[
                      { step:"Order Created",            done:true },
                      { step:"Order Validated",          done:trackResult.orderStatus!=='CREATED' },
                      { step:"Order Approved",           done:['APPROVED','PACKETIZED','DELIVERED'].includes(trackResult.orderStatus) },
                      { step:"Packet + QR Generated",    done:['PACKETIZED','DELIVERED'].includes(trackResult.orderStatus) },
                      { step:"Dispatched to DC",         done:trackResult.orderStatus==='DELIVERED' },
                      { step:"OTP Verified & Delivered", done:trackResult.orderStatus==='DELIVERED' },
                    ].map((s,i) => (
                      <div key={i} className="flex items-center gap-2.5 mb-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${s.done?'bg-success/10 text-success':'bg-muted text-muted-foreground'}`}>
                          {s.done ? <CheckCircle className="h-3 w-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />}
                        </div>
                        <p className={`text-xs ${s.done?'font-bold text-foreground':'text-muted-foreground'}`}>{s.step}</p>
                      </div>
                    ))}
                    <div className="mt-3 p-2 rounded-lg bg-card border border-border text-center">
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${statusColor[trackResult.orderStatus]||'bg-muted text-muted-foreground'}`}>
                        Current: {trackResult.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OperatorDashboard;