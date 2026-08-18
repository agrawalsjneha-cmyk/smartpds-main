import { motion } from "framer-motion";
import { Warehouse, Package, Truck, Users, ArrowRight, AlertTriangle, CheckCircle, Blocks, QrCode, Globe, Zap } from "lucide-react";
import comparisonCities from "@/assets/comparison-cities.png";
import Layout from "@/components/Layout";

const supplyChain = [
  { icon: Warehouse, label: "District Warehouse", desc: "FCI/SWC/CWC grain storage", emoji: "🏭" },
  { icon: Package, label: "P&SC", desc: "QR-coded package sorting", emoji: "📦" },
  { icon: Truck, label: "Dispatch Center", desc: "Block-level distribution", emoji: "🚛" },
  { icon: Users, label: "Beneficiary Doorstep", desc: "Verified delivery", emoji: "🏠" },
];

const problems = [
  "Grain diversion and pilferage at multiple supply chain nodes",
  "Lack of real-time traceability from warehouse to beneficiary",
  "Manual record-keeping prone to errors and manipulation",
  "Weak enforcement mechanisms for accountability",
  "Delayed delivery impacting food security of vulnerable populations",
  "Ghost beneficiaries and duplicate ration cards",
];

const solutions = [
  "Immutable blockchain ledger records every transaction",
  "Dynamic watermarked QR codes for package identification",
  "Demand-driven distribution replaces quota-based allocation",
  "Real-time dashboards provide instant visibility to all stakeholders",
  "Role-based access ensures secure, authorized system interaction",
  "IPFS-stored documents for tamper-proof evidence",
  "Aadhaar-linked verification eliminates ghost beneficiaries",
];

const howItWorks = [
  { icon: Blocks, title: "Hyperledger Fabric", desc: "Permissioned blockchain with multiple peer organizations (GodownOrg, P&SCOrg, DCOrg) maintaining consensus on grain movements.", emoji: "🔗" },
  { icon: QrCode, title: "Dynamic Watermarked QR", desc: "Each packet gets a unique QR code with embedded watermark. Static QR for sacks (Godown→P&SC), Dynamic QR for packets (P&SC→Beneficiary).", emoji: "📱" },
  { icon: Globe, title: "IPFS Document Storage", desc: "E-challans, delivery proofs, and quality certificates are stored on IPFS for immutable, decentralized document management.", emoji: "📄" },
  { icon: Zap, title: "Smart Contracts", desc: "Chaincode automates order management, packet lifecycle, and delivery exception handling with tamper-proof execution.", emoji: "⚡" },
];

const About = () => (
  <Layout>
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-16">
      <div className="container relative">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-md bg-accent/20 px-3 py-1 text-xs font-bold text-primary-foreground mb-3">
            📚 About
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-primary-foreground">About SMART PDS</h1>
          <p className="mt-3 text-base text-primary-foreground/75 leading-relaxed">
            Understanding the challenges of India's Public Distribution System and how blockchain technology transforms it into a transparent, efficient, and accountable ecosystem.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Comparison */}
    <section className="container py-16">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
        <h2 className="font-display text-2xl font-black text-foreground">Conventional PDS vs SMART PDS</h2>
        <p className="text-muted-foreground mt-3 max-w-x1 mx-auto leading-relaxed">
          Conventional PDS moves grain through FPS-mediated, paper-based logistics, leakage, ghost beneficiaries,
          and no real-time visibility. SMART PDS replaces it with a Hyperledger Fabric-based, demand-driven chain:
          beneficiaries order, blockchain records every custody transfer, and dynamic QR + OTP confirm doorstep
          delivery.
        </p>
        <motion.img
          src={comparisonCities}
          alt="Comparison: Conventional vs SMART PDS"
          loading="lazy"           
          className="w-full max-w-7xl mx-auto rounded-xl shadow-lg mt-8 mb-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        />
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <h2 className="font-display text-lg font-black text-foreground mb-1 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" /> Conventional PDS
          </h2>
          <p className="text-xs text-destructive font-bold mb-4">❌ Chaotic, leaky, opaque</p>
          <ul className="space-y-3">
            {problems.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm text-muted-foreground">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-destructive/50" />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="rounded-xl border border-success/20 bg-success/5 p-6">
          <h2 className="font-display text-lg font-black text-foreground mb-1 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" /> SMART PDS
          </h2>
          <p className="text-xs text-success font-bold mb-4">✅ Clean, transparent, direct delivery</p>
          <ul className="space-y-3">
            {solutions.map((s) => (
              <li key={s} className="flex gap-2.5 text-sm text-muted-foreground">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-success/50" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>

    {/* Supply Chain */}
    <section className="bg-muted/30 py-16">
      <div className="container">
        <h2 className="font-display text-2xl font-black text-foreground text-center mb-10">Redesigned Supply Chain Flow</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {supplyChain.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 mb-2 text-3xl animate-bounce-gentle" style={{ animationDelay: `${i * 0.3}s` }}>
                  {step.emoji}
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">{step.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[120px]">{step.desc}</p>
              </div>
              {i < supplyChain.length - 1 && (
                <ArrowRight className="hidden md:block h-6 w-6 text-secondary/40 shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="container py-16">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
        <h2 className="font-display text-2xl font-black text-foreground">How It Works</h2>
        <p className="text-sm text-muted-foreground mt-1">The technology behind SMART PDS</p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2">
        {howItWorks.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl bg-card p-6 stat-card border border-border hover:border-secondary/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{item.emoji}</span>
              <h3 className="font-display text-base font-black text-foreground">{item.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Objectives */}
    <section className="bg-primary/5 py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-black text-foreground mb-4">System Objectives</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            SMART PDS aims to build a <strong className="text-foreground">demand-driven, traceable, and tamper-proof</strong> food
            distribution architecture for Ranchi district. By leveraging Hyperledger Fabric's permissioned blockchain,
            dynamic QR codes, IPFS document storage, and real-time analytics, the system ensures complete transparency
            from district warehouses to the beneficiaries across 18 blocks.
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
