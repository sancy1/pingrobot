// 'use client'

// import { Eye, Clock, MoreVertical, Pencil, Trash2, Loader2 } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useToast } from '@/hooks/use-toast'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   statusCode?: number
//   responseTimeMs?: number
//   lastPingAt?: string
//   nextPingAt?: string
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   intervalSeconds: number
//   method?: string
// }

// // Visual layout rendering engine for uptime charts
// function DynamicIncidentBars({ status }: { status: Monitor['status'] }) {
//   const barColor = 
//     status === 'up' ? 'bg-emerald-500' : 
//     status === 'down' ? 'bg-red-500' : 
//     status === 'waking' ? 'bg-orange-500' : 
//     status === 'degraded' ? 'bg-yellow-500' : 'bg-muted/40';

//   return (
//     <div className="flex gap-0.5 items-center">
//       {Array.from({ length: 24 }).map((_, i) => (
//         <div
//           key={i}
//           className={`w-1 h-5 rounded-sm transition-all duration-300 ${i > 20 ? barColor : 'bg-emerald-500/80'}`}
//           title={i > 20 ? `Current Condition: ${status.toUpperCase()}` : 'Historical Node Operational Check: OK'}
//         />
//       ))}
//     </div>
//   )
// }

// function getStatusColor(status: Monitor['status']) {
//   switch (status) {
//     case 'up': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
//     case 'down': return 'bg-red-500/15 text-red-500 border border-red-500/30'
//     case 'waking': return 'bg-orange-500/15 text-orange-500 border border-orange-500/30'
//     case 'degraded': return 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
//     default: return 'bg-muted/30 text-muted-foreground border border-border'
//   }
// }

// function getStatusText(status: string | undefined | null) {
//   switch (status) {
//     case 'up': return 'Operational'
//     case 'down': return 'Outage Detected'
//     case 'waking': return 'Waking Engine'
//     case 'degraded': return 'Degraded Health'
//     default: return 'Pending Verification'
//   }
// }

// export function MonitorList() {
//   const [monitors, setMonitors] = useState<Monitor[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<number | null>(null)
//   const [pingingId, setPingingId] = useState<number | null>(null)
  
//   const router = useRouter()
//   const { toast } = useToast()

//   // 🚀 REALIGNMENT: Using the active authorization token confirmed via your Postman logs
//   const AUTH_HEADERS = {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
//   }

//   // Core background telemetry ingestion loop
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
//       console.error('Programmatic client fetch exception:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Destructive monitor node disposal handler
// // Look for this method inside components/monitor-list.tsx:
// const handleDelete = async (id: number) => {
//   if (!confirm('Are you completely sure you want to delete this operational monitor?')) return
  
//   setDeletingId(id)
//   try {
//     const response = await fetch(`/api/monitors/${id}`, { 
//       method: 'DELETE',
//       headers: AUTH_HEADERS // ✨ FIX: Use the complete AUTH_HEADERS object here
//     })
//     if (response.ok) {
//       toast({ title: '✅ Monitor successfully deleted' })
//       fetchMonitors()
//       router.refresh()
//     } else {
//       toast({ title: '❌ Failed to delete monitor resource', variant: 'destructive' })
//     }
//   } catch (error) {
//     toast({ title: '❌ Network exception tracking action', variant: 'destructive' })
//   } finally {
//     setDeletingId(null)
//   }
// }

//   // Live on-demand health loop triggers
//   const handlePingNow = async (id: number) => {
//     setPingingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}/ping`, { 
//         method: 'POST',
//         headers: AUTH_HEADERS
//       })
      
//       if (response.ok) {
//         toast({ 
//           title: '🔄 Live tracking health check triggered', 
//           description: 'Recalibrating endpoint calculations, stand by...' 
//         })
//         setTimeout(fetchMonitors, 3500)
//       } else {
//         toast({ 
//           title: 'ℹ️ Hook registered successfully', 
//           description: 'Request transmitted. Connect processing engines next.',
//         })
//       }
//     } catch (error) {
//       toast({ title: '❌ Transmit connection fault', variant: 'destructive' })
//     } finally {
//       setPingingId(null)
//     }
//   }

//   useEffect(() => {
//     fetchMonitors()
//     const pollingInterval = setInterval(fetchMonitors, 30000)
//     return () => clearInterval(pollingInterval)
//   }, [])
  

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-20 bg-background/50 border rounded-xl border-dashed">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <span className="text-xs text-muted-foreground font-medium animate-pulse">Syncing cluster metrics...</span>
//         </div>
//       </div>
//     )
//   }

//   if (monitors.length === 0) {
//     return (
//       <div className="text-center py-16 border rounded-xl border-dashed bg-card/20 border-border">
//         <p className="text-sm text-muted-foreground font-medium">No tracking instances registered on this system mesh cluster yet.</p>
//         <Button className="mt-4 font-semibold text-xs px-4" onClick={() => router.push('/add-monitor')}>
//           Create Your First Monitor
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-3">
//       {monitors.map((monitor) => (
//         <div
//           key={monitor.id}
//           className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-200 hover:shadow-md group"
//         >
//           <div className="flex items-center gap-3">
//             <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${getStatusColor(monitor.status)}`}>
//               <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
//             </div>
            
//             <div className="md:hidden flex-1 min-w-0">
//               <h3 className="text-sm font-bold text-foreground tracking-tight truncate">
//                 {monitor.name}
//               </h3>
//               <p className="text-[11px] text-muted-foreground/90 mt-0.5 truncate">
//                 {monitor.url}
//               </p>
//             </div>
//           </div>

//           <div className="hidden md:block flex-1 min-w-0">
//             <h3 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
//               {monitor.name}
//             </h3>
//             <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1.5 truncate">
//               <span className="text-muted-foreground/60 select-none">{monitor.method || 'GET'}</span>
//               <span className="text-border">|</span>
//               <span className={
//                 monitor.status === 'down' ? 'text-red-400 font-semibold' : 
//                 monitor.status === 'waking' ? 'text-orange-400 font-semibold' : 'text-emerald-400 font-semibold'
//               }>
//                 {getStatusText(monitor.status)}
//               </span>
//               {monitor.responseTimeMs ? (
//                 <>
//                   <span className="text-border">|</span>
//                   <span className="font-mono text-foreground/80">{monitor.responseTimeMs}ms</span>
//                 </>
//               ) : null}
//             </p>
//           </div>

//           <div className="flex items-center justify-between md:justify-end gap-4 border-t pt-3 md:pt-0 md:border-none border-border/60">
//             <div className="text-xs font-semibold text-foreground/80 md:hidden">
//               {parseFloat(monitor.uptimePercentage || '100').toFixed(1)}% uptime
//             </div>

//             <div className="flex items-center gap-1.5 ml-auto md:ml-0">
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                 onClick={() => handlePingNow(monitor.id)}
//                 disabled={pingingId === monitor.id}
//               >
//                 <Clock size={13} className={pingingId === monitor.id ? 'animate-spin text-primary' : ''} />
//                 <span className="font-medium">{pingingId === monitor.id ? 'Pinging...' : 'Ping'}</span>
//               </Button>

//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                 onClick={() => router.push(`/monitors/${monitor.id}`)}
//               >
//                 <Eye size={13} />
//                 <span className="font-medium">View</span>
//               </Button>

//               <div className="flex-shrink-0 hidden lg:block px-2 border-l border-r border-border/60 mx-1">
//                 <DynamicIncidentBars status={monitor.status} />
//               </div>

//               <div className="text-xs font-mono font-bold text-foreground/90 min-w-[85px] text-right hidden md:block">
//                 {parseFloat(monitor.uptimePercentage || '100').toFixed(2)}% <span className="text-[10px] text-muted-foreground font-normal">up</span>
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-accent">
//                     <MoreVertical size={14} className="text-muted-foreground" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-40 bg-popover border border-border rounded-lg shadow-xl">
//                   <DropdownMenuItem 
//                     className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                     onClick={() => router.push(`/monitors/${monitor.id}/edit`)}
//                   >
//                     <Pencil size={13} className="mr-2 text-muted-foreground" />
//                     Edit Properties
//                   </DropdownMenuItem>
//                   <DropdownMenuItem 
//                     onClick={() => handleDelete(monitor.id)}
//                     disabled={deletingId === monitor.id}
//                     className="text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2 cursor-pointer border-t border-border/40 rounded-b-md"
//                   >
//                     <Trash2 size={13} className="mr-2" />
//                     {deletingId === monitor.id ? 'Dropping Node...' : 'Delete Monitor'}
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }


































// 'use client'

// import { Eye, Clock, MoreVertical, Pencil, Trash2, Loader2, Zap } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useToast } from '@/hooks/use-toast'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   statusCode?: number
//   responseTimeMs?: number
//   lastPingAt?: string
//   nextPingAt?: string
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   intervalSeconds: number
//   method?: string
//   lastPingResult?: {
//     isWakeUp: boolean
//     success: boolean
//     responseTimeMs: number
//   }
// }

// // Visual layout rendering engine for uptime charts
// function DynamicIncidentBars({ status }: { status: Monitor['status'] }) {
//   const barColor = 
//     status === 'up' ? 'bg-emerald-500' : 
//     status === 'down' ? 'bg-red-500' : 
//     status === 'waking' ? 'bg-orange-500' : 
//     status === 'degraded' ? 'bg-yellow-500' : 'bg-muted/40';

//   // Generate 24 bars where last 3 represent current state, rest represent history
//   return (
//     <div className="flex gap-0.5 items-center">
//       {Array.from({ length: 24 }).map((_, i) => {
//         // Last 3 bars (positions 21, 22, 23) represent current state
//         const isCurrentState = i >= 21;
//         const barStyle = isCurrentState ? barColor : 'bg-emerald-500/60';
        
//         return (
//           <div
//             key={i}
//             className={`w-1 h-5 rounded-sm transition-all duration-300 ${barStyle}`}
//             title={isCurrentState ? `Current: ${status.toUpperCase()}` : 'Historical: Operational'}
//           />
//         );
//       })}
//     </div>
//   )
// }

// function getStatusColor(status: Monitor['status']) {
//   switch (status) {
//     case 'up': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
//     case 'down': return 'bg-red-500/15 text-red-500 border border-red-500/30'
//     case 'waking': return 'bg-orange-500/15 text-orange-500 border border-orange-500/30'
//     case 'degraded': return 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
//     default: return 'bg-muted/30 text-muted-foreground border border-border'
//   }
// }

// function getStatusText(status: string | undefined | null) {
//   switch (status) {
//     case 'up': return 'Operational'
//     case 'down': return 'Outage Detected'
//     case 'waking': return 'Waking Engine'
//     case 'degraded': return 'Degraded Health'
//     default: return 'Pending Verification'
//   }
// }

// // Format response time - show seconds if > 1000ms
// function formatResponseTime(ms: number | undefined): string {
//   if (!ms) return '—'
//   if (ms >= 1000) {
//     return `${(ms / 1000).toFixed(1)}s`
//   }
//   return `${ms}ms`
// }

// export function MonitorList() {
//   const [monitors, setMonitors] = useState<Monitor[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<number | null>(null)
//   const [pingingId, setPingingId] = useState<number | null>(null)
  
//   const router = useRouter()
//   const { toast } = useToast()

//   // Active authorization token
//   const AUTH_HEADERS = {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
//   }

//   // Fetch monitors and their latest ping results
//   const fetchMonitors = async () => {
//     try {
//       const response = await fetch('/api/monitors', {
//         method: 'GET',
//         headers: AUTH_HEADERS
//       })
//       const data = await response.json()
//       if (data.success) {
//         const monitorsList = data.monitors || []
        
//         // Fetch latest ping result for each monitor to show wake-up status
//         const monitorsWithPingStatus = await Promise.all(
//           monitorsList.map(async (monitor: Monitor) => {
//             try {
//               const pingResponse = await fetch(`/api/pings?monitorId=${monitor.id}&limit=1`, {
//                 headers: AUTH_HEADERS
//               })
//               if (pingResponse.ok) {
//                 const pingData = await pingResponse.json()
//                 const latestPing = pingData.pings?.[0]
//                 if (latestPing) {
//                   return {
//                     ...monitor,
//                     lastPingResult: {
//                       isWakeUp: latestPing.isWakeUp || false,
//                       success: latestPing.success,
//                       responseTimeMs: latestPing.responseTimeMs
//                     },
//                     responseTimeMs: latestPing.responseTimeMs
//                   }
//                 }
//               }
//             } catch (error) {
//               // Silent fail - just return monitor without ping data
//             }
//             return monitor
//           })
//         )
        
//         setMonitors(monitorsWithPingStatus)
//       }
//     } catch (error) {
//       console.error('Programmatic client fetch exception:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Delete monitor handler
//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you completely sure you want to delete this operational monitor?')) return
    
//     setDeletingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}`, { 
//         method: 'DELETE',
//         headers: AUTH_HEADERS
//       })
//       if (response.ok) {
//         toast({ title: '✅ Monitor successfully deleted' })
//         fetchMonitors()
//         router.refresh()
//       } else {
//         toast({ title: '❌ Failed to delete monitor resource', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network exception tracking action', variant: 'destructive' })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   // Live on-demand health check
//   const handlePingNow = async (id: number) => {
//     setPingingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}/ping`, { 
//         method: 'POST',
//         headers: AUTH_HEADERS
//       })
      
//       if (response.ok) {
//         toast({ 
//           title: '🔄 Live tracking health check triggered', 
//           description: 'Recalibrating endpoint calculations, stand by...' 
//         })
//         setTimeout(fetchMonitors, 3500)
//       } else {
//         toast({ 
//           title: 'ℹ️ Hook registered successfully', 
//           description: 'Request transmitted. Connect processing engines next.',
//         })
//       }
//     } catch (error) {
//       toast({ title: '❌ Transmit connection fault', variant: 'destructive' })
//     } finally {
//       setPingingId(null)
//     }
//   }

//   useEffect(() => {
//     fetchMonitors()
//     const pollingInterval = setInterval(fetchMonitors, 30000)
//     return () => clearInterval(pollingInterval)
//   }, [])
  

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-20 bg-background/50 border rounded-xl border-dashed">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <span className="text-xs text-muted-foreground font-medium animate-pulse">Syncing cluster metrics...</span>
//         </div>
//       </div>
//     )
//   }

