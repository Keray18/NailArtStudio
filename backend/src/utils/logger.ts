export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  requestId?: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

class Logger {
  private currentLevel: LogLevel = "info";

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.currentLevel];
  }

  private format(payload: LogPayload): string {
    if (process.env.NODE_ENV === "production") {
      return JSON.stringify(payload);
    }
    const reqStr = payload.requestId ? ` [req:${payload.requestId.slice(0, 8)}]` : "";
    const ctxStr = payload.context ? ` ${JSON.stringify(payload.context)}` : "";
    return `[${payload.timestamp}] [${payload.level.toUpperCase()}]${reqStr}: ${payload.message}${ctxStr}`;
  }

  debug(message: string, context?: Record<string, unknown>, requestId?: string): void {
    if (!this.shouldLog("debug")) return;
    const payload: LogPayload = {
      level: "debug",
      message,
      requestId,
      context,
      timestamp: new Date().toISOString(),
    };
    console.debug(this.format(payload));
  }

  info(message: string, context?: Record<string, unknown>, requestId?: string): void {
    if (!this.shouldLog("info")) return;
    const payload: LogPayload = {
      level: "info",
      message,
      requestId,
      context,
      timestamp: new Date().toISOString(),
    };
    console.info(this.format(payload));
  }

  warn(message: string, context?: Record<string, unknown>, requestId?: string): void {
    if (!this.shouldLog("warn")) return;
    const payload: LogPayload = {
      level: "warn",
      message,
      requestId,
      context,
      timestamp: new Date().toISOString(),
    };
    console.warn(this.format(payload));
  }

  error(message: string, context?: Record<string, unknown>, requestId?: string): void {
    if (!this.shouldLog("error")) return;
    const payload: LogPayload = {
      level: "error",
      message,
      requestId,
      context,
      timestamp: new Date().toISOString(),
    };
    console.error(this.format(payload));
  }
}

export const logger = new Logger();

