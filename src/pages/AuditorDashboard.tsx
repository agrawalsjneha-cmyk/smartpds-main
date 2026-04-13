import { motion } from "framer-motion";
import { Eye, Search, FileText, Shield, Blocks, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Input } from "@/components/ui/input";

const auditLog = [
  { hash: "0x8a3f...e21b", block: "#148723", action: "Grain Dispatch", actor: "Operator_07", timestamp: "2026-03-30 09:15:32", verified: true, chaincode: "Packet Lifecycle" },
  { hash: "0x7c2d...f45a", block: "#148722", action: "Stock Receipt", actor: "Operator_03", timestamp: "2026-03-30 08:52:10", verified: true, chaincode: "Order Management" },
  { hash: "0x6b1e...d89c", block: "#148721", action: "Beneficiary Delivery", actor: "Operator_12", timestamp: "2026-03-30 08:31:45", verified: true, chaincode: "Delivery Exception" },
  { hash: "0x5a9f...c73b", block: "#148720", action: "Package Scan", actor: "Operator_07", timestamp: "2026-03-30 08:15:22", verified: true, chaincode: "Packet Lifecycle" },
  { hash: "0x4e8d...b62a", block: "#148719", action: "Stock Transfer", actor: "Admin_01", timestamp: "2026-03-30 07:58:17", verified: true, chaincode: "Order Management" },
  { hash: "0x3d7c...a51f", block: "#148718", action: "Allocation Update", actor: "Admin_01", timestamp: "2026-03-30 07:42:03", verified: false, chaincode: "Order Management" },
  { hash: "0x2c6b...945e", block: "#148717", action: "QR Verification", actor: "Operator_05", timestamp: "2026-03-30 07:28:51", verified: true, chaincode: "Packet Lifecycle" },
  { hash: "0x1b5a...834d", block: "#148716", action: "Dispatch Created", actor: "Operator_03", timestamp: "2026-03-30 07:15:08", verified: true, chaincode: "Packet Lifecycle" },
];

const traceability = [
  { id: "PKT-8842", origin: "Godown-1 (FCI)", current: "DC Block 7", events: 6, lastUpdate: "2026-03-30 09:15" },
  { id: "PKT-8841", origin: "Godown-2 (SWC)", current: "P&SC Alpha", events: 4, lastUpdate: "2026-03-30 08:52" },
  { id: "SACK-2204", origin: "Godown-1 (FCI)", current: "P&SC Beta", events: 3, lastUpdate: "2026-03-30 08:30" },
  { id: "PKT-8840", origin: "Godown-1 (FCI)", current: "Delivered", events: 8, lastUpdate: "2026-03-30 08:15" },
];

const AuditorDashboard = () => (
  <Layout>
    <div className="container py-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
          <Eye className="h-5 w-5 text-warning" />
        </div>
        <div>
          <h1 className="font-display text-xl font-black text-foreground">Auditor Dashboard</h1>
          <p className="text-xs text-muted-foreground">Immutable transaction logs, traceability & verification</p>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard icon={Blocks} value="148,723" label="Total Blocks" color="primary" />
        <StatCard icon={FileText} value="1.2M+" label="Recorded Transactions" delay={0.1} color="secondary" />
        <StatCard icon={Shield} value="99.97%" label="Verification Rate" delay={0.2} color="success" />
        <StatCard icon={Search} value="342" label="Audits This Month" delay={0.3} color="warning" />
      </div>

      <div className="mb-5 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input className="pl-9 rounded-lg h-9" placeholder="Search by TX hash, block, actor, or chaincode..." />
        </div>
      </div>

      <div className="rounded-xl bg-card stat-card overflow-hidden border border-border mb-6">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-bold text-foreground text-sm">Blockchain Audit Log</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Immutable records from Hyperledger Fabric</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">TX Hash</th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Block</th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Chaincode</th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Action</th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Actor</th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Timestamp</th>
                <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Verified</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((log) => (
                <tr key={log.hash} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-[10px] text-primary font-bold">{log.hash}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px]">{log.block}</td>
                  <td className="px-3 py-2.5"><span className="rounded-md bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-bold">{log.chaincode}</span></td>
                  <td className="px-3 py-2.5 text-xs font-medium">{log.action}</td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{log.actor}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-[10px]">{log.timestamp}</td>
                  <td className="px-3 py-2.5">
                    {log.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-warning/10 px-1.5 py-0.5 text-[10px] font-bold text-warning">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-bold text-foreground text-sm">Traceability Records</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Track any packet or sack from origin to current location</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Origin</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Current Location</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Events</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {traceability.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-mono text-xs text-primary font-bold">{t.id}</td>
                  <td className="px-4 py-2.5 text-xs">{t.origin}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${t.current === "Delivered" ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary"}`}>{t.current}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs font-bold">{t.events}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{t.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Layout>
);

export default AuditorDashboard;
