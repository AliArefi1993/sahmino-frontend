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
            <span className="font-extrabold text-green-700 text-lg">Date</span>
            <input name="date" type="date" value={form.date} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 font-extrabold text-green-700 text-lg placeholder-green-400" style={{color: form.date ? '#15803d' : '#22c55e', fontWeight: 'bold', fontSize: '1.125rem'}} required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">Done by</span>
            <input name="done_by" value={form.done_by} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 font-extrabold text-green-700 text-lg placeholder-green-400" style={{color: form.done_by ? '#15803d' : '#22c55e', fontWeight: 'bold', fontSize: '1.125rem'}} required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">Task</span>
            <input name="task" value={form.task} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 font-extrabold text-green-700 text-lg placeholder-green-400" style={{color: form.task ? '#15803d' : '#22c55e', fontWeight: 'bold', fontSize: '1.125rem'}} required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700">Type</span>
            <input name="type" value={form.type} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 font-extrabold text-green-700 text-lg placeholder-green-400" style={{color: form.type ? '#15803d' : '#22c55e', fontWeight: 'bold', fontSize: '1.125rem'}} required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-extrabold text-green-700 text-lg">Quantity</span>
            <input name="quantity" type="number" value={form.quantity} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 font-extrabold text-green-700 text-lg placeholder-green-400" style={{color: form.quantity ? '#15803d' : '#22c55e', fontWeight: 'bold', fontSize: '1.125rem'}} required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-extrabold text-green-700 text-lg">Base GVT</span>
            <input name="base_gvt" type="number" step="0.01" value={form.base_gvt} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 font-extrabold text-green-700 text-lg placeholder-green-400" style={{color: form.base_gvt ? '#15803d' : '#22c55e', fontWeight: 'bold', fontSize: '1.125rem'}} required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-extrabold text-green-700 text-lg">GVT Earned</span>
            <input name="gvt_earned" type="number" step="0.01" value={form.gvt_earned} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 font-extrabold text-green-700 text-lg placeholder-green-400" style={{color: form.gvt_earned ? '#15803d' : '#22c55e', fontWeight: 'bold', fontSize: '1.125rem'}} required />
          </label>
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-700 transition">Create Item</button>
        </form>
        {message && <p className="mt-6 text-center text-green-600 font-semibold">{message}</p>}
      </div>
    </main>
  );
}