//   if (monitors.length === 0) {
//     return (
//       <div className="text-center py-16 border rounded-xl border-dashed bg-card/20 border-border">
//         <p className="text-sm text-muted-foreground font-medium">No tracking instances registered on this system mesh cluster yet.</p>
//         <Button className="mt-4 font-semibold text-xs px-4" onClick={() => router.push('/add-monitor')}>
//           Create Your First Monitor
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-3">
//       {monitors.map((monitor) => {
//         const isWakeUp = monitor.lastPingResult?.isWakeUp
//         const responseTimeFormatted = formatResponseTime(monitor.responseTimeMs)
        
//         return (
//           <div
//             key={monitor.id}
//             className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-card border transition-all duration-200 hover:shadow-md group ${
//               isWakeUp ? 'border-orange-500/50 bg-orange-500/5' : 'border-border hover:border-primary/20'
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${getStatusColor(monitor.status)}`}>
//                 {isWakeUp ? (
//                   <Zap size={18} className="text-orange-500" />
//                 ) : (
//                   <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
//                 )}
//               </div>
              
//               <div className="md:hidden flex-1 min-w-0">
//                 <h3 className="text-sm font-bold text-foreground tracking-tight truncate">
//                   {monitor.name}
//                   {isWakeUp && <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">WAKE-UP</span>}
//                 </h3>
//                 <p className="text-[11px] text-muted-foreground/90 mt-0.5 truncate">
//                   {monitor.url}
//                 </p>
//               </div>
//             </div>

//             <div className="hidden md:block flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
//                   {monitor.name}
//                 </h3>
//                 {isWakeUp && (
//                   <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
//                     <Zap size={10} />
//                     WAKE-UP DETECTED
//                   </span>
//                 )}
//               </div>
//               <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1.5 truncate flex-wrap">
//                 <span className="text-muted-foreground/60 select-none">{monitor.method || 'GET'}</span>
//                 <span className="text-border">|</span>
//                 <span className={
//                   monitor.status === 'down' ? 'text-red-400 font-semibold' : 
//                   monitor.status === 'waking' ? 'text-orange-400 font-semibold' : 'text-emerald-400 font-semibold'
//                 }>
//                   {getStatusText(monitor.status)}
//                 </span>
//                 {monitor.responseTimeMs && (
//                   <>
//                     <span className="text-border">|</span>
//                     <span className={`font-mono ${responseTimeFormatted.includes('s') ? 'text-orange-400' : 'text-foreground/80'}`}>
//                       {responseTimeFormatted}
//                       {isWakeUp && <span className="text-orange-500 ml-1">(Cold Start)</span>}
//                     </span>
//                   </>
//                 )}
//               </p>
//             </div>

//             <div className="flex items-center justify-between md:justify-end gap-4 border-t pt-3 md:pt-0 md:border-none border-border/60">
//               <div className="text-xs font-semibold text-foreground/80 md:hidden">
//                 {parseFloat(monitor.uptimePercentage || '100').toFixed(1)}% uptime
//               </div>

//               <div className="flex items-center gap-1.5 ml-auto md:ml-0">
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                   onClick={() => handlePingNow(monitor.id)}
//                   disabled={pingingId === monitor.id}
//                 >
//                   <Clock size={13} className={pingingId === monitor.id ? 'animate-spin text-primary' : ''} />
//                   <span className="font-medium">{pingingId === monitor.id ? 'Pinging...' : 'Ping'}</span>
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                   onClick={() => router.push(`/monitors/${monitor.id}`)}
//                 >
//                   <Eye size={13} />
//                   <span className="font-medium">View</span>
//                 </Button>

//                 <div className="flex-shrink-0 hidden lg:block px-2 border-l border-r border-border/60 mx-1">
//                   <DynamicIncidentBars status={monitor.status} />
//                 </div>

//                 <div className="text-xs font-mono font-bold text-foreground/90 min-w-[85px] text-right hidden md:block">
//                   {parseFloat(monitor.uptimePercentage || '100').toFixed(2)}% <span className="text-[10px] text-muted-foreground font-normal">up</span>
//                 </div>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-accent">
//                       <MoreVertical size={14} className="text-muted-foreground" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-40 bg-popover border border-border rounded-lg shadow-xl">
//                     <DropdownMenuItem 
//                       className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                       onClick={() => router.push(`/monitors/${monitor.id}/edit`)}
//                     >
//                       <Pencil size={13} className="mr-2 text-muted-foreground" />
//                       Edit Properties
//                     </DropdownMenuItem>
//                     <DropdownMenuItem 
//                       onClick={() => handleDelete(monitor.id)}
//                       disabled={deletingId === monitor.id}
//                       className="text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2 cursor-pointer border-t border-border/40 rounded-b-md"
//                     >
//                       <Trash2 size={13} className="mr-2" />
//                       {deletingId === monitor.id ? 'Dropping Node...' : 'Delete Monitor'}
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }
































// 'use client'

// import { Eye, Clock, MoreVertical, Pencil, Trash2, Loader2, Zap, Play, Pause, Power } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useToast } from '@/hooks/use-toast'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   statusCode?: number
//   responseTimeMs?: number
//   lastPingAt?: string
//   nextPingAt?: string
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   intervalSeconds: number
//   method?: string
//   isActive: boolean
//   lastPingResult?: {
//     isWakeUp: boolean
//     success: boolean
//     responseTimeMs: number
//   }
// }

// // Visual layout rendering engine for uptime charts
// function DynamicIncidentBars({ status }: { status: Monitor['status'] }) {
//   const barColor = 
//     status === 'up' ? 'bg-emerald-500' : 
//     status === 'down' ? 'bg-red-500' : 
//     status === 'waking' ? 'bg-orange-500' : 
//     status === 'degraded' ? 'bg-yellow-500' : 'bg-muted/40';

//   return (
//     <div className="flex gap-0.5 items-center">
//       {Array.from({ length: 24 }).map((_, i) => {
//         const isCurrentState = i >= 21;
//         const barStyle = isCurrentState ? barColor : 'bg-emerald-500/60';
        
//         return (
//           <div
//             key={i}
//             className={`w-1 h-5 rounded-sm transition-all duration-300 ${barStyle}`}
//             title={isCurrentState ? `Current: ${status.toUpperCase()}` : 'Historical: Operational'}
//           />
//         );
//       })}
//     </div>
//   )
// }

// function getStatusColor(status: Monitor['status'], isActive: boolean = true) {
//   if (!isActive) return 'bg-gray-500/15 text-gray-500 border border-gray-500/30'
//   switch (status) {
//     case 'up': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
//     case 'down': return 'bg-red-500/15 text-red-500 border border-red-500/30'
//     case 'waking': return 'bg-orange-500/15 text-orange-500 border border-orange-500/30'
//     case 'degraded': return 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
//     default: return 'bg-muted/30 text-muted-foreground border border-border'
//   }
// }

// function getStatusText(status: string | undefined | null, isActive: boolean = true) {
//   if (!isActive) return 'Paused'
//   switch (status) {
//     case 'up': return 'Operational'
//     case 'down': return 'Outage Detected'
//     case 'waking': return 'Waking Engine'
//     case 'degraded': return 'Degraded Health'
//     default: return 'Pending Verification'
//   }
// }

// // Format response time - show seconds if > 1000ms
// function formatResponseTime(ms: number | undefined): string {
//   if (!ms) return '—'
//   if (ms >= 1000) {
//     return `${(ms / 1000).toFixed(1)}s`
//   }
//   return `${ms}ms`
// }

// export function MonitorList() {
//   const [monitors, setMonitors] = useState<Monitor[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<number | null>(null)
//   const [pingingId, setPingingId] = useState<number | null>(null)
//   const [togglingId, setTogglingId] = useState<number | null>(null)
  
//   const router = useRouter()
//   const { toast } = useToast()

//   // Active authorization token
//   const AUTH_HEADERS = {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
//   }

//   // Fetch monitors and their latest ping results
//   const fetchMonitors = async () => {
//     try {
//       const response = await fetch('/api/monitors', {
//         method: 'GET',
//         headers: AUTH_HEADERS
//       })
//       const data = await response.json()
//       if (data.success) {
//         const monitorsList = data.monitors || []
        
//         // Fetch latest ping result for each monitor to show wake-up status
//         const monitorsWithPingStatus = await Promise.all(
//           monitorsList.map(async (monitor: Monitor) => {
//             try {
//               const pingResponse = await fetch(`/api/pings?monitorId=${monitor.id}&limit=1`, {
//                 headers: AUTH_HEADERS
//               })
//               if (pingResponse.ok) {
//                 const pingData = await pingResponse.json()
//                 const latestPing = pingData.pings?.[0]
//                 if (latestPing) {
//                   return {
//                     ...monitor,
//                     lastPingResult: {
//                       isWakeUp: latestPing.isWakeUp || false,
//                       success: latestPing.success,
//                       responseTimeMs: latestPing.responseTimeMs
//                     },
//                     responseTimeMs: latestPing.responseTimeMs
//                   }
//                 }
//               }
//             } catch (error) {
//               // Silent fail - just return monitor without ping data
//             }
//             return monitor
//           })
//         )
        
//         setMonitors(monitorsWithPingStatus)
//       }
//     } catch (error) {
//       console.error('Programmatic client fetch exception:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Toggle monitor active status (Start/Stop)
//   const handleToggleMonitor = async (id: number, currentStatus: boolean) => {
//     setTogglingId(id)
//     const newStatus = !currentStatus
    
//     try {
//       console.log(`🔄 Toggling monitor ${id}: ${currentStatus} -> ${newStatus}`)
      
//       const response = await fetch(`/api/monitors/${id}`, {
//         method: 'PUT',
//         headers: AUTH_HEADERS,
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       const data = await response.json()
//       console.log('📡 Toggle response:', data)
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus 
//             ? 'Monitoring has been reactivated. Pings will resume shortly.'
//             : 'Monitoring has been paused. No further pings will be sent.',
//         })
//         // Refresh the monitor list to show updated status
//         await fetchMonitors()
//         router.refresh()
//       } else {
//         toast({ 
//           title: '❌ Failed to toggle monitor', 
//           description: data.error || 'Unknown error occurred',
//           variant: 'destructive' 
//         })
//       }
//     } catch (error) {
//       console.error('Toggle error:', error)
//       toast({ 
//         title: '❌ Network error', 
//         description: 'Could not update monitor status',
//         variant: 'destructive' 
//       })
//     } finally {
//       setTogglingId(null)
//     }
//   }

//   // Delete monitor handler
//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you completely sure you want to delete this operational monitor?')) return
    
//     setDeletingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}`, { 
//         method: 'DELETE',
//         headers: AUTH_HEADERS
//       })
//       if (response.ok) {
//         toast({ title: '✅ Monitor successfully deleted' })
//         fetchMonitors()
//         router.refresh()
//       } else {
//         toast({ title: '❌ Failed to delete monitor resource', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network exception tracking action', variant: 'destructive' })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   // Live on-demand health check (only if monitor is active)
//   const handlePingNow = async (id: number) => {
//     setPingingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}/ping`, { 
//         method: 'POST',
//         headers: AUTH_HEADERS
//       })
      
//       if (response.ok) {
//         toast({ 
//           title: '🔄 Live tracking health check triggered', 
//           description: 'Recalibrating endpoint calculations, stand by...' 
//         })
//         setTimeout(fetchMonitors, 3500)
//       } else {
//         toast({ 
//           title: 'ℹ️ Hook registered successfully', 
//           description: 'Request transmitted. Connect processing engines next.',
//         })
//       }
//     } catch (error) {
//       toast({ title: '❌ Transmit connection fault', variant: 'destructive' })
//     } finally {
//       setPingingId(null)
//     }
//   }

//   useEffect(() => {
//     fetchMonitors()
//     const pollingInterval = setInterval(fetchMonitors, 30000)
//     return () => clearInterval(pollingInterval)
//   }, [])
  

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-20 bg-background/50 border rounded-xl border-dashed">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <span className="text-xs text-muted-foreground font-medium animate-pulse">Syncing cluster metrics...</span>
//         </div>
//       </div>
//     )
//   }

//   if (monitors.length === 0) {
//     return (
//       <div className="text-center py-16 border rounded-xl border-dashed bg-card/20 border-border">
//         <p className="text-sm text-muted-foreground font-medium">No tracking instances registered on this system mesh cluster yet.</p>
//         <Button className="mt-4 font-semibold text-xs px-4" onClick={() => router.push('/add-monitor')}>
//           Create Your First Monitor
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-3">
//       {monitors.map((monitor) => {
//         const isWakeUp = monitor.lastPingResult?.isWakeUp
//         const responseTimeFormatted = formatResponseTime(monitor.responseTimeMs)
//         const isActive = monitor.isActive !== false // Default to true if undefined
//         const isPaused = !isActive
        
//         return (
//           <div
//             key={monitor.id}
//             className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-card border transition-all duration-200 hover:shadow-md group ${
//               isPaused ? 'border-gray-500/40 bg-gray-500/5 opacity-80' :
//               isWakeUp ? 'border-orange-500/50 bg-orange-500/5' : 
//               'border-border hover:border-primary/20'
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${getStatusColor(monitor.status, isActive)}`}>
//                 {isPaused ? (
//                   <Pause size={18} className="text-gray-500" />
//                 ) : isWakeUp ? (
//                   <Zap size={18} className="text-orange-500" />
//                 ) : (
//                   <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
//                 )}
//               </div>
              
//               <div className="md:hidden flex-1 min-w-0">
//                 <h3 className="text-sm font-bold text-foreground tracking-tight truncate">
//                   {monitor.name}
//                   {isPaused && <span className="ml-2 text-[10px] bg-gray-500/20 text-gray-500 px-1.5 py-0.5 rounded-full">PAUSED</span>}
//                   {!isPaused && isWakeUp && <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">WAKE-UP</span>}
//                 </h3>
//                 <p className="text-[11px] text-muted-foreground/90 mt-0.5 truncate">
//                   {monitor.url}
//                 </p>
//               </div>
//             </div>

//             <div className="hidden md:block flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
//                   {monitor.name}
//                 </h3>
//                 {isPaused && (
//                   <span className="text-[10px] bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
//                     <Pause size={10} />
//                     PAUSED
//                   </span>
//                 )}
//                 {!isPaused && isWakeUp && (
//                   <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
//                     <Zap size={10} />
//                     WAKE-UP DETECTED
//                   </span>
//                 )}
//               </div>
//               <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1.5 truncate flex-wrap">
//                 <span className="text-muted-foreground/60 select-none">{monitor.method || 'GET'}</span>
//                 <span className="text-border">|</span>
//                 <span className={
//                   isPaused ? 'text-gray-400 font-semibold' :
//                   monitor.status === 'down' ? 'text-red-400 font-semibold' : 
//                   monitor.status === 'waking' ? 'text-orange-400 font-semibold' : 'text-emerald-400 font-semibold'
//                 }>
//                   {getStatusText(monitor.status, isActive)}
//                 </span>
//                 {!isPaused && monitor.responseTimeMs && (
//                   <>
//                     <span className="text-border">|</span>
//                     <span className={`font-mono ${responseTimeFormatted.includes('s') ? 'text-orange-400' : 'text-foreground/80'}`}>
//                       {responseTimeFormatted}
//                       {isWakeUp && <span className="text-orange-500 ml-1">(Cold Start)</span>}
//                     </span>
//                   </>
//                 )}
//               </p>
//             </div>

//             <div className="flex items-center justify-between md:justify-end gap-4 border-t pt-3 md:pt-0 md:border-none border-border/60">
//               <div className="text-xs font-semibold text-foreground/80 md:hidden">
//                 {parseFloat(monitor.uptimePercentage || '100').toFixed(1)}% uptime
//               </div>

//               <div className="flex items-center gap-1.5 ml-auto md:ml-0">
//                 {/* Ping Button - Disabled when paused */}
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                   onClick={() => handlePingNow(monitor.id)}
//                   disabled={pingingId === monitor.id || isPaused}
//                 >
//                   <Clock size={13} className={pingingId === monitor.id ? 'animate-spin text-primary' : ''} />
//                   <span className="font-medium">{pingingId === monitor.id ? 'Pinging...' : 'Ping'}</span>
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                   onClick={() => router.push(`/monitors/${monitor.id}`)}
//                 >
//                   <Eye size={13} />
//                   <span className="font-medium">View</span>
//                 </Button>

//                 <div className="flex-shrink-0 hidden lg:block px-2 border-l border-r border-border/60 mx-1">
//                   <DynamicIncidentBars status={monitor.status} />
//                 </div>

//                 <div className="text-xs font-mono font-bold text-foreground/90 min-w-[85px] text-right hidden md:block">
//                   {parseFloat(monitor.uptimePercentage || '100').toFixed(2)}% <span className="text-[10px] text-muted-foreground font-normal">up</span>
//                 </div>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-accent">
//                       <MoreVertical size={14} className="text-muted-foreground" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-44 bg-popover border border-border rounded-lg shadow-xl">
//                     {/* Toggle Start/Stop Button */}
//                     <DropdownMenuItem 
//                       className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                       onClick={() => handleToggleMonitor(monitor.id, isActive)}
//                       disabled={togglingId === monitor.id}
//                     >
//                       {togglingId === monitor.id ? (
//                         <Loader2 size={13} className="mr-2 animate-spin" />
//                       ) : isPaused ? (
//                         <Play size={13} className="mr-2 text-green-500" />
//                       ) : (
//                         <Pause size={13} className="mr-2 text-yellow-500" />
//                       )}
//                       {togglingId === monitor.id 
//                         ? 'Updating...' 
//                         : isPaused 
//                           ? 'Resume Monitoring' 
//                           : 'Pause Monitoring'}
//                     </DropdownMenuItem>

//                     <DropdownMenuItem 
//                       className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                       onClick={() => router.push(`/monitors/${monitor.id}/edit`)}
//                     >
//                       <Pencil size={13} className="mr-2 text-muted-foreground" />
//                       Edit Properties
//                     </DropdownMenuItem>
                    
//                     <DropdownMenuItem 
//                       onClick={() => handleDelete(monitor.id)}
//                       disabled={deletingId === monitor.id}
//                       className="text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2 cursor-pointer border-t border-border/40 rounded-b-md"
//                     >
//                       <Trash2 size={13} className="mr-2" />
//                       {deletingId === monitor.id ? 'Dropping Node...' : 'Delete Monitor'}
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }


















































// 'use client'

// import { Eye, Clock, MoreVertical, Pencil, Trash2, Loader2, Zap, Play, Pause, Search, X, Filter, ArrowUpDown } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { useEffect, useState, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
// import { useToast } from '@/hooks/use-toast'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   statusCode?: number
//   responseTimeMs?: number
//   lastPingAt?: string
//   nextPingAt?: string
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   intervalSeconds: number
//   method?: string
//   isActive: boolean
//   lastPingResult?: {
//     isWakeUp: boolean
//     success: boolean
//     responseTimeMs: number
//   }
// }

// type SortOption = 'status-down-first' | 'status-up-first' | 'name-asc' | 'name-desc' | 'uptime-desc' | 'uptime-asc' | 'response-desc' | 'response-asc'
// type StatusFilter = 'all' | 'up' | 'down' | 'waking' | 'degraded' | 'paused' | 'active'

// // Visual layout rendering engine for uptime charts
// function DynamicIncidentBars({ status }: { status: Monitor['status'] }) {
//   const barColor = 
//     status === 'up' ? 'bg-emerald-500' : 
//     status === 'down' ? 'bg-red-500' : 
//     status === 'waking' ? 'bg-orange-500' : 
//     status === 'degraded' ? 'bg-yellow-500' : 'bg-muted/40';

//   return (
//     <div className="flex gap-0.5 items-center">
//       {Array.from({ length: 24 }).map((_, i) => {
//         const isCurrentState = i >= 21;
//         const barStyle = isCurrentState ? barColor : 'bg-emerald-500/60';
        
//         return (
//           <div
//             key={i}
//             className={`w-1 h-5 rounded-sm transition-all duration-300 ${barStyle}`}
//             title={isCurrentState ? `Current: ${status.toUpperCase()}` : 'Historical: Operational'}
//           />
//         );
//       })}
//     </div>
//   )
// }

// function getStatusColor(status: Monitor['status'], isActive: boolean = true) {
//   if (!isActive) return 'bg-gray-500/15 text-gray-500 border border-gray-500/30'
//   switch (status) {
//     case 'up': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
//     case 'down': return 'bg-red-500/15 text-red-500 border border-red-500/30'
//     case 'waking': return 'bg-orange-500/15 text-orange-500 border border-orange-500/30'
//     case 'degraded': return 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
//     default: return 'bg-muted/30 text-muted-foreground border border-border'
//   }
// }

// function getStatusText(status: string | undefined | null, isActive: boolean = true) {
//   if (!isActive) return 'Paused'
//   switch (status) {
//     case 'up': return 'Operational'
//     case 'down': return 'Outage Detected'
//     case 'waking': return 'Waking Engine'
//     case 'degraded': return 'Degraded Health'
//     default: return 'Pending Verification'
//   }
// }

// // Format response time - show seconds if > 1000ms
// function formatResponseTime(ms: number | undefined): string {
//   if (!ms) return '—'
//   if (ms >= 1000) {
//     return `${(ms / 1000).toFixed(1)}s`
//   }
//   return `${ms}ms`
// }

// // Filter Bar Component
// function FilterBar({ 
//   searchQuery, 
//   onSearchChange, 
//   statusFilter, 
//   onStatusFilterChange, 
//   sortBy, 
//   onSortChange,
//   activeFiltersCount,
//   onClearFilters 
// }: {
//   searchQuery: string
//   onSearchChange: (value: string) => void
//   statusFilter: StatusFilter
//   onStatusFilterChange: (value: StatusFilter) => void
//   sortBy: SortOption
//   onSortChange: (value: SortOption) => void
//   activeFiltersCount: number
//   onClearFilters: () => void
// }) {
//   const [isFilterOpen, setIsFilterOpen] = useState(false)

//   const statusOptions: { value: StatusFilter; label: string; color: string }[] = [
//     { value: 'all', label: 'All', color: 'text-gray-500' },
//     { value: 'active', label: 'Active', color: 'text-blue-500' },
//     { value: 'paused', label: 'Paused', color: 'text-gray-500' },
//     { value: 'up', label: 'Up', color: 'text-green-500' },
//     { value: 'down', label: 'Down', color: 'text-red-500' },
//     { value: 'waking', label: 'Waking', color: 'text-orange-500' },
//     { value: 'degraded', label: 'Degraded', color: 'text-yellow-500' },
//   ]

//   const sortOptions: { value: SortOption; label: string }[] = [
//     { value: 'status-down-first', label: '⚠️ Down First' },
//     { value: 'status-up-first', label: '✅ Up First' },
//     { value: 'name-asc', label: 'Name A → Z' },
//     { value: 'name-desc', label: 'Name Z → A' },
//     { value: 'uptime-desc', label: 'Uptime (High to Low)' },
//     { value: 'uptime-asc', label: 'Uptime (Low to High)' },
//     { value: 'response-desc', label: 'Slowest First' },
//     { value: 'response-asc', label: 'Fastest First' },
//   ]

//   const getSortIcon = () => {
//     if (sortBy.includes('asc')) return '↑'
//     if (sortBy.includes('desc')) return '↓'
//     return '↕'
//   }

//   const getStatusLabel = () => {
//     const option = statusOptions.find(opt => opt.value === statusFilter)
//     return option?.label || 'All'
//   }

//   return (
//     <div className="mb-4 space-y-3">
//       {/* Search Bar */}
//       <div className="relative">
//         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//         <Input
//           type="text"
//           placeholder="Search monitors by name or URL..."
//           value={searchQuery}
//           onChange={(e) => onSearchChange(e.target.value)}
//           className="pl-9 pr-9 h-9 bg-card border-border text-sm"
//         />
//         {searchQuery && (
//           <button
//             onClick={() => onSearchChange('')}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//           >
//             <X size={14} />
//           </button>
//         )}
//       </div>

//       {/* Filter and Sort Buttons */}
//       <div className="flex items-center gap-2 flex-wrap">
//         {/* Status Filter Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
//               statusFilter !== 'all' 
//                 ? 'bg-primary/10 text-primary border border-primary/20' 
//                 : 'bg-card border border-border text-muted-foreground hover:text-foreground'
//             }`}
//           >
//             <Filter size={12} />
//             Status: {getStatusLabel()}
//             {statusFilter !== 'all' && (
//               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
//             )}
//           </button>
          
