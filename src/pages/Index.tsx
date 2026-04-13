import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, MapPin, TrendingUp, Blocks, Wheat,
  ArrowRight, Eye, Target, CalendarDays,
  Megaphone, Bell, ChevronLeft, ChevronRight,
} from "lucide-react";
import RanchiDistrictMap from "@/components/RanchiDistrictMap";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import heroSupplyChain from "@/assets/hero-supply-chain.png";

const stats = [
  { icon: Users, value: "35 Lakh+", label: "Beneficiaries Covered", color: "secondary" as const },
  { icon: MapPin, value: "18", label: "Blocks Covered", color: "primary" as const },
  { icon: TrendingUp, value: "6,500 MT", label: "Monthly Grain Movement", color: "success" as const },
  { icon: Blocks, value: "1.2M+", label: "Blockchain Transactions", color: "warning" as const },
];


const announcements = [
  { date: "2026-04-05", title: "April Grain Allocation Released", desc: "Monthly allocation for all 18 blocks has been published. Godowns can begin dispatch.", type: "info" as const },
  { date: "2026-04-03", title: "System Maintenance – April 8", desc: "Scheduled maintenance window from 2:00 AM to 5:00 AM IST. Dashboard may be unavailable.", type: "warning" as const },
  { date: "2026-04-01", title: "New Block Added: Khelari", desc: "Khelari block is now fully onboarded with QR-enabled tracking at all distribution points.", type: "success" as const },
  { date: "2026-03-28", title: "Leakage Alert – Bundu Block", desc: "Discrepancy detected in wheat dispatch vs delivery. Audit initiated.", type: "alert" as const },
  { date: "2026-03-25", title: "Beneficiary Verification Drive", desc: "Aadhaar-based re-verification for 12,000+ beneficiaries completed across Kanke & Ratu.", type: "info" as const },
  { date: "2026-03-20", title: "OTIF Improvement Report", desc: "On-Time In-Full delivery rate improved to 94.2% district-wide for March cycle.", type: "success" as const },
];

