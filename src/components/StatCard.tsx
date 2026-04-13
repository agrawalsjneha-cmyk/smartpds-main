import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  delay?: number;
  color?: "primary" | "saffron" | "secondary" | "golden" | "success" | "warning";
}

const AnimatedCounter = ({ value }: { value: string }) => {
  const [display, setDisplay] = useState(value);
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const hasNumber = !isNaN(numeric) && numeric > 0;

  useEffect(() => {
    if (!hasNumber) return;
    const prefix = value.match(/^[^0-9]*/)?.[0] || "";
    const suffix = value.match(/[^0-9.]*$/)?.[0] || "";
    const isDecimal = value.includes(".");
    const duration = 1200;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numeric * eased;
      const formatted = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, numeric, hasNumber]);

  return <span>{display}</span>;
};

const colorMap = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  saffron: { bg: "bg-accent/10", text: "text-accent" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary" },
  golden: { bg: "bg-warning/15", text: "text-warning" },
  success: { bg: "bg-success/10", text: "text-success" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
};

const StatCard = ({ icon: Icon, value, label, delay = 0, color = "primary" }: StatCardProps) => {
  const c = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="stat-card rounded-xl bg-card p-5 text-center border border-border"
    >
      <div className={`mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl ${c.bg}`}>
        <Icon className={`h-6 w-6 ${c.text}`} />
      </div>
      <p className="font-display text-2xl font-extrabold text-foreground">
        <AnimatedCounter value={value} />
      </p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </motion.div>
  );
};

export default StatCard;
