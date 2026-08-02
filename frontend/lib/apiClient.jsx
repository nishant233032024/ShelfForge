import { API_BASE_URL } from "./constants";

export class ApiRequestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
  }
}

export async function apiClient(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let responseBody = null;

  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }

  if (!response.ok) {
    throw new ApiRequestError(
      responseBody?.message || "Request failed",
      response.status
    );
  }

  return responseBody;
}