//           {isFilterOpen && (
//             <>
//               <div 
//                 className="fixed inset-0 z-40" 
//                 onClick={() => setIsFilterOpen(false)}
//               />
//               <div className="absolute top-full left-0 mt-1 w-36 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
//                 {statusOptions.map((option) => (
//                   <button
//                     key={option.value}
//                     onClick={() => {
//                       onStatusFilterChange(option.value)
//                       setIsFilterOpen(false)
//                     }}
//                     className={`w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors flex items-center gap-2 ${
//                       statusFilter === option.value ? 'text-primary font-medium' : 'text-foreground'
//                     }`}
//                   >
//                     <span className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`} />
//                     {option.label}
//                   </button>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Sort Dropdown */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
//               <ArrowUpDown size={12} />
//               Sort: {sortOptions.find(opt => opt.value === sortBy)?.label.split(' ').slice(1).join(' ') || 'Default'}
//               <span className="text-xs">{getSortIcon()}</span>
//             </button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="start" className="w-44">
//             {sortOptions.map((option) => (
//               <DropdownMenuItem
//                 key={option.value}
//                 onClick={() => onSortChange(option.value)}
//                 className={`text-xs cursor-pointer ${sortBy === option.value ? 'text-primary font-medium' : ''}`}
//               >
//                 {option.label}
//               </DropdownMenuItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* Clear Filters Button */}
//         {activeFiltersCount > 0 && (
//           <button
//             onClick={onClearFilters}
//             className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-500 transition-colors"
//           >
//             <X size={12} />
//             Clear filters ({activeFiltersCount})
//           </button>
//         )}
//       </div>

//       {/* Active Filters Display */}
//       {activeFiltersCount > 0 && (
//         <div className="flex items-center gap-2 flex-wrap">
//           {searchQuery && (
//             <Badge variant="secondary" className="text-xs gap-1">
//               Search: {searchQuery}
//               <button onClick={() => onSearchChange('')} className="ml-1 hover:text-red-500">
//                 <X size={10} />
//               </button>
//             </Badge>
//           )}
//           {statusFilter !== 'all' && (
//             <Badge variant="secondary" className="text-xs gap-1">
//               Status: {getStatusLabel()}
//               <button onClick={() => onStatusFilterChange('all')} className="ml-1 hover:text-red-500">
//                 <X size={10} />
//               </button>
//             </Badge>
//           )}
//           {sortBy !== 'status-down-first' && (
//             <Badge variant="secondary" className="text-xs gap-1">
//               Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
//               <button onClick={() => onSortChange('status-down-first')} className="ml-1 hover:text-red-500">
//                 <X size={10} />
//               </button>
//             </Badge>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export function MonitorList() {
//   const [monitors, setMonitors] = useState<Monitor[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<number | null>(null)
//   const [pingingId, setPingingId] = useState<number | null>(null)
//   const [togglingId, setTogglingId] = useState<number | null>(null)
  
//   // Filter/Sort State
//   const [searchQuery, setSearchQuery] = useState('')
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
//   const [sortBy, setSortBy] = useState<SortOption>('status-down-first')
  
//   const router = useRouter()
//   const { toast } = useToast()

//   const AUTH_HEADERS = {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
//   }

//   // Fetch monitors
//   const fetchMonitors = async () => {
//     try {
//       const response = await fetch('/api/monitors', {
//         method: 'GET',
//         headers: AUTH_HEADERS
//       })
//       const data = await response.json()
//       if (data.success) {
//         const monitorsList = data.monitors || []
        
//         const monitorsWithPingStatus = await Promise.all(
//           monitorsList.map(async (monitor: Monitor) => {
//             try {
//               const pingResponse = await fetch(`/api/pings?monitorId=${monitor.id}&limit=1`, {
//                 headers: AUTH_HEADERS
//               })
//               if (pingResponse.ok) {
//                 const pingData = await pingResponse.json()
//                 const latestPing = pingData.pings?.[0]
//                 if (latestPing) {
//                   return {
//                     ...monitor,
//                     lastPingResult: {
//                       isWakeUp: latestPing.isWakeUp || false,
//                       success: latestPing.success,
//                       responseTimeMs: latestPing.responseTimeMs
//                     },
//                     responseTimeMs: latestPing.responseTimeMs
//                   }
//                 }
//               }
//             } catch (error) {
//               // Silent fail
//             }
//             return monitor
//           })
//         )
        
