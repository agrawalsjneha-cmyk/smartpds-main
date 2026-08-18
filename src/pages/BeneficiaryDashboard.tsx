import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  User, Package, QrCode, History, CheckCircle, Clock, Search, Shield,
  ClipboardList, Truck, AlertCircle, Loader2
} from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getBeneficiary, getOrdersByBeneficiary, getDeliveriesByBeneficiary, createOrder,
} from "@/api/fabricApi";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const orderStatusColor: Record<string, string> = {
  DELIVERED: "bg-success/10 text-success",
  AUTHORIZED: "bg-primary/10 text-primary",
  AGGREGATED: "bg-warning/10 text-warning",
  PLACED: "bg-warning/10 text-warning",
  DISPATCHED: "bg-primary/10 text-primary",
};

const ORDER_STAGES = ["PLACED", "AGGREGATED", "AUTHORIZED", "DISPATCHED", "DELIVERED"];

const BeneficiaryDashboard = () => {
  const { id } = useParams<{ id?: string }>();
  const [qrScanned, setQrScanned] = useState(false);
  const [searchId, setSearchId] = useState(id || "BENF-JH-RAN-131C4576");
  const [beneficiary, setBeneficiary] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Order placement state
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const [placeSuccess, setPlaceSuccess] = useState("");
  const [orderRice, setOrderRice] = useState(0);
  const [orderWheat, setOrderWheat] = useState(0);

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
      if (ben) {
        setOrderRice(ben.riceQty ?? 0);
        setOrderWheat(ben.wheatQty ?? 0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchId);
  }, []);

  const thisMonthOrder = useMemo(
    () => orders.find((o: any) => o.allocationMonth === currentMonth()),
    [orders]
  );

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => (b.allocationMonth || "").localeCompare(a.allocationMonth || "")),
    [orders]
  );

  const handlePlaceOrder = async () => {
    if (!beneficiary) return;
    setPlacing(true);
    setPlaceError("");
    setPlaceSuccess("");
    try {
      await createOrder({
        beneficiaryID: beneficiary.beneficiaryID,
        allocationMonth: currentMonth(),
        requestedRiceQty: orderRice,
        requestedWheatQty: orderWheat,
      });
      setPlaceSuccess(`Order placed for ${currentMonth()}. It will be aggregated and authorized in the next cycle.`);
      await fetchData(beneficiary.beneficiaryID);
    } catch (err: any) {
      setPlaceError(err.message || "Failed to place order. It may already exist for this month.");
    } finally {
      setPlacing(false);
    }
  };

  const stageIndex = (status: string) => ORDER_STAGES.indexOf(status);

  return (
    <Layout>
      <div className="container py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <User className="h-5 w-5 text-success" />
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-foreground">Beneficiary Portal</h1>
            <p className="text-xs text-muted-foreground">
              Entitlements, monthly ordering, live tracking, and delivery history
            </p>
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
          <div className="text-center py-12 text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading from blockchain...
          </div>
        )}

        {!loading && beneficiary && (
          <>
            {/* Profile header strip */}
            <div className="rounded-xl bg-card border border-border p-5 stat-card mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-2xl">
                  🌾
                </div>
                <div>
                  <p className="font-display font-black text-foreground text-base">{beneficiary.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{beneficiary.beneficiaryID}</p>
                </div>
                <span className={`ml-auto rounded-md px-2 py-1 text-[10px] font-bold ${
                  beneficiary.status === "ACTIVE" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}>{beneficiary.status}</span>
              </div>
            </div>

            <Tabs defaultValue="entitlement" className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-1 mb-5 h-auto p-1 bg-muted/50 rounded-xl">
                <TabsTrigger value="entitlement" className="text-xs py-2 gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Entitlement
                </TabsTrigger>
                <TabsTrigger value="place-order" className="text-xs py-2 gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5" /> Place Order
                </TabsTrigger>
                <TabsTrigger value="track" className="text-xs py-2 gap-1.5">
                  <Truck className="h-3.5 w-3.5" /> Track Order
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs py-2 gap-1.5">
                  <History className="h-3.5 w-3.5" /> History
                </TabsTrigger>
                <TabsTrigger value="qr" className="text-xs py-2 gap-1.5">
                  <QrCode className="h-3.5 w-3.5" /> QR & Delivery
                </TabsTrigger>
              </TabsList>

              {/* ── ENTITLEMENT ─────────────────────────── */}
              <TabsContent value="entitlement">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-xl bg-card border border-border p-5 stat-card">
                    <h3 className="font-display font-black text-foreground mb-3 text-sm flex items-center gap-2">
                      <Package className="h-4 w-4 text-secondary" /> Monthly Entitlement
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: "Category", value: beneficiary.category },
                        { label: "Family size", value: beneficiary.familyCount },
                        { label: "Rice", value: `${beneficiary.riceQty} kg/month` },
                        { label: "Wheat", value: `${beneficiary.wheatQty} kg/month` },
                        { label: "Total", value: `${beneficiary.totalEntitlement} kg/month` },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-xs p-2 rounded-lg bg-muted/30">
                          <span className="text-muted-foreground">{row.label}</span>
                          <strong className="text-foreground">{row.value}</strong>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-3">
                      PHH = 5 kg/person/month · AAY = 35 kg/household/month, per NFSA 2013 Schedule I.
                    </p>
                  </div>

                  <div className="rounded-xl bg-card border border-border p-5 stat-card">
                    <h3 className="font-display font-black text-foreground mb-3 text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" /> Registration Details
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: "Ration Card", value: beneficiary.rationCardNumber },
                        { label: "Aadhaar", value: beneficiary.maskedAadhaar },
                        { label: "District", value: beneficiary.district },
                        { label: "Block", value: beneficiary.block },
                        { label: "Village", value: beneficiary.villageWard },
                        { label: "P&SC", value: beneficiary.pscName },
                        { label: "Dispatch Centre", value: beneficiary.dcName },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-xs p-2 rounded-lg bg-muted/30">
                          <span className="text-muted-foreground">{row.label}</span>
                          <strong className="text-foreground">{row.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ── PLACE ORDER ─────────────────────────── */}
              <TabsContent value="place-order">
                <div className="rounded-xl bg-card border border-border p-5 stat-card max-w-xl">
                  <h3 className="font-display font-black text-foreground mb-1 text-sm flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-primary" /> Monthly Food-Grain Order — {currentMonth()}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mb-4">
                    SMART PDS is demand-driven: your order initiates the supply chain, rather than
                    grain being pushed to you automatically. Submit your requirement — up to your
                    verified entitlement — and it will flow through DC → P&SC aggregation → Godown
                    authorization → dispatch.
                  </p>

                  {thisMonthOrder ? (
                    <div className="rounded-lg bg-success/10 border border-success/20 p-4 text-center">
                      <CheckCircle className="h-6 w-6 text-success mx-auto mb-1" />
                      <p className="text-xs font-bold text-success">
                        Order already placed for {currentMonth()}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {thisMonthOrder.requestedRiceQty} kg rice · {thisMonthOrder.requestedWheatQty} kg wheat ·
                        Status: {thisMonthOrder.orderStatus}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground">Rice (kg)</label>
                          <Input
                            type="number" min={0} max={beneficiary.riceQty}
                            value={orderRice}
                            onChange={(e) => setOrderRice(Math.min(Number(e.target.value), beneficiary.riceQty))}
                            className="h-9 rounded-lg mt-1"
                          />
                          <p className="text-[9px] text-muted-foreground mt-0.5">Max entitled: {beneficiary.riceQty} kg</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground">Wheat (kg)</label>
                          <Input
                            type="number" min={0} max={beneficiary.wheatQty}
                            value={orderWheat}
                            onChange={(e) => setOrderWheat(Math.min(Number(e.target.value), beneficiary.wheatQty))}
                            className="h-9 rounded-lg mt-1"
                          />
                          <p className="text-[9px] text-muted-foreground mt-0.5">Max entitled: {beneficiary.wheatQty} kg</p>
                        </div>
                      </div>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={placing || (orderRice === 0 && orderWheat === 0)}
                        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {placing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ClipboardList className="h-3.5 w-3.5" />}
                        {placing ? "Submitting to blockchain..." : "Submit Monthly Order"}
                      </button>
                      {placeError && (
                        <p className="text-[11px] text-destructive mt-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {placeError}
                        </p>
                      )}
                      {placeSuccess && (
                        <p className="text-[11px] text-success mt-2 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> {placeSuccess}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              {/* ── TRACK ORDER ─────────────────────────── */}
              <TabsContent value="track">
                {thisMonthOrder ? (
                  <div className="rounded-xl bg-card border border-border p-5 stat-card max-w-2xl">
                    <h3 className="font-display font-black text-foreground mb-4 text-sm flex items-center gap-2">
                      <Truck className="h-4 w-4 text-primary" /> Order {thisMonthOrder.orderID}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      {ORDER_STAGES.map((stage, i) => {
                        const reached = i <= stageIndex(thisMonthOrder.orderStatus);
                        return (
                          <div key={stage} className="flex-1 flex flex-col items-center relative">
                            {i > 0 && (
                              <div className={`absolute right-1/2 top-2.5 h-0.5 w-full -z-10 ${
                                reached ? "bg-primary" : "bg-border"
                              }`} />
                            )}
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                              {reached ? <CheckCircle className="h-3 w-3" /> : i + 1}
                            </div>
                            <p className="text-[9px] mt-1.5 text-center text-muted-foreground">{stage}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-5 space-y-2">
                      {[
                        { label: "Rice requested", value: `${thisMonthOrder.requestedRiceQty} kg` },
                        { label: "Wheat requested", value: `${thisMonthOrder.requestedWheatQty} kg` },
                        { label: "Placed at", value: thisMonthOrder.placedAt },
                        { label: "Current status", value: thisMonthOrder.orderStatus },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-xs p-2 rounded-lg bg-muted/30">
                          <span className="text-muted-foreground">{row.label}</span>
                          <strong className="text-foreground">{row.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-muted/30 border border-border p-8 text-center max-w-md mx-auto">
                    <Clock className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs font-bold text-foreground">No order placed for {currentMonth()} yet</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Use the "Place Order" tab to submit this month's requirement.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* ── HISTORY ─────────────────────────── */}
              <TabsContent value="history">
                <div className="rounded-xl bg-card stat-card overflow-hidden border border-border mb-6">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-display font-black text-foreground text-sm flex items-center gap-2">
                      <History className="h-4 w-4 text-primary" /> Order History
                    </h3>
                  </div>
                  {sortedOrders.length === 0 ? (
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
                          {sortedOrders.map((o: any) => (
                            <tr key={o.orderID} className="border-b border-border last:border-0 hover:bg-muted/20">
                              <td className="px-4 py-2.5 font-mono text-[10px] text-primary font-bold">{o.orderID}</td>
                              <td className="px-4 py-2.5 text-xs">{o.allocationMonth}</td>
                              <td className="px-4 py-2.5 text-xs">{o.requestedRiceQty} kg</td>
                              <td className="px-4 py-2.5 text-xs">{o.requestedWheatQty} kg</td>
                              <td className="px-4 py-2.5">
                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                  orderStatusColor[o.orderStatus] || "bg-muted text-muted-foreground"
                                }`}>{o.orderStatus}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="rounded-xl bg-card stat-card overflow-hidden border border-border">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-display font-black text-foreground text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-warning" /> Delivery History
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
                                  orderStatusColor[d.deliveryStatus] || "bg-muted text-muted-foreground"
                                }`}>{d.deliveryStatus}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ── QR & DELIVERY ─────────────────────────── */}
              <TabsContent value="qr">
                <div className="grid gap-5 lg:grid-cols-2">
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
                        <h3 className="font-display font-black text-foreground text-sm">Dynamic QR Verification</h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Watermarked QR, generated per packet at P&SC, expires 48 hours after generation
                        </p>
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
                      <Shield className="h-4 w-4 text-warning" /> Latest Delivery Proof
                    </h3>
                    {deliveries.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        No delivery records yet. Once a packet is delivered and OTP-confirmed,
                        proof details will appear here.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {[
                          { label: "Delivery ID", value: deliveries[0].deliveryID },
                          { label: "Packet ID", value: deliveries[0].packetID },
                          { label: "Status", value: deliveries[0].deliveryStatus },
                          { label: "Confirmed at", value: deliveries[0].confirmedAt || "Pending" },
                        ].map((row) => (
                          <div key={row.label} className="flex justify-between text-xs p-2 rounded-lg bg-muted/30">
                            <span className="text-muted-foreground">{row.label}</span>
                            <strong className="text-foreground">{row.value}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BeneficiaryDashboard;
