import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ranchiData from "@/data/ranchi-blocks.json";

const COLORS = [
  "#3B82F6", "#5EEAD4", "#22C55E", "#F59E0B",
  "#60A5FA", "#34D399", "#4ADE80", "#FBBF24",
  "#1E3A8A", "#2DD4BF", "#16A34A", "#D97706",
  "#93C5FD", "#6EE7B7", "#86EFAC", "#FCD34D",
  "#1D4ED8", "#14B8A6",
];

// Convert GeoJSON [lng,lat] polygon coords to SVG path
function geoToSvg(
  coords: number[][],
  minLng: number, maxLng: number, minLat: number, maxLat: number,
  width: number, height: number, padding: number
) {
  const drawW = width - padding * 2;
  const drawH = height - padding * 2;
  return coords.map((c, i) => {
    const x = padding + ((c[0] - minLng) / (maxLng - minLng)) * drawW;
    const y = padding + ((maxLat - c[1]) / (maxLat - minLat)) * drawH; // flip Y
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";
}

function getCentroid(coords: number[][]) {
  let cx = 0, cy = 0;
  for (const c of coords) { cx += c[0]; cy += c[1]; }
  return [cx / coords.length, cy / coords.length];
}

export default function RanchiDistrictMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  const { paths, width, height } = useMemo(() => {
    const W = 600, H = 500, PAD = 20;
    const features = (ranchiData as any).features;

    // Compute bounds
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    for (const feat of features) {
      const geom = feat.geometry as any;
      const rings = geom.type === "Polygon" ? [geom.coordinates[0]] : geom.coordinates.map(p => p[0]);
      for (const ring of rings) {
        for (const c of ring) {
          if (c[0] < minLng) minLng = c[0];
          if (c[0] > maxLng) maxLng = c[0];
          if (c[1] < minLat) minLat = c[1];
          if (c[1] > maxLat) maxLat = c[1];
        }
      }
    }

    const result = features.map((feat, i) => {
      const geom = feat.geometry as any;
      const rings = geom.type === "Polygon" ? [geom.coordinates[0]] : geom.coordinates.map(p => p[0]);
      const svgPaths = rings.map(ring => geoToSvg(ring, minLng, maxLng, minLat, maxLat, W, H, PAD));
      const allCoords = rings.flat();
      const [cLng, cLat] = getCentroid(allCoords);
      const cx = PAD + ((cLng - minLng) / (maxLng - minLng)) * (W - PAD * 2);
      const cy = PAD + ((maxLat - cLat) / (maxLat - minLat)) * (H - PAD * 2);
      return {
        name: feat.properties?.name || "",
        paths: svgPaths,
        cx, cy,
        color: COLORS[i % COLORS.length],
      };
    });

    return { paths: result, width: W, height: H };
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto rounded-xl border border-border overflow-hidden stat-card bg-card">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <filter id="blockShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
          </filter>
        </defs>

        {paths.map((block, i) => {
          const isHovered = hovered === block.name;
          return (
            <motion.g
              key={block.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onMouseEnter={() => setHovered(block.name)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {block.paths.map((d, pi) => (
                <path
                  key={pi}
                  d={d}
                  fill={block.color}
                  fillOpacity={isHovered ? 0.8 : 0.5}
                  stroke="#fff"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  filter="url(#blockShadow)"
                  style={{ transition: "fill-opacity 0.2s, stroke-width 0.2s" }}
                />
              ))}
              <text
                x={block.cx}
                y={block.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isHovered ? "#1F2937" : "#374151"}
                fontSize={isHovered ? 13 : 10}
                fontWeight={isHovered ? 800 : 600}
                fontFamily="'Nunito', sans-serif"
                className="pointer-events-none select-none"
                style={{ transition: "font-size 0.2s" }}
              >
                {block.name}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {hovered && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-fade-in">
          📍 {hovered} Block
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2.5 text-[11px] text-muted-foreground border-t border-border bg-card">
        <span className="font-bold">Ranchi District, Jharkhand</span>
        <span className="font-bold">18 Blocks</span>
      </div>
    </div>
  );
}