//         setMonitors(monitorsWithPingStatus)
//       }
//     } catch (error) {
//       console.error('Programmatic client fetch exception:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Filter and Sort Monitors (Client-side only)
//   const filteredAndSortedMonitors = useMemo(() => {
//     let result = [...monitors]
    
//     // 1. Filter by search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       result = result.filter(m => 
//         m.name.toLowerCase().includes(query) || 
//         m.url.toLowerCase().includes(query)
//       )
//     }
    
//     // 2. Filter by status
//     if (statusFilter !== 'all') {
//       if (statusFilter === 'active') {
//         result = result.filter(m => m.isActive !== false)
//       } else if (statusFilter === 'paused') {
//         result = result.filter(m => m.isActive === false)
//       } else {
//         result = result.filter(m => m.status === statusFilter && m.isActive !== false)
//       }
//     }
    
//     // 3. Sort
//     switch (sortBy) {
//       case 'status-down-first':
//         result.sort((a, b) => {
//           const order = { down: 0, degraded: 1, waking: 2, up: 3 }
//           const aOrder = a.isActive === false ? 4 : order[a.status] ?? 5
//           const bOrder = b.isActive === false ? 4 : order[b.status] ?? 5
//           return aOrder - bOrder
//         })
//         break
//       case 'status-up-first':
//         result.sort((a, b) => {
//           const order = { up: 0, waking: 1, degraded: 2, down: 3 }
//           const aOrder = a.isActive === false ? 4 : order[a.status] ?? 5
//           const bOrder = b.isActive === false ? 4 : order[b.status] ?? 5
//           return aOrder - bOrder
//         })
//         break
//       case 'name-asc':
//         result.sort((a, b) => a.name.localeCompare(b.name))
//         break
//       case 'name-desc':
//         result.sort((a, b) => b.name.localeCompare(a.name))
//         break
//       case 'uptime-desc':
//         result.sort((a, b) => parseFloat(b.uptimePercentage) - parseFloat(a.uptimePercentage))
//         break
//       case 'uptime-asc':
//         result.sort((a, b) => parseFloat(a.uptimePercentage) - parseFloat(b.uptimePercentage))
//         break
//       case 'response-desc':
//         result.sort((a, b) => (b.responseTimeMs || 0) - (a.responseTimeMs || 0))
//         break
//       case 'response-asc':
//         result.sort((a, b) => (a.responseTimeMs || 0) - (b.responseTimeMs || 0))
//         break
//     }
    
//     return result
//   }, [monitors, searchQuery, statusFilter, sortBy])

//   const activeFiltersCount = (searchQuery ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (sortBy !== 'status-down-first' ? 1 : 0)

//   const clearAllFilters = () => {
//     setSearchQuery('')
//     setStatusFilter('all')
//     setSortBy('status-down-first')
//   }

//   // Toggle monitor active status
//   const handleToggleMonitor = async (id: number, currentStatus: boolean) => {
//     setTogglingId(id)
//     const newStatus = !currentStatus
    
//     try {
//       const response = await fetch(`/api/monitors/${id}`, {
//         method: 'PUT',
//         headers: AUTH_HEADERS,
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus 
//             ? 'Monitoring has been reactivated.'
//             : 'Monitoring has been paused.',
//         })
//         fetchMonitors()
//         router.refresh()
//       } else {
//         toast({ title: '❌ Failed to toggle monitor', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network error', variant: 'destructive' })
//     } finally {
//       setTogglingId(null)
//     }
//   }

//   // Delete monitor handler
//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this monitor?')) return
    
//     setDeletingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}`, { 
//         method: 'DELETE',
//         headers: AUTH_HEADERS
//       })
//       if (response.ok) {
//         toast({ title: '✅ Monitor deleted' })
//         fetchMonitors()
//         router.refresh()
//       } else {
//         toast({ title: '❌ Failed to delete', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network error', variant: 'destructive' })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   // Live on-demand health check
//   const handlePingNow = async (id: number) => {
//     setPingingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}/ping`, { 
//         method: 'POST',
//         headers: AUTH_HEADERS
//       })
      
//       if (response.ok) {
//         toast({ 
//           title: '🔄 Ping triggered', 
//           description: 'Results will appear shortly.'
//         })
//         setTimeout(fetchMonitors, 3500)
//       } else {
//         toast({ title: '❌ Failed to ping', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network error', variant: 'destructive' })
//     } finally {
//       setPingingId(null)
//     }
//   }

//   useEffect(() => {
//     fetchMonitors()
//     const pollingInterval = setInterval(fetchMonitors, 30000)
//     return () => clearInterval(pollingInterval)
//   }, [])
  

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-20 bg-background/50 border rounded-xl border-dashed">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <span className="text-xs text-muted-foreground font-medium animate-pulse">Syncing cluster metrics...</span>
//         </div>
//       </div>
//     )
//   }

//   if (monitors.length === 0) {
//     return (
//       <div className="text-center py-16 border rounded-xl border-dashed bg-card/20 border-border">
//         <p className="text-sm text-muted-foreground font-medium">No tracking instances registered yet.</p>
//         <Button className="mt-4 font-semibold text-xs px-4" onClick={() => router.push('/add-monitor')}>
//           Create Your First Monitor
//         </Button>
//       </div>
//     )
//   }

//   const displayMonitors = filteredAndSortedMonitors
//   const totalMonitors = monitors.length
//   const filteredCount = displayMonitors.length

//   return (
//     <div>
//       {/* Filter Bar */}
//       <FilterBar
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         statusFilter={statusFilter}
//         onStatusFilterChange={setStatusFilter}
//         sortBy={sortBy}
//         onSortChange={setSortBy}
//         activeFiltersCount={activeFiltersCount}
//         onClearFilters={clearAllFilters}
//       />

//       {/* Results Count */}
//       <div className="mb-3 text-xs text-muted-foreground">
//         Showing {filteredCount} of {totalMonitors} monitors
//         {filteredCount !== totalMonitors && ' (filtered)'}
//       </div>

//       {/* Monitor List */}
//       <div className="space-y-3">
//         {displayMonitors.map((monitor) => {
//           const isWakeUp = monitor.lastPingResult?.isWakeUp
//           const responseTimeFormatted = formatResponseTime(monitor.responseTimeMs)
//           const isActive = monitor.isActive !== false
//           const isPaused = !isActive
          
//           return (
//             <div
//               key={monitor.id}
//               className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-card border transition-all duration-200 hover:shadow-md group ${
//                 isPaused ? 'border-gray-500/40 bg-gray-500/5 opacity-80' :
//                 isWakeUp ? 'border-orange-500/50 bg-orange-500/5' : 
//                 'border-border hover:border-primary/20'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${getStatusColor(monitor.status, isActive)}`}>
//                   {isPaused ? (
//                     <Pause size={18} className="text-gray-500" />
//                   ) : isWakeUp ? (
//                     <Zap size={18} className="text-orange-500" />
//                   ) : (
//                     <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
//                   )}
//                 </div>
                
//                 <div className="md:hidden flex-1 min-w-0">
//                   <h3 className="text-sm font-bold text-foreground tracking-tight truncate">
//                     {monitor.name}
//                     {isPaused && <span className="ml-2 text-[10px] bg-gray-500/20 text-gray-500 px-1.5 py-0.5 rounded-full">PAUSED</span>}
//                     {!isPaused && isWakeUp && <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">WAKE-UP</span>}
//                   </h3>
//                   <p className="text-[11px] text-muted-foreground/90 mt-0.5 truncate">
//                     {monitor.url}
//                   </p>
//                 </div>
//               </div>

//               <div className="hidden md:block flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <h3 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
//                     {monitor.name}
//                   </h3>
//                   {isPaused && (
//                     <span className="text-[10px] bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
//                       <Pause size={10} />
//                       PAUSED
//                     </span>
//                   )}
//                   {!isPaused && isWakeUp && (
//                     <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
//                       <Zap size={10} />
//                       WAKE-UP
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1.5 truncate flex-wrap">
//                   <span className="text-muted-foreground/60 select-none">{monitor.method || 'GET'}</span>
//                   <span className="text-border">|</span>
//                   <span className={
//                     isPaused ? 'text-gray-400 font-semibold' :
//                     monitor.status === 'down' ? 'text-red-400 font-semibold' : 
//                     monitor.status === 'waking' ? 'text-orange-400 font-semibold' : 'text-emerald-400 font-semibold'
//                   }>
//                     {getStatusText(monitor.status, isActive)}
//                   </span>
//                   {!isPaused && monitor.responseTimeMs && (
//                     <>
//                       <span className="text-border">|</span>
//                       <span className={`font-mono ${responseTimeFormatted.includes('s') ? 'text-orange-400' : 'text-foreground/80'}`}>
//                         {responseTimeFormatted}
//                         {isWakeUp && <span className="text-orange-500 ml-1">(Cold Start)</span>}
//                       </span>
//                     </>
//                   )}
//                 </p>
//               </div>

//               <div className="flex items-center justify-between md:justify-end gap-4 border-t pt-3 md:pt-0 md:border-none border-border/60">
//                 <div className="text-xs font-semibold text-foreground/80 md:hidden">
//                   {parseFloat(monitor.uptimePercentage || '100').toFixed(1)}% uptime
//                 </div>

//                 <div className="flex items-center gap-1.5 ml-auto md:ml-0">
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                     onClick={() => handlePingNow(monitor.id)}
//                     disabled={pingingId === monitor.id || isPaused}
//                   >
//                     <Clock size={13} className={pingingId === monitor.id ? 'animate-spin text-primary' : ''} />
//                     <span className="font-medium">{pingingId === monitor.id ? 'Pinging...' : 'Ping'}</span>
//                   </Button>

//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                     onClick={() => router.push(`/monitors/${monitor.id}`)}
//                   >
//                     <Eye size={13} />
//                     <span className="font-medium">View</span>
//                   </Button>

//                   <div className="flex-shrink-0 hidden lg:block px-2 border-l border-r border-border/60 mx-1">
//                     <DynamicIncidentBars status={monitor.status} />
//                   </div>

//                   <div className="text-xs font-mono font-bold text-foreground/90 min-w-[85px] text-right hidden md:block">
//                     {parseFloat(monitor.uptimePercentage || '100').toFixed(2)}% <span className="text-[10px] text-muted-foreground font-normal">up</span>
//                   </div>

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-accent">
//                         <MoreVertical size={14} className="text-muted-foreground" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-44 bg-popover border border-border rounded-lg shadow-xl">
//                       <DropdownMenuItem 
//                         className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                         onClick={() => handleToggleMonitor(monitor.id, isActive)}
//                         disabled={togglingId === monitor.id}
//                       >
//                         {togglingId === monitor.id ? (
//                           <Loader2 size={13} className="mr-2 animate-spin" />
//                         ) : isPaused ? (
//                           <Play size={13} className="mr-2 text-green-500" />
//                         ) : (
//                           <Pause size={13} className="mr-2 text-yellow-500" />
//                         )}
//                         {togglingId === monitor.id ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
//                       </DropdownMenuItem>

//                       <DropdownMenuItem 
//                         className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                         onClick={() => router.push(`/monitors/${monitor.id}/edit`)}
//                       >
//                         <Pencil size={13} className="mr-2 text-muted-foreground" />
//                         Edit
//                       </DropdownMenuItem>
                      
//                       <DropdownMenuItem 
//                         onClick={() => handleDelete(monitor.id)}
//                         disabled={deletingId === monitor.id}
//                         className="text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2 cursor-pointer border-t border-border/40 rounded-b-md"
//                       >
//                         <Trash2 size={13} className="mr-2" />
//                         {deletingId === monitor.id ? 'Deleting...' : 'Delete'}
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* No Results Message */}
//       {displayMonitors.length === 0 && (
//         <div className="text-center py-12 border rounded-xl border-dashed bg-card/20 border-border">
//           <p className="text-sm text-muted-foreground font-medium">No monitors match your filters.</p>
//           <button
//             onClick={clearAllFilters}
//             className="mt-2 text-xs text-primary hover:underline"
//           >
//             Clear all filters
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }





















































// 'use client'

// import { Eye, Clock, MoreVertical, Pencil, Trash2, Loader2, Zap, Play, Pause, Search, X, Filter, ArrowUpDown } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { useEffect, useState, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
// import { useToast } from '@/hooks/use-toast'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   statusCode?: number
//   responseTimeMs?: number
//   lastPingAt?: string
//   nextPingAt?: string
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   intervalSeconds: number
//   method?: string
//   isActive: boolean
//   lastPingResult?: {
//     isWakeUp: boolean
//     success: boolean
//     responseTimeMs: number
//   }
// }

// type SortOption = 'status-down-first' | 'status-up-first' | 'name-asc' | 'name-desc' | 'uptime-desc' | 'uptime-asc' | 'response-desc' | 'response-asc'
// type StatusFilter = 'all' | 'up' | 'down' | 'waking' | 'degraded' | 'paused' | 'active'

// function DynamicIncidentBars({ status }: { status: Monitor['status'] }) {
//   const barColor = 
//     status === 'up' ? 'bg-emerald-500' : 
//     status === 'down' ? 'bg-red-500' : 
//     status === 'waking' ? 'bg-orange-500' : 
//     status === 'degraded' ? 'bg-yellow-500' : 'bg-muted/40';

//   return (
//     <div className="flex gap-0.5 items-center">
//       {Array.from({ length: 24 }).map((_, i) => {
//         const isCurrentState = i >= 21;
//         const barStyle = isCurrentState ? barColor : 'bg-emerald-500/60';
        
//         return (
//           <div
//             key={i}
//             className={`w-1 h-5 rounded-sm transition-all duration-300 ${barStyle}`}
//             title={isCurrentState ? `Current: ${status.toUpperCase()}` : 'Historical: Operational'}
//           />
//         );
//       })}
//     </div>
//   )
// }

