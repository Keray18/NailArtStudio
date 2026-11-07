# The Nail Lounge — Phase 2: API Conventions & Contract Reference

**Document Version:** 1.0.0  
**Phase:** Phase 2 (Technical Foundation)  
**Base URL:** `/api/v1`  
**Protocol:** REST over JSON / HTTPS  

---

## 1. Global Response Envelopes

Every endpoint implemented in **The Nail Lounge** backend adheres strictly to standardized JSON response envelopes.

### 1.1 Success Response (`ApiResponse<T>`)

```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 36,
    "totalPages": 2
  },
  "timestamp": "2026-11-06T12:00:00.000Z"
}
```

| Property | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | Always `true` for 2xx responses. |
| `statusCode` | `number` | HTTP status code matching the header (e.g., 200, 201). |
| `data` | `T` | The primary payload object or array. |
| `meta` | `object` *(optional)* | Pagination or faceted navigation metadata. |
| `timestamp` | `string` | ISO 8601 UTC timestamp of response generation. |

### 1.2 Error Response (`ApiErrorResponse`)

```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Input validation failed.",
    "details": [
      {
        "field": "body.email",
        "message": "Invalid email address format"
      }
    ]
  },
  "timestamp": "2026-11-06T12:00:00.000Z"
}
```

| Property | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | Always `false` for 4xx/5xx responses. |
| `statusCode` | `number` | HTTP status code (e.g., 400, 404, 409, 429, 500, 503). |
| `error.code` | `string` | Machine-readable error code (e.g., `NOT_FOUND`, `RATE_LIMIT_EXCEEDED`). |
| `error.message` | `string` | Human-readable error description safe for client display. |
| `error.details` | `array` *(optional)* | Field-level error breakdowns for forms and validation. |
| `timestamp` | `string` | ISO 8601 UTC timestamp. |

---

## 2. Standard HTTP Status Codes & Error Codes

| Status | Error Code | Scenario |
| :--- | :--- | :--- |
| `200 OK` | — | Successful query, calculation, or status probe. |
| `201 Created` | — | Entity successfully created (e.g. order placed). |
| `400 Bad Request` | `VALIDATION_FAILED` / `MALFORMED_JSON` | Zod schema validation failed or request JSON is unparseable. |
| `404 Not Found` | `NOT_FOUND` / `RECORD_NOT_FOUND` | Route or catalog resource does not exist. |
| `409 Conflict` | `CONFLICT` / `UNIQUE_CONSTRAINT_VIOLATION` | Business logic or uniqueness collision (e.g. out of stock). |
| `429 Too Many Requests` | `RATE_LIMIT_EXCEEDED` | Client exceeded IP-based request threshold. |
| `500 Internal Error` | `INTERNAL_SERVER_ERROR` | Unhandled runtime exception (stack redacted in production). |
| `503 Service Unavailable`| `SERVICE_UNAVAILABLE` / `DATABASE_ERROR` | Database or upstream dependent service failed readiness check. |

---

## 3. Correlation ID & Distributed Tracing

1. Every incoming request is tagged with an `X-Request-Id` HTTP header.
2. If the client sends an `X-Request-Id`, the backend preserves and propagates it.
3. If omitted, the server automatically generates a cryptographic UUIDv4.
4. The ID is attached to:
   - `req.id` on Express Request objects.
   - Response header `X-Request-Id`.
   - All structured log entries emitted by `logger`.

---

## 4. Phase 2 Implemented Endpoints

### 4.1 Liveness Probe
- **Endpoint:** `GET /api/v1/health` (also aliased at `/health`)
- **Purpose:** Verifies that the Express HTTP server process is running and accepting sockets. Does not query database or external dependencies.
- **Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "status": "pass",
    "service": "the-nail-lounge-backend",
    "uptimeSeconds": 142,
    "timestamp": "2026-11-06T12:00:00.000Z"
  },
  "timestamp": "2026-11-06T12:00:00.000Z"
}
```

### 4.2 Readiness Probe
- **Endpoint:** `GET /api/v1/ready`
- **Purpose:** Executes a bounded (3,000ms timeout) `$queryRaw` ping against PostgreSQL. Returns 200 if connected; returns 503 if unreachable or degraded.
- **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "status": "ready",
    "service": "the-nail-lounge-backend",
    "database": {
      "status": "connected",
      "latencyMs": 4
    },
    "timestamp": "2026-11-06T12:00:00.000Z"
  },
  "timestamp": "2026-11-06T12:00:00.000Z"
}
```
- **Failure Response (503 Service Unavailable):**
```json
{
  "success": false,
  "statusCode": 503,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Database connectivity check failed.",
    "details": [
      {
        "field": "database",
        "message": "Connection refused at localhost:5432"
      }
    ]
  },
  "timestamp": "2026-11-06T12:00:00.000Z"
}
```

