const API_BASE = "/api/v1";

export const fetchCMS = async (path: string, password?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (password) {
    headers["X-Admin-Password"] = password;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

export const updateCMS = async (path: string, data: any, password: string) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": password,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

export const fetchPublic = async (path: string) => {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};