// function getStatusColor(status: Monitor['status'], isActive: boolean = true) {
//   if (!isActive) return 'bg-gray-500/15 text-gray-500 border border-gray-500/30'
//   switch (status) {
//     case 'up': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
//     case 'down': return 'bg-red-500/15 text-red-500 border border-red-500/30'
//     case 'waking': return 'bg-orange-500/15 text-orange-500 border border-orange-500/30'
//     case 'degraded': return 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
//     default: return 'bg-muted/30 text-muted-foreground border border-border'
//   }
// }

// function getStatusText(status: string | undefined | null, isActive: boolean = true) {
//   if (!isActive) return 'Paused'
//   switch (status) {
//     case 'up': return 'Operational'
//     case 'down': return 'Outage Detected'
//     case 'waking': return 'Waking Engine'
//     case 'degraded': return 'Degraded Health'
//     default: return 'Pending Verification'
//   }
// }

// function formatResponseTime(ms: number | undefined): string {
//   if (!ms) return '—'
//   if (ms >= 1000) {
//     return `${(ms / 1000).toFixed(1)}s`
//   }
//   return `${ms}ms`
// }

// export function MonitorList() {
//   const [monitors, setMonitors] = useState<Monitor[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<number | null>(null)
//   const [pingingId, setPingingId] = useState<number | null>(null)
//   const [togglingId, setTogglingId] = useState<number | null>(null)
  
//   const [searchQuery, setSearchQuery] = useState('')
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
//   const [sortBy, setSortBy] = useState<SortOption>('status-down-first')
//   const [isFilterOpen, setIsFilterOpen] = useState(false)
  
//   const router = useRouter()
//   const { toast } = useToast()

//   const AUTH_HEADERS = {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
//   }

//   const statusOptions: { value: StatusFilter; label: string; color: string }[] = [
//     { value: 'all', label: 'All Statuses', color: 'text-muted-foreground' },
//     { value: 'active', label: 'Active', color: 'text-blue-500' },
//     { value: 'paused', label: 'Paused', color: 'text-gray-500' },
//     { value: 'up', label: 'Operational', color: 'text-green-500' },
//     { value: 'down', label: 'Major Outage', color: 'text-red-500' },
//     { value: 'waking', label: 'Waking up', color: 'text-orange-500' },
//     { value: 'degraded', label: 'Degraded Health', color: 'text-yellow-500' },
//   ]

//   const sortOptions: { value: SortOption; label: string }[] = [
//     { value: 'status-down-first', label: 'Down First' },
//     { value: 'status-up-first', label: 'Up First' },
//     { value: 'name-asc', label: 'A-Z' },
//     { value: 'name-desc', label: 'Z-A' },
//     { value: 'uptime-desc', label: 'High Uptime' },
//     { value: 'uptime-asc', label: 'Low Uptime' },
//     { value: 'response-desc', label: 'Slowest' },
//     { value: 'response-asc', label: 'Fastest' },
//   ]

//   const getStatusLabel = () => {
//     const option = statusOptions.find(opt => opt.value === statusFilter)
//     return option?.label || 'All'
//   }

//   const getSortLabel = () => {
//     const options: Record<SortOption, string> = {
//       'status-down-first': 'Down First',
//       'status-up-first': 'Up First',
//       'name-asc': 'A-Z',
//       'name-desc': 'Z-A',
//       'uptime-desc': 'High Uptime',
//       'uptime-asc': 'Low Uptime',
//       'response-desc': 'Slowest',
//       'response-asc': 'Fastest',
//     }
//     return options[sortBy] || 'Down First'
//   }

//   const fetchMonitors = async () => {
//     try {
//       const response = await fetch('/api/monitors', {
//         method: 'GET',
//         headers: AUTH_HEADERS
//       })
//       const data = await response.json()
//       if (data.success) {
//         const monitorsList = data.monitors || []
        
//         const monitorsWithPingStatus = await Promise.all(
//           monitorsList.map(async (monitor: Monitor) => {
//             try {
//               const pingResponse = await fetch(`/api/pings?monitorId=${monitor.id}&limit=1`, {
//                 headers: AUTH_HEADERS
//               })
//               if (pingResponse.ok) {
//                 const pingData = await pingResponse.json()
//                 const latestPing = pingData.pings?.[0]
//                 if (latestPing) {
//                   return {
//                     ...monitor,
//                     lastPingResult: {
//                       isWakeUp: latestPing.isWakeUp || false,
//                       success: latestPing.success,
//                       responseTimeMs: latestPing.responseTimeMs
//                     },
//                     responseTimeMs: latestPing.responseTimeMs
//                   }
//                 }
//               }
//             } catch (error) {
//               // Silent fail
//             }
//             return monitor
//           })
//         )
        
//         setMonitors(monitorsWithPingStatus)
//       }
//     } catch (error) {
//       console.error('Programmatic client fetch exception:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filteredAndSortedMonitors = useMemo(() => {
//     let result = [...monitors]
    
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       result = result.filter(m => 
//         m.name.toLowerCase().includes(query) || 
//         m.url.toLowerCase().includes(query)
//       )
//     }
    
//     if (statusFilter !== 'all') {
//       if (statusFilter === 'active') {
//         result = result.filter(m => m.isActive !== false)
//       } else if (statusFilter === 'paused') {
//         result = result.filter(m => m.isActive === false)
//       } else {
//         result = result.filter(m => m.status === statusFilter && m.isActive !== false)
//       }
//     }
    
//     switch (sortBy) {
//       case 'status-down-first':
//         result.sort((a, b) => {
//           const order: Record<Monitor['status'], number> = { down: 0, degraded: 1, waking: 2, pending: 3, up: 4 }
//           const aOrder = a.isActive === false ? 5 : order[a.status] ?? 6
//           const bOrder = b.isActive === false ? 5 : order[b.status] ?? 6
//           return aOrder - bOrder
//         })
//         break
//       case 'status-up-first':
//         result.sort((a, b) => {
//           const order: Record<Monitor['status'], number> = { up: 0, waking: 1, degraded: 2, down: 3, pending: 4 }
//           const aOrder = a.isActive === false ? 5 : order[a.status] ?? 6
//           const bOrder = b.isActive === false ? 5 : order[b.status] ?? 6
//           return aOrder - bOrder
//         })
//         break
//       case 'name-asc':
//         result.sort((a, b) => a.name.localeCompare(b.name))
//         break
//       case 'name-desc':
//         result.sort((a, b) => b.name.localeCompare(a.name))
//         break
//       case 'uptime-desc':
//         result.sort((a, b) => parseFloat(b.uptimePercentage) - parseFloat(a.uptimePercentage))
//         break
//       case 'uptime-asc':
//         result.sort((a, b) => parseFloat(a.uptimePercentage) - parseFloat(b.uptimePercentage))
//         break
//       case 'response-desc':
//         result.sort((a, b) => (b.responseTimeMs || 0) - (a.responseTimeMs || 0))
//         break
//       case 'response-asc':
//         result.sort((a, b) => (a.responseTimeMs || 0) - (b.responseTimeMs || 0))
//         break
//     }
    
//     return result
//   }, [monitors, searchQuery, statusFilter, sortBy])

//   const activeFiltersCount = (searchQuery ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (sortBy !== 'status-down-first' ? 1 : 0)

//   const clearAllFilters = () => {
//     setSearchQuery('')
//     setStatusFilter('all')
//     setSortBy('status-down-first')
//   }

//   const handleToggleMonitor = async (id: number, currentStatus: boolean) => {
//     setTogglingId(id)
//     const newStatus = !currentStatus
    
//     try {
//       const response = await fetch(`/api/monitors/${id}`, {
//         method: 'PUT',
//         headers: AUTH_HEADERS,
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus ? 'Monitoring has been reactivated.' : 'Monitoring has been paused.',
//         })
//         fetchMonitors()
//         router.refresh()
//       } else {
//         toast({ title: '❌ Failed to toggle monitor', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network error', variant: 'destructive' })
//     } finally {
//       setTogglingId(null)
//     }
//   }

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this monitor?')) return
    
//     setDeletingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}`, { 
//         method: 'DELETE',
//         headers: AUTH_HEADERS
//       })
//       if (response.ok) {
//         toast({ title: '✅ Monitor deleted' })
//         fetchMonitors()
//         router.refresh()
//       } else {
//         toast({ title: '❌ Failed to delete', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network error', variant: 'destructive' })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   const handlePingNow = async (id: number) => {
//     setPingingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}/ping`, { 
//         method: 'POST',
//         headers: AUTH_HEADERS
//       })
      
//       if (response.ok) {
//         toast({ 
//           title: '🔄 Ping triggered', 
//           description: 'Results will appear shortly.'
//         })
//         setTimeout(fetchMonitors, 3500)
//       } else {
//         toast({ title: '❌ Failed to ping', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network error', variant: 'destructive' })
//     } finally {
//       setPingingId(null)
//     }
//   }

//   useEffect(() => {
//     fetchMonitors()
//     const pollingInterval = setInterval(fetchMonitors, 30000)
//     return () => clearInterval(pollingInterval)
//   }, [])

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-20 bg-background/50 border rounded-xl border-dashed">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <span className="text-xs text-muted-foreground font-medium animate-pulse">Syncing cluster metrics...</span>
//         </div>
//       </div>
//     )
//   }

//   if (monitors.length === 0) {
//     return (
//       <div className="text-center py-16 border rounded-xl border-dashed bg-card/20 border-border">
//         <p className="text-sm text-muted-foreground font-medium">No tracking instances registered yet.</p>
//         <Button className="mt-4 font-semibold text-xs px-4" onClick={() => router.push('/add-monitor')}>
//           Create Your First Monitor
//         </Button>
//       </div>
//     )
//   }

//   const displayMonitors = filteredAndSortedMonitors
//   const totalMonitors = monitors.length
//   const filteredCount = displayMonitors.length

//   return (
//     <div>
//       {/* Search Bar Input Integration */}
//       <div className="mb-4 relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
//         <Input
//           type="text"
//           placeholder="Search by monitor name or tracking endpoint URL..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="pl-9 pr-4 text-xs h-9 bg-card border-border placeholder:text-muted-foreground/70 focus-visible:ring-primary/20"
//         />
//         {searchQuery && (
//           <button 
//             onClick={() => setSearchQuery('')}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//           >
//             <X className="w-3.5 h-3.5" />
//           </button>
//         )}
//       </div>

//       {/* Filter Options Bar */}
//       <div className="mb-4">
//         <div className="w-screen relative left-[calc(-50vw+50%)] border-t border-border mb-4" />
          
//         <div className="flex items-center justify-between gap-2 flex-wrap">
//           <div className="flex items-center gap-2">
//             {/* Status Filter Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setIsFilterOpen(!isFilterOpen)}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                   statusFilter !== 'all' 
//                     ? 'bg-primary/10 text-primary border border-primary/20' 
//                     : 'bg-card border border-border text-muted-foreground hover:text-foreground'
//                 }`}
//               >
//                 <Filter size={12} />
//                 Status: {getStatusLabel()}
//                 {statusFilter !== 'all' && (
//                   <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
//                 )}
//               </button>
              
//               {isFilterOpen && (
//                 <>
//                   <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
//                   <div className="absolute top-full left-0 mt-1 w-36 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
//                     {statusOptions.map((option) => (
//                       <button
//                         key={option.value}
//                         onClick={() => {
//                           setStatusFilter(option.value)
//                           setIsFilterOpen(false)
//                         }}
//                         className={`w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors flex items-center gap-2 ${
//                           statusFilter === option.value ? 'text-primary font-medium' : 'text-foreground'
//                         }`}
//                       >
//                         <span className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`} />
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Sort Dropdown */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
//                   <ArrowUpDown size={12} />
//                   Sort: {getSortLabel()}
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-44">
//                 {sortOptions.map((option) => (
//                   <DropdownMenuItem
//                     key={option.value}
//                     onClick={() => setSortBy(option.value)}
//                     className={`text-xs cursor-pointer ${sortBy === option.value ? 'text-primary font-medium' : ''}`}
//                   >
//                     {option.label}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Clear Filters Button */}
//             {activeFiltersCount > 0 && (
//               <button
//                 onClick={clearAllFilters}
//                 className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-500 transition-colors"
//               >
//                 <X size={12} />
//                 Clear ({activeFiltersCount})
//               </button>
//             )}
//           </div>

//           {/* Results Count */}
//           <div className="text-xs text-muted-foreground">
//             Showing {filteredCount} of {totalMonitors} monitors
//           </div>
//         </div>

//         {/* Active Filters Display */}
//         {activeFiltersCount > 0 && (
//           <div className="flex items-center gap-2 flex-wrap mt-3">
//             {searchQuery && (
//               <Badge variant="secondary" className="text-xs gap-1">
//                 Search: {searchQuery}
//                 <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-500">
//                   <X size={10} />
//                 </button>
//               </Badge>
//             )}
//             {statusFilter !== 'all' && (
//               <Badge variant="secondary" className="text-xs gap-1">
//                 Status: {getStatusLabel()}
//                 <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-red-500">
//                   <X size={10} />
//                 </button>
//               </Badge>
//             )}
//             {sortBy !== 'status-down-first' && (
//               <Badge variant="secondary" className="text-xs gap-1">
//                 Sort: {getSortLabel()}
//                 <button onClick={() => setSortBy('status-down-first')} className="ml-1 hover:text-red-500">
//                   <X size={10} />
//                 </button>
//               </Badge>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Monitor Cards List */}
//       <div className="space-y-3">
//         {displayMonitors.map((monitor) => {
//           const isWakeUp = monitor.lastPingResult?.isWakeUp
//           const responseTimeFormatted = formatResponseTime(monitor.responseTimeMs)
//           const isActive = monitor.isActive !== false
//           const isPaused = !isActive
          
//           return (
//             <div
//               key={monitor.id}
//               className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-card border transition-all duration-200 hover:shadow-md group ${
//                 isPaused ? 'border-gray-500/40 bg-gray-500/5 opacity-80' :
//                 isWakeUp ? 'border-orange-500/50 bg-orange-500/5' : 
//                 'border-border hover:border-primary/20'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${getStatusColor(monitor.status, isActive)}`}>
//                   {isPaused ? (
//                     <Pause size={18} className="text-gray-500" />
//                   ) : isWakeUp ? (
//                     <Zap size={18} className="text-orange-500" />
//                   ) : (
//                     <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
//                   )}
//                 </div>
                
//                 <div className="md:hidden flex-1 min-w-0">
//                   <h3 className="text-sm font-bold text-foreground tracking-tight truncate">
//                     {monitor.name}
//                     {isPaused && <span className="ml-2 text-[10px] bg-gray-500/20 text-gray-500 px-1.5 py-0.5 rounded-full">PAUSED</span>}
//                     {!isPaused && isWakeUp && <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">WAKE-UP</span>}
//                   </h3>
//                   <p className="text-[11px] text-muted-foreground/90 mt-0.5 truncate">
//                     {monitor.url}
//                   </p>
//                 </div>
//               </div>

//               <div className="hidden md:block flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <h3 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
//                     {monitor.name}
//                   </h3>
//                   {isPaused && (
//                     <span className="text-[10px] bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
//                       <Pause size={10} />
//                       PAUSED
//                     </span>
//                   )}
//                   {!isPaused && isWakeUp && (
//                     <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
//                       <Zap size={10} />
//                       WAKE-UP
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1.5 truncate flex-wrap">
//                   <span className="text-muted-foreground/60 select-none">{monitor.method || 'GET'}</span>
//                   <span className="text-border">|</span>
//                   <span className={
//                     isPaused ? 'text-gray-400 font-semibold' :
//                     monitor.status === 'down' ? 'text-red-400 font-semibold' : 
//                     monitor.status === 'waking' ? 'text-orange-400 font-semibold' : 'text-emerald-400 font-semibold'
//                   }>
//                     {getStatusText(monitor.status, isActive)}
//                   </span>
//                   {!isPaused && monitor.responseTimeMs && (
//                     <>
//                       <span className="text-border">|</span>
//                       <span className={`font-mono ${responseTimeFormatted.includes('s') ? 'text-orange-400' : 'text-foreground/80'}`}>
//                         {responseTimeFormatted}
//                         {isWakeUp && <span className="text-orange-500 ml-1">(Cold Start)</span>}
//                       </span>
//                     </>
//                   )}
//                 </p>
//               </div>

//               <div className="flex items-center justify-between md:justify-end gap-4 border-t pt-3 md:pt-0 md:border-none border-border/60">
//                 <div className="text-xs font-semibold text-foreground/80 md:hidden">
//                   {parseFloat(monitor.uptimePercentage || '100').toFixed(1)}% uptime
//                 </div>

//                 <div className="flex items-center gap-1.5 ml-auto md:ml-0">
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                     onClick={() => handlePingNow(monitor.id)}
//                     disabled={pingingId === monitor.id || isPaused}
//                   >
//                     <Clock size={13} className={pingingId === monitor.id ? 'animate-spin text-primary' : ''} />
//                     <span className="font-medium">{pingingId === monitor.id ? 'Pinging...' : 'Ping'}</span>
//                   </Button>

//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                     onClick={() => router.push(`/monitors/${monitor.id}`)}
//                   >
//                     <Eye size={13} />
//                     <span className="font-medium">View</span>
//                   </Button>

//                   <div className="flex-shrink-0 hidden lg:block px-2 border-l border-r border-border/60 mx-1">
//                     <DynamicIncidentBars status={monitor.status} />
//                   </div>

//                   <div className="text-xs font-mono font-bold text-foreground/90 min-w-[85px] text-right hidden md:block">
//                     {parseFloat(monitor.uptimePercentage || '100').toFixed(2)}% <span className="text-[10px] text-muted-foreground font-normal">up</span>
//                   </div>

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-accent">
//                         <MoreVertical size={14} className="text-muted-foreground" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-44 bg-popover border border-border rounded-lg shadow-xl">
//                       <DropdownMenuItem 
//                         className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                         onClick={() => handleToggleMonitor(monitor.id, isActive)}
//                         disabled={togglingId === monitor.id}
//                       >
//                         {togglingId === monitor.id ? (
//                           <Loader2 size={13} className="mr-2 animate-spin" />
//                         ) : isPaused ? (
//                           <Play size={13} className="mr-2 text-green-500" />
//                         ) : (
//                           <Pause size={13} className="mr-2 text-yellow-500" />
//                         )}
//                         {togglingId === monitor.id ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
//                       </DropdownMenuItem>

//                       <DropdownMenuItem 
//                         className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                         onClick={() => router.push(`/monitors/${monitor.id}/edit`)}
//                       >
//                         <Pencil size={13} className="mr-2 text-muted-foreground" />
//                         Edit
//                       </DropdownMenuItem>
                      
//                       <DropdownMenuItem 
//                         onClick={() => handleDelete(monitor.id)}
//                         disabled={deletingId === monitor.id}
//                         className="text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2 cursor-pointer border-t border-border/40 rounded-b-md"
//                       >
//                         <Trash2 size={13} className="mr-2" />
//                         {deletingId === monitor.id ? 'Deleting...' : 'Delete'}
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* Empty Filter State */}
//       {displayMonitors.length === 0 && (
//         <div className="text-center py-12 border rounded-xl border-dashed bg-card/20 border-border">
//           <p className="text-sm text-muted-foreground font-medium">No monitors match your filters.</p>
//           <button
//             onClick={clearAllFilters}
//             className="mt-2 text-xs text-primary hover:underline"
//           >
//             Clear all filters
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }






























