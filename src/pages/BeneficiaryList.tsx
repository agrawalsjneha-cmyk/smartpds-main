import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Search, Eye } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_KEY  = import.meta.env.VITE_API_KEY  || 'pds-secret-key-2024';

const ALL_DCS = [
  "KHE-A","KHE-B",
  "BUR-A","BUR-B",
  "CHA-A","CHA-B",
  "MAN-A","MAN-B",
  "BER-A","BER-B",
  "LAP-A","LAP-B",
  "ITK-A","ITK-B",
  "KAN-A","KAN-B","KAN-C","KAN-D","KAN-E","KAN-F",
  "RAT-A","RAT-B",
  "NAG-A","NAG-B",
  "NMK-A","NMK-B",
  "ANG-A","ANG-B",
  "RAH-A","RAH-B",
  "ORM-A","ORM-B",
  "SIL-A","SIL-B",
  "BUN-A","BUN-B",
  "SON-A","SON-B",
  "TAM-A","TAM-B"
];
const DC_NAMES: Record<string, string> = {
  "KHE-A": "Khelari DC-A",   "KHE-B": "Khelari DC-B",
  "BUR-A": "Burmu DC-A",     "BUR-B": "Burmu DC-B",
  "CHA-A": "Chanho DC-A",    "CHA-B": "Chanho DC-B",
  "MAN-A": "Mandar DC-A",    "MAN-B": "Mandar DC-B",
  "BER-A": "Bero DC-A",      "BER-B": "Bero DC-B",
  "LAP-A": "Lapung DC-A",    "LAP-B": "Lapung DC-B",
  "ITK-A": "Itki DC-A",      "ITK-B": "Itki DC-B",
  "KAN-A": "Kanke DC-A",     "KAN-B": "Kanke DC-B",
  "KAN-C": "Kanke DC-C",     "KAN-D": "Kanke DC-D",
  "KAN-E": "Kanke DC-E",     "KAN-F": "Kanke DC-F",
  "RAT-A": "Ratu DC-A",      "RAT-B": "Ratu DC-B",
  "NAG-A": "Nagri DC-A",     "NAG-B": "Nagri DC-B",
  "NMK-A": "Namkum DC-A",    "NMK-B": "Namkum DC-B",
  "ANG-A": "Angara DC-A",    "ANG-B": "Angara DC-B",
  "RAH-A": "Rahe DC-A",      "RAH-B": "Rahe DC-B",
  "ORM-A": "Ormanjhi DC-A",  "ORM-B": "Ormanjhi DC-B",
  "SIL-A": "Silli DC-A",     "SIL-B": "Silli DC-B",
  "BUN-A": "Bundu DC-A",     "BUN-B": "Bundu DC-B",
  "SON-A": "Sonahatu DC-A",  "SON-B": "Sonahatu DC-B",
  "TAM-A": "Tamar DC-A",     "TAM-B": "Tamar DC-B",
};

async function apiFetch(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data;
}

