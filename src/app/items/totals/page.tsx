"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authorizedFetch } from "../../../lib/auth";

type Total = {
  done_by: string;
  total_gvt: string; // decimal string from backend
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, "Z"].join(" ");
}

const COLORS = [
  "#60A5FA",
  "#FCA5A5",
  "#34D399",
  "#FBBF24",
  "#A78BFA",
  "#F472B6",
  "#93C5FD",
  "#FDE68A",
];

export default function TotalsPage() {
  const [totals, setTotals] = useState<Total[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    authorizedFetch("http://localhost:8000/api/done-by/totals/")
      .then((r: any) => r.json())
      .then((data: any) => {
        setTotals(data.totals || []);
      })
      .catch(() => setTotals([]))
      .finally(() => setLoading(false));
  }, []);

  const numericTotals = totals.map((t) => ({ done_by: t.done_by, value: Number(t.total_gvt) }));
  const grandTotal = numericTotals.reduce((s, x) => s + (isNaN(x.value) ? 0 : x.value), 0);

  let angleStart = 0;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl text-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-700">GVT Totals by Person</h1>
          <Link href="/items/create" className="text-sm text-blue-600 hover:underline">← Back to Items</Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="md:flex gap-6">
            <div className="md:w-1/2 flex flex-col items-center">
              <div className="inline-block bg-white p-4 rounded-lg">
                {grandTotal === 0 ? (
                  <div className="w-64 h-64 flex items-center justify-center text-gray-500">No data</div>
                ) : (
                  <svg viewBox="0 0 200 200" width="300" height="300" className="mx-auto">
                    {numericTotals.map((t, i) => {
                      const value = isNaN(t.value) ? 0 : t.value;
                      const angle = (value / grandTotal) * 360;
                      const path = describeArc(100, 100, 80, angleStart, angleStart + angle);
                      const color = COLORS[i % COLORS.length];
                      angleStart += angle;
                      return <path key={t.done_by} d={path} fill={color} stroke="#fff" strokeWidth={1} />;
                    })}
                  </svg>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">Total GVT: {grandTotal.toFixed(2)}</p>
            </div>

            <div className="md:w-1/2 mt-6 md:mt-0">
              <div className="space-y-2">
                {numericTotals.map((t, i) => {
                  const pct = grandTotal === 0 ? 0 : (t.value / grandTotal) * 100;
                  const color = COLORS[i % COLORS.length];
                  return (
                    <div key={t.done_by} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span style={{ width: 14, height: 14, background: color }} className="inline-block rounded-sm" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">{t.done_by}</div>
                          <div className="text-xs text-gray-500">{t.value.toFixed(2)} GVT</div>
                        </div>
                      </div>
                      <div className="w-32 text-right text-sm text-gray-600">{pct.toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
