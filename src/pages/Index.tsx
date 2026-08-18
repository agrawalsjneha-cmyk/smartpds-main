import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, CheckCircle, Blocks, Leaf, ArrowRight, Clock, ChevronRight, MapPin
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_KEY  = import.meta.env.VITE_API_KEY  || 'pds-secret-key-2024';

const PSC_ZONES = [
  { id:"PSC-RAN-01", name:"P&SC Chanho",  zone:"North-West",   color:"#8e15e6", blocks:["Khelari","Burmu","Chanho","Mandar"],           benefs:225 },
  { id:"PSC-RAN-02", name:"P&SC Bero",     zone:"South-West",   color:"#1581e7", blocks:["Bero","Lapung","Itki"],                        benefs:165 },
  { id:"PSC-RAN-03", name:"P&SC Kanke",    zone:"Central",      color:"#05620e", blocks:["Kanke","Ratu","Nagri"],                        benefs:270 },
  { id:"PSC-RAN-04", name:"P&SC Angara",   zone:"East-Central", color:"#eb8c1f", blocks:["Namkum","Angara","Rahe","Ormanjhi"],           benefs:230 },
  { id:"PSC-RAN-05", name:"P&SC Sonahatu",    zone:"Far East",     color:"#d816a7", blocks:["Silli","Bundu","Sonahatu","Tamar"],            benefs:221 },
];

// Block positions on the map (percentage-based, matching the Ranchi map image)
const BLOCKS: Record<string, { x:number, y:number, psc:string, dcIds:string[], benefs:number }> = {
  "Khelari":  { x:9, y:8,  psc:"PSC-RAN-01", dcIds:["KHE-A","KHE-B"], benefs:60  },
  "Burmu":    { x:26, y:16, psc:"PSC-RAN-01", dcIds:["BUR-A","BUR-B"], benefs:55  },
  "Chanho":   { x:10, y:23, psc:"PSC-RAN-01", dcIds:["CHA-A","CHA-B"], benefs:55  },
  "Mandar":   { x:18, y:32, psc:"PSC-RAN-01", dcIds:["MAN-A","MAN-B"], benefs:55  },
  "Bero":     { x:8, y:48, psc:"PSC-RAN-02", dcIds:["BER-A","BER-B"], benefs:55  },
  "Lapung":   { x:5, y:67, psc:"PSC-RAN-02", dcIds:["LAP-A","LAP-B"], benefs:55  },
  "Itki":     { x:21, y:47, psc:"PSC-RAN-02", dcIds:["ITK-A","ITK-B"], benefs:55  },
  "Kanke":    { x:42, y:28, psc:"PSC-RAN-03", dcIds:["KAN-A","KAN-B","KAN-C","KAN-D","KAN-E","KAN-F"], benefs:160 },
  "Ratu":     { x:32, y:34, psc:"PSC-RAN-03", dcIds:["RAT-A","RAT-B"], benefs:55  },
  "Nagri":    { x:33, y:47, psc:"PSC-RAN-03", dcIds:["NAG-A","NAG-B"], benefs:55  },
  "Namkum":   { x:52, y:51, psc:"PSC-RAN-04", dcIds:["NMK-A","NMK-B"], benefs:60  },
  "Angara":   { x:71, y:37, psc:"PSC-RAN-04", dcIds:["ANG-A","ANG-B"], benefs:60  },
  "Rahe":     { x:79, y:52, psc:"PSC-RAN-04", dcIds:["RAH-A","RAH-B"], benefs:55  },
  "Ormanjhi": { x:58, y:25, psc:"PSC-RAN-04", dcIds:["ORM-A","ORM-B"], benefs:55  },
  "Silli":    { x:95, y:40, psc:"PSC-RAN-05", dcIds:["SIL-A","SIL-B"], benefs:45  },
  "Bundu":    { x:70, y:61, psc:"PSC-RAN-05", dcIds:["BUN-A","BUN-B"], benefs:42  },
  "Sonahatu": { x:94, y:59, psc:"PSC-RAN-05", dcIds:["SON-A","SON-B"], benefs:42  },
  "Tamar":    { x:90, y:79, psc:"PSC-RAN-05", dcIds:["TAM-A","TAM-B"], benefs:42  },
};

// PSC center positions
const PSC_CENTERS: Record<string, { x:number, y:number }> = {
  "PSC-RAN-01": { x:15, y:26},
  "PSC-RAN-02": { x:17, y:62 },
  "PSC-RAN-03": { x:41, y:45 },
  "PSC-RAN-04": { x:68, y:52 },
  "PSC-RAN-05": { x:85, y:74 },
};

