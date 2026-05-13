import { use } from "react";

const API_BASE = "/api/v1";

const promiseCache = new Map<string, Promise<unknown>>();

export const useSuspenseFetch = <T>(path: string): T => {
  if (!promiseCache.has(path)) {
    promiseCache.set(path, fetchPublic<T>(path));
  }
  return use(promiseCache.get(path)! as Promise<T>);
};

export const fetchCMS = async <T>(
  path: string,
  password?: string,
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (password) {
    headers["X-Admin-Token"] = password;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const updateCMS = async <T>(
  path: string,
  data: T,
  password: string,
): Promise<{ status: string; id: number }> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": password,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json() as Promise<{ status: string; id: number }>;
};

export const fetchPublic = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

export const postPublic = async <T, R = unknown>(
  path: string,
  data: T,
): Promise<R> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json() as Promise<R>;
};
