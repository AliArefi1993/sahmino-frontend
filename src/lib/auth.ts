export async function obtainToken(username: string, password: string) {
  const res = await fetch("http://localhost:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Login failed");
  }
  const data = await res.json();
  // store tokens
  localStorage.setItem("accessToken", data.access);
  if (data.refresh) localStorage.setItem("refreshToken", data.refresh);
  return data;
}

export function getAccessToken() {
  try {
    return localStorage.getItem("accessToken");
  } catch (e) {
    return null;
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch (e) {
    // ignore
  }
}

export async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  // ensure JSON content-type when body present and not multipart
  if (init.body && !headers.get("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { ...init, headers });
}
