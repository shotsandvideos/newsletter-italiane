'use client'

import { useCallback, useState } from 'react'
import { logClientSecurityEvent } from '../lib/client-security'
import { logger, devError } from '../lib/logger'

export interface AppError {
  message: string
  code?: string
  statusCode?: number
  originalError?: Error
  context?: Record<string, any>
}

interface ErrorHandlerState {
  error: AppError | null
  isErrorVisible: boolean
}

/**
 * Hook for handling async errors (API calls, promises, etc.)
 * Error boundaries only catch synchronous errors in React render cycle
 */
export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorHandlerState>({
    error: null,
    isErrorVisible: false
  })

  const handleError = useCallback((error: unknown, context?: Record<string, any>) => {
    let appError: AppError

    if (error instanceof Error) {
      appError = {
        message: error.message,
        originalError: error,
        context
      }
    } else if (typeof error === 'string') {
      appError = {
        message: error,
        context
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      appError = {
        message: (error as any).message || 'Unknown error',
        code: (error as any).code,
        statusCode: (error as any).statusCode,
        context
      }
    } else {
      appError = {
        message: 'An unexpected error occurred',
        context: { ...context, originalError: error }
      }
    }

    // Log error for monitoring
    if (appError.originalError) {
      logger.error('useErrorHandler caught error:', appError.originalError)
      devError('Error context:', appError.context)
    } else {
      logger.error('useErrorHandler caught error:', appError.message)
      devError('Error details:', appError)
    }

    // Log security-related errors
    if (appError.statusCode === 401 || appError.statusCode === 403) {
      logClientSecurityEvent('auth_error', {
        message: appError.message,
        statusCode: appError.statusCode,
        context: appError.context
      })
    }

    setErrorState({
      error: appError,
      isErrorVisible: true
    })

    return appError
  }, [])

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isErrorVisible: false
    })
  }, [])

  const hideError = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      isErrorVisible: false
    }))
  }, [])

  /**
   * Wrapper for async functions that automatically handles errors
   */
  const withErrorHandling = useCallback(
    <T extends any[], R>(
      asyncFn: (...args: T) => Promise<R>,
      context?: Record<string, any>
    ) => {
      return async (...args: T): Promise<R | null> => {
        try {
          return await asyncFn(...args)
        } catch (error) {
          handleError(error, context)
          return null
        }
      }
    },
    [handleError]
  )

  /**
   * Wrapper for API calls with automatic error handling
   */
  const apiCall = useCallback(
    async <T = any>(
      url: string,
      options?: RequestInit,
      context?: Record<string, any>
    ): Promise<T | null> => {
      try {
        const response = await fetch(url, options)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw {
            message: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
            statusCode: response.status,
            code: errorData.code
          }
        }

        return await response.json()
      } catch (error) {
        handleError(error, { url, method: options?.method || 'GET', ...context })
        return null
      }
    },
    [handleError]
  )

  return {
    error: errorState.error,
    isErrorVisible: errorState.isErrorVisible,
    handleError,
    clearError,
    hideError,
    withErrorHandling,
    apiCall
  }
}

/**
 * Error Display Component
 * Use this to show errors caught by useErrorHandler
 */
interface ErrorDisplayProps {
  error: AppError | null
  isVisible: boolean
  onClose: () => void
  onRetry?: () => void
}

export function ErrorDisplay({ error, isVisible, onClose, onRetry }: ErrorDisplayProps) {
  if (!error || !isVisible) return null

  const isAuthError = error.statusCode === 401 || error.statusCode === 403

  return (
    <div className="fixed top-4 right-4 max-w-sm w-full z-50 animate-in slide-in-from-right-full">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-destructive">
                {isAuthError ? 'Errore di Autenticazione' : 'Errore'}
              </span>
            </div>
            <p className="text-sm text-foreground mb-3">
              {error.message}
            </p>
            <div className="flex gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors"
                >
                  Riprova
                </button>
              )}
              <button
                onClick={onClose}
                className="text-xs border border-border text-foreground px-2 py-1 rounded hover:bg-accent transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1"
            aria-label="Close error"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default useErrorHandler