// components/providers.tsx
// Wrapper component that provides session context to the entire application
// Enables useSession() hook anywhere in the component tree

'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}