// 'use client'

// import { Eye, Clock, MoreVertical, Pencil, Trash2, Loader2, Zap, Play, Pause, Search, X, Filter, ArrowUpDown } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { useEffect, useState, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
// import { useToast } from '@/hooks/use-toast'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   statusCode?: number
//   responseTimeMs?: number
//   lastPingAt?: string
//   nextPingAt?: string
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   intervalSeconds: number
//   method?: string
//   isActive: boolean
//   lastPingResult?: {
//     isWakeUp: boolean
//     success: boolean
//     responseTimeMs: number
//   }
// }

// type SortOption = 'status-down-first' | 'status-up-first' | 'name-asc' | 'name-desc' | 'uptime-desc' | 'uptime-asc' | 'response-desc' | 'response-asc'
// type StatusFilter = 'all' | 'up' | 'down' | 'waking' | 'degraded' | 'paused' | 'active'

// function DynamicIncidentBars({ status }: { status: Monitor['status'] }) {
//   const barColor = 
//     status === 'up' ? 'bg-emerald-500' : 
//     status === 'down' ? 'bg-red-500' : 
//     status === 'waking' ? 'bg-orange-500' : 
//     status === 'degraded' ? 'bg-yellow-500' : 'bg-muted/40';

//   return (
//     <div className="flex gap-0.5 items-center">
//       {Array.from({ length: 24 }).map((_, i) => {
//         const isCurrentState = i >= 21;
//         const barStyle = isCurrentState ? barColor : 'bg-emerald-500/60';
        
//         return (
//           <div
//             key={i}
//             className={`w-1 h-5 rounded-sm transition-all duration-300 ${barStyle}`}
//             title={isCurrentState ? `Current: ${status.toUpperCase()}` : 'Historical: Operational'}
//           />
//         );
//       })}
//     </div>
//   )
// }

// function getStatusColor(status: Monitor['status'], isActive: boolean = true) {
//   if (!isActive) return 'bg-gray-500/15 text-gray-500 border border-gray-500/30'
//   switch (status) {
//     case 'up': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
//     case 'down': return 'bg-red-500/15 text-red-500 border border-red-500/30'
//     case 'waking': return 'bg-orange-500/15 text-orange-500 border border-orange-500/30'
//     case 'degraded': return 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
//     default: return 'bg-muted/30 text-muted-foreground border border-border'
//   }
// }

// function getStatusText(status: string | undefined | null, isActive: boolean = true) {
//   if (!isActive) return 'Paused'
//   switch (status) {
//     case 'up': return 'Operational'
//     case 'down': return 'Outage Detected'
//     case 'waking': return 'Waking Engine'
//     case 'degraded': return 'Degraded Health'
//     default: return 'Pending Verification'
//   }
// }

// function formatResponseTime(ms: number | undefined): string {
//   if (!ms) return '—'
//   if (ms >= 1000) {
//     return `${(ms / 1000).toFixed(1)}s`
//   }
//   return `${ms}ms`
// }

// export function MonitorList() {
//   const [monitors, setMonitors] = useState<Monitor[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<number | null>(null)
//   const [pingingId, setPingingId] = useState<number | null>(null)
//   const [togglingId, setTogglingId] = useState<number | null>(null)
  
//   const [searchQuery, setSearchQuery] = useState('')
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
//   const [sortBy, setSortBy] = useState<SortOption>('status-down-first')
//   const [isFilterOpen, setIsFilterOpen] = useState(false)
  
//   const router = useRouter()
//   const { toast } = useToast()

//   const AUTH_HEADERS = {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
//   }

//   const statusOptions: { value: StatusFilter; label: string; color: string }[] = [
//     { value: 'all', label: 'All Statuses', color: 'text-muted-foreground' },
//     { value: 'active', label: 'Active', color: 'text-blue-500' },
//     { value: 'paused', label: 'Paused', color: 'text-gray-500' },
//     { value: 'up', label: 'Operational', color: 'text-green-500' },
//     { value: 'down', label: 'Major Outage', color: 'text-red-500' },
//     { value: 'waking', label: 'Waking up', color: 'text-orange-500' },
//     { value: 'degraded', label: 'Degraded Health', color: 'text-yellow-500' },
//   ]

//   const sortOptions: { value: SortOption; label: string }[] = [
//     { value: 'status-down-first', label: 'Down First' },
//     { value: 'status-up-first', label: 'Up First' },
//     { value: 'name-asc', label: 'A-Z' },
//     { value: 'name-desc', label: 'Z-A' },
//     { value: 'uptime-desc', label: 'High Uptime' },
//     { value: 'uptime-asc', label: 'Low Uptime' },
//     { value: 'response-desc', label: 'Slowest' },
//     { value: 'response-asc', label: 'Fastest' },
//   ]

//   const getStatusLabel = () => {
//     const option = statusOptions.find(opt => opt.value === statusFilter)
//     return option?.label || 'All'
//   }

//   const getSortLabel = () => {
//     const options: Record<SortOption, string> = {
//       'status-down-first': 'Down First',
//       'status-up-first': 'Up First',
//       'name-asc': 'A-Z',
//       'name-desc': 'Z-A',
//       'uptime-desc': 'High Uptime',
//       'uptime-asc': 'Low Uptime',
//       'response-desc': 'Slowest',
//       'response-asc': 'Fastest',
//     }
//     return options[sortBy] || 'Down First'
//   }

//   const fetchMonitors = async () => {
//     try {
//       const response = await fetch('/api/monitors', {
//         method: 'GET',
//         headers: AUTH_HEADERS
//       })
//       const data = await response.json()
//       if (data.success) {
//         const monitorsList = data.monitors || []
        
//         const monitorsWithPingStatus = await Promise.all(
//           monitorsList.map(async (monitor: Monitor) => {
//             try {
//               const pingResponse = await fetch(`/api/pings?monitorId=${monitor.id}&limit=1`, {
//                 headers: AUTH_HEADERS
//               })
//               if (pingResponse.ok) {
//                 const pingData = await pingResponse.json()
//                 const latestPing = pingData.pings?.[0]
//                 if (latestPing) {
//                   return {
//                     ...monitor,
//                     lastPingResult: {
//                       isWakeUp: latestPing.isWakeUp || false,
//                       success: latestPing.success,
//                       responseTimeMs: latestPing.responseTimeMs
//                     },
//                     responseTimeMs: latestPing.responseTimeMs
//                   }
//                 }
//               }
//             } catch (error) {
//               // Silent fail
//             }
//             return monitor
//           })
//         )
        
