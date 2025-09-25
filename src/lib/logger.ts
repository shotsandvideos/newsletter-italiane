/**
 * Production-safe logging utility
 * Conditionally logs based on environment and severity level
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  enabledInProduction: boolean
  minLevel: LogLevel
  enabledLevels: Set<LogLevel>
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

class Logger {
  private config: LoggerConfig
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    
    // Configure based on environment
    this.config = {
      enabledInProduction: false, // Disable all logs in production by default
      minLevel: this.isDevelopment ? 'debug' : 'error',
      enabledLevels: new Set(this.isDevelopment ? ['debug', 'info', 'warn', 'error'] : ['error'])
    }
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log if explicitly enabled and level is allowed
    if (!this.isDevelopment && !this.config.enabledInProduction) {
      return level === 'error' // Only errors in production
    }

    // Check minimum level
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel] && 
           this.config.enabledLevels.has(level)
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): any[] {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    return [prefix, message, ...args]
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(...this.formatMessage('debug', message, ...args))
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.formatMessage('info', message, ...args))
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.formatMessage('warn', message, ...args))
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(...this.formatMessage('error', message, ...args))
    }
  }

  // Temporarily enable production logging for debugging
  enableProductionLogging(enabled: boolean = true): void {
    this.config.enabledInProduction = enabled
  }

  // Set minimum log level
  setLevel(level: LogLevel): void {
    this.config.minLevel = level
    this.config.enabledLevels = new Set(
      Object.keys(LOG_LEVELS).filter(l => 
        LOG_LEVELS[l as LogLevel] >= LOG_LEVELS[level]
      ) as LogLevel[]
    )
  }
}

// Create singleton instance
export const logger = new Logger()

// Convenience functions for backward compatibility
export const log = logger.debug.bind(logger)
export const logInfo = logger.info.bind(logger)
export const logWarn = logger.warn.bind(logger)
export const logError = logger.error.bind(logger)

// Development-only logging (completely removed in production builds)
export const devLog = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] ${message}`, ...args)
  }
}

export const devError = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[DEV] ${message}`, ...args)
  }
}