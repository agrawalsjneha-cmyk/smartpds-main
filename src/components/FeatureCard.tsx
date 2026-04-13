import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  color?: string;
}

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary", border: "hover:border-primary/30" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", border: "hover:border-secondary/30" },
  saffron: { bg: "bg-accent/10", text: "text-accent", border: "hover:border-accent/30" },
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0, color = "primary" }: FeatureCardProps) => {
  const c = colorClasses[color] || colorClasses.primary;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className={`stat-card group rounded-xl bg-card p-5 border border-border ${c.border} transition-all duration-200`}
    >
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg ${c.bg} group-hover:scale-105 transition-transform`}>
        <Icon className={`h-5 w-5 ${c.text}`} />
      </div>
      <h3 className="font-display text-base font-bold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