//         setMonitors(monitorsWithPingStatus)
//       }
//     } catch (error) {
//       console.error('Programmatic client fetch exception:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filteredAndSortedMonitors = useMemo(() => {
//     let result = [...monitors]
    
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       result = result.filter(m => 
//         m.name.toLowerCase().includes(query) || 
//         m.url.toLowerCase().includes(query)
//       )
//     }
    
//     if (statusFilter !== 'all') {
//       if (statusFilter === 'active') {
//         result = result.filter(m => m.isActive !== false)
//       } else if (statusFilter === 'paused') {
//         result = result.filter(m => m.isActive === false)
//       } else {
//         result = result.filter(m => m.status === statusFilter && m.isActive !== false)
//       }
//     }
    
//     switch (sortBy) {
//       case 'status-down-first':
//         result.sort((a, b) => {
//           const order: Record<Monitor['status'], number> = { down: 0, degraded: 1, waking: 2, pending: 3, up: 4 }
//           const aOrder = a.isActive === false ? 5 : order[a.status] ?? 6
//           const bOrder = b.isActive === false ? 5 : order[b.status] ?? 6
//           return aOrder - bOrder
//         })
//         break
//       case 'status-up-first':
//         result.sort((a, b) => {
//           const order: Record<Monitor['status'], number> = { up: 0, waking: 1, degraded: 2, down: 3, pending: 4 }
//           const aOrder = a.isActive === false ? 5 : order[a.status] ?? 6
//           const bOrder = b.isActive === false ? 5 : order[b.status] ?? 6
//           return aOrder - bOrder
//         })
//         break
//       case 'name-asc':
//         result.sort((a, b) => a.name.localeCompare(b.name))
//         break
//       case 'name-desc':
//         result.sort((a, b) => b.name.localeCompare(a.name))
//         break
//       case 'uptime-desc':
//         result.sort((a, b) => parseFloat(b.uptimePercentage) - parseFloat(a.uptimePercentage))
//         break
//       case 'uptime-asc':
//         result.sort((a, b) => parseFloat(a.uptimePercentage) - parseFloat(b.uptimePercentage))
//         break
//       case 'response-desc':
//         result.sort((a, b) => (b.responseTimeMs || 0) - (a.responseTimeMs || 0))
//         break
//       case 'response-asc':
//         result.sort((a, b) => (a.responseTimeMs || 0) - (b.responseTimeMs || 0))
//         break
//     }
    
//     return result
//   }, [monitors, searchQuery, statusFilter, sortBy])

//   const activeFiltersCount = (searchQuery ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (sortBy !== 'status-down-first' ? 1 : 0)

//   const clearAllFilters = () => {
//     setSearchQuery('')
//     setStatusFilter('all')
//     setSortBy('status-down-first')
//   }

//   const handleToggleMonitor = async (id: number, currentStatus: boolean) => {
//     setTogglingId(id)
//     const newStatus = !currentStatus
    
//     try {
//       const response = await fetch(`/api/monitors/${id}`, {
//         method: 'PUT',
//         headers: AUTH_HEADERS,
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus ? 'Monitoring has been reactivated.' : 'Monitoring has been paused.',
//         })
//         fetchMonitors()
//         router.refresh()
//       } else {
//         toast({ title: '❌ Failed to toggle monitor', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network error', variant: 'destructive' })
//     } finally {
//       setTogglingId(null)
//     }
//   }

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this monitor?')) return
    
//     setDeletingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}`, { 
//         method: 'DELETE',
//         headers: AUTH_HEADERS
//       })
//       if (response.ok) {
//         toast({ title: '✅ Monitor deleted' })
//         fetchMonitors()
//         router.refresh()
//       } else {
//         toast({ title: '❌ Failed to delete', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network error', variant: 'destructive' })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   const handlePingNow = async (id: number) => {
//     setPingingId(id)
//     try {
//       const response = await fetch(`/api/monitors/${id}/ping`, { 
//         method: 'POST',
//         headers: AUTH_HEADERS
//       })
      
//       if (response.ok) {
//         toast({ 
//           title: '🔄 Ping triggered', 
//           description: 'Results will appear shortly.'
//         })
//         setTimeout(fetchMonitors, 3500)
//       } else {
//         toast({ title: '❌ Failed to ping', variant: 'destructive' })
//       }
//     } catch (error) {
//       toast({ title: '❌ Network error', variant: 'destructive' })
//     } finally {
//       setPingingId(null)
//     }
//   }

//   useEffect(() => {
//     fetchMonitors()
//     const pollingInterval = setInterval(fetchMonitors, 30000)
//     return () => clearInterval(pollingInterval)
//   }, [])

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-20 bg-background/50 border rounded-xl border-dashed">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <span className="text-xs text-muted-foreground font-medium animate-pulse">Syncing cluster metrics...</span>
//         </div>
//       </div>
//     )
//   }

//   if (monitors.length === 0) {
//     return (
//       <div className="text-center py-16 border rounded-xl border-dashed bg-card/20 border-border">
//         <p className="text-sm text-muted-foreground font-medium">No tracking instances registered yet.</p>
//         <Button className="mt-4 font-semibold text-xs px-4" onClick={() => router.push('/add-monitor')}>
//           Create Your First Monitor
//         </Button>
//       </div>
//     )
//   }

//   const displayMonitors = filteredAndSortedMonitors
//   const totalMonitors = monitors.length
//   const filteredCount = displayMonitors.length

//   return (
//     <div className="w-full max-w-full overflow-x-hidden">
//       {/* Search Bar Input Integration */}
//       <div className="mb-4 relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
//         <Input
//           type="text"
//           placeholder="Search by monitor name or tracking endpoint URL..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="pl-9 pr-4 text-xs h-9 bg-card border-border placeholder:text-muted-foreground/70 focus-visible:ring-primary/20"
//         />
//         {searchQuery && (
//           <button 
//             onClick={() => setSearchQuery('')}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//           >
//             <X className="w-3.5 h-3.5" />
//           </button>
//         )}
//       </div>

//       {/* Filter Options Bar - Removed full-width line that causes scroll */}
//       <div className="mb-4">
//         <div className="flex items-center justify-between gap-2 flex-wrap">
//           <div className="flex items-center gap-2 flex-wrap">
//             {/* Status Filter Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setIsFilterOpen(!isFilterOpen)}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                   statusFilter !== 'all' 
//                     ? 'bg-primary/10 text-primary border border-primary/20' 
//                     : 'bg-card border border-border text-muted-foreground hover:text-foreground'
//                 }`}
//               >
//                 <Filter size={12} />
//                 Status: {getStatusLabel()}
//                 {statusFilter !== 'all' && (
//                   <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
//                 )}
//               </button>
              
//               {isFilterOpen && (
//                 <>
//                   <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
//                   <div className="absolute top-full left-0 mt-1 w-36 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
//                     {statusOptions.map((option) => (
//                       <button
//                         key={option.value}
//                         onClick={() => {
//                           setStatusFilter(option.value)
//                           setIsFilterOpen(false)
//                         }}
//                         className={`w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors flex items-center gap-2 ${
//                           statusFilter === option.value ? 'text-primary font-medium' : 'text-foreground'
//                         }`}
//                       >
//                         <span className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`} />
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Sort Dropdown */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
//                   <ArrowUpDown size={12} />
//                   Sort: {getSortLabel()}
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-44">
//                 {sortOptions.map((option) => (
//                   <DropdownMenuItem
//                     key={option.value}
//                     onClick={() => setSortBy(option.value)}
//                     className={`text-xs cursor-pointer ${sortBy === option.value ? 'text-primary font-medium' : ''}`}
//                   >
//                     {option.label}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Clear Filters Button */}
//             {activeFiltersCount > 0 && (
//               <button
//                 onClick={clearAllFilters}
//                 className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-500 transition-colors"
//               >
//                 <X size={12} />
//                 Clear ({activeFiltersCount})
//               </button>
//             )}
//           </div>

//           {/* Results Count */}
//           <div className="text-xs text-muted-foreground">
//             Showing {filteredCount} of {totalMonitors} monitors
//           </div>
//         </div>

//         {/* Active Filters Display */}
//         {activeFiltersCount > 0 && (
//           <div className="flex items-center gap-2 flex-wrap mt-3">
//             {searchQuery && (
//               <Badge variant="secondary" className="text-xs gap-1">
//                 Search: {searchQuery}
//                 <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-500">
//                   <X size={10} />
//                 </button>
//               </Badge>
//             )}
//             {statusFilter !== 'all' && (
//               <Badge variant="secondary" className="text-xs gap-1">
//                 Status: {getStatusLabel()}
//                 <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-red-500">
//                   <X size={10} />
//                 </button>
//               </Badge>
//             )}
//             {sortBy !== 'status-down-first' && (
//               <Badge variant="secondary" className="text-xs gap-1">
//                 Sort: {getSortLabel()}
//                 <button onClick={() => setSortBy('status-down-first')} className="ml-1 hover:text-red-500">
//                   <X size={10} />
//                 </button>
//               </Badge>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Monitor Cards List */}
//       <div className="space-y-3">
//         {displayMonitors.map((monitor) => {
//           const isWakeUp = monitor.lastPingResult?.isWakeUp
//           const responseTimeFormatted = formatResponseTime(monitor.responseTimeMs)
//           const isActive = monitor.isActive !== false
//           const isPaused = !isActive
          
//           return (
//             <div
//               key={monitor.id}
//               className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-card border transition-all duration-200 hover:shadow-md group ${
//                 isPaused ? 'border-gray-500/40 bg-gray-500/5 opacity-80' :
//                 isWakeUp ? 'border-orange-500/50 bg-orange-500/5' : 
//                 'border-border hover:border-primary/20'
//               }`}
//             >
//               <div className="flex items-center gap-3 min-w-0 flex-1">
//                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${getStatusColor(monitor.status, isActive)}`}>
//                   {isPaused ? (
//                     <Pause size={18} className="text-gray-500" />
//                   ) : isWakeUp ? (
//                     <Zap size={18} className="text-orange-500" />
//                   ) : (
//                     <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
//                   )}
//                 </div>
                
//                 <div className="min-w-0 flex-1">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <h3 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
//                       {monitor.name}
//                     </h3>
//                     {isPaused && (
//                       <span className="text-[10px] bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 whitespace-nowrap">
//                         <Pause size={10} />
//                         PAUSED
//                       </span>
//                     )}
//                     {!isPaused && isWakeUp && (
//                       <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 whitespace-nowrap">
//                         <Zap size={10} />
//                         WAKE-UP
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1.5 flex-wrap">
//                     <span className="text-muted-foreground/60 select-none">{monitor.method || 'GET'}</span>
//                     <span className="text-border">|</span>
//                     <span className={
//                       isPaused ? 'text-gray-400 font-semibold' :
//                       monitor.status === 'down' ? 'text-red-400 font-semibold' : 
//                       monitor.status === 'waking' ? 'text-orange-400 font-semibold' : 'text-emerald-400 font-semibold'
//                     }>
//                       {getStatusText(monitor.status, isActive)}
//                     </span>
//                     {!isPaused && monitor.responseTimeMs && (
//                       <>
//                         <span className="text-border">|</span>
//                         <span className={`font-mono ${responseTimeFormatted.includes('s') ? 'text-orange-400' : 'text-foreground/80'}`}>
//                           {responseTimeFormatted}
//                           {isWakeUp && <span className="text-orange-500 ml-1">(Cold Start)</span>}
//                         </span>
//                       </>
//                     )}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center justify-end gap-4 border-t pt-3 md:pt-0 md:border-none border-border/60">
//                 <div className="text-xs font-semibold text-foreground/80 md:hidden">
//                   {parseFloat(monitor.uptimePercentage || '100').toFixed(1)}% uptime
//                 </div>

//                 <div className="flex items-center gap-1.5 ml-auto md:ml-0">
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                     onClick={() => handlePingNow(monitor.id)}
//                     disabled={pingingId === monitor.id || isPaused}
//                   >
//                     <Clock size={13} className={pingingId === monitor.id ? 'animate-spin text-primary' : ''} />
//                     <span className="font-medium hidden sm:inline">{pingingId === monitor.id ? 'Pinging...' : 'Ping'}</span>
//                     <span className="font-medium sm:hidden">Ping</span>
//                   </Button>

//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
//                     onClick={() => router.push(`/monitors/${monitor.id}`)}
//                   >
//                     <Eye size={13} />
//                     <span className="font-medium hidden sm:inline">View</span>
//                   </Button>

//                   <div className="flex-shrink-0 hidden lg:block px-2 border-l border-r border-border/60 mx-1">
//                     <DynamicIncidentBars status={monitor.status} />
//                   </div>

//                   <div className="text-xs font-mono font-bold text-foreground/90 min-w-[85px] text-right hidden sm:block">
//                     {parseFloat(monitor.uptimePercentage || '100').toFixed(2)}% <span className="text-[10px] text-muted-foreground font-normal">up</span>
//                   </div>

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-accent">
//                         <MoreVertical size={14} className="text-muted-foreground" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-44 bg-popover border border-border rounded-lg shadow-xl">
//                       <DropdownMenuItem 
//                         className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                         onClick={() => handleToggleMonitor(monitor.id, isActive)}
//                         disabled={togglingId === monitor.id}
//                       >
//                         {togglingId === monitor.id ? (
//                           <Loader2 size={13} className="mr-2 animate-spin" />
//                         ) : isPaused ? (
//                           <Play size={13} className="mr-2 text-green-500" />
//                         ) : (
//                           <Pause size={13} className="mr-2 text-yellow-500" />
//                         )}
//                         {togglingId === monitor.id ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
//                       </DropdownMenuItem>

//                       <DropdownMenuItem 
//                         className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
//                         onClick={() => router.push(`/monitors/${monitor.id}/edit`)}
//                       >
//                         <Pencil size={13} className="mr-2 text-muted-foreground" />
//                         Edit
//                       </DropdownMenuItem>
                      
//                       <DropdownMenuItem 
//                         onClick={() => handleDelete(monitor.id)}
//                         disabled={deletingId === monitor.id}
//                         className="text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2 cursor-pointer border-t border-border/40 rounded-b-md"
//                       >
//                         <Trash2 size={13} className="mr-2" />
//                         {deletingId === monitor.id ? 'Deleting...' : 'Delete'}
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* Empty Filter State */}
//       {displayMonitors.length === 0 && (
//         <div className="text-center py-12 border rounded-xl border-dashed bg-card/20 border-border">
//           <p className="text-sm text-muted-foreground font-medium">No monitors match your filters.</p>
//           <button
//             onClick={clearAllFilters}
//             className="mt-2 text-xs text-primary hover:underline"
//           >
//             Clear all filters
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }


























































'use client'

import { Eye, Clock, MoreVertical, Pencil, Trash2, Loader2, Zap, Play, Pause, Search, X, Filter, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface Monitor {
  id: number
  name: string
  url: string
  status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
  statusCode?: number
  responseTimeMs?: number
  lastPingAt?: string
  nextPingAt?: string
  uptimePercentage: string
  totalPings: number
  successfulPings: number
  intervalSeconds: number
  method?: string
  isActive: boolean
  lastPingResult?: {
    isWakeUp: boolean
    success: boolean
    responseTimeMs: number
  }
}

type SortOption = 'status-down-first' | 'status-up-first' | 'name-asc' | 'name-desc' | 'uptime-desc' | 'uptime-asc' | 'response-desc' | 'response-asc'
type StatusFilter = 'all' | 'up' | 'down' | 'waking' | 'degraded' | 'paused' | 'active'

function DynamicIncidentBars({ status }: { status: Monitor['status'] }) {
  const barColor = 
    status === 'up' ? 'bg-emerald-500' : 
    status === 'down' ? 'bg-red-500' : 
    status === 'waking' ? 'bg-orange-500' : 
    status === 'degraded' ? 'bg-yellow-500' : 'bg-muted/40';

  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 24 }).map((_, i) => {
        const isCurrentState = i >= 21;
        const barStyle = isCurrentState ? barColor : 'bg-emerald-500/60';
        
        return (
          <div
            key={i}
            className={`w-1 h-5 rounded-sm transition-all duration-300 ${barStyle}`}
            title={isCurrentState ? `Current: ${status.toUpperCase()}` : 'Historical: Operational'}
          />
        );
      })}
    </div>
  )
}

function getStatusColor(status: Monitor['status'], isActive: boolean = true) {
  if (!isActive) return 'bg-gray-500/15 text-gray-500 border border-gray-500/30'
  switch (status) {
    case 'up': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
    case 'down': return 'bg-red-500/15 text-red-500 border border-red-500/30'
    case 'waking': return 'bg-orange-500/15 text-orange-500 border border-orange-500/30'
    case 'degraded': return 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
    default: return 'bg-muted/30 text-muted-foreground border border-border'
  }
}

function getStatusText(status: string | undefined | null, isActive: boolean = true) {
  if (!isActive) return 'Paused'
  switch (status) {
    case 'up': return 'Operational'
    case 'down': return 'Outage Detected'
    case 'waking': return 'Waking Engine'
    case 'degraded': return 'Degraded Health'
    default: return 'Pending Verification'
  }
}

