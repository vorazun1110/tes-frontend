const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://skilled-stud-merely.ngrok-free.app";

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json();
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
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}
