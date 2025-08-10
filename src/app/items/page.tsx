"use client";
import React, { useEffect, useState } from "react";

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
    fetch("http://localhost:8000/api/items/")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center drop-shadow">All Items</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white border rounded-xl shadow-lg p-6 flex flex-col gap-2">
              <div className="text-xl font-bold text-blue-600 mb-2">{item.task}</div>
              <div className="text-gray-700">Date: <span className="font-mono">{item.date}</span></div>
              <div className="text-gray-700">Done by: <span className="font-semibold">{item.done_by}</span></div>
              <div className="text-gray-700">Type: {item.type}</div>
              <div className="text-gray-700">Quantity: {item.quantity}</div>
              <div className="text-gray-700">Base GVT: {item.base_gvt}</div>
              <div className="text-gray-700">GVT Earned: {item.gvt_earned}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
