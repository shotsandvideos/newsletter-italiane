'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../hooks/useAuth';

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Don't wrap admin routes with AuthProvider (they use localStorage auth)
  const isAdminRoute = pathname?.startsWith('/admin');
  
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
