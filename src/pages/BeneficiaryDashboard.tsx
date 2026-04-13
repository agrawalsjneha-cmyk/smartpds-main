import { useState } from "react";
import { motion } from "framer-motion";
import { User, Package, QrCode, History, CheckCircle, Clock, Search, Shield } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";

const entitlements = [
  { item: "Wheat", entitled: "5 kg", received: "5 kg", price: "₹2/kg", status: "Delivered" },
  { item: "Rice", entitled: "5 kg", received: "5 kg", price: "₹3/kg", status: "Delivered" },
  { item: "Sugar", entitled: "1 kg", received: "—", price: "₹13.50/kg", status: "Pending" },
  { item: "Kerosene", entitled: "3 L", received: "3 L", price: "₹32/L", status: "Delivered" },
];

const txHistory = [
  { id: "BEN-9921", date: "2026-03-28", items: "Wheat (5kg), Rice (5kg)", qty: "10 kg", price: "₹25", status: "Collected" },
  { id: "BEN-9845", date: "2026-02-27", items: "Wheat (5kg), Rice (5kg), Sugar (1kg)", qty: "11 kg", price: "₹38.50", status: "Collected" },
  { id: "BEN-9780", date: "2026-01-29", items: "Wheat (5kg), Rice (5kg), Kerosene (3L)", qty: "10 kg + 3L", price: "₹121", status: "Collected" },
];

const authEvents = [
  { type: "QR Scan", status: "Success", time: "2026-03-28 10:15 AM", detail: "Ration card QR verified" },
  { type: "OTP Verification", status: "Success", time: "2026-03-28 10:16 AM", detail: "OTP sent to ****7842" },
  { type: "SMS Confirmation", status: "Success", time: "2026-03-28 10:18 AM", detail: "Collection confirmed via SMS" },
  { type: "QR Scan", status: "Failed", time: "2026-02-27 09:42 AM", detail: "Invalid QR — retried after 2 min" },
  { type: "OTP Verification", status: "Success", time: "2026-02-27 09:45 AM", detail: "OTP sent to ****7842" },
];

const BeneficiaryDashboard = () => {
  const [qrScanned, setQrScanned] = useState(false);

  return (
    <Layout>
      <div className="container py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <User className="h-5 w-5 text-success" />
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-foreground">Beneficiary Portal</h1>
            <p className="text-xs text-muted-foreground">View entitlements, track delivery, verify collections</p>
          </div>
        </motion.div>

        <div className="rounded-xl bg-card p-4 border border-border stat-card mb-5">
          <h3 className="font-display font-bold text-foreground mb-2 text-sm">Beneficiary Registry</h3>
          <div className="flex gap-2">
            <Input placeholder="Search by Beneficiary ID or Ration Card..." className="rounded-lg h-9 max-w-sm" />
            <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs">
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3 mb-6">
          <div className="rounded-xl bg-card border border-border p-5 stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-2xl">
                👨‍🌾
              </div>
              <div>
                <p className="font-display font-black text-foreground text-base">Rajesh Kumar</p>
                <p className="text-[10px] text-muted-foreground font-mono">JH-RAN-2024-84521</p>
              </div>
            </div>
            <div className="space-y-1.5 rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground flex justify-between">Family <strong className="text-foreground">4</strong></p>
              <p className="text-xs text-muted-foreground flex justify-between">Category <strong className="text-foreground">AAY</strong></p>
              <p className="text-xs text-muted-foreground flex justify-between">Aadhaar <strong className="text-foreground">XXXX-XXXX-7842</strong></p>
              <p className="text-xs text-muted-foreground flex justify-between">Status <span className="rounded-md bg-success/10 text-success px-1.5 py-0.5 text-[10px] font-bold">Active</span></p>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-dashed border-success/30 p-5 flex flex-col items-center justify-center text-center stat-card">
            {qrScanned ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
                <h3 className="font-display font-black text-success text-base">Verified!</h3>
                <p className="text-xs text-muted-foreground mt-1">QR authentication successful.</p>
                <button onClick={() => setQrScanned(false)} className="mt-3 text-xs text-primary font-bold hover:underline">Reset</button>
              </motion.div>
            ) : (
              <>
                <QrCode className="h-16 w-16 text-muted-foreground/30 mb-2" />
                <h3 className="font-display font-black text-foreground text-sm">QR Verification</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Scan your ration card QR</p>
                <button
                  onClick={() => setQrScanned(true)}
                  className="mt-3 rounded-lg bg-success px-4 py-2 text-xs font-bold text-success-foreground hover:bg-success/90 transition-colors"
                >
                  📱 Simulate QR Scan
                </button>
              </>
            )}
          </div>

          <div className="rounded-xl bg-card border border-border p-5 stat-card">
            <h3 className="font-display font-black text-foreground mb-3 text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-secondary" /> Delivery Status
            </h3>
            <div className="space-y-3">
              {[
                { text: "Dispatched from Warehouse", date: "Mar 26, 2026", done: true },
                { text: "Arrived at P&SC Alpha", date: "Mar 27, 2026", done: true },
                { text: "Dispatched to DC Block 7", date: "Mar 28, 2026", done: true },
                { text: "Ready for Collection", date: "Visit nearest FPS", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {step.done ? (
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning shrink-0 animate-pulse" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-foreground">{step.text}</p>
                    <p className="text-[10px] text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card stat-card overflow-hidden border border-border mb-6">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-black text-foreground text-sm">Monthly Entitlements — March 2026</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Item</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Entitled</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Received</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Price</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {entitlements.map((e) => (
                  <tr key={e.item} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-xs font-bold">{e.item}</td>
                    <td className="px-4 py-2.5 text-xs">{e.entitled}</td>
                    <td className="px-4 py-2.5 text-xs">{e.received}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{e.price}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        e.status === "Delivered" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-card stat-card overflow-hidden border border-border mb-6">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-black text-foreground text-sm flex items-center gap-2">
              <History className="h-4 w-4 text-primary" /> Collection History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">ID</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Date</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Items</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Qty</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Price</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {txHistory.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-mono text-[10px] text-primary font-bold">{tx.id}</td>
                    <td className="px-4 py-2.5 text-xs">{tx.date}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{tx.items}</td>
                    <td className="px-4 py-2.5 text-xs font-medium">{tx.qty}</td>
                    <td className="px-4 py-2.5 text-xs font-bold text-secondary">{tx.price}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-black text-foreground text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-warning" /> Authorization Events Trail
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {authEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  e.status === "Success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}>
                  {e.status === "Success" ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">{e.type}</p>
                  <p className="text-[10px] text-muted-foreground">{e.detail}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    e.status === "Success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>{e.status}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BeneficiaryDashboard;
