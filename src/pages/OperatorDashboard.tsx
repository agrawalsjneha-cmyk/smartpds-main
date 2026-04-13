import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck, Truck, QrCode, Package, CheckCircle, Warehouse,
  Search, FileText, Blocks, MapPin, Clock, ArrowRight
} from "lucide-react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Input } from "@/components/ui/input";

const dispatchLog = [
  { id: "DSP-4521", dest: "Block 7 DC", qty: "42 MT", time: "09:15 AM", status: "Dispatched", vehicle: "JH-01-AB-1234", driver: "Raj Kumar" },
  { id: "DSP-4520", dest: "Block 3 DC", qty: "28 MT", time: "08:45 AM", status: "In Transit", vehicle: "JH-01-CD-5678", driver: "Sunil Oraon" },
  { id: "DSP-4519", dest: "Block 12 DC", qty: "35 MT", time: "08:10 AM", status: "Delivered", vehicle: "JH-01-EF-9012", driver: "Mohan Das" },
  { id: "DSP-4518", dest: "Block 1 DC", qty: "50 MT", time: "07:30 AM", status: "Delivered", vehicle: "JH-01-GH-3456", driver: "Vikram Singh" },
];

const statusColor: Record<string, string> = {
  Dispatched: "bg-warning/10 text-warning",
  "In Transit": "bg-secondary/10 text-secondary",
  Delivered: "bg-success/10 text-success",
};

const inventoryLedger = [
  { location: "Godown-1 (FCI)", type: "FCI", stockIn: 450, stockOut: 380, balance: 70, lat: "23.3441°N", lng: "85.3096°E" },
  { location: "Godown-2 (SWC)", type: "SWC", stockIn: 320, stockOut: 290, balance: 30, lat: "23.3601°N", lng: "85.3300°E" },
  { location: "P&SC Alpha", type: "P&SC", stockIn: 280, stockOut: 265, balance: 15, lat: "23.3500°N", lng: "85.3200°E" },
  { location: "DC Block 7", type: "DC", stockIn: 180, stockOut: 175, balance: 5, lat: "23.3700°N", lng: "85.3400°E" },
];

const orders = [
  { id: "ORD-2201", beneficiary: "Rajesh Kumar", items: "Wheat 5kg, Rice 5kg", status: "Aggregated" },
  { id: "ORD-2202", beneficiary: "Meena Devi", items: "Wheat 5kg, Rice 5kg, Sugar 1kg", status: "Pending" },
  { id: "ORD-2203", beneficiary: "Suresh Oraon", items: "Wheat 5kg, Rice 5kg", status: "Aggregated" },
];

const allocationOrders = [
  { month: "March 2026", commodity: "Wheat", entitled: "320 MT", plan: "Generated" },
  { month: "March 2026", commodity: "Rice", entitled: "280 MT", plan: "Generated" },
  { month: "March 2026", commodity: "Sugar", entitled: "45 MT", plan: "Pending" },
];

const receipts = [
  { id: "REC-1101", from: "Godown-1", to: "P&SC Alpha", qty: "42 MT", date: "2026-03-30", status: "Verified" },
  { id: "REC-1100", from: "P&SC Alpha", to: "DC Block 7", qty: "18 MT", date: "2026-03-29", status: "Verified" },
  { id: "REC-1099", from: "Godown-2", to: "P&SC Beta", qty: "35 MT", date: "2026-03-29", status: "Pending" },
];

const blockchainActivity = [
  { tx: "TX-78235", chaincode: "Order Management", action: "createOrder", time: "09:15:32", block: "#148725" },
  { tx: "TX-78234", chaincode: "Packet Lifecycle", action: "printQR", time: "09:14:18", block: "#148724" },
  { tx: "TX-78233", chaincode: "Delivery Exception", action: "reportDelay", time: "09:12:05", block: "#148723" },
  { tx: "TX-78232", chaincode: "Packet Lifecycle", action: "dispatchPacket", time: "09:10:41", block: "#148722" },
];

const sackEvents = [
  { event: "QR Printed", time: "07:30 AM", location: "Godown-1" },
  { event: "Sorted & Packed", time: "08:15 AM", location: "Godown-1" },
  { event: "Dispatched", time: "08:45 AM", location: "Godown-1" },
  { event: "Delivered at P&SC", time: "10:30 AM", location: "P&SC Alpha" },
];

