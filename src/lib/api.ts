import { clearAuth, getToken } from "./auth";
import { dispatchSnackbar } from "./snackbar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://skilled-stud-merely.ngrok-free.app";

async function handleActionResponse<T>(response: Response): Promise<T> {
  const json = await response.json();
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      clearAuth();
      window.location.href = "/signin";
    }
    throw new Error("Unauthorized");
  }
  if (!response.ok || !json.success) {
    dispatchSnackbar({ message: json.message || "API request failed", severity: "error" });
    throw new Error(json.message || "API request failed");
  }
  dispatchSnackbar({ message: json.message || "API request successful", severity: "success" });
  return json;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json();
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      clearAuth();
      window.location.href = "/signin";
    }
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error(json.message || "API request failed");
  }
  return json;
}
export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "zail",
      "Authorization": `Bearer ${getToken()}`,
    },
    cache: "no-store",
  });
  return handleResponse<T>(res);
}

export async function apiAction<T>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "zail",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  return handleActionResponse<T>(res);
}