// Individual DC marker positions (percentage-based). Edit any x/y here directly.
const DC_POSITIONS: Record<string, { x:number, y:number }> = {
  "KHE-A": { x:6.9, y:7 },    "KHE-B": { x:7, y:14 },
  "BUR-A": { x:22.9, y:14 },   "BUR-B": { x:29.1, y:22 },
  "CHA-A": { x:4.9, y:22 },   "CHA-B": { x:10.1, y:30 },
  "MAN-A": { x:15.9, y:39 },   "MAN-B": { x:21, y:31 },
  "BER-A": { x:7.9, y:45 },   "BER-B": { x:8.1, y:56 },
  "LAP-A": { x:3.9,  y:75 },   "LAP-B": { x:7.1, y:67 },
  "ITK-A": { x:20.9, y:46 },   "ITK-B": { x:21.1, y:53 },
  "KAN-A": { x:40.8, y:20.9 }, "KAN-B": { x:45,   y:25.9 }, "KAN-C": { x:52.2, y:37.9 },
  "KAN-D": { x:37.8, y:28.1 }, "KAN-E": { x:48,   y:32.1 }, "KAN-F": { x:46.2, y:39.1 },
  "RAT-A": { x:29.9, y:40},   "RAT-B": { x:32.1, y:34 },
  "NAG-A": { x:28.9, y:48 },   "NAG-B": { x:38.1, y:47 },
  "NMK-A": { x:49.9, y:49 },   "NMK-B": { x:52.1, y:58 },
  "ANG-A": { x:64.9, y:37 },   "ANG-B": { x:80, y:39 },
  "RAH-A": { x:73.9, y:52 },   "RAH-B": { x:84, y:53 },
  "ORM-A": { x:52.9, y:25 },   "ORM-B": { x:65.1, y:27 },
  "SIL-A": { x:95, y:38 },   "SIL-B": { x:95, y:47 },
  "BUN-A": { x:69, y:60 },   "BUN-B": { x:70.1, y:67.5 },
  "SON-A": { x:84.9, y:62 },   "SON-B": { x:97, y:67 },
  "TAM-A": { x:85, y:78 },   "TAM-B": { x:88.1, y:87 },
};

const blockchainFeed = [
  { tx:"TX-F760D459", action:"RegisterBeneficiary", node:"GodownOrgMSP", time:"09:45:12", type:"success" },
  { tx:"TX-E3AB1377", action:"CreateOrder",         node:"PSCOrgMSP",    time:"09:43:05", type:"success" },
  { tx:"TX-C50B5B15", action:"GeneratePacketQR",    node:"PSCOrgMSP",    time:"09:41:33", type:"success" },
  { tx:"TX-2B71151F", action:"CreateDispatch",      node:"GodownOrgMSP", time:"09:39:22", type:"success" },
  { tx:"TX-9A4D5496", action:"VerifyOTPDelivery",   node:"DCOrgMSP",     time:"09:37:11", type:"success" },
  { tx:"TX-D8EFC332", action:"FlagException",       node:"AuditCC",      time:"09:35:44", type:"warning" },
];

const importantUpdates = [
  { type:"Operations", severity:"Info",   msg:"May 2026 grain allocation released for all 18 blocks", time:"2 min ago" },
  { type:"Audit",      severity:"High",   msg:"Duplicate scan attempt at Kanke DC — blocked by blockchain", time:"15 min ago" },
  { type:"System",     severity:"Info",   msg:"Hyperledger Fabric: 3/3 peers online — pds-channel active", time:"30 min ago" },
  { type:"Operations", severity:"Medium", msg:"Vehicle VH-003 delayed on RT-EC-03 — road blockage NH-23", time:"1 hr ago" },
  { type:"Audit",      severity:"Info",   msg:"Monthly ledger integrity check complete — 100% verified", time:"2 hr ago" },
];

const weeklyLifecycle = [
  { day:"Week 1", phase:"Order Placement",        desc:"Beneficiaries place monthly grain orders",                                      icon:"📋", color:"blue"   },
  { day:"Week 1", phase:"Aggregation",            desc:"Aggregation of all demands at the end of week 1",                               icon:"📊", color:"purple" },
  { day:"Week 2", phase:"Godown Dispatch",        desc:"Godown packs sacks with static QR and dispatches to P&SC",                      icon:"📦", color:"teal"   },
  { day:"Week 2 & 3", phase:"P&SC Packetization", desc:"P&SC creates per-beneficiary packets with dynamic QR, and dispatches to DCs",   icon:"🏷️", color:"amber"  },
  { day:"Week 4", phase:"DC Delivery",            desc:"Doorstop delivery + OTP confirmation by the beneficiaries",                     icon:"✅", color:"green"  },
];

