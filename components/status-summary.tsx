// 'use client'

// import { MoreVertical, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useToast } from '@/hooks/use-toast'

// interface Monitor {
//   id: number
//   name: string
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   createdAt: string
// }

// export function StatusSummary() {
//   const [monitors, setMonitors] = useState<Monitor[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()
//   const { toast } = useToast()

//   const AUTH_HEADERS = {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
//   }

//   const fetchMonitors = async () => {
//     try {
//       const response = await fetch('/api/monitors', {
//         method: 'GET',
//         headers: AUTH_HEADERS
//       })
//       const data = await response.json()
//       if (data.success) {
//         setMonitors(data.monitors || [])
//       }
//     } catch (error) {
//       console.error('Failed to fetch monitors for status summary:', error)
//       toast({
//         title: '❌ Error',
//         description: 'Failed to load status summary',
//         variant: 'destructive',
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchMonitors()
//     // Refresh every 30 seconds
//     const interval = setInterval(fetchMonitors, 30000)
//     return () => clearInterval(interval)
//   }, [])

//   // Calculate real statistics from monitor data
//   const totalMonitors = monitors.length
//   const downCount = monitors.filter(m => m.status === 'down').length
//   const upCount = monitors.filter(m => m.status === 'up' || m.status === 'waking').length
//   const pausedCount = monitors.filter(m => !m.status || m.status === 'pending').length
//   const degradedCount = monitors.filter(m => m.status === 'degraded').length

//   // Calculate overall uptime percentage across all monitors
//   const calculateOverallUptime = () => {
//     if (monitors.length === 0) return 0
    
//     let totalUptimeSum = 0
//     let validMonitors = 0
    
//     monitors.forEach(monitor => {
//       const uptime = parseFloat(monitor.uptimePercentage || '100')
//       if (!isNaN(uptime)) {
//         totalUptimeSum += uptime
//         validMonitors++
//       }
//     })
    
//     return validMonitors > 0 ? totalUptimeSum / validMonitors : 0
//   }

//   // Calculate MTBF (Mean Time Between Failures) in hours
//   // Simplified: based on success rate and total pings
//   const calculateMTBF = () => {
//     if (monitors.length === 0) return 0
    
//     let totalSuccessRate = 0
//     monitors.forEach(monitor => {
//       if (monitor.totalPings > 0) {
//         const successRate = (monitor.successfulPings / monitor.totalPings) * 100
//         totalSuccessRate += successRate
//       } else {
//         totalSuccessRate += 100 // New monitors assumed healthy
//       }
//     })
    
//     const avgSuccessRate = totalSuccessRate / monitors.length
//     // Convert success rate to MTBF hours (inverse relationship)
//     // 100% success = 24h MTBF, 0% success = 0h MTBF
//     const mtbfHours = (avgSuccessRate / 100) * 24
//     return mtbfHours
//   }

//   // Calculate time since last incident (simplified)
//   const calculateTimeWithoutIncident = () => {
//     // Find the most recent down monitor
//     const downMonitors = monitors.filter(m => m.status === 'down')
//     if (downMonitors.length === 0) {
//       // No down monitors - check degraded
//       const degradedMonitors = monitors.filter(m => m.status === 'degraded')
//       if (degradedMonitors.length === 0) {
//         return { value: 24, unit: 'h' } // All healthy for 24+ hours
//       }
//       return { value: 2, unit: 'h' } // Degraded within last 2 hours
//     }
//     return { value: 0, unit: 'm' } // Currently has incident
//   }

//   const overallUptime = calculateOverallUptime()
//   const mtbf = calculateMTBF()
//   const timeWithoutIncident = calculateTimeWithoutIncident()
  
//   // Determine overall status color
//   const getOverallStatusColor = () => {
//     if (downCount > 0) return 'from-red-500/20 to-red-600/20 border-red-500/40 text-red-500'
//     if (degradedCount > 0) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/40 text-yellow-500'
//     if (upCount > 0) return 'from-green-500/20 to-green-600/20 border-green-500/40 text-green-500'
//     return 'from-gray-500/20 to-gray-600/20 border-gray-500/40 text-gray-500'
//   }

//   const getOverallStatusText = () => {
//     if (downCount > 0) return downCount
//     if (degradedCount > 0) return '⚠️'
//     if (upCount > 0) return '✓'
//     return '?'
//   }

