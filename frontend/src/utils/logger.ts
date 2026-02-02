type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEvent {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: number;
}

class Logger {
  private static instance: Logger;
  private logs: LogEvent[] = [];
  private readonly maxLogSize = 100;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const event: LogEvent = {
      level,
      message,
      context,
      timestamp: Date.now(),
    };

    this.logs.push(event);

    // Prevent unbounded memory growth
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift();
    }

    // Only output in development mode
    if (import.meta.env.DEV) {
      const formattedContext = context ? ` ${JSON.stringify(context)}` : '';
      console[level](`[${level.toUpperCase()}] ${message}${formattedContext}`);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  /**
   * Get all logged events (useful for debugging or external reporting)
   */
  getLogs(): readonly LogEvent[] {
    return [...this.logs];
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
