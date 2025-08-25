"use client";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { authorizedFetch } from "../../lib/auth";

interface Item {
  id: number;
  date: string;
  done_by: string;
  task: string;
  type: string;
  quantity: number;
  base_gvt: string;
  gvt_earned: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch items and defensively ensure we always set an array
    authorizedFetch("http://localhost:8000/api/items/")
      .then((res: any) => res.json())
      .then((data: any) => {
        let list: any[] = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data.results)) list = data.results;
        else if (Array.isArray(data.items)) list = data.items;
        else if (Array.isArray(data.totals)) list = data.totals; // fallback if wrong endpoint returned
        else list = [];
        setItems(list);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center drop-shadow">All Items</h1>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/"> Back</Link>
        </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {items.map((item, idx) => {
            // Highlight the most recently added item (assume last in list)
            const isNew = idx === items.length - 1;
            return (
              <div
                key={item.id}
                className={`bg-white border rounded-xl shadow-lg p-6 flex flex-col gap-2 transition ${isNew ? "border-green-500 ring-2 ring-green-300" : ""}`}
              >
                <div className="text-2xl font-extrabold text-green-700 mb-2">Task: <span className="text-2xl font-extrabold text-green-700">{item.task}</span></div>
                <div className="text-green-700 font-extrabold text-lg">Date: <span className="font-mono">{item.date}</span></div>
                <div className="text-green-700 font-extrabold text-lg">Done by: <span className="text-green-700 font-extrabold text-lg">{item.done_by}</span></div>
                <div className="text-green-700 font-extrabold text-lg">Type: <span className="text-green-700 font-extrabold text-lg">{item.type}</span></div>
                <div className="text-green-700 font-extrabold text-lg">Quantity: <span className="text-green-700 font-extrabold text-lg">{item.quantity}</span></div>
                <div className="text-green-700 font-extrabold text-lg">Base GVT: <span className="text-green-700 font-extrabold text-lg">{item.base_gvt}</span></div>
                <div className="text-green-700 font-extrabold text-lg">GVT Earned: <span className="text-green-700 font-extrabold text-lg">{item.gvt_earned}</span></div>
                {isNew && <span className="mt-2 text-green-600 font-semibold">New!</span>}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