//   const timeWithoutIncidentDisplay = timeWithoutIncident.value >= 24 
//     ? `${Math.floor(timeWithoutIncident.value / 24)}d`
//     : timeWithoutIncident.value >= 1 
//       ? `${timeWithoutIncident.value}h` 
//       : `${timeWithoutIncident.value}m`

//   if (isLoading) {
//     return (
//       <div className="w-full h-full overflow-y-auto">
//         <div className="w-full max-w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
//           <div className="flex items-center justify-between gap-2">
//             <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight">
//               Current status<span className="text-primary">.</span>
//             </h2>
//           </div>
//           <div className="flex items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full h-full overflow-y-auto">
//       <div className="w-full max-w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between gap-2">
//           <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight">
//             Current status<span className="text-primary">.</span>
//           </h2>
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             className="w-8 h-8 text-muted-foreground hover:text-foreground flex-shrink-0"
//             onClick={fetchMonitors}
//             title="Refresh status"
//           >
//             <MoreVertical size={18} />
//           </Button>
//         </div>

//         {/* Status Indicator - Dynamic */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-start lg:justify-center">
//             <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${getOverallStatusColor()} border-2 flex items-center justify-center shadow-lg`}>
//               <div className="text-3xl sm:text-4xl font-bold">
//                 {getOverallStatusText()}
//               </div>
//             </div>
//           </div>

//           {/* Stats Grid - Dynamic */}
//           <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center w-full">
//             <div className="flex flex-col items-center justify-center">
//               <div className="text-lg sm:text-2xl font-bold text-red-500">{downCount}</div>
//               <div className="text-xs text-muted-foreground mt-1">Down</div>
//             </div>
//             <div className="flex flex-col items-center justify-center">
//               <div className="text-lg sm:text-2xl font-bold text-green-500">{upCount}</div>
//               <div className="text-xs text-muted-foreground mt-1">Up</div>
//             </div>
//             <div className="flex flex-col items-center justify-center">
//               <div className="text-lg sm:text-2xl font-bold text-yellow-500">{pausedCount + degradedCount}</div>
//               <div className="text-xs text-muted-foreground mt-1">Issues</div>
//             </div>
//           </div>
//         </div>

//         {/* Monitor Count - Dynamic */}
//         <div className="text-center text-xs sm:text-sm text-muted-foreground">
//           Monitoring {totalMonitors} {totalMonitors === 1 ? 'monitor' : 'monitors'}.
//         </div>

//         <div className="border-t border-border" />

//         {/* Last 24 Hours */}
//         <div>
//           <h3 className="text-base sm:text-lg font-semibold text-foreground">
//             Last 24 hours<span className="text-primary">.</span>
//           </h3>
//         </div>

//         {/* Uptime Metrics - Dynamic */}
//         <div className="space-y-3 sm:space-y-4">
//           <div className="space-y-2">
//             <div className="flex items-center justify-between gap-2">
//               <span className="text-xs sm:text-sm text-muted-foreground">Overall uptime</span>
//               <div className="flex items-center gap-2">
//                 <span className={`text-base sm:text-lg font-semibold ${overallUptime < 95 ? 'text-red-500' : overallUptime < 99 ? 'text-yellow-500' : 'text-green-500'} flex-shrink-0`}>
//                   {overallUptime.toFixed(2)}%
//                 </span>
//                 {overallUptime < 99 && (
//                   overallUptime < 95 ? <TrendingDown size={16} className="text-red-500" /> : <AlertCircle size={16} className="text-yellow-500" />
//                 )}
//                 {overallUptime >= 99 && <TrendingUp size={16} className="text-green-500" />}
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between gap-2">
//               <span className="text-xs sm:text-sm text-muted-foreground">MTBF</span>
//               <span className="text-base sm:text-lg font-semibold text-foreground flex-shrink-0">
//                 {mtbf.toFixed(1)}h
//               </span>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
//             <div className="space-y-2">
//               <div className="flex items-center justify-between gap-2">
//                 <span className="text-xs sm:text-sm text-muted-foreground">Without Inc.</span>
//                 <span className="text-base sm:text-lg font-semibold text-foreground flex-shrink-0">
//                   {timeWithoutIncidentDisplay}
//                 </span>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between gap-2">
//                 <span className="text-xs sm:text-sm text-muted-foreground">Incidents</span>
//                 <span className="text-base sm:text-lg font-semibold text-red-500 flex-shrink-0">{downCount}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-border" />