const typeStyles = {
  info: "bg-secondary/10 text-secondary border-secondary/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
  alert: "bg-destructive/10 text-destructive border-destructive/20",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Mock events for the calendar
const calendarEvents: Record<string, { label: string; color: string }[]> = {
  "2026-04-01": [{ label: "Allocation Release", color: "bg-secondary" }],
  "2026-04-05": [{ label: "Dispatch Start", color: "bg-success" }],
  "2026-04-08": [{ label: "Maintenance", color: "bg-warning" }],
  "2026-04-10": [{ label: "Audit Review", color: "bg-destructive" }],
  "2026-04-15": [{ label: "Mid-cycle Report", color: "bg-secondary" }],
  "2026-04-20": [{ label: "Verification Drive", color: "bg-accent" }],
  "2026-04-25": [{ label: "Monthly Review", color: "bg-primary" }],
  "2026-04-30": [{ label: "Cycle Close", color: "bg-success" }],
};

function InteractiveCalendar() {
  const [current, setCurrent] = useState(new Date(2026, 3, 6)); // April 2026
  const [selected, setSelected] = useState<string | null>(null);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const toKey = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="rounded-xl bg-card border border-border p-5 stat-card">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-display text-base font-bold text-foreground">
          {MONTHS[month]} {year}
        </h3>
        <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-bold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const key = toKey(day);
          const events = calendarEvents[key];
          const isSelected = selected === key;
          const isToday = key === "2026-04-06";

          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(isSelected ? null : key)}
              className={`relative rounded-lg p-1.5 text-sm font-medium transition-all duration-200
                ${isToday ? "ring-2 ring-secondary ring-offset-1 ring-offset-card" : ""}
                ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}
              `}
            >
              {day}
              {events && (
                <div className="flex gap-0.5 justify-center mt-0.5">
                  {events.map((e, ei) => (
                    <span key={ei} className={`w-1.5 h-1.5 rounded-full ${e.color}`} />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selected && calendarEvents[selected] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 border-t border-border pt-3 space-y-1.5"
        >
          {calendarEvents[selected].map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${e.color}`} />
              <span className="text-foreground font-medium">{e.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary min-h-[540px] flex items-center">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-28 h-28 rounded-full bg-accent animate-float" />
        <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-secondary animate-float" style={{ animationDelay: "1s" }} />
      </div>
      <div className="container relative py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-md bg-accent/20 px-3 py-1 text-xs font-bold text-primary-foreground backdrop-blur-sm border border-accent/30 mb-5">
              <Blocks className="h-3 w-3" /> Powered by Hyperledger Fabric
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-primary-foreground leading-tight">
              SMART Public<br />Distribution<br />System
            </h1>
            <p className="mt-4 text-base md:text-lg text-primary-foreground/75 max-w-xl leading-relaxed">
              A blockchain-enabled, transparent, and accountable food grain distribution system — ensuring every grain reaches the right beneficiary in Ranchi, Jharkhand.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg px-6 shadow-md">
                <Link to="/dashboard">
                  View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent rounded-lg px-6">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative bg-primary-foreground/5 backdrop-blur-md rounded-2xl p-5 border border-primary-foreground/10">
              <img src={heroSupplyChain} alt="SMART PDS Supply Chain" width={600} height={300} className="w-full h-auto rounded-xl animate-float" />
              <div className="h-1.5 rounded-full animate-chain-flow mx-4 mt-3" />
              <p className="text-center text-xs text-primary-foreground/40 mt-2 font-medium">🔗 Immutable Blockchain Chain</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="container -mt-12 relative z-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.1} />
        ))}
      </div>
    </section>

    {/* Overview */}
    <section className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <span className="inline-flex items-center gap-2 rounded-md bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary mb-3">
            <Wheat className="h-3 w-3" /> How It Works
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black text-foreground">How SMART PDS Works</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            SMART PDS integrates <strong className="text-foreground">Hyperledger Fabric</strong> permissioned blockchain,
            dynamic watermarked QR codes, IPFS document storage, and real-time monitoring dashboards to eliminate grain diversion
            and ensure complete traceability across the entire supply chain.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Vision & Mission */}
    <section className="bg-muted/50 py-16">
      <div className="container grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="rounded-xl bg-card p-6 stat-card border border-secondary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Eye className="h-5 w-5 text-secondary" />
            </div>
            <h3 className="font-display text-lg font-black text-foreground">Our Vision</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A fully transparent, digitally empowered public distribution ecosystem where every grain
            is tracked, every transaction is immutable, and every beneficiary receives their rightful entitlement
            without delay or diversion.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="rounded-xl bg-card p-6 stat-card border border-accent/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <h3 className="font-display text-lg font-black text-foreground">Our Mission</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Leveraging blockchain technology to build an accountable, efficient, and sustainable
            food security system that serves 35 lakh+ beneficiaries with real-time traceability
            across all 18 blocks of Ranchi.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Important Updates & Announcements */}
    <section className="container py-16">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
        <span className="inline-flex items-center gap-2 rounded-md bg-warning/10 px-3 py-1 text-xs font-bold text-warning mb-3">
          <Megaphone className="h-3 w-3" /> Updates
        </span>
        <h2 className="font-display text-2xl font-black text-foreground">Important Updates & Announcements</h2>
        <p className="text-sm text-muted-foreground mt-1">Latest news and alerts from SMART PDS operations</p>
      </motion.div>
      <div className="grid gap-3 max-w-3xl mx-auto">
        {announcements.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-xl bg-card p-4 stat-card border flex items-start gap-4 ${typeStyles[a.type].split(" ").filter(c => c.startsWith("border-")).join(" ")}`}
          >
            <div className={`flex-shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${typeStyles[a.type].split(" ").filter(c => c.startsWith("bg-")).join(" ")}`}>
              <Bell className={`h-4 w-4 ${typeStyles[a.type].split(" ").filter(c => c.startsWith("text-")).join(" ")}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-foreground">{a.title}</h4>
                <span className="text-[10px] font-medium text-muted-foreground">{a.date}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Ranchi District Map – 18 Blocks */}
    <section className="bg-muted/30 py-16">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-md bg-success/10 px-3 py-1 text-xs font-bold text-success mb-3">
            <MapPin className="h-3 w-3" /> District Map
          </span>
          <h2 className="font-display text-2xl font-black text-foreground">Ranchi District – 18 Blocks</h2>
          <p className="text-sm text-muted-foreground mt-1">All operational blocks with Godown, P&SC, and Dispatch Centers</p>
        </motion.div>
        <RanchiDistrictMap />
      </div>
    </section>

    {/* Interactive Calendar */}
    <section className="container py-16">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
        <span className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
          <CalendarDays className="h-3 w-3" /> Schedule
        </span>
        <h2 className="font-display text-2xl font-black text-foreground">Distribution Calendar</h2>
        <p className="text-sm text-muted-foreground mt-1">Track dispatch schedules, audits, and key operational dates</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <InteractiveCalendar />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-card border border-border p-5 stat-card space-y-3"
        >
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-secondary" /> Upcoming Events
          </h3>
          {Object.entries(calendarEvents)
            .filter(([date]) => date >= "2026-04-06")
            .slice(0, 5)
            .map(([date, events]) => (
              <div key={date} className="flex items-start gap-3 text-sm border-b border-border/50 pb-2 last:border-0">
                <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap min-w-[70px]">
                  {new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </span>
                <div className="space-y-0.5">
                  {events.map((e, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${e.color}`} />
                      <span className="text-foreground font-medium text-xs">{e.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary py-16">
      <div className="container text-center relative">
        <h2 className="font-display text-2xl md:text-3xl font-black text-primary-foreground">Ready to Explore?</h2>
        <p className="mt-2 text-primary-foreground/70">Access the operational dashboard or log in to your role-based portal.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg" className="font-bold bg-primary-foreground text-primary rounded-lg px-6 hover:bg-primary-foreground/90">
            <Link to="/dashboard">Operational Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent rounded-lg px-6">
            <Link to="/login">Login Portal</Link>
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
