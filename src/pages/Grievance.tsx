import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Upload, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import grievanceSupport from "@/assets/grievance-support.png";

const categories = ["Grain Quality Issue", "Delayed Delivery", "Wrong Quantity", "QR Code Problem", "Authentication Failure", "Other"];

const sampleGrievances = [
  { id: "GRV-2024-001", name: "Suresh Kumar", block: "Kanke", category: "Delayed Delivery", status: "Resolved", date: "2026-03-15" },
  { id: "GRV-2024-002", name: "Meena Devi", block: "Ratu", category: "Wrong Quantity", status: "Under Review", date: "2026-03-22" },
  { id: "GRV-2024-003", name: "Ramesh Oraon", block: "Bundu", category: "QR Code Problem", status: "Submitted", date: "2026-03-28" },
];

const statusStyle: Record<string, { icon: typeof CheckCircle; color: string }> = {
  Submitted: { icon: Clock, color: "text-warning bg-warning/10" },
  "Under Review": { icon: AlertCircle, color: "text-secondary bg-secondary/10" },
  Resolved: { icon: CheckCircle, color: "text-success bg-success/10" },
};

const Grievance = () => {
  const [trackingId, setTrackingId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Layout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-12">
        <div className="container relative">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-md bg-accent/20 px-3 py-1 text-xs font-bold text-primary-foreground mb-3">
              📝 Support
            </span>
            <h1 className="font-display text-3xl font-black text-primary-foreground">Grievance Portal</h1>
            <p className="mt-2 text-primary-foreground/70">Submit and track your complaints</p>
          </motion.div>
        </div>
      </section>

      <div className="container py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-xl bg-card border border-border p-6 stat-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-black text-foreground">Submit a Grievance</h2>
                  <p className="text-xs text-muted-foreground">Fill in the details below</p>
                </div>
              </div>

              {submitted ? (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center py-10">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                  <h3 className="font-display text-lg font-black text-success">Grievance Submitted!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Ticket ID: <strong className="text-foreground font-mono">GRV-2024-004</strong></p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Full Name</Label>
                      <Input placeholder="Enter your name" className="rounded-lg h-9" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Beneficiary ID</Label>
                      <Input placeholder="JH-RAN-XXXX-XXXXX" className="rounded-lg h-9" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Block</Label>
                    <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm h-9" required>
                      <option value="">Select Block</option>
                      {["Kanke", "Ratu", "Namkum", "Bundu", "Tamar", "Mandar", "Chanho", "Angara", "Silli", "Sonahatu"].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Issue Category</Label>
                    <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm h-9" required>
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Description</Label>
                    <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[80px]" placeholder="Describe your issue..." required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Attach File (optional)</Label>
                    <div className="border border-dashed border-border rounded-lg p-4 text-center hover:border-secondary/40 transition-colors cursor-pointer">
                      <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Click to upload · PNG, JPG, PDF up to 5MB</p>
                    </div>
                  </div>
                  <Button type="submit" className="w-full font-bold rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground py-4">
                    <Send className="h-4 w-4 mr-2" /> Submit Grievance
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="rounded-xl bg-card border border-border p-6 stat-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-black text-foreground">Track Grievance</h2>
                  <p className="text-xs text-muted-foreground">Enter your ticket ID</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="GRV-2024-XXX" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} className="rounded-lg h-9" />
                <Button className="rounded-lg bg-primary hover:bg-primary/90 px-5 h-9">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-5 space-y-3">
                <h3 className="font-display font-bold text-foreground text-xs">Status Timeline</h3>
                {["Submitted", "Under Review", "Resolved"].map((step, i) => {
                  const s = statusStyle[step];
                  return (
                    <div key={step} className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${s.color}`}>
                        <s.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-foreground">{step}</p>
                        <p className="text-[10px] text-muted-foreground">{i === 0 ? "Ticket created" : i === 1 ? "Being investigated" : "Issue resolved"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-muted/30 border border-accent/20 p-6 text-center">
              <img src={grievanceSupport} alt="Support team" loading="lazy" width={250} height={250} className="mx-auto w-full max-w-[220px] h-auto mb-3" />
              <h3 className="font-display text-base font-black text-foreground">We're Here to Help!</h3>
              <p className="text-xs text-muted-foreground mt-1">Our team reviews every grievance within 48 hours.</p>
            </div>

            <div className="rounded-xl bg-card border border-border p-5 stat-card">
              <h3 className="font-display font-bold text-foreground mb-3 text-sm">Recent Grievances</h3>
              <div className="space-y-2">
                {sampleGrievances.map((g) => {
                  const s = statusStyle[g.status];
                  return (
                    <div key={g.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                      <div>
                        <p className="text-xs font-mono font-bold text-primary">{g.id}</p>
                        <p className="text-xs text-foreground">{g.category}</p>
                        <p className="text-[10px] text-muted-foreground">{g.name} · {g.block}</p>
                      </div>
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${s.color}`}>{g.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Grievance;
