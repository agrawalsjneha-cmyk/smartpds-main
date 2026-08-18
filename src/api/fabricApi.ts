const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_KEY  = import.meta.env.VITE_API_KEY  || 'pds-secret-key-2024';

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data;
}

// ── Beneficiary ──────────────────────────────────────────────
export const getBeneficiary       = (id: string)   => apiFetch(`/api/beneficiaries/${id}`);
export const getBeneficiaryHistory = (id: string)  => apiFetch(`/api/beneficiaries/${id}/history`);
export const getBeneficiariesByDC  = ()            => apiFetch(`/api/beneficiaries`);

// ── Orders ───────────────────────────────────────────────────
export const getOrder                  = (id: string)            => apiFetch(`/api/orders/${id}`);
export const getOrdersByBeneficiary    = (beneficiaryId: string) => apiFetch(`/api/orders/beneficiary/${beneficiaryId}`);
export const getOrderHistory           = (id: string)            => apiFetch(`/api/orders/${id}/history`);
export const createOrder = (data: any) => apiFetch(`/api/orders`, { method: 'POST', body: JSON.stringify(data) });

// ── Packets ──────────────────────────────────────────────────
export const getPacket             = (id: string) => apiFetch(`/api/packets/${id}`);
export const getPacketsByBeneficiary = (id: string) => apiFetch(`/api/packets/beneficiary/${id}`);
export const getFullTraceability   = (id: string) => apiFetch(`/api/packets/${id}/traceability`);

// ── Deliveries ───────────────────────────────────────────────
export const getDelivery                = (id: string)            => apiFetch(`/api/deliveries/${id}`);
export const getDeliveriesByBeneficiary = (beneficiaryId: string) => apiFetch(`/api/deliveries/beneficiary/${beneficiaryId}`);

// ── Analytics ──────────────────────────────────────────────────
export const getOTIF   = (dcId?: string) => apiFetch(`/api/analytics/otif${dcId ? `?dcId=${dcId}` : ''}`);
export const getCarbonFootprint = (renewable: boolean = true) => apiFetch(`/api/analytics/carbon?renewable=${renewable}`);