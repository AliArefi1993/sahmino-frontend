"use client";
import React, { useState } from "react";

export default function CreateItemPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    date: today,
    done_by: "",
    task: "",
    type: "",
    quantity: "",
    base_gvt: "",
    gvt_earned: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("http://localhost:8000/api/items/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        base_gvt: Number(form.base_gvt),
        gvt_earned: Number(form.gvt_earned),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Item created successfully!");
      setForm({
        date: today,
        done_by: "",
        task: "",
        type: "",
        quantity: "",
        base_gvt: "",
        gvt_earned: "",
      });
    } else {
      setMessage(data.error || "Error creating item.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-green-700 mb-6 drop-shadow text-center">Create New Item</h1>
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">Date</span>
            <input name="date" type="date" value={form.date} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">Done by</span>
            <input name="done_by" placeholder="Done by" value={form.done_by} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">Task</span>
            <input name="task" placeholder="Task" value={form.task} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">Type</span>
            <input name="type" placeholder="Type" value={form.type} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">Quantity</span>
            <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">Base GVT</span>
            <input name="base_gvt" type="number" step="0.01" placeholder="Base GVT" value={form.base_gvt} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">GVT Earned</span>
            <input name="gvt_earned" type="number" step="0.01" placeholder="GVT Earned" value={form.gvt_earned} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" required />
          </label>
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-700 transition">Create Item</button>
        </form>
        {message && <p className="mt-6 text-center text-green-600 font-semibold">{message}</p>}
      </div>
    </main>
  );
}