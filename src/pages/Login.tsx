import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import avatarAdmin from "@/assets/avatar-admin.png";
import avatarOperator from "@/assets/avatar-operator.png";
import avatarAuditor from "@/assets/avatar-auditor.png";
import avatarBeneficiary from "@/assets/avatar-beneficiary.png";

const DEMO_CREDENTIALS: Record<string, {
  username: string; password: string; role: string;
  name: string; org: string; apiKey: string; permissions: string[];
}> = {
  admin: {
    username: "admin@smartpds", password: "admin123",
    role: "admin", name: "District Godown Manager",
    org: "GodownOrgMSP", apiKey: "pds-secret-key-2024",
    permissions: ["all"]
  },
  operator: {
    username: "operator@smartpds", password: "op123",
    role: "operator", name: "PSC / DC Operator",
    org: "PSCOrgMSP / DCOrgMSP", apiKey: "pds-secret-key-2024",
    permissions: ["orders", "packets", "delivery"]
  },
  auditor: {
    username: "auditor@smartpds", password: "audit123",
    role: "auditor", name: "District Auditor",
    org: "Read-only access", apiKey: "pds-secret-key-2024",
    permissions: ["read-only"]
  },
  beneficiary: {
    username: "BENF-JH-RAN-82DB6EDD", password: "benef123",
    role: "beneficiary", name: "Sunita Devi",
    org: "NFSA 2013 entitled", apiKey: "pds-secret-key-2024",
    permissions: ["own-data"]
  },
};

const roles = [
  {
    id: "admin",
    title: "Admin",
    subtitle: "GodownOrgMSP",
    description: "System-wide monitoring & approvals",
    avatar: avatarAdmin,
    color: "#e9880a",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    selectedBorder: "border-orange-500",
    selectedBg: "from-orange-100 to-amber-100",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    id: "operator",
    title: "Operator",
    subtitle: "PSCOrgMSP / DCOrgMSP",
    description: "Packetization & delivery management",
    avatar: avatarOperator,
    color: "#1f06d9",
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    selectedBorder: "border-blue-400",
    selectedBg: "from-blue-100 to-indigo-100",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: "auditor",
    title: "Auditor",
    subtitle: "Read-only access",
    description: "Transaction verification & audit",
    avatar: avatarAuditor,
    color: "#16A34A",
    bg: "from-green-50 to-teal-50",
    border: "border-green-200",
    selectedBorder: "border-green-400",
    selectedBg: "from-green-100 to-teal-100",
    badge: "bg-green-100 text-green-700",
  },
  {
    id: "beneficiary",
    title: "Beneficiary",
    subtitle: "NFSA 2013 entitled",
    description: "Entitlements & delivery tracking",
    avatar: avatarBeneficiary,
    color: "#7C3AED",
    bg: "from-purple-50 to-pink-50",
    border: "border-purple-200",
    selectedBorder: "border-purple-400",
    selectedBg: "from-purple-100 to-pink-100",
    badge: "bg-purple-100 text-purple-700",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("admin");
  const [username, setUsername] = useState("admin@smartpds");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    const creds = DEMO_CREDENTIALS[roleId];
    setUsername(creds.username);
    setPassword(creds.password);
    setError("");
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 800));
    const creds = DEMO_CREDENTIALS[selectedRole];
    if (username === creds.username && password === creds.password) {
      localStorage.setItem("apiKey", creds.apiKey);
      localStorage.setItem("role", creds.role);
      localStorage.setItem("userName", creds.name);
      localStorage.setItem("userOrg", creds.org);
      switch (creds.role) {
        case "admin":       navigate("/admin"); break;
        case "operator":    navigate("/operator"); break;
        case "auditor":     navigate("/auditor"); break;
        case "beneficiary": navigate("/beneficiaries"); break;
        default:            navigate("/");
      }
    } else {
      setError("Invalid credentials. Please check username and password.");
    }
    setLoading(false);
  };

  const activeRole = roles.find(r => r.id === selectedRole)!;
  const activeCreds = DEMO_CREDENTIALS[selectedRole];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-blue-100 shadow-sm mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-600">
                SMART PDS — Demo Mode Active
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Login to <span className="text-blue-600">SMART PDS</span>
            </h1>
            <p className="text-sm text-gray-500">
              Select your role to access the appropriate dashboard
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT — Role selection cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Select your role
              </p>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role, i) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`
                      relative cursor-pointer rounded-2xl border-2 p-4 text-center
                      bg-gradient-to-b transition-all duration-200
                      hover:shadow-lg hover:-translate-y-1
                      ${selectedRole === role.id
                        ? `${role.selectedBg} ${role.selectedBorder} shadow-md scale-105`
                        : `${role.bg} ${role.border}`
                      }
                    `}
                  >
                    {/* Selected checkmark */}
                    {selectedRole === role.id && (
                      <div
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow"
                        style={{ backgroundColor: role.color }}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Avatar image */}
                    <div className="flex justify-center mb-2">
                      <img
                        src={role.avatar}
                        alt={role.title}
                        className="w-20 h-20 object-contain drop-shadow-sm"
                      />
                    </div>

                    {/* Role name */}
                    <h3 className="font-bold text-gray-800 text-sm mb-0.5">
                      {role.title}
                    </h3>

                    {/* Org badge */}
                    <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full mb-1 ${role.badge}`}>
                      {role.subtitle}
                    </span>

                    {/* Description */}
                    <p className="text-[10px] text-gray-500 leading-tight">
                      {role.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — Login form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur rounded-2xl border border-gray-100 shadow-lg p-6 flex flex-col justify-between"
            >
              {/* Selected role header */}
              <div>
                <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${activeRole.bg} border ${activeRole.border} mb-5`}>
                  <img
                    src={activeRole.avatar}
                    alt={activeRole.title}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      Logging in as {activeRole.title}
                    </p>
                    <p className="text-[10px] text-gray-500">{activeRole.subtitle}</p>
                    <p className="text-[10px] text-gray-400">{activeRole.description}</p>
                  </div>
                </div>

                {/* Demo credentials hint */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 mb-4 text-center">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                    Demo credentials
                  </p>
                  <p className="text-xs font-mono text-gray-700">
                    {activeCreds.username} / {activeCreds.password}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    API Key: pds-secret-key-2024
                  </p>
                </div>

                {/* Form fields */}
                <div className="space-y-3 mb-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Username / ID
                    </Label>
                    <Input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="text-sm h-10 border-gray-200 focus:border-blue-400"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Password
                    </Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="text-sm h-10 border-gray-200 focus:border-blue-400"
                      placeholder="Enter password"
                      onKeyDown={e => e.key === "Enter" && handleLogin()}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}
              </div>

              {/* Login button + footer */}
              <div>
                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full h-11 text-sm font-semibold rounded-xl"
                  style={{ backgroundColor: activeRole.color }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    `Login as ${activeRole.title}`
                  )}
                </Button>

                <p className="text-center text-[10px] text-gray-400 mt-3">
                  🔒 Demo mode — blockchain network at{" "}
                  <span className="font-mono">peer0.psc.pds.com:9051</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom network status bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-white/70 backdrop-blur rounded-xl border border-gray-100 shadow-sm px-6 py-3 flex items-center justify-center gap-8 flex-wrap"
          >
            {[
              { label: "Network", value: "Hyperledger Fabric 2.5", dot: "bg-green-500" },
              { label: "Channel", value: "pds-channel", dot: "bg-blue-500" },
              { label: "Peers", value: "3/3 Online", dot: "bg-green-500" },
              { label: "Chaincodes", value: "4 Active", dot: "bg-purple-500" },
              { label: "API", value: "localhost:3001", dot: "bg-orange-500" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                <span className="text-[10px] text-gray-400">{item.label}:</span>
                <span className="text-[10px] font-semibold text-gray-600">{item.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
