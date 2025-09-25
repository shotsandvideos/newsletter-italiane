'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { logClientSecurityEvent } from '../lib/client-security'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Global Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error, 
      errorInfo: null 
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Update state with error info
    this.setState({
      error,
      errorInfo
    })

    // Log the error for monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log to our security monitoring system (client-safe)
    logClientSecurityEvent('react_error_boundary_triggered', {
      errorMessage: error.message,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : 'hidden',
      componentStack: process.env.NODE_ENV === 'development' ? errorInfo.componentStack : 'hidden',
      timestamp: new Date().toISOString()
    })

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error monitoring service
      // sendErrorToService(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Oops! Qualcosa è andato storto
              </h1>
              <p className="text-muted-foreground mb-6">
                Si è verificato un errore imprevisto. Il nostro team è stato notificato.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Riprova
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
              >
                <Home className="h-4 w-4" />
                Torna alla Home
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-muted p-4 rounded-lg text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Dettagli Errore (Solo Sviluppo)
                </summary>
                <pre className="whitespace-pre-wrap overflow-auto max-h-40 text-xs">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook-based error boundary component for functional components
 * Use this for smaller, localized error boundaries
 */
interface LocalErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
}

export function LocalErrorBoundary({ children, fallback }: LocalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        fallback ? undefined : (
          <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Errore nel caricamento</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Questo componente ha riscontrato un problema.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm bg-destructive text-destructive-foreground px-3 py-1 rounded hover:bg-destructive/90 transition-colors"
            >
              Ricarica Pagina
            </button>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary