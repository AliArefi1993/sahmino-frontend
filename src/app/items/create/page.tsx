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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editingRowValues, setEditingRowValues] = useState<any>({});
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

  function startEdit(item: any) {
    // populate form with existing item values (convert numbers to strings)
    setItems([
      {
        date: item.date || today,
        done_by: item.done_by || "",
        task: item.task || "",
        type: item.type || "",
        status: item.status || "To Do",
        quantity: item.quantity?.toString?.() || String(item.quantity || ""),
        base_gvt: item.base_gvt?.toString?.() || String(item.base_gvt || ""),
        gvt_earned: item.gvt_earned?.toString?.() || String(item.gvt_earned || ""),
      },
    ]);
    setEditingId(item.id || null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
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
    setEditingId(null);
    setRowStatus([""]);
    setMessage("");
  }

  function startRowEdit(item: any) {
    setEditingRowId(item.id);
    setEditingRowValues({
      date: item.date || today,
      done_by: item.done_by || "",
      task: item.task || "",
      type: item.type || "",
      status: item.status || "To Do",
      quantity: item.quantity?.toString?.() || String(item.quantity || ""),
      base_gvt: item.base_gvt?.toString?.() || String(item.base_gvt || ""),
      gvt_earned: item.gvt_earned?.toString?.() || String(item.gvt_earned || ""),
    });
  }

  function cancelRowEdit() {
    setEditingRowId(null);
    setEditingRowValues({});
  }

  function handleRowEditChange(field: string, value: any) {
    const updated = { ...editingRowValues, [field]: value };
    // auto-calc gvt_earned
    const q = Number(updated.quantity);
    const b = Number(updated.base_gvt);
    if (!isNaN(q) && !isNaN(b)) {
      updated.gvt_earned = (q * b).toFixed(2);
    } else {
      updated.gvt_earned = "";
    }
    setEditingRowValues(updated);
  }

  async function saveRowEdit(id: number) {
    const payload = {
      ...editingRowValues,
      quantity: Number(editingRowValues.quantity),
      base_gvt: Number(editingRowValues.base_gvt),
      gvt_earned: Number(editingRowValues.gvt_earned || 0),
    };
    const res = await fetch(`http://localhost:8000/api/items/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setEditingRowId(null);
      setEditingRowValues({});
      refreshExistingItems();
      setMessage('Item updated successfully.');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Error updating item.');
    }
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
    let res;
    if (editingId) {
      // update existing item
      res = await fetch(`http://localhost:8000/api/items/${editingId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("http://localhost:8000/api/items/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    const data = await res.json();
    setRowStatus(rowStatus => {
      const updated = [...rowStatus];
      if (res.ok) {
        updated[idx] = "Saved!";
  refreshExistingItems();
        // if it was an update, clear editing mode
        if (editingId) {
          setEditingId(null);
        }
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
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input name="date" type="date" value={items[0].date} onChange={e => handleChange(0, e)} className="mt-1 border p-2 rounded w-full" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Done by</label>
              <select name="done_by" value={items[0].done_by} onChange={e => handleChange(0, e)} className="mt-1 border p-2 rounded w-full" required>
                <option value="">Select done by</option>
                {allowedDoneBy.map(doneBy => (
                  <option key={doneBy} value={doneBy}>{doneBy}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Task</label>
              <input name="task" type="text" value={items[0].task} onChange={e => handleChange(0, e)} className="mt-1 border p-2 rounded w-full" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type" value={items[0].type} onChange={e => handleChange(0, e)} className="mt-1 border p-2 rounded w-full" required>
                  <option value="">Select type</option>
                  {allowedTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={items[0].status} onChange={e => handleChange(0, e)} className="mt-1 border p-2 rounded w-full" required>
                  {allowedStatus.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input name="quantity" type="number" value={items[0].quantity} onChange={e => handleChange(0, e)} className="mt-1 border p-2 rounded w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Base GVT</label>
                <input name="base_gvt" type="number" step="0.01" value={items[0].base_gvt} onChange={e => handleChange(0, e)} className="mt-1 border p-2 rounded w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GVT Earned</label>
                <input name="gvt_earned" type="number" step="0.01" value={items[0].gvt_earned} readOnly className="mt-1 border p-2 rounded w-full bg-gray-100" />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold">Create Item</button>
              <button type="button" className="bg-green-500 text-white px-4 py-2 rounded font-bold" onClick={() => handleRowSave(0)}>Save</button>
              <button type="button" className="text-red-600 px-4 py-2 rounded font-bold" onClick={() => removeRow(0)}>Remove</button>
            </div>
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
                  <th className="p-2 text-gray-700">Actions</th>
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
                    <td className="p-2 text-center flex gap-2 justify-center">
                      <button
                        className="text-blue-600 font-bold px-2 py-1 rounded hover:bg-blue-100"
                        onClick={() => startEdit(item)}
                      >Update</button>
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