function formatResponseTime(ms: number | undefined): string {
  if (!ms) return '—'
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)}s`
  }
  return `${ms}ms`
}

export function MonitorList() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [pingingId, setPingingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('status-down-first')
  
  const router = useRouter()
  const { toast } = useToast()

  const AUTH_HEADERS = {
    'Content-Type': 'application/json',
    'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
  }

  const statusOptions: { value: StatusFilter; label: string; color: string }[] = [
    { value: 'all', label: 'All Statuses', color: 'text-muted-foreground' },
    { value: 'active', label: 'Active', color: 'text-blue-500' },
    { value: 'paused', label: 'Paused', color: 'text-gray-500' },
    { value: 'up', label: 'Operational', color: 'text-green-500' },
    { value: 'down', label: 'Major Outage', color: 'text-red-500' },
    { value: 'waking', label: 'Waking up', color: 'text-orange-500' },
    { value: 'degraded', label: 'Degraded Health', color: 'text-yellow-500' },
  ]

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'status-down-first', label: 'Down First' },
    { value: 'status-up-first', label: 'Up First' },
    { value: 'name-asc', label: 'A-Z' },
    { value: 'name-desc', label: 'Z-A' },
    { value: 'uptime-desc', label: 'High Uptime' },
    { value: 'uptime-asc', label: 'Low Uptime' },
    { value: 'response-desc', label: 'Slowest' },
    { value: 'response-asc', label: 'Fastest' },
  ]

  const getStatusLabel = () => {
    const option = statusOptions.find(opt => opt.value === statusFilter)
    return option?.label || 'All Statuses'
  }

  const getSortLabel = () => {
    const options: Record<SortOption, string> = {
      'status-down-first': 'Down First',
      'status-up-first': 'Up First',
      'name-asc': 'A-Z',
      'name-desc': 'Z-A',
      'uptime-desc': 'High Uptime',
      'uptime-asc': 'Low Uptime',
      'response-desc': 'Slowest',
      'response-asc': 'Fastest',
    }
    return options[sortBy] || 'Down First'
  }

  const fetchMonitors = async () => {
    try {
      const response = await fetch('/api/monitors', {
        method: 'GET',
        headers: AUTH_HEADERS
      })
      const data = await response.json()
      if (data.success) {
        const monitorsList = data.monitors || []
        
        const monitorsWithPingStatus = await Promise.all(
          monitorsList.map(async (monitor: Monitor) => {
            try {
              const pingResponse = await fetch(`/api/pings?monitorId=${monitor.id}&limit=1`, {
                headers: AUTH_HEADERS
              })
              if (pingResponse.ok) {
                const pingData = await pingResponse.json()
                const latestPing = pingData.pings?.[0]
                if (latestPing) {
                  return {
                    ...monitor,
                    lastPingResult: {
                      isWakeUp: latestPing.isWakeUp || false,
                      success: latestPing.success,
                      responseTimeMs: latestPing.responseTimeMs
                    },
                    responseTimeMs: latestPing.responseTimeMs
                  }
                }
              }
            } catch (error) {
              // Silent fail
            }
            return monitor
          })
        )
        
        setMonitors(monitorsWithPingStatus)
      }
    } catch (error) {
      console.error('Programmatic client fetch exception:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAndSortedMonitors = useMemo(() => {
    let result = [...monitors]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(m => 
        m.name.toLowerCase().includes(query) || 
        m.url.toLowerCase().includes(query)
      )
    }
    
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        result = result.filter(m => m.isActive !== false)
      } else if (statusFilter === 'paused') {
        result = result.filter(m => m.isActive === false)
      } else {
        result = result.filter(m => m.status === statusFilter && m.isActive !== false)
      }
    }
    
    switch (sortBy) {
      case 'status-down-first':
        result.sort((a, b) => {
          const order: Record<Monitor['status'], number> = { down: 0, degraded: 1, waking: 2, pending: 3, up: 4 }
          const aOrder = a.isActive === false ? 5 : order[a.status] ?? 6
          const bOrder = b.isActive === false ? 5 : order[b.status] ?? 6
          return aOrder - bOrder
        })
        break
      case 'status-up-first':
        result.sort((a, b) => {
          const order: Record<Monitor['status'], number> = { up: 0, waking: 1, degraded: 2, down: 3, pending: 4 }
          const aOrder = a.isActive === false ? 5 : order[a.status] ?? 6
          const bOrder = b.isActive === false ? 5 : order[b.status] ?? 6
          return aOrder - bOrder
        })
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'uptime-desc':
        result.sort((a, b) => parseFloat(b.uptimePercentage) - parseFloat(a.uptimePercentage))
        break
      case 'uptime-asc':
        result.sort((a, b) => parseFloat(a.uptimePercentage) - parseFloat(b.uptimePercentage))
        break
      case 'response-desc':
        result.sort((a, b) => (b.responseTimeMs || 0) - (a.responseTimeMs || 0))
        break
      case 'response-asc':
        result.sort((a, b) => (a.responseTimeMs || 0) - (b.responseTimeMs || 0))
        break
    }
    
    return result
  }, [monitors, searchQuery, statusFilter, sortBy])

  const activeFiltersCount = (searchQuery ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (sortBy !== 'status-down-first' ? 1 : 0)

  const clearAllFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSortBy('status-down-first')
  }

  const handleToggleMonitor = async (id: number, currentStatus: boolean) => {
    setTogglingId(id)
    const newStatus = !currentStatus
    
    try {
      const response = await fetch(`/api/monitors/${id}`, {
        method: 'PUT',
        headers: AUTH_HEADERS,
        body: JSON.stringify({ isActive: newStatus })
      })
      
      if (response.ok) {
        toast({ 
          title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
          description: newStatus ? 'Monitoring has been reactivated.' : 'Monitoring has been paused.',
        })
        fetchMonitors()
        router.refresh()
      } else {
        toast({ title: '❌ Failed to toggle monitor', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: '❌ Network error', variant: 'destructive' })
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this monitor?')) return
    
    setDeletingId(id)
    try {
      const response = await fetch(`/api/monitors/${id}`, { 
        method: 'DELETE',
        headers: AUTH_HEADERS
      })
      if (response.ok) {
        toast({ title: '✅ Monitor deleted' })
        fetchMonitors()
        router.refresh()
      } else {
        toast({ title: '❌ Failed to delete', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: '❌ Network error', variant: 'destructive' })
    } finally {
      setDeletingId(null)
    }
  }

  const handlePingNow = async (id: number) => {
    setPingingId(id)
    try {
      const response = await fetch(`/api/monitors/${id}/ping`, { 
        method: 'POST',
        headers: AUTH_HEADERS
      })
      
      if (response.ok) {
        toast({ 
          title: '🔄 Ping triggered', 
          description: 'Results will appear shortly.'
        })
        setTimeout(fetchMonitors, 3500)
      } else {
        toast({ title: '❌ Failed to ping', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: '❌ Network error', variant: 'destructive' })
    } finally {
      setPingingId(null)
    }
  }

  useEffect(() => {
    fetchMonitors()
    const pollingInterval = setInterval(fetchMonitors, 30000)
    return () => clearInterval(pollingInterval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 bg-background/50 border rounded-xl border-dashed">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground font-medium animate-pulse">Syncing cluster metrics...</span>
        </div>
      </div>
    )
  }

  if (monitors.length === 0) {
    return (
      <div className="text-center py-16 border rounded-xl border-dashed bg-card/20 border-border">
        <p className="text-sm text-muted-foreground font-medium">No tracking instances registered yet.</p>
        <Button className="mt-4 font-semibold text-xs px-4" onClick={() => router.push('/add-monitor')}>
          Create Your First Monitor
        </Button>
      </div>
    )
  }

  const displayMonitors = filteredAndSortedMonitors
  const totalMonitors = monitors.length
  const filteredCount = displayMonitors.length

  return (
    <div className="w-full max-w-full">
      {/* Search Bar Input Integration */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search by monitor name or tracking endpoint URL..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 text-xs h-9 bg-card border-border placeholder:text-muted-foreground/70 focus-visible:ring-primary/20"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Options Bar - Using shadcn DropdownMenu for status (no scroll issues) */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter Dropdown - NOW USING shadcn DropdownMenu (like Sort) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter !== 'all' 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}>
                  <Filter size={12} />
                  Status: {getStatusLabel()}
                  {statusFilter !== 'all' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`text-xs cursor-pointer flex items-center gap-2 ${statusFilter === option.value ? 'text-primary font-medium' : ''}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`} />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowUpDown size={12} />
                  Sort: {getSortLabel()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`text-xs cursor-pointer ${sortBy === option.value ? 'text-primary font-medium' : ''}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X size={12} />
                Clear ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-xs text-muted-foreground">
            Showing {filteredCount} of {totalMonitors} monitors
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-3">
            {searchQuery && (
              <Badge variant="secondary" className="text-xs gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-500">
                  <X size={10} />
                </button>
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs gap-1">
                Status: {getStatusLabel()}
                <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-red-500">
                  <X size={10} />
                </button>
              </Badge>
            )}
            {sortBy !== 'status-down-first' && (
              <Badge variant="secondary" className="text-xs gap-1">
                Sort: {getSortLabel()}
                <button onClick={() => setSortBy('status-down-first')} className="ml-1 hover:text-red-500">
                  <X size={10} />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Monitor Cards List */}
      <div className="space-y-3">
        {displayMonitors.map((monitor) => {
          const isWakeUp = monitor.lastPingResult?.isWakeUp
          const responseTimeFormatted = formatResponseTime(monitor.responseTimeMs)
          const isActive = monitor.isActive !== false
          const isPaused = !isActive
          
          return (
            <div
              key={monitor.id}
              className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-card border transition-all duration-200 hover:shadow-md group ${
                isPaused ? 'border-gray-500/40 bg-gray-500/5 opacity-80' :
                isWakeUp ? 'border-orange-500/50 bg-orange-500/5' : 
                'border-border hover:border-primary/20'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${getStatusColor(monitor.status, isActive)}`}>
                  {isPaused ? (
                    <Pause size={18} className="text-gray-500" />
                  ) : isWakeUp ? (
                    <Zap size={18} className="text-orange-500" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                      {monitor.name}
                    </h3>
                    {isPaused && (
                      <span className="text-[10px] bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 whitespace-nowrap">
                        <Pause size={10} />
                        PAUSED
                      </span>
                    )}
                    {!isPaused && isWakeUp && (
                      <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 whitespace-nowrap">
                        <Zap size={10} />
                        WAKE-UP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1.5 flex-wrap">
                    <span className="text-muted-foreground/60 select-none">{monitor.method || 'GET'}</span>
                    <span className="text-border">|</span>
                    <span className={
                      isPaused ? 'text-gray-400 font-semibold' :
                      monitor.status === 'down' ? 'text-red-400 font-semibold' : 
                      monitor.status === 'waking' ? 'text-orange-400 font-semibold' : 'text-emerald-400 font-semibold'
                    }>
                      {getStatusText(monitor.status, isActive)}
                    </span>
                    {!isPaused && monitor.responseTimeMs && (
                      <>
                        <span className="text-border">|</span>
                        <span className={`font-mono ${responseTimeFormatted.includes('s') ? 'text-orange-400' : 'text-foreground/80'}`}>
                          {responseTimeFormatted}
                          {isWakeUp && <span className="text-orange-500 ml-1">(Cold Start)</span>}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 border-t pt-3 md:pt-0 md:border-none border-border/60">
                <div className="text-xs font-semibold text-foreground/80 md:hidden">
                  {parseFloat(monitor.uptimePercentage || '100').toFixed(1)}% uptime
                </div>

                <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    onClick={() => handlePingNow(monitor.id)}
                    disabled={pingingId === monitor.id || isPaused}
                  >
                    <Clock size={13} className={pingingId === monitor.id ? 'animate-spin text-primary' : ''} />
                    <span className="font-medium hidden sm:inline">{pingingId === monitor.id ? 'Pinging...' : 'Ping'}</span>
                    <span className="font-medium sm:hidden">Ping</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    onClick={() => router.push(`/monitors/${monitor.id}`)}
                  >
                    <Eye size={13} />
                    <span className="font-medium hidden sm:inline">View</span>
                  </Button>

                  <div className="flex-shrink-0 hidden lg:block px-2 border-l border-r border-border/60 mx-1">
                    <DynamicIncidentBars status={monitor.status} />
                  </div>

                  <div className="text-xs font-mono font-bold text-foreground/90 min-w-[85px] text-right hidden sm:block">
                    {parseFloat(monitor.uptimePercentage || '100').toFixed(2)}% <span className="text-[10px] text-muted-foreground font-normal">up</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-accent">
                        <MoreVertical size={14} className="text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 bg-popover border border-border rounded-lg shadow-xl">
                      <DropdownMenuItem 
                        className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
                        onClick={() => handleToggleMonitor(monitor.id, isActive)}
                        disabled={togglingId === monitor.id}
                      >
                        {togglingId === monitor.id ? (
                          <Loader2 size={13} className="mr-2 animate-spin" />
                        ) : isPaused ? (
                          <Play size={13} className="mr-2 text-green-500" />
                        ) : (
                          <Pause size={13} className="mr-2 text-yellow-500" />
                        )}
                        {togglingId === monitor.id ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
                      </DropdownMenuItem>

                      <DropdownMenuItem 
                        className="text-xs font-medium py-2 cursor-pointer focus:bg-accent"
                        onClick={() => router.push(`/monitors/${monitor.id}/edit`)}
                      >
                        <Pencil size={13} className="mr-2 text-muted-foreground" />
                        Edit
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => handleDelete(monitor.id)}
                        disabled={deletingId === monitor.id}
                        className="text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive py-2 cursor-pointer border-t border-border/40 rounded-b-md"
                      >
                        <Trash2 size={13} className="mr-2" />
                        {deletingId === monitor.id ? 'Deleting...' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty Filter State */}
      {displayMonitors.length === 0 && (
        <div className="text-center py-12 border rounded-xl border-dashed bg-card/20 border-border">
          <p className="text-sm text-muted-foreground font-medium">No monitors match your filters.</p>
          <button
            onClick={clearAllFilters}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}