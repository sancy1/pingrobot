'use client'

import { Search } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden" style={{ marginLeft: '80px' }}>
      <div className="px-4 sm:px-6 py-4">
        {/* Title and Search */}
        <div className="flex items-center gap-3 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight whitespace-nowrap">
            PingRobot<span className="text-primary">.</span>
          </h1>
          
          {/* Search Field */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border min-w-0">
            <Search size={16} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name or URL..."
              className="bg-transparent text-xs sm:text-sm text-foreground placeholder-muted-foreground outline-none flex-1 min-w-0"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
