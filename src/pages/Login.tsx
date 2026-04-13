import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, User, ClipboardCheck, Eye, Settings, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import loginRoles from "@/assets/login-roles.png";

const roles = [
  { id: "admin", label: "Admin", icon: Settings, desc: "System-wide monitoring & approvals", path: "/admin", color: "bg-destructive/10 border-destructive/20 text-destructive", emoji: "🔴", demo: { user: "admin@smartpds", pass: "admin123" } },
  { id: "operator", label: "Operator", icon: ClipboardCheck, desc: "Dispatch & delivery management", path: "/operator", color: "bg-secondary/10 border-secondary/20 text-secondary", emoji: "🟠", demo: { user: "operator@smartpds", pass: "operator123" } },
  { id: "auditor", label: "Auditor", icon: Eye, desc: "Transaction verification & audit", path: "/auditor", color: "bg-warning/10 border-warning/20 text-warning", emoji: "🟡", demo: { user: "auditor@smartpds", pass: "auditor123" } },
  { id: "beneficiary", label: "Beneficiary", icon: User, desc: "Entitlements & delivery tracking", path: "/beneficiary", color: "bg-success/10 border-success/20 text-success", emoji: "🟢", demo: { user: "beneficiary@smartpds", pass: "ben123" } },
];

const Login = () => {
  const [selected, setSelected] = useState("admin");
  const navigate = useNavigate();
  const activeRole = roles.find((r) => r.id === selected)!;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(activeRole.path);
  };

  return (
    <Layout>
      <div className="container py-12">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md">
          <div className="text-center mb-6">
            <img src={loginRoles} alt="Role-based login" width={240} height={240} className="mx-auto mb-3 w-full max-w-[220px] h-auto" />
            <h1 className="font-display text-2xl font-black text-foreground">Login to SMART PDS</h1>
            <p className="text-sm text-muted-foreground mt-1">Select your role and enter credentials</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {roles.map((r) => (
              <motion.button
                key={r.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelected(r.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition-all ${
                  selected === r.id
                    ? `${r.color} ring-2 ring-offset-1`
                    : "border-border bg-card hover:border-secondary/20"
                }`}
              >
                <span className="text-xl">{r.emoji}</span>
                <span className={`text-xs font-bold ${selected === r.id ? "" : "text-foreground"}`}>{r.label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{r.desc}</span>
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="rounded-xl border border-border bg-card p-5 space-y-3 stat-card">
            <div className="rounded-lg bg-muted/50 p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground font-bold">Demo Credentials for {activeRole.label}</p>
              <p className="text-xs text-foreground font-mono mt-0.5">{activeRole.demo.user} / {activeRole.demo.pass}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-bold">Username / ID</Label>
              <Input id="username" placeholder="Enter your ID" defaultValue={activeRole.demo.user} className="rounded-lg h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" defaultValue={activeRole.demo.pass} className="rounded-lg h-9" />
            </div>
            <Button type="submit" className="w-full font-bold rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground py-4">
              Login as {activeRole.label} {activeRole.emoji}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground">🔒 Demo mode — click Login to proceed</p>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
