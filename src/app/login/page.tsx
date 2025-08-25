"use client";
import React, { useState } from "react";
import { obtainToken, clearTokens } from "../../lib/auth";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const search = useSearchParams();
  const router = useRouter();
  const next = search.get("next") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      await obtainToken(username, password);
  // redirect to next
  router.push(next);
    } catch (err: any) {
      setMessage(err.message || "Login failed");
    }
  }

  function logout() {
    clearTokens();
    setMessage("Logged out.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-gray-700">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">Login</button>
            <button type="button" onClick={logout} className="flex-1 bg-gray-200 px-4 py-2 rounded">Logout</button>
          </div>
        </form>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        <div className="mt-4 text-sm">
          <Link href="/">← Back</Link>
        </div>
      </div>
    </main>
  );
}