const pscBarData = PSC_ZONES.map(p => ({ name:p.name.replace(' P&SC',''), benefs:p.benefs, color:p.color }));

const grainTrendData = [
  { month:"Jan", rice:1100, wheat:275 },
  { month:"Feb", rice:1180, wheat:295 },
  { month:"Mar", rice:1240, wheat:310 },
  { month:"Apr", rice:1380, wheat:345 },
  { month:"May", rice:1560, wheat:390 },
];

const severityColor: Record<string,string> = {
  High:   "bg-red-100 text-red-600",
  Medium: "bg-amber-100 text-amber-600",
  Info:   "bg-blue-100 text-blue-600",
};

const colorMap: Record<string,string> = {
  blue:"bg-blue-50 border-blue-400 text-blue-800",
  purple:"bg-purple-50 border-purple-400 text-purple-800",
  teal:"bg-teal-50 border-teal-400 text-teal-800",
  amber:"bg-amber-50 border-amber-400 text-amber-800",
  green:"bg-green-50 border-green-400 text-green-800",
  
};

const Index = () => {
  const [activeFilter,  setActiveFilter]  = useState("All");
  const [currentTime,   setCurrentTime]   = useState(new Date());
  const [selectedBlock, setSelectedBlock] = useState<string|null>(null);
  const [mapView,       setMapView]       = useState<"psc"|"dc"|"beneficiaries">("psc");
  const [otifData, setOtifData] = useState<{ OTIF: number; DCR: number; IF: number; OT: number } | null>(null);
  const [carbonData, setCarbonData] = useState<{ reductionPct: number; smartMonthlyT: number; conventionalMonthlyT: number; absoluteAnnualSavingT: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/api/analytics/otif`, { headers: { 'X-API-Key': API_KEY } })
      .then(r => r.json())
      .then(json => { if (json.success) setOtifData(json.data); })
      .catch(() => {});

    fetch(`${BASE_URL}/api/analytics/carbon`, { headers: { 'X-API-Key': API_KEY } })
      .then(r => r.json())
      .then(json => { if (json.success) setCarbonData(json.data); })
      .catch(() => {});
  }, []);

  const filteredFeed = activeFilter === "All"
    ? importantUpdates
    : importantUpdates.filter(f => f.type === activeFilter);

  const selectedData  = selectedBlock ? BLOCKS[selectedBlock] : null;
  const selectedPSC   = selectedData  ? PSC_ZONES.find(p => p.id === selectedData.psc) : null;

  return (
    <div className="min-h-screen bg-gray-50">
     <Navbar /> 

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 text-white py-14 px-4">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage:'linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)', backgroundSize:'50px 50px' }} />

        <div className="container mx-auto relative z-10">
          {/* Badges */}
          <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} className="flex flex-wrap gap-2 mb-5">
            {["⛓ Hyperledger Fabric 2.5","📱 QR Code Technology","☁ IPFS Storage","📍 Ranchi, Jharkhand"].map(b => (
              <span key={b} className="px-3 py-1 rounded-full text-[13px] font- border border-white/20 bg-white/10">{b}</span>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <motion.div initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.1 }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-[11px] font-bold tracking-wider uppercase">
                  System Live · {currentTime.toLocaleTimeString('en-IN')}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-4">
                SMART Public<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Distribution</span><br />
                System
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-lg">
                A blockchain-enabled, transparent, and accountable food grain distribution infrastructure,
                powered by <strong className="text-white">Hyperledger Fabric 2.5</strong>, dynamic QR verification,
                and IPFS document storage. Ensuring every grain reaches the right beneficiary in
                <strong className="text-white"> Ranchi District, Jharkhand</strong>.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Link to="/operator" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm transition-all shadow-lg">
                  Explore Live Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/auditor" className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 hover:bg-white/10 text-white font-bold text-sm transition-all">
                  View Blockchain Ledger
                </Link>
                <Link to="/beneficiaries" className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-green-400/40 hover:bg-green-400/10 text-green-300 font-bold text-sm transition-all">
                  Beneficiary Portal
                </Link>
              </div>
              {/* Network Status */}
              <div className="rounded-xl border border-white/15 bg-white/08 backdrop-blur p-4">
                <p className="text-[15px] font-bold text-blue-300 uppercase tracking-widest mb-3">Live Network Status</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label:"Peers Online", value:"3/3" },
                    { label:"Channel",      value:"pds-channel" },
                    { label:"Chaincodes",   value:"4 Active" },
                    { label:"Ledger",       value:"Intact" },
                  ].map(s => (
                    <div key={s.label} className="text-center bg-white/5 rounded-lg p-2">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[16px] font-regular text-green-300">{s.value}</span>
                      </div>
                      <p className="text-[14px] text-white-200/60">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — System Architecture Diagram */}
            <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.2 }}>
              <div className="rounded-3xl border border-white/18 overflow-hidden shadow-3xl">
                <img
                  src="/smart-pds-diagram.png"
                  alt="SMART PDS System Architecture"
                  className="w-full max-h-100 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/600x400/1E3A5F/FFFFFF?text=SMART+PDS+System+Diagram";
                  }}
                />
                <div className="bg-slate-900/80 px-4 py-2 text-center">
                  <p className="text-[15px] text-white-300 font-bold">🔗 Immutable Blockchain Chain · IPFS Decentralized Storage</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── KPI STRIP ─────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 shadow-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label:"OTIF (Projected)",   value:"94.05%",  sub:"District-scale, Ch.4",  icon:"✅", bg:"bg-green-50",  text:"text-green-700" },
              { label:"OTIF (Live Demo)",   value: otifData ? `${otifData.OTIF}%` : "…", sub: otifData ? `${otifData.DCR}% coverage` : "Loading…", icon:"📡", bg:"bg-blue-50",  text:"text-blue-700" },
              { label:"Ledger Integrity",    value:"100%",    sub:"3/3 peers verified", icon:"⛓", bg:"bg-blue-50",   text:"text-blue-700"  },
              { label:"Demand Fulfillment",  value:"99.1%",   sub:"+0.9% improvement", icon:"📦", bg:"bg-indigo-50", text:"text-indigo-700"},
              { label:"Total Beneficiaries", value:"1,111",     sub:"All ACTIVE",         icon:"👥", bg:"bg-blue-50",   text:"text-blue-700"  },
              { label:"CO₂ Reduction",       value: carbonData ? `${carbonData.reductionPct}%` : "90.62%", sub:"vs. conventional PDS", icon:"🌱", bg:"bg-green-50",  text:"text-green-700" },
            ].map((k,i) => (
              <motion.div key={k.label} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
                className={`rounded-xl ${k.bg} border border-gray-200 p-4 text-center`}>
                <p className="text-2xl mb-1">{k.icon}</p>
                <p className={`font-display text-xl font-black ${k.text}`}>{k.value}</p>
                <p className="text-[10px] font-bold text-gray-600 mt-0.5">{k.label}</p>
                <p className="text-[9px] text-gray-500 mt-0.5">{k.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPORTANT UPDATES + BLOCKCHAIN ────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Important Updates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-xl font-black text-gray-900">Important Updates</h2>
                  <p className="text-xs text-gray-500">Real-time operational alerts and system events</p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {["All","Operations","Audit","System"].map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${activeFilter===f?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {filteredFeed.map((item,i) => (
                  <motion.div key={i} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold flex-shrink-0 mt-0.5 ${severityColor[item.severity]||'bg-gray-100 text-gray-600'}`}>
                      {item.severity}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-800">{item.msg}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-gray-500 font-bold">{item.type}</span>
                        <span className="text-[9px] text-gray-400">· {item.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Blockchain Transparency */}
            <div>
              <div className="mb-4">
                <h2 className="font-display text-xl font-black text-gray-900">Blockchain Transparency</h2>
                <p className="text-xs text-gray-500">Live transaction feed · Hyperledger Fabric · pds-channel</p>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="p-3 flex items-center justify-between bg-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-300">LIVE · pds-channel · 3 orgs</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{blockchainFeed.length} recent txns</span>
                </div>
                <div className="divide-y divide-gray-100 bg-white">
                  {blockchainFeed.map((tx,i) => (
                    <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${tx.type==='success'?'bg-green-100':'bg-amber-100'}`}>
                        <Blocks className={`h-3.5 w-3.5 ${tx.type==='success'?'text-green-600':'text-amber-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{tx.action}</p>
                        <p className="text-[10px] text-gray-500">{tx.node}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-[10px] text-blue-600 font-bold">{tx.tx}</p>
                        <p className="text-[9px] text-gray-400">{tx.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                  <Link to="/auditor" className="text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1">
                    View Full Blockchain Ledger <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE DISTRICT MAP ──────────────────────── */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-[10px] font-bold mb-2">
              <MapPin className="h-3 w-3" /> Smart District Map
            </span>
            <h2 className="font-display text-2xl font-black text-gray-900">Ranchi District: Interactive SMART PDS Map</h2>
            <p className="text-sm text-gray-500 mt-1">Click any block to view P&SC zone, DC details and beneficiary stats</p>
          </div>

          {/* View Toggles */}
          <div className="flex justify-center gap-2 mb-5 flex-wrap">
            {[
              { key:"psc",           label:"🟣 P&SC Zones" },
              { key:"dc",            label:"🔵 Dispatch Centers" },
              { key:"beneficiaries", label:"👥 Beneficiaries" },
            ].map(t => (
              <button key={t.key} onClick={() => setMapView(t.key as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mapView===t.key?'bg-blue-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map Container */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="relative">
                {/* Base Map Image */}
                <img
                  src="/ranchi-map.png"
                  alt="Ranchi District Map"
                  className="w-full opacity-70"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-white/30 pointer-events-none" />

                {/* SVG Overlay — interactive markers */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full"
                  style={{ top:0, left:0 }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* PSC Zone circles (background) */}
                  {mapView === "psc" && PSC_ZONES.map(psc => {
                    const center = PSC_CENTERS[psc.id];
                    return (
                      <circle
                        key={psc.id}
                        cx={center.x} cy={center.y} r="2"
                        fill={psc.color} opacity="0.12"
                        stroke={psc.color} strokeWidth="0.5"
                        strokeDasharray="2,2"
                      />
                    );
                  })}

                  {/* Block markers */}
                  {/* Block markers */}
{/* Block markers — one circle per Dispatch Centre */}
{/* Block markers — one circle per Dispatch Centre */}
{Object.entries(BLOCKS).map(([block, data]) => {
  const psc = PSC_ZONES.find(p => p.id === data.psc)!;
  const isSelected = selectedBlock === block;
  const dcCount = data.dcIds.length;
  const dcMarkerR = mapView === 'beneficiaries' ? 1.1 : 1.3;
  const spread = 2.6;          // increased spacing between circles
  const perRow = dcCount > 4 ? 3 : dcCount;  // wrap Kanke's 6 into 2 rows of 3

  return (
    <g key={block} onClick={() => setSelectedBlock(isSelected ? null : block)}
      style={{ cursor:'pointer' }}>

      {/* Pulse ring around the whole cluster when selected */}
      {isSelected && (
        <circle cx={data.x} cy={data.y} r={spread * (Math.min(perRow,dcCount)/2) + 2}
          fill="none" stroke={psc.color} strokeWidth="0.6" opacity="0.4" />
      )}

      {/* One marker per DC — position from DC_POSITIONS, hand-tunable */}
      {data.dcIds.map((dcId, i) => {
        const pos = DC_POSITIONS[dcId] || { x: data.x, y: data.y };
        const cx = pos.x;
        const cy = pos.y;
        const dcLetter = dcId.split('-')[1];

        return (
          <g key={dcId}>
            <circle
              cx={cx} cy={cy} r={dcMarkerR}
              fill={psc.color}
              opacity={isSelected ? 1 : 0.92}
              stroke="white" strokeWidth="0.25"
            />
            {mapView === 'dc' && (
              <text x={cx} y={cy + 0.45} textAnchor="middle"
                fontSize="1.3" fill="white" fontWeight="bold">{dcLetter}</text>
            )}
            {mapView === 'beneficiaries' && (
              <text x={cx} y={cy + 0.45} textAnchor="middle"
                fontSize="1.1" fill="white" fontWeight="bold">
                {Math.round(data.benefs / dcCount)}
              </text>
            )}
          </g>
        );
      })}

      {/* Block name label, centered below the DC cluster */}
      <text x={data.x} y={data.y + (dcCount > 4 ? 5.5 : 3.6)}
  textAnchor="middle" fontSize="2.3" fill="#0a0d10"
  fontWeight={isSelected ? "bold" : "normal"}
  fontFamily="'Times New Roman', 'Times', serif"
  style={{ textShadow:'0 0 3px white' }}>
  {block}
</text>
    </g>
  );
})}

{/* P&SC zone markers */}
                  {PSC_ZONES.map(psc => {
                    const center = PSC_CENTERS[psc.id];
                    return (
                      <g key={psc.id}>
                        <rect x={center.x - 4.5} y={center.y - 10} width="5" height="5" rx="1"
                          fill={psc.color} stroke="white" strokeWidth="0.3" />
                        <text x={center.x - 1.8} y={center.y - 6.5} textAnchor="middle"
                          fontSize="3" fill="white" fontWeight="bold"
                          fontFamily="'Times New Roman', 'Times', serif">
                          {psc.id.split('-')[2]}
                        </text>
                        <text x={center.x-1} y={center.y - 3} textAnchor="middle"
                          fontSize="2.2" fill="#1F2937" fontWeight="bold"
                          fontFamily="'Times New Roman', 'Times', serif"
                          style={{ textShadow:'0 0 3px white' }}>
                          {psc.name.replace(' P&SC','')}
                        </text>
                      </g>
                    );
                  })}

                <text x="52" y="97" textAnchor="middle" fontSize="2.5" fill="#140119" fontWeight="bold"
                      fontFamily="'Times New Roman', 'Times', serif">
                      Ranchi District, Jharkhand · 5 Packaging & Sorting Centers · 40 Dispatch Centers
                </text>
                </svg>
              </div>

              {/* Map Legend */}
              <div className="p-4 border-t border-gray-400 bg-gray-50">
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-[10px] font-bold text-gray-500">P&SC Zones:</span>
                  {PSC_ZONES.map(p => (
                    <div key={p.id} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ background:p.color }} />
                      <span className="text-[11px] text-gray-800">{p.name.replace(' P&SC','')} ({p.zone})</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-600 mt-2">Click any block marker to view details · 40 DCs · 5 P&SC zones · 1,111 beneficiaries</p>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Selected block details */}
              {selectedBlock && selectedData && selectedPSC ? (
                <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
                  className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded-full" style={{ background:selectedPSC.color }} />
                    <h3 className="font-display font-black text-gray-900">{selectedBlock} Block</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label:"P&SC Zone",       value:selectedPSC.name,     color:selectedPSC.color },
                      { label:"Zone",            value:selectedPSC.zone+' Zone', color:null },
                      { label:"Dispatch Centers", value:selectedData.dcIds.join(', '), color:null },
                      { label:"Beneficiaries",   value:String(selectedData.benefs), color:null },
                      { label:"Orders (May 26)", value:String(selectedData.benefs), color:null },
                      { label:"QR Status",       value:"Ready to Generate",  color:null },
                      { label:"Delivery Status", value:"Pending Dispatch",   color:null },
                      { label:"Blockchain",      value:"✅ On-chain verified",color:null },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-xs border-b border-gray-100 pb-1.5">
                        <span className="text-gray-500">{item.label}</span>
                        <strong style={item.color?{color:item.color}:{}} className="text-gray-800">{item.value}</strong>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setSelectedBlock(null)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors">
                    Clear Selection
                  </button>
                </motion.div>
              ) : (
                <div className="rounded-xl bg-blue-50 border border-blue-300 p-5 text-center">
                  <MapPin className="h-10 w-10 text-blue-700 mx-auto mb-2" />
                  <p className="text-sm font-bold text-blue-900">Select a Block</p>
                  <p className="text-xs text-blue-600 mt-1">Click any DC marker on the map to view P&SC zone, beneficiaries and delivery details</p>
                </div>
              )}

              {/* P&SC Summary Table */}
              <div className="rounded-xl bg-white border border-gray-400 p-4 shadow-sm">
                <h3 className="font-display font-bold text-gray-900 text-sm mb-3">P&SC Network Summary</h3>
                <div className="space-y-2.5">
                  {PSC_ZONES.map(p => (
                    <div key={p.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:p.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-gray-1200">{p.name}</p>
                        <p className="text-[11px] text-gray-700">{p.zone} · {p.blocks.length} blocks · {p.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black" style={{ color:p.color }}>{p.benefs}</p>
                        <p className="text-[11px] text-gray-500">benef.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beneficiary chart */}
              <div className="rounded-xl bg-white border border-blue-300 p-4 shadow-sm">
                <h3 className="font-display font-bold text-blue-900 text-sm mb-3">Beneficiaries by P&SC</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={pscBarData} margin={{ top:5, right:5, left:-20, bottom:5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize:11 }} />
                    <YAxis tick={{ fontSize:11 }} />
                    <Tooltip />
                    <Bar dataKey="benefs" name="Beneficiaries" radius={[6,6,0,0]}>
                    {pscBarData.map((entry,i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OPERATIONAL SCHEDULER ─────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-[10px] font-bold mb-2">
              <Clock className="h-3 w-3" /> Monthly Lifecycle
            </span>
            <h2 className="font-display text-2xl font-black text-gray-1200">SMART PDS Operational Schedule</h2>
            <p className="text-sm text-gray-800 mt-1">Weekly distribution lifecycle: Order placement to doorstep delivery</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-stretch">
            {weeklyLifecycle.map((w,i) => (
              <motion.div key={w.phase} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.1 }}
                className={`rounded-xl border p-4 text-center relative hover:shadow-md transition-shadow h-full flex flex-col ${colorMap[w.color]||'bg-gray-50 border-gray-200'}`}>
                <div className="text-3xl mb-2">{w.icon}</div>
                <span className="text-[11px] font-bold bg-white/70 px-2 py-0.5 rounded-full text-gray-1200">{w.day}</span>
                <p className="text-xs font-black text-gray-800 mt-2">{w.phase}</p>
                <p className="text-[11px] text-gray-900 mt-1">{w.desc}</p>
                {i < weeklyLifecycle.length-1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY STACK ──────────────────────────────── */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-700 px-3 py-1 text-[10px] font-bold mb-2">
              <Zap className="h-3 w-3" /> Technology Stack
            </span>
            <h2 className="font-display text-2xl font-black text-gray-900">Powered by Cutting-Edge Technologies</h2>
            <p className="text-sm text-gray-500 mt-1">Three core technologies for a tamper-proof distribution system</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                icon:"⛓", title:"Hyperledger Fabric 2.5",
                subtitle:"Permissioned Blockchain Network",
                bg:"bg-blue-50", border:"border-blue-200", titleColor:"text-blue-700",
                points:[
                  "3-org consortium: GodownOrg · PSCOrg · DCOrg",
                  "4 chaincodes: Beneficiary · Order · Packetization · Delivery",
                  "Multi-org endorsement — no single-party fraud",
                  "CouchDB rich queries for real-time analytics",
                  "Immutable ledger — zero data tampering",
                ]
              },
              {
                icon:"📱", title:"QR Code Technology",
                subtitle:"Dual-Layer Delivery Verification",
                bg:"bg-indigo-50", border:"border-indigo-200", titleColor:"text-indigo-700",
                points:[
                  "Static QR — Godown to P&SC (sack level)",
                  "Dynamic QR — P&SC to DC to Beneficiary",
                  "OTP-based final delivery confirmation",
                  "Blockchain stores QR hash for tamper detection",
                  "Prevents proxy collection and impersonation",
                ]
              },
              {
                icon:"☁", title:"IPFS Storage",
                subtitle:"Decentralized Document Storage",
                bg:"bg-green-50", border:"border-green-200", titleColor:"text-green-700",
                points:[
                  "Delivery proofs stored on IPFS permanently",
                  "E-challans and signed acknowledgements",
                  "Blockchain stores IPFS CID — not the document",
                  "Pinata service for reliable IPFS pinning",
                  "Eliminates paper-based documentation",
                ]
              },
            ].map((tech,i) => (
              <motion.div key={tech.title} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.1 }}
                className={`rounded-xl ${tech.bg} border ${tech.border} p-6 hover:shadow-md transition-shadow`}>
                <div className="text-4xl mb-3">{tech.icon}</div>
                <h3 className={`font-display text-base font-black ${tech.titleColor}`}>{tech.title}</h3>
                <p className="text-[10px] text-gray-500 mb-4">{tech.subtitle}</p>
                <ul className="space-y-2">
                  {tech.points.map(point => (
                    <li key={point} className="flex items-start gap-2 text-[11px] text-gray-700">
                      <CheckCircle className={`h-3.5 w-3.5 ${tech.titleColor} flex-shrink-0 mt-0.5`} />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARBON IMPACT ─────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 p-8 text-white shadow-xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-400/20 text-green-200 px-3 py-1 text-[10px] font-bold mb-3">
                  <Leaf className="h-3 w-3" /> Environmental Impact
                </span>
                <h2 className="font-display text-2xl font-black text-white mb-3">Carbon Footprint Reduction</h2>
                <p className="text-green-100 text-sm leading-relaxed">
                  SMART PDS significantly reduces carbon footprint through digital transformation —
                  eliminating paper processes, optimizing delivery routes, and preventing food waste
                  through accurate demand aggregation across all 18 blocks of Ranchi.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label:"Conventional PDS",    value: carbonData ? `${carbonData.conventionalMonthlyT} t/mo` : "359.84 t/mo", icon:"🏭" },
                  { label:"SMART PDS (renewable)", value: carbonData ? `${carbonData.smartMonthlyT} t/mo` : "33.75 t/mo", icon:"🌱" },
                  { label:"Reduction",           value: carbonData ? `${carbonData.reductionPct}%` : "90.62%", icon:"📉" },
                  { label:"Annual Saving",       value: carbonData ? `${carbonData.absoluteAnnualSavingT} t/yr` : "3,913.10 t/yr", icon:"🌍" },
                ].map(c => (
                  <div key={c.label} className="rounded-xl bg-white/15 p-4 text-center">
                    <p className="text-2xl mb-1">{c.icon}</p>
                    <p className="font-display text-lg font-black text-green-200">{c.value}</p>
                    <p className="text-[10px] text-green-100/70 mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GRAIN TREND + VISION ──────────────────────────── */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
              <h3 className="font-display font-black text-gray-900 text-sm mb-4">Monthly Grain Movement Trend (Jan–May 2026)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={grainTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize:10 }} />
                  <YAxis tick={{ fontSize:10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rice"  stroke="#dc13c5" strokeWidth={2.5} dot={{ r:4 }} name="Rice (kg)" />
                  <Line type="monotone" dataKey="wheat" stroke="#740ee8" strokeWidth={2.5} dot={{ r:4 }} name="Wheat (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
              <h3 className="font-display font-black text-gray-1200 text-sm mb-4">Vision & Mission</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-bold text-blue-700 mb-1">🎯 Our Vision</p>
                  <p className="text-[14px] text-gray-1000 leading-relaxed">
                    A fully transparent, digitally empowered public distribution ecosystem where every grain
                    is tracked, every transaction is immutable, and every beneficiary receives their rightful
                    entitlement without delay or diversion.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-xs font-bold text-green-700 mb-1">🚀 Our Mission</p>
                  <p className="text-[14px] text-gray-1000 leading-relaxed">
                    Leveraging blockchain technology to build an accountable, efficient, and sustainable
                    food security system that serves 1,111+ beneficiaries with real-time traceability
                    across all 40 Dispatch Centres in Ranchi District, Jharkhand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}>
            <p className="text-blue-300 text-[10px] font-bold tracking-widest uppercase mb-3">Ready to Explore?</p>
            <h2 className="font-display text-3xl font-black text-white mb-4">Experience Real Blockchain-Powered PDS</h2>
            <p className="text-blue-200 text-sm max-w-xl mx-auto mb-8">
              Access live dashboards with real blockchain data — 1,111 beneficiaries, 1,100 orders,
              5 P&SC zones, 40 dispatch centers across Ranchi District.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/operator"       className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm transition-all shadow-lg">
                Explore Live Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/auditor"        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white font-bold text-sm transition-all">
                View Blockchain Ledger
              </Link>
              <Link to="/beneficiaries"  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-green-400/40 hover:bg-green-400/10 text-green-300 font-bold text-sm transition-all">
                Beneficiary Portal
              </Link>
              <Link to="/admin"          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-yellow-400/40 hover:bg-yellow-400/10 text-yellow-300 font-bold text-sm transition-all">
                Admin Command Centre
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white py-8 px-4 border-t border-white/10">
        <div className="container mx-auto">
          <div className="grid gap-6 sm:grid-cols-3 mb-6">
            <div>
              <p className="font-display font-black text-lg mb-2">SMART PDS</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                A blockchain-enabled Smart Public Distribution System for Ranchi District, Jharkhand. PhD Research Project.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300 mb-2">Quick Access</p>
              <div className="space-y-1">
                {[
                  { label:"Beneficiary List",   to:"/beneficiaries" },
                  { label:"Admin Dashboard",    to:"/admin" },
                  { label:"Operator Dashboard", to:"/operator" },
                  { label:"Auditor Dashboard",  to:"/auditor" },
                ].map(l => (
                  <Link key={l.to} to={l.to} className="block text-[11px] text-slate-400 hover:text-white transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300 mb-2">Technology Stack</p>
              <div className="space-y-1 text-[11px] text-slate-400">
                <p>⛓ Hyperledger Fabric 2.5</p>
                <p>⚛ React + TypeScript + Vite</p>
                <p>🟢 Node.js Express API</p>
                <p>☁ IPFS · 📱 QR Code · 🔐 OTP</p>
                <p>📍 Ranchi, Jharkhand, India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 flex flex-wrap justify-between items-center gap-2">
            <p className="text-[10px] text-slate-500">© 2026 SMART PDS — PhD Research. All rights reserved.</p>
            <p className="text-[10px] text-slate-500">Powered by Hyperledger Fabric · IPFS · QR Technology</p>
          </div>
        </div>
      </footer>
    </div>
    );
};

export default Index;
