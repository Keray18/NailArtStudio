/**
 * The Nail Lounge — Centralized Typed API Client
 * Facilitates all HTTP communication with the Express backend REST API (/api/v1).
 * Strictly isolated: Zero Prisma imports, clean error normalization, AbortController timeout.
 */

export interface ApiResponse<T> {
  success: true;
  statusCode: number;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  timestamp: string;
}

export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ApiErrorDetail[];

  constructor(message: string, statusCode = 500, code = "NETWORK_ERROR", details?: ApiErrorDetail[]) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
    defaultTimeout = 8000
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, ""); // Remove trailing slashes
    this.defaultTimeout = defaultTimeout;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, timeoutMs = this.defaultTimeout, headers, ...customConfig } = options;
    const url = this.buildUrl(path, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...customConfig,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Request-Id": typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `req_${Date.now()}`,
          ...headers,
        },
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!isJson) {
        if (!response.ok) {
          throw new ApiClientError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            "HTTP_ERROR"
          );
        }
        return {} as T;
      }

      const json = await response.json();

      if (!response.ok || json.success === false) {
        const errorData = (json as ApiErrorResponse).error || {
          code: "REQUEST_FAILED",
          message: `Request failed with status ${response.status}`,
        };

        throw new ApiClientError(
          errorData.message,
          json.statusCode || response.status,
          errorData.code,
          errorData.details
        );
      }

      return (json as ApiResponse<T>).data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiClientError(
          `Request to ${path} timed out after ${timeoutMs}ms.`,
          408,
          "TIMEOUT_ERROR"
        );
      }

      const message = error instanceof Error ? error.message : "Network request failed";
      throw new ApiClientError(message, 500, "NETWORK_ERROR");
    }
  }

  public get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  public post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