const BeneficiaryTable = ({ data, selected, onSelect }: { data: any[], selected: any, onSelect: (b: any) => void }) => (
  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-card z-10">
        <tr className="border-b border-border bg-muted/30">
          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Name</th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Ration Card</th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Cat</th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Block</th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">Status</th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-muted-foreground">View</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">No beneficiaries found</td></tr>
        ) : (
          data.map((b) => (
            <tr
              key={b.beneficiaryID}
              className={`border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer transition-colors ${selected?.beneficiaryID === b.beneficiaryID ? 'bg-primary/5' : ''}`}
              onClick={() => onSelect(b)}
            >
              <td className="px-3 py-2.5 text-xs font-bold">{b.name}</td>
              <td className="px-3 py-2.5 font-mono text-[10px] text-primary">{b.rationCardNumber}</td>
              <td className="px-3 py-2.5">
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${b.category === 'AAY' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>{b.category}</span>
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">{b.block}</td>
              <td className="px-3 py-2.5">
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${b.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{b.status}</span>
              </td>
              <td className="px-3 py-2.5 flex gap-1">
                <button onClick={() => onSelect(b)} className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold hover:bg-primary/10 hover:text-primary transition-colors">
                  <Eye className="h-3 w-3" />
                </button>
                <Link to={`/beneficiary/${b.beneficiaryID}`} className="rounded-md bg-primary/10 text-primary px-2 py-1 text-[10px] font-bold hover:bg-primary/20 transition-colors">
                  Full Profile
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const DetailPanel = ({ selected }: { selected: any }) => (
  <div className="rounded-xl bg-card stat-card border border-border overflow-hidden">
    <div className="p-4 border-b border-border">
      <h3 className="font-display font-bold text-foreground text-sm">Beneficiary Details</h3>
    </div>
    {!selected ? (
      <div className="p-8 text-center text-xs text-muted-foreground">Click a row to view details</div>
    ) : (
      <div className="p-4 space-y-2 overflow-y-auto max-h-[600px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">👨‍🌾</div>
          <div>
            <p className="font-display font-black text-foreground">{selected.name}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{selected.beneficiaryID}</p>
          </div>
        </div>
        {[
          { label: 'Head of Family', value: selected.headOfFamily },
          { label: 'Gender', value: selected.headGender },
          { label: 'Family Count', value: selected.familyCount },
          { label: 'Category', value: selected.category },
          { label: 'Ration Card', value: selected.rationCardNumber },
          { label: 'Aadhaar', value: selected.maskedAadhaar },
          { label: 'Mobile', value: selected.maskedMobile },
          { label: 'Address', value: selected.address },
          { label: 'Block', value: selected.block },
          { label: 'Village/Ward', value: selected.villageWard },
          { label: 'District', value: selected.district },
          { label: 'PSC', value: selected.pscName },
          { label: 'DC', value: selected.dcName },
          { label: 'Rice', value: `${selected.riceQty} kg/month` },
          { label: 'Wheat', value: `${selected.wheatQty} kg/month` },
          { label: 'Total', value: `${selected.totalEntitlement} kg/month` },
          { label: 'Portability', value: selected.portabilityStatus },
          { label: 'Created At', value: new Date(selected.createdAt).toLocaleDateString() },
          { label: 'Created By', value: selected.createdByOrg },
        ].map((item) => (
          <div key={item.label} className="flex justify-between text-xs border-b border-border pb-1.5">
            <span className="text-muted-foreground">{item.label}</span>
            <strong className="text-foreground text-right max-w-[60%]">{item.value}</strong>
          </div>
        ))}
        <div className="flex justify-between text-xs pt-1">
          <span className="text-muted-foreground">Status</span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${selected.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{selected.status}</span>
        </div>
      </div>
    )}
  </div>
);

const BeneficiaryList = () => {
  const [tab, setTab] = useState<"all" | "dc">("all");
  const [selected, setSelected] = useState<any>(null);

  // ── ALL tab state ────────────────────────────────────────
  const [allBeneficiaries, setAllBeneficiaries] = useState<any[]>([]);
  const [allFiltered, setAllFiltered] = useState<any[]>([]);
  const [allSearch, setAllSearch] = useState("");
  const [allLoading, setAllLoading] = useState(false);
  const [allProgress, setAllProgress] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  // ── DC tab state ─────────────────────────────────────────
  const [dcId, setDcId] = useState("KHE-A");
  const [dcBeneficiaries, setDcBeneficiaries] = useState<any[]>([]);
  const [dcFiltered, setDcFiltered] = useState<any[]>([]);
  const [dcSearch, setDcSearch] = useState("");
  const [dcLoading, setDcLoading] = useState(false);
  const [dcError, setDcError] = useState("");

  // ── Load All ─────────────────────────────────────────────
  const fetchAll = async () => {
    setAllLoading(true);
    setAllLoaded(false);
    setAllBeneficiaries([]);
    setAllFiltered([]);
    setAllProgress(0);
    const all: any[] = [];
    for (let i = 0; i < ALL_DCS.length; i++) {
      try {
        const data = await apiFetch(`/api/beneficiaries?dcId=${ALL_DCS[i]}`);
        const list = Array.isArray(data) ? data : [data];
        all.push(...list);
        setAllProgress(Math.round(((i + 1) / ALL_DCS.length) * 100));
      } catch { /* skip empty DC */ }
    }
    const unique = Array.from(new Map(all.map(b => [b.beneficiaryID, b])).values());
    setAllBeneficiaries(unique);
    setAllFiltered(unique);
    setAllLoading(false);
    setAllLoaded(true);
  };

  // ── Load DC ──────────────────────────────────────────────
  const fetchDC = async (id: string) => {
    setDcLoading(true);
    setDcError("");
    setDcBeneficiaries([]);
    setDcFiltered([]);
    try {
      const data = await apiFetch(`/api/beneficiaries?dcId=${id}`);
      const list = Array.isArray(data) ? data : [data];
      setDcBeneficiaries(list);
      setDcFiltered(list);
    } catch (err: any) {
      setDcError(err.message);
    } finally {
      setDcLoading(false);
    }
  };

  // ── Search filters ───────────────────────────────────────
  useEffect(() => {
    const q = allSearch.toLowerCase();
    setAllFiltered(!q ? allBeneficiaries : allBeneficiaries.filter(b =>
      b.name?.toLowerCase().includes(q) ||
      b.beneficiaryID?.toLowerCase().includes(q) ||
      b.rationCardNumber?.toLowerCase().includes(q) ||
      b.block?.toLowerCase().includes(q) ||
      b.villageWard?.toLowerCase().includes(q) ||
      b.pscName?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q)
    ));
  }, [allSearch, allBeneficiaries]);

  useEffect(() => {
    const q = dcSearch.toLowerCase();
    setDcFiltered(!q ? dcBeneficiaries : dcBeneficiaries.filter(b =>
      b.name?.toLowerCase().includes(q) ||
      b.beneficiaryID?.toLowerCase().includes(q) ||
      b.rationCardNumber?.toLowerCase().includes(q) ||
      b.block?.toLowerCase().includes(q) ||
      b.villageWard?.toLowerCase().includes(q)
    ));
  }, [dcSearch, dcBeneficiaries]);

  return (
    <Layout>
      <div className="container py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-foreground">Beneficiary List</h1>
            <p className="text-xs text-muted-foreground">Ranchi District — All registered beneficiaries from blockchain</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === "all" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"}`}
          >
            All Beneficiaries (1,111)
          </button>
          <button
            onClick={() => setTab("dc")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === "dc" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"}`}
          >
            DC-wise Search
          </button>
        </div>

        {/* ── ALL TAB ─────────────────────────────────────── */}
        {tab === "all" && (
          <>
            <div className="rounded-xl bg-card p-4 border border-border mb-5 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold text-muted-foreground">Search by Name / Ration Card / Block / Village / PSC</label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Search..." className="rounded-lg h-9" value={allSearch} onChange={(e) => setAllSearch(e.target.value)} />
                  <button className="px-3 py-1.5 rounded-lg bg-muted"><Search className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <button onClick={fetchAll} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs h-9">
                {allLoaded ? "🔄 Reload" : "📥 Load All Beneficiaries"}
              </button>
              {allLoaded && (
                <div className="text-xs text-muted-foreground font-bold">
                  {allFiltered.length} of {allBeneficiaries.length} beneficiaries
                </div>
              )}
            </div>

            {allLoading && (
              <div className="mb-5">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${allProgress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">Loading from all 40 DCs... {allProgress}%</p>
              </div>
            )}

            {!allLoading && !allLoaded && (
              <div className="rounded-xl bg-card border border-border p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-bold text-foreground">Click "Load All Beneficiaries" to fetch all 1,111 records from blockchain</p>
                <p className="text-xs text-muted-foreground mt-1">This will query all 40 DCs across 5 P&SCs in Ranchi district</p>
              </div>
            )}

            {!allLoading && allLoaded && (
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl bg-card stat-card overflow-hidden border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-display font-bold text-foreground text-sm">All Beneficiaries — Ranchi District</h3>
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">{allFiltered.length} records</span>
                  </div>
                  <BeneficiaryTable data={allFiltered} selected={selected} onSelect={setSelected} />
                </div>
                <DetailPanel selected={selected} />
              </div>
            )}
          </>
        )}

        {/* ── DC TAB ──────────────────────────────────────── */}
        {tab === "dc" && (
          <>
            <div className="rounded-xl bg-card p-4 border border-border mb-5 flex flex-wrap gap-3 items-end">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground">Select DC</label>
                <select
                  value={dcId}
                  onChange={(e) => setDcId(e.target.value)}
                  className="w-48 rounded-lg border border-border bg-background px-2 py-1.5 text-xs mt-1 h-9 block"
                >
                  {ALL_DCS.map(dc => (
                    <option key={dc} value={dc}>{DC_NAMES[dc]} ({dc})</option>
                  ))}
                </select>
              </div>
              <button onClick={() => fetchDC(dcId)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs h-9">
                Load
              </button>
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold text-muted-foreground">Search within DC</label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Search by name, ration card, block..." className="rounded-lg h-9" value={dcSearch} onChange={(e) => setDcSearch(e.target.value)} />
                  <button className="px-3 py-1.5 rounded-lg bg-muted"><Search className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              {dcBeneficiaries.length > 0 && (
                <div className="text-xs text-muted-foreground font-bold">{dcFiltered.length} beneficiaries</div>
              )}
            </div>

            {dcError && <div className="text-xs text-destructive mb-4 p-3 rounded-lg bg-destructive/10">{dcError}</div>}
            {dcLoading && <div className="text-center py-12 text-muted-foreground text-sm">Loading from blockchain...</div>}

            {!dcLoading && (
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl bg-card stat-card overflow-hidden border border-border">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-display font-bold text-foreground text-sm">{DC_NAMES[dcId] || dcId}</h3>
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">{dcFiltered.length} records</span>
                  </div>
                  <BeneficiaryTable data={dcFiltered} selected={selected} onSelect={setSelected} />
                </div>
                <DetailPanel selected={selected} />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default BeneficiaryList;