export type Direction = "left" | "right";

export interface User {
  id: number;
  username: string;
  role: "admin" | "operator";
}

export interface Location {
  id: number;
  code: string;
  name: string;
  backgroundImage: string | null;
}

export interface Train {
  id: number;
  trainCode: string;
  locationId: number;
  locationCode: string;
  x: number;
  y: number;
  direction: Direction;
  updatedAt: string;
  updatedBy: string | null;
}

export type TrainChange = Partial<Pick<Train, "x" | "y" | "direction" | "locationId">>;

const TOKEN_KEY = "prasarana.token";
const USER_KEY = "prasarana.user";

export function saveSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  if (!localStorage.getItem(TOKEN_KEY)) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? "null") as User | null;
  } catch {
    return null;
  }
}

export function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let onUnauthorized: () => void = () => {};
export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem(TOKEN_KEY);
  if (options.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`/api${path}`, { ...options, headers });

  if (res.status === 401 && path !== "/auth/login") onUnauthorized();
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(res.status, body?.error ?? `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  login: (username: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  locations: () => request<Location[]>("/locations"),
  trains: (locationCode: string) =>
    request<Train[]>(`/trains?location=${encodeURIComponent(locationCode)}`),
  addTrain: (data: { trainCode: string; locationId: number }) =>
    request<Train>("/trains", { method: "POST", body: JSON.stringify(data) }),
  updateTrain: (id: number, change: TrainChange) =>
    request<Train>(`/trains/${id}`, { method: "PATCH", body: JSON.stringify(change) }),
  deleteTrain: (id: number) => request<void>(`/trains/${id}`, { method: "DELETE" }),
};