'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { MonitorList } from '@/components/monitor-list'
import { StatusSummary } from '@/components/status-summary'

export default function Page() {
  return (
    <main className="min-h-screen bg-background flex flex-col" style={{ marginLeft: '80px' }}>
      <Sidebar />
      <Header />
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full lg:w-0 min-w-0">
          <MonitorList />
        </div>

        {/* Status Summary - Responsive: Stacks below on smaller screens, sidebar on lg+ */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border lg:flex-shrink-0 overflow-y-auto">
          <StatusSummary />
        </div>
      </div>
    </main>
  )
}