const packetEvents = [
  { event: "Sorted at P&SC", time: "11:00 AM", location: "P&SC Alpha" },
  { event: "Dynamic QR Printed", time: "11:15 AM", location: "P&SC Alpha" },
  { event: "Dispatched to DC", time: "12:00 PM", location: "P&SC Alpha" },
  { event: "Reached DC", time: "01:30 PM", location: "DC Block 7" },
  { event: "Dispatched to Beneficiary", time: "02:00 PM", location: "DC Block 7" },
  { event: "Delivered", time: "03:45 PM", location: "Beneficiary" },
];

const documents = [
  { name: "E-Challan #EC-4521", type: "Challan", date: "2026-03-30", size: "245 KB" },
  { name: "Delivery Proof #DP-4519", type: "Proof", date: "2026-03-30", size: "1.2 MB" },
  { name: "Quality Check #QC-887", type: "QC Report", date: "2026-03-29", size: "890 KB" },
  { name: "Signed Acknowledgement #SA-4518", type: "Acknowledgement", date: "2026-03-29", size: "320 KB" },
];

const OperatorDashboard = () => {
  const [mainTab, setMainTab] = useState<"operations" | "tracking">("operations");
  const [opsTab, setOpsTab] = useState<"inventory" | "orders" | "allocation" | "dispatch" | "receipts" | "blockchain">("inventory");

  return (
    <Layout>
      <div className="container py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
            <ClipboardCheck className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-foreground">Operator Dashboard</h1>
            <p className="text-xs text-muted-foreground">Dispatch management, tracking & blockchain activity</p>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-5">
          <StatCard icon={Truck} value="24" label="Today's Dispatches" color="secondary" />
          <StatCard icon={Package} value="186 MT" label="Grain Dispatched" delay={0.1} color="success" />
          <StatCard icon={QrCode} value="1,240" label="QR Scans Today" delay={0.2} color="primary" />
          <StatCard icon={CheckCircle} value="96.2%" label="Delivery Success" delay={0.3} color="warning" />
        </div>

        <div className="flex gap-2 mb-5">
          {(["operations", "tracking"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setMainTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mainTab === t ? "bg-secondary text-secondary-foreground shadow-sm" : "bg-muted text-muted-foreground"
              }`}
            >
              {t === "operations" ? "Operations" : "Distribution Tracking"}
            </button>
          ))}
        </div>

        {mainTab === "operations" && (
          <>
            <div className="flex gap-1.5 mb-5 flex-wrap">
              {(["inventory", "orders", "allocation", "dispatch", "receipts", "blockchain"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setOpsTab(t)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                    opsTab === t ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {opsTab === "inventory" && (
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
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">In</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Out</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Balance</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Geo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryLedger.map((i) => (
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
            )}

            {opsTab === "orders" && (
              <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="font-display font-bold text-foreground text-sm">Order Intake</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Order ID</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Beneficiary</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Items</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-2.5 font-mono text-xs text-primary font-bold">{o.id}</td>
                          <td className="px-4 py-2.5 text-xs">{o.beneficiary}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{o.items}</td>
                          <td className="px-4 py-2.5">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${o.status === "Aggregated" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {opsTab === "allocation" && (
              <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="font-display font-bold text-foreground text-sm">Plan & Allocation</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Month</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Commodity</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Entitled</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Plan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocationOrders.map((a, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5 text-xs">{a.month}</td>
                          <td className="px-4 py-2.5 text-xs font-bold">{a.commodity}</td>
                          <td className="px-4 py-2.5 text-xs">{a.entitled}</td>
                          <td className="px-4 py-2.5">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${a.plan === "Generated" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{a.plan}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {opsTab === "dispatch" && (
              <div className="space-y-5">
                <div className="rounded-xl bg-card p-5 border border-secondary/20 stat-card">
                  <h3 className="font-display font-bold text-foreground mb-3 text-sm">Create Dispatch</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground">From</label>
                      <select className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs mt-1">
                        <option>Godown-1 (FCI)</option>
                        <option>Godown-2 (SWC)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground">To</label>
                      <select className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs mt-1">
                        <option>P&SC Alpha</option>
                        <option>DC Block 7</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground">Vehicle No.</label>
                      <Input placeholder="JH-01-XX-XXXX" className="rounded-lg mt-1 h-8 text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground">Driver</label>
                      <Input placeholder="Driver name" className="rounded-lg mt-1 h-8 text-xs" />
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-bold text-xs hover:bg-secondary/90">Create Dispatch</button>
                </div>

                <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-display font-bold text-foreground text-sm">Today's Dispatch Log</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">ID</th>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Dest</th>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Qty</th>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Vehicle</th>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Time</th>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dispatchLog.map((d) => (
                          <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                            <td className="px-3 py-2.5 font-mono text-[10px] text-primary font-bold">{d.id}</td>
                            <td className="px-3 py-2.5 text-xs">{d.dest}</td>
                            <td className="px-3 py-2.5 text-xs font-medium">{d.qty}</td>
                            <td className="px-3 py-2.5 text-[10px] text-muted-foreground">{d.vehicle}</td>
                            <td className="px-3 py-2.5 text-xs text-muted-foreground">{d.time}</td>
                            <td className="px-3 py-2.5">
                              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${statusColor[d.status]}`}>{d.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {opsTab === "receipts" && (
              <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="font-display font-bold text-foreground text-sm">Receipt Log</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">ID</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">From</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">To</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Qty</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Date</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipts.map((r) => (
                        <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-2.5 font-mono text-xs text-primary font-bold">{r.id}</td>
                          <td className="px-4 py-2.5 text-xs">{r.from}</td>
                          <td className="px-4 py-2.5 text-xs">{r.to}</td>
                          <td className="px-4 py-2.5 text-xs font-medium">{r.qty}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.date}</td>
                          <td className="px-4 py-2.5">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${r.status === "Verified" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {opsTab === "blockchain" && (
              <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="font-display font-bold text-foreground text-sm">Blockchain Activity Timeline</h3>
                </div>
                <div className="p-4 space-y-3">
                  {blockchainActivity.map((b) => (
                    <div key={b.tx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Blocks className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-foreground">{b.chaincode}</p>
                        <p className="text-[10px] text-muted-foreground">{b.action} · Block {b.block}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] text-primary font-bold">{b.tx}</p>
                        <p className="text-[10px] text-muted-foreground">{b.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {mainTab === "tracking" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-card p-5 stat-card border border-border">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm">Batch/Sack Traceability (Godown → P&SC, Static QR)</h3>
              <div className="flex gap-2 mb-4">
                <Input placeholder="Search by Sack ID or scan QR..." className="rounded-lg h-9 max-w-sm" />
                <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground mb-2">Sack Events</h4>
                  <div className="space-y-2">
                    {sackEvents.map((e, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i < sackEvents.length - 1 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{e.event}</p>
                          <p className="text-[10px] text-muted-foreground">{e.time} · {e.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-muted/30 p-3">
                  <h4 className="text-xs font-bold text-muted-foreground mb-2">Vehicle Info</h4>
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-muted-foreground">Vehicle:</span> <strong>JH-01-AB-1234</strong></p>
                    <p><span className="text-muted-foreground">Route:</span> <strong>Godown-1 → P&SC Alpha</strong></p>
                    <p><span className="text-muted-foreground">ETA:</span> <strong>10:30 AM</strong></p>
                    <p><span className="text-muted-foreground">Weight:</span> <strong>42 MT (84 sacks)</strong></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card p-5 stat-card border border-border">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm">Packet Traceability (P&SC → DC → Beneficiary, Dynamic QR)</h3>
              <div className="flex gap-2 mb-4">
                <Input placeholder="Search by Packet ID or scan QR..." className="rounded-lg h-9 max-w-sm" />
                <button className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-bold text-xs">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {packetEvents.map((e, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      i === packetEvents.length - 1 ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                    }`}>
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">{e.event}</p>
                      <p className="text-[10px] text-muted-foreground">{e.time} · {e.location}</p>
                    </div>
                    {i < packetEvents.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/30" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-bold text-foreground text-sm">Document Vault</h3>
              </div>
              <div className="divide-y divide-border">
                {documents.map((d) => (
                  <div key={d.name} className="p-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-bold text-foreground">{d.name}</p>
                        <p className="text-[10px] text-muted-foreground">{d.type} · {d.date} · {d.size}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-secondary hover:underline">View</button>
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

export default OperatorDashboard;