//         {/* Legend Info */}
//         <div className="text-xs text-muted-foreground space-y-1.5 sm:space-y-2">
//           <p>
//             <span className="text-red-500">●</span> Down - Service is unavailable
//           </p>
//           <p>
//             <span className="text-green-500">●</span> Up - Service is running
//           </p>
//           <p>
//             <span className="text-yellow-500">●</span> Warning - Degraded or Waking
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


























'use client'

import { MoreVertical, TrendingDown, TrendingUp, AlertCircle, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface Monitor {
  id: number
  name: string
  status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
  uptimePercentage: string
  totalPings: number
  successfulPings: number
  createdAt: string
  isActive: boolean
}

export function StatusSummary() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const AUTH_HEADERS = {
    'Content-Type': 'application/json',
    'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
  }

  const fetchMonitors = async () => {
    try {
      const response = await fetch('/api/monitors', {
        method: 'GET',
        headers: AUTH_HEADERS
      })
      const data = await response.json()
      if (data.success) {
        setMonitors(data.monitors || [])
      }
    } catch (error) {
      console.error('Failed to fetch monitors for status summary:', error)
      toast({
        title: '❌ Error',
        description: 'Failed to load status summary',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonitors()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMonitors, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calculate real statistics from monitor data
  const totalMonitors = monitors.length
  
  // ✅ FIXED: Paused monitors (isActive = false) should NOT count in up/down/downtime
  const activeMonitors = monitors.filter(m => m.isActive !== false)
  const pausedMonitors = monitors.filter(m => m.isActive === false)
  
  // Only count active monitors for status calculations
  const downCount = activeMonitors.filter(m => m.status === 'down').length
  const upCount = activeMonitors.filter(m => m.status === 'up' || m.status === 'waking').length
  const degradedCount = activeMonitors.filter(m => m.status === 'degraded').length
  
  // Paused monitors count (shown separately)
  const pausedCount = pausedMonitors.length

  // Calculate overall uptime percentage across ONLY ACTIVE monitors
  const calculateOverallUptime = () => {
    if (activeMonitors.length === 0) return 0
    
    let totalUptimeSum = 0
    let validMonitors = 0
    
    activeMonitors.forEach(monitor => {
      const uptime = parseFloat(monitor.uptimePercentage || '100')
      if (!isNaN(uptime)) {
        totalUptimeSum += uptime
        validMonitors++
      }
    })
    
    return validMonitors > 0 ? totalUptimeSum / validMonitors : 0
  }

  // Calculate MTBF (Mean Time Between Failures) for ACTIVE monitors only
  const calculateMTBF = () => {
    if (activeMonitors.length === 0) return 0
    
    let totalSuccessRate = 0
    activeMonitors.forEach(monitor => {
      if (monitor.totalPings > 0) {
        const successRate = (monitor.successfulPings / monitor.totalPings) * 100
        totalSuccessRate += successRate
      } else {
        totalSuccessRate += 100 // New monitors assumed healthy
      }
    })
    
    const avgSuccessRate = totalSuccessRate / activeMonitors.length
    const mtbfHours = (avgSuccessRate / 100) * 24
    return mtbfHours
  }

  // Calculate time since last incident for ACTIVE monitors only
  const calculateTimeWithoutIncident = () => {
    const activeDownMonitors = activeMonitors.filter(m => m.status === 'down')
    if (activeDownMonitors.length === 0) {
      const activeDegradedMonitors = activeMonitors.filter(m => m.status === 'degraded')
      if (activeDegradedMonitors.length === 0) {
        return { value: 24, unit: 'h' }
      }
      return { value: 2, unit: 'h' }
    }
    return { value: 0, unit: 'm' }
  }

  const overallUptime = calculateOverallUptime()
  const mtbf = calculateMTBF()
  const timeWithoutIncident = calculateTimeWithoutIncident()
  
  // Determine overall status color (based on active monitors only)
  const getOverallStatusColor = () => {
    if (activeMonitors.length === 0 && pausedCount > 0) {
      return 'from-gray-500/20 to-gray-600/20 border-gray-500/40 text-gray-500'
    }
    if (downCount > 0) return 'from-red-500/20 to-red-600/20 border-red-500/40 text-red-500'
    if (degradedCount > 0) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/40 text-yellow-500'
    if (upCount > 0) return 'from-green-500/20 to-green-600/20 border-green-500/40 text-green-500'
    return 'from-gray-500/20 to-gray-600/20 border-gray-500/40 text-gray-500'
  }

  const getOverallStatusText = () => {
    if (activeMonitors.length === 0 && pausedCount > 0) return '⏸'
    if (downCount > 0) return downCount
    if (degradedCount > 0) return '⚠️'
    if (upCount > 0) return '✓'
    return '?'
  }

  const timeWithoutIncidentDisplay = timeWithoutIncident.value >= 24 
    ? `${Math.floor(timeWithoutIncident.value / 24)}d`
    : timeWithoutIncident.value >= 1 
      ? `${timeWithoutIncident.value}h` 
      : `${timeWithoutIncident.value}m`

  if (isLoading) {
    return (
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full max-w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight">
              Current status<span className="text-primary">.</span>
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="w-full max-w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight">
            Current status<span className="text-primary">.</span>
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-muted-foreground hover:text-foreground flex-shrink-0"
            onClick={fetchMonitors}
            title="Refresh status"
          >
            <MoreVertical size={18} />
          </Button>
        </div>

        {/* Status Indicator - Dynamic */}
        <div className="space-y-4">
          <div className="flex items-center justify-start lg:justify-center">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${getOverallStatusColor()} border-2 flex items-center justify-center shadow-lg`}>
              <div className="text-3xl sm:text-4xl font-bold">
                {getOverallStatusText()}
              </div>
            </div>
          </div>

          {/* Stats Grid - Dynamic with Paused included */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="text-lg sm:text-2xl font-bold text-red-500">{downCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Down</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-lg sm:text-2xl font-bold text-green-500">{upCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Up</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-lg sm:text-2xl font-bold text-yellow-500">{degradedCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Degraded</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-500">{pausedCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Paused</div>
            </div>
          </div>
        </div>

        {/* Monitor Count - Dynamic */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground">
          Monitoring {activeMonitors.length} of {totalMonitors} {totalMonitors === 1 ? 'monitor' : 'monitors'}.
          {pausedCount > 0 && ` (${pausedCount} paused)`}
        </div>

        <div className="border-t border-border" />

        {/* Last 24 Hours */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Last 24 hours<span className="text-primary">.</span>
          </h3>
        </div>

        {/* Uptime Metrics - Dynamic */}
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Overall uptime</span>
              <div className="flex items-center gap-2">
                <span className={`text-base sm:text-lg font-semibold ${overallUptime < 95 ? 'text-red-500' : overallUptime < 99 ? 'text-yellow-500' : 'text-green-500'} flex-shrink-0`}>
                  {overallUptime.toFixed(2)}%
                </span>
                {overallUptime < 99 && (
                  overallUptime < 95 ? <TrendingDown size={16} className="text-red-500" /> : <AlertCircle size={16} className="text-yellow-500" />
                )}
                {overallUptime >= 99 && <TrendingUp size={16} className="text-green-500" />}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">MTBF</span>
              <span className="text-base sm:text-lg font-semibold text-foreground flex-shrink-0">
                {mtbf.toFixed(1)}h
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Without Inc.</span>
                <span className="text-base sm:text-lg font-semibold text-foreground flex-shrink-0">
                  {timeWithoutIncidentDisplay}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Incidents</span>
                <span className="text-base sm:text-lg font-semibold text-red-500 flex-shrink-0">{downCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Legend Info */}
        <div className="text-xs text-muted-foreground space-y-1.5 sm:space-y-2">
          <p>
            <span className="text-red-500">●</span> Down - Service is unavailable
          </p>
          <p>
            <span className="text-green-500">●</span> Up - Service is running
          </p>
          <p>
            <span className="text-yellow-500">●</span> Degraded - Performance issues
          </p>
          <p>
            <span className="text-gray-500">●</span> Paused - Monitoring stopped
          </p>
        </div>
      </div>
    </div>
  )
}