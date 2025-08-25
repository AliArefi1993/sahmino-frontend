"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "../lib/auth";

export default function Header() {
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setToken(getAccessToken());

    // update token state when localStorage changes in other tabs
    function onStorage(e: StorageEvent) {
      if (e.key === "accessToken") {
        setToken(e.newValue);
      }
    }
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function logout() {
    clearTokens();
    setToken(null);
    router.push("/login");
  }

  // If user not logged in and trying to access a protected route, redirect
  useEffect(() => {
    // refresh token state on route change as login may have occurred
    setToken(getAccessToken());

    const publicPaths = ["/login", "/", "/items/totals", "/api/docs"]; // adjust
    if (!getAccessToken() && !publicPaths.includes(pathname)) {
      const loginHref = `/login?next=${encodeURIComponent(pathname)}`;
      router.push(loginHref);
    }
  }, [pathname, router]);

  return (
    <header className="w-full bg-white border-b py-3 mb-6">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-700">Sahmino</Link>
        <nav className="flex items-center gap-4">
          <Link href="/items" className="text-sm text-gray-700 hover:underline">Items</Link>
          <Link href="/items/create" className="text-sm text-gray-700 hover:underline">Create</Link>
          <Link href="/items/totals" className="text-sm text-gray-700 hover:underline">Totals</Link>
          {token ? (
            <button onClick={logout} className="text-sm text-red-600">Logout</button>
          ) : (
            <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="text-sm text-blue-600">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
