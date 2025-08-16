"use client";
import Link from 'next/link';
import React, { useState, useEffect } from "react";

export default function CreateItemPage() {
  // State for allowed status
  const allowedStatus = ["Done", "To Do", "In Progress"];
  // State for allowed done_by
  const [allowedDoneBy, setAllowedDoneBy] = useState<string[]>([]);

  // Fetch allowed done_by from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/done-by/")
      .then(res => res.json())
      .then(data => {
        setAllowedDoneBy(data.done_by || []);
      });
  }, []);
  // State for allowed types
  const [allowedTypes, setAllowedTypes] = useState<string[]>([]);

  // Fetch allowed types from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/item-types/")
      .then(res => res.json())
      .then(data => {
        setAllowedTypes(data.types || []);
      });
  }, []);
  // Delete item handler
  async function handleDelete(itemId: number) {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setMessage("");
    const res = await fetch(`http://localhost:8000/api/items/${itemId}/delete/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessage("Item deleted successfully.");
      refreshExistingItems();
    } else {
      setMessage("Error deleting item.");
    }
  }
  // Helper to refresh existing items
  const refreshExistingItems = () => {
    setLoadingExisting(true);
    fetch("http://localhost:8000/api/items/")
      .then(res => res.json())
      .then(data => {
        setExistingItems(data);
        setLoadingExisting(false);
      });
  };
  const [existingItems, setExistingItems] = useState<any[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/items/")
      .then(res => res.json())
      .then(data => {
        setExistingItems(data);
        setLoadingExisting(false);
      });
  }, []);
  const today = new Date().toISOString().slice(0, 10);
  const [items, setItems] = useState([
    {
      date: today,
      done_by: "",
      task: "",
      type: "",
      status: "To Do",
      quantity: "",
      base_gvt: "",
      gvt_earned: "",
    },
  ]);
  const [message, setMessage] = useState("");
  const [rowStatus, setRowStatus] = useState<string[]>(items.map(() => ""));

  function handleChange(idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const newItems = [...items];
    type ItemKey = 'date' | 'done_by' | 'task' | 'type' | 'quantity' | 'base_gvt' | 'gvt_earned';
  if (name === 'date' || name === 'done_by' || name === 'task' || name === 'type' || name === 'status' || name === 'quantity' || name === 'base_gvt') {
      newItems[idx][name as ItemKey] = value;
      // Auto-calculate gvt_earned
      const quantity = Number(newItems[idx].quantity);
      const base_gvt = Number(newItems[idx].base_gvt);
      if (!isNaN(quantity) && !isNaN(base_gvt)) {
        newItems[idx].gvt_earned = (quantity * base_gvt).toFixed(2);
      } else {
        newItems[idx].gvt_earned = "";
      }
    }
    setItems(newItems);
  }

  function addRow() {
    setItems([
      ...items,
      {
        date: today,
        done_by: "",
        task: "",
        type: "",
        status: "To Do",
        quantity: "",
        base_gvt: "",
        gvt_earned: "",
      },
    ]);
    setRowStatus([...rowStatus, ""]);
  }

  function removeRow(idx: number) {
  if (items.length === 1) return;
  setItems(items.filter((_, i) => i !== idx));
  setRowStatus(rowStatus.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const item = {
      ...items[0],
      quantity: Number(items[0].quantity),
      base_gvt: Number(items[0].base_gvt),
      gvt_earned: Number(items[0].gvt_earned),
      status: items[0].status || "To Do",
    };
    const res = await fetch("http://localhost:8000/api/items/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Item created successfully!");
      setItems([
        {
          date: today,
          done_by: "",
          task: "",
          type: "",
          status: "To Do",
          quantity: "",
          base_gvt: "",
          gvt_earned: "",
        },
      ]);
      setRowStatus([""]);
      refreshExistingItems();
    } else {
      setMessage(data.error || "Error creating item.");
    }
  }

  async function handleRowSave(idx: number) {
    setRowStatus(rowStatus => {
      const updated = [...rowStatus];
      updated[idx] = "Saving...";
      return updated;
    });
    const item = items[idx];
    const payload = {
      ...item,
      quantity: Number(item.quantity),
      base_gvt: Number(item.base_gvt),
      gvt_earned: Number(item.gvt_earned),
    };
  const res = await fetch("http://localhost:8000/api/items/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setRowStatus(rowStatus => {
      const updated = [...rowStatus];
      if (res.ok) {
        updated[idx] = "Saved!";
  refreshExistingItems();
      } else {
        updated[idx] = data.error || "Error";
      }
      return updated;
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-4xl text-gray-700">
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/" className="text-blue-600 hover:underline font-bold">← Back</Link>
        </div>
        <h1 className="text-4xl font-extrabold text-green-700 mb-6 drop-shadow text-center">Create New Items (Batch)</h1>
  <form onSubmit={handleSubmit} className="text-gray-700">
          <div style={{ overflowX: 'auto' }}>
            <table className="min-w-max border mb-4">
            <thead>
              <tr className="bg-green-100">
                <th className="p-2 text-gray-700">Date</th>
                <th className="p-2 text-gray-700">Done by</th>
                <th className="p-2 text-gray-700">Task</th>
                <th className="p-2 text-gray-700">Type</th>
                <th className="p-2 text-gray-700">Quantity</th>
                <th className="p-2 text-gray-700">Base GVT</th>
                <th className="p-2 text-gray-700">GVT Earned</th>
                <th className="p-2 text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2"><input name="date" type="date" value={item.date} onChange={e => handleChange(idx, e)} className="border p-2 rounded w-full" required /></td>
                  <td className="p-2" style={{ minWidth: '140px', maxWidth: '220px' }}>
                    <select
                      name="done_by"
                      value={item.done_by}
                      onChange={e => handleChange(idx, e)}
                      className="border p-2 rounded w-full text-base"
                      required
                    >
                      <option value="">Select done by</option>
                      {allowedDoneBy.map(doneBy => (
                        <option key={doneBy} value={doneBy}>{doneBy}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2"><input name="task" type="text" value={item.task} onChange={e => handleChange(idx, e)} className="border p-2 rounded w-full" required /></td>
                  <td className="p-2" style={{ minWidth: '100px', maxWidth: '140px' }}>
                    <select
                      name="type"
                      value={item.type}
                      onChange={e => handleChange(idx, e)}
                      className="border p-2 rounded w-full text-base"
                      required
                      style={{ minWidth: '100px', maxWidth: '140px', padding: '8px' }}
                    >
                      <option value="">Select type</option>
                      {allowedTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2"><input name="quantity" type="number" value={item.quantity} onChange={e => handleChange(idx, e)} className="border p-2 rounded w-full" required /></td>
                  <td className="p-2" style={{ minWidth: '100px', maxWidth: '140px' }}><input name="base_gvt" type="number" step="0.01" value={item.base_gvt} onChange={e => handleChange(idx, e)} className="border p-2 rounded w-full text-base" required /></td>
                  <td className="p-2" style={{ minWidth: '140px', maxWidth: '220px' }}><input name="gvt_earned" type="number" step="0.01" value={item.gvt_earned} readOnly className="border p-2 rounded w-full bg-gray-100 text-base" required /></td>
                  <td className="p-2" style={{ minWidth: '100px', maxWidth: '140px' }}>
                    <select
                      name="status"
                      value={item.status}
                      onChange={e => handleChange(idx, e)}
                      className="border p-2 rounded w-full text-base"
                      required
                      style={{ minWidth: '100px', maxWidth: '140px', padding: '8px' }}
                    >
                      {allowedStatus.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 text-center flex flex-col gap-2 items-center">
                    <button type="button" className="text-red-600 font-bold" onClick={() => removeRow(idx)} disabled={items.length === 1}>✕</button>
                    <button type="button" className="bg-green-500 text-white px-2 py-1 rounded font-bold shadow hover:bg-green-600 transition" onClick={() => handleRowSave(idx)}>Save</button>
                    {rowStatus[idx] && <span className="text-xs text-gray-500">{rowStatus[idx]}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="flex gap-4 mb-4">
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded font-bold shadow hover:bg-blue-600 transition" onClick={addRow}>Add Row</button>
          </div>
        </form>
        {message && <p className="mt-6 text-center text-green-600 font-semibold">{message}</p>}

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">All Existing Tasks</h2>
          {loadingExisting ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : existingItems.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found.</p>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 text-gray-700">Date</th>
                  <th className="p-2 text-gray-700">Done by</th>
                  <th className="p-2 text-gray-700">Task</th>
                  <th className="p-2 text-gray-700">Type</th>
                  <th className="p-2 text-gray-700">Quantity</th>
                  <th className="p-2 text-gray-700">Base GVT</th>
                  <th className="p-2 text-gray-700">GVT Earned</th>
                  <th className="p-2 text-gray-700">Status</th>
                  <th className="p-2 text-gray-700">Delete</th>
                </tr>
              </thead>
              <tbody>
                {existingItems.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b">
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.done_by}</td>
                    <td className="p-2">{item.task}</td>
                    <td className="p-2">{item.type}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">{item.base_gvt}</td>
                    <td className="p-2">{item.gvt_earned}</td>
                    <td className="p-2">{item.status}</td>
                    <td className="p-2 text-center">
                      <button
                        className="text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100"
                        onClick={() => handleDelete(item.id)}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}