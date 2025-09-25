'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '../hooks/useAuth';
import { useErrorHandler, ErrorDisplay } from '../hooks/useErrorHandler';

function ErrorHandlingWrapper({ children }: { children: ReactNode }) {
  const { error, isErrorVisible, hideError } = useErrorHandler()

  return (
    <>
      {children}
      <ErrorDisplay 
        error={error} 
        isVisible={isErrorVisible} 
        onClose={hideError}
      />
    </>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ErrorHandlingWrapper>
        {children}
      </ErrorHandlingWrapper>
    </AuthProvider>
  );
}
