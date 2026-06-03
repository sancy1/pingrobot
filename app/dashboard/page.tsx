// app/dashboard/page.tsx
// Protected Dashboard Page - Requires authentication
// Displays monitor list and status summary

'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MonitorList } from '@/components/monitor-list';
import { StatusSummary } from '@/components/status-summary';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/');
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main 
      className="min-h-screen bg-background flex flex-col transition-all duration-200"
      style={{ marginLeft: isMobile ? 0 : '80px' }}
    >
      <Sidebar />
      <Header />
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full lg:w-0 min-w-0">
          <MonitorList />
        </div>
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border lg:flex-shrink-0 overflow-y-auto">
          <StatusSummary />
        </div>
      </div>
    </main>
  );
}