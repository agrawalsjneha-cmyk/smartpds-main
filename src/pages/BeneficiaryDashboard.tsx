import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Package, QrCode, History, CheckCircle, Clock, Search, Shield } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { getBeneficiary, getOrdersByBeneficiary, getDeliveriesByBeneficiary } from "@/api/fabricApi";

const BeneficiaryDashboard = () => {
  const [qrScanned, setQrScanned] = useState(false);
  const [searchId, setSearchId] = useState("BENF-JH-RAN-82DB6EDD");
  const [beneficiary, setBeneficiary] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const [ben, ords, dels] = await Promise.all([
        getBeneficiary(id),
        getOrdersByBeneficiary(id),
        getDeliveriesByBeneficiary(id),
      ]);
      setBeneficiary(ben);
      setOrders(Array.isArray(ords) ? ords : []);
      setDeliveries(Array.isArray(dels) ? dels : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchId);
  }, []);

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

        {/* Search */}
        <div className="rounded-xl bg-card p-4 border border-border stat-card mb-5">
          <h3 className="font-display font-bold text-foreground mb-2 text-sm">Beneficiary Registry</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Search by Beneficiary ID..."
              className="rounded-lg h-9 max-w-sm"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              onClick={() => fetchData(searchId)}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </div>

        {loading && (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading from blockchain...</div>
        )}

        {!loading && beneficiary && (
          <>
            {/* Beneficiary Card + QR + Delivery */}
            <div className="grid gap-5 lg:grid-cols-3 mb-6">

              {/* Profile */}
              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-2xl">
                    👨‍🌾
                  </div>
                  <div>
                    <p className="font-display font-black text-foreground text-base">{beneficiary.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{beneficiary.beneficiaryID}</p>
                  </div>
                </div>
                <div className="space-y-1.5 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground flex justify-between">Family <strong className="text-foreground">{beneficiary.familyCount}</strong></p>
                  <p className="text-xs text-muted-foreground flex justify-between">Category <strong className="text-foreground">{beneficiary.category}</strong></p>
                  <p className="text-xs text-muted-foreground flex justify-between">Ration Card <strong className="text-foreground">{beneficiary.rationCardNumber}</strong></p>
                  <p className="text-xs text-muted-foreground flex justify-between">Aadhaar <strong className="text-foreground">{beneficiary.maskedAadhaar}</strong></p>
                  <p className="text-xs text-muted-foreground flex justify-between">District <strong className="text-foreground">{beneficiary.district}</strong></p>
                  <p className="text-xs text-muted-foreground flex justify-between">Block <strong className="text-foreground">{beneficiary.block}</strong></p>
                  <p className="text-xs text-muted-foreground flex justify-between">Status
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      beneficiary.status === "ACTIVE" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}>{beneficiary.status}</span>
                  </p>
                </div>
              </div>

              {/* QR Verification */}
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

              {/* Entitlements */}
              <div className="rounded-xl bg-card border border-border p-5 stat-card">
                <h3 className="font-display font-black text-foreground mb-3 text-sm flex items-center gap-2">
                  <Package className="h-4 w-4 text-secondary" /> Entitlements
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Rice</span>
                    <strong>{beneficiary.riceQty} kg/month</strong>
                  </div>
                  <div className="flex justify-between text-xs p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Wheat</span>
                    <strong>{beneficiary.wheatQty} kg/month</strong>
                  </div>
                  <div className="flex justify-between text-xs p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Total</span>
                    <strong>{beneficiary.totalEntitlement} kg/month</strong>
                  </div>
                  <div className="flex justify-between text-xs p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">PSC</span>
                    <strong>{beneficiary.pscName}</strong>
                  </div>
                  <div className="flex justify-between text-xs p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">DC</span>
                    <strong>{beneficiary.dcName}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border mb-6">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-black text-foreground text-sm flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> Orders from Blockchain
                </h3>
              </div>
              {orders.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">No orders found on blockchain</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Order ID</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Month</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Rice</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Wheat</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o: any) => (
                        <tr key={o.orderID} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-2.5 font-mono text-[10px] text-primary font-bold">{o.orderID}</td>
                          <td className="px-4 py-2.5 text-xs">{o.allocationMonth}</td>
                          <td className="px-4 py-2.5 text-xs">{o.requestedRiceQty} kg</td>
                          <td className="px-4 py-2.5 text-xs">{o.requestedWheatQty} kg</td>
                          <td className="px-4 py-2.5">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                              o.orderStatus === "DELIVERED" ? "bg-success/10 text-success" :
                              o.orderStatus === "CREATED"   ? "bg-warning/10 text-warning" :
                              "bg-primary/10 text-primary"
                            }`}>{o.orderStatus}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Deliveries Table */}
            <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-black text-foreground text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-warning" /> Deliveries from Blockchain
                </h3>
              </div>
              {deliveries.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">No deliveries found on blockchain</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Delivery ID</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Packet</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Rice</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Wheat</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map((d: any) => (
                        <tr key={d.deliveryID} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-2.5 font-mono text-[10px] text-primary font-bold">{d.deliveryID}</td>
                          <td className="px-4 py-2.5 text-xs">{d.packetID}</td>
                          <td className="px-4 py-2.5 text-xs">{d.riceQty} kg</td>
                          <td className="px-4 py-2.5 text-xs">{d.wheatQty} kg</td>
                          <td className="px-4 py-2.5">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                              d.deliveryStatus === "DELIVERED" ? "bg-success/10 text-success" :
                              d.deliveryStatus === "CREATED"   ? "bg-warning/10 text-warning" :
                              "bg-primary/10 text-primary"
                            }`}>{d.deliveryStatus}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BeneficiaryDashboard;