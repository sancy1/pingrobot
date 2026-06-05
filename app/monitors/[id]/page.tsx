
// // app/monitors/[id]/page.tsx

// 'use client'

// import { 
//   ArrowLeft, 
//   Eye, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   AlertCircle, 
//   Zap, 
//   Server, 
//   Activity, 
//   Calendar, 
//   Globe, 
//   Hash, 
//   Cpu,
//   Copy,
//   Check,
//   Pause,
//   Play
// } from 'lucide-react'
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState, useEffect, use } from 'react'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   description: string | null
//   monitorType: string
//   method: string
//   intervalSeconds: number
//   region: string
//   timeoutMs: number
//   sslEnabled: boolean
//   isActive: boolean
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   createdAt: string
//   updatedAt: string
//   lastPingAt: string | null
//   nextPingAt: string | null
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   averageResponseMs: number
// }

// interface PingResult {
//   id: number
//   statusCode: number | null
//   responseTimeMs: number | null
//   success: boolean
//   isWakeUp: boolean
//   errorMessage: string | null
//   errorType: string | null
//   responsePreview: string | null
//   jsonResponse: any
//   createdAt: string
//   sslValid?: boolean | null
//   sslExpiryDays?: number | null
// }

// interface LatestSSLData {  
//   sslValid: boolean | null  
//   sslExpiryDays: number | null
// }

// // Next.js App Router dynamic page standard signature
// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default function MonitorDetailPage({ params }: PageProps) {
//   const resolvedParams = use(params)
//   const monitorId = resolvedParams.id

//   const router = useRouter()
//   const { toast } = useToast()
//   const [isMobile, setIsMobile] = useState(false)

//   const [monitor, setMonitor] = useState<Monitor | null>(null)
//   const [recentPings, setRecentPings] = useState<PingResult[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
//   const [copied, setCopied] = useState(false)
//   const [isToggling, setIsToggling] = useState(false)
//   const [latestSSL, setLatestSSL] = useState<LatestSSLData | null>(null)

//   const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

//   // ✅ Mobile responsive check (same as dashboard)
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Copy URL to clipboard function
//   const handleCopyUrl = async (url: string) => {
//     try {
//       await navigator.clipboard.writeText(url)
//       setCopied(true)
//       toast({
//         title: '✅ URL Copied',
//         description: 'Monitor endpoint address has been copied to clipboard.',
//         duration: 2000,
//       })
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       toast({
//         title: '❌ Copy Failed',
//         description: 'Unable to copy URL to clipboard.',
//         variant: 'destructive',
//         duration: 2000,
//       })
//     }
//   }

//   const getLatestSSLData = (pings: PingResult[]) => {  
//     if (!pings || pings.length === 0) return null    
//     const pingWithSSL = pings.find(ping =>     
//       ping.sslValid !== undefined || ping.sslExpiryDays !== undefined  
//     )    
//     if (!pingWithSSL) return null    
//     return {    
//       sslValid: pingWithSSL.sslValid ?? null,    
//       sslExpiryDays: pingWithSSL.sslExpiryDays ?? null,  
//     }
//   }

//   // Toggle monitor pause/resume
//   const handleToggleMonitor = async () => {
//     if (!monitor) return
//     setIsToggling(true)
//     const newStatus = !monitor.isActive
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}`, {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//           'X-API-Key': apiKey 
//         },
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       const data = await response.json()
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus 
//             ? 'Monitoring has been reactivated. Pings will resume shortly.'
//             : 'Monitoring has been paused. No further pings will be sent.',
//         })
//         setMonitor({ ...monitor, isActive: newStatus })
//         setTimeout(() => {
//           window.location.reload()
//         }, 2000)
//       } else {
//         toast({ 
//           title: '❌ Failed to toggle monitor', 
//           description: data.error || 'Unknown error occurred',
//           variant: 'destructive' 
//         })
//       }
//     } catch (error) {
//       toast({ 
//         title: '❌ Network error', 
//         description: 'Could not update monitor status',
//         variant: 'destructive' 
//       })
//     } finally {
//       setIsToggling(false)
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!monitorId) return

//         console.log(`📡 Detail Request Dispatched for Monitor ID: ${monitorId}`)

//         const monitorRes = await fetch(`/api/monitors/${monitorId}`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (!monitorRes.ok) {
//           const errorPayload = await monitorRes.text()
//           console.error(`❌ Server rejected request with status ${monitorRes.status}:`, errorPayload)
//           throw new Error(`Server returned HTTP Status ${monitorRes.status}`)
//         }
        
//         const monitorData = await monitorRes.json()
        
//         const targetNode = Array.isArray(monitorData.monitor) 
//           ? monitorData.monitor[0] 
//           : monitorData.monitor

//         if (!targetNode) {
//           throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
//         }
        
//         setMonitor(targetNode)

//         const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (pingsRes.ok) {
//           const pingsData = await pingsRes.json()
//           const pingsList = pingsData.pings || []
//           setRecentPings(pingsList)
//           const sslData = getLatestSSLData(pingsList)
//           setLatestSSL(sslData)
//         }
//       } catch (error: any) {
//         console.error('🚨 DETAILED PROFILE RESOLUTION EXCEPTION:', error)
//         toast({
//           title: '❌ Monitor Link Failure',
//           description: error.message || 'The requested monitor profile could not be fetched.',
//           variant: 'destructive',
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [monitorId, router, toast, apiKey])

//   const handlePingNow = async () => {
//     if (!monitor?.isActive) {
//       toast({
//         title: '⏸️ Monitor is Paused',
//         description: 'Resume the monitor before pinging.',
//         variant: 'destructive',
//       })
//       return
//     }
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}/ping`, {
//         method: 'POST',
//         headers: { 'X-API-Key': apiKey }
//       })
      
//       if (response.ok) {
//         toast({
//           title: '🔄 Ping triggered',
//           description: 'Recalibrating endpoint calculations, standing by...',
//         })
//         setTimeout(() => {
//           window.location.reload()
//         }, 3500)
//       } else {
//         toast({
//           title: '❌ Failed to ping',
//           description: 'Could not trigger automated ping at this time',
//           variant: 'destructive',
//         })
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while executing link check.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'Never'
//     return new Date(dateString).toLocaleString()
//   }

//   const getStatusBadge = (status: Monitor['status'], isActive: boolean = true) => {
//     if (!isActive) {
//       return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Pause, text: 'Paused' }
//     }
//     switch (status) {
//       case 'up':
//         return { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle, text: 'Operational' }
//       case 'down':
//         return { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle, text: 'Outage Detected' }
//       case 'waking':
//         return { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Zap, text: 'Waking Engine' }
//       case 'degraded':
//         return { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: AlertCircle, text: 'Degraded' }
//       default:
//         return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Clock, text: 'Pending Verification' }
//     }
//   }

//   const getPingIcon = (ping: PingResult) => {
//     if (ping.isWakeUp) return <Zap size={14} className="text-orange-500" />
//     if (ping.success) return <CheckCircle size={14} className="text-green-500" />
//     return <XCircle size={14} className="text-red-500" />
//   }

//   const getSSLWarning = (daysRemaining: number | null | undefined) => {  
//     if (daysRemaining === null || daysRemaining === undefined) return null  
//     if (daysRemaining <= 0) return { severity: 'critical', message: 'EXPIRED', color: 'bg-red-500' }  
//     if (daysRemaining <= 7) return { severity: 'critical', message: `${daysRemaining}d left`, color: 'bg-red-500' }  
//     if (daysRemaining <= 30) return { severity: 'warning', message: `${daysRemaining}d left`, color: 'bg-yellow-500' }  
//     if (daysRemaining <= 60) return { severity: 'info', message: `${daysRemaining}d left`, color: 'bg-blue-500' }  
//     return { severity: 'good', message: `${daysRemaining}d left`, color: 'bg-green-500' }
//   }

//   const formatSSLDisplay = () => {  
//     if (!monitor?.sslEnabled) {    
//       return { show: false, badgeText: 'Ignored', badgeVariant: 'secondary' as const, tooltip: 'SSL monitoring is disabled for this monitor' }  
//     }    
//     if (!latestSSL) {    
//       return { show: true, badgeText: 'Pending', badgeVariant: 'outline' as const, tooltip: 'No SSL data yet. Run a ping to check certificate.' }  
//     }    
//     if (latestSSL.sslValid === false) {    
//       return { show: true, badgeText: 'Invalid', badgeVariant: 'destructive' as const, tooltip: 'SSL certificate is invalid or expired' }  
//     }    
    
//     const warning = getSSLWarning(latestSSL.sslExpiryDays)  
//     if (warning && warning.severity === 'critical') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'destructive' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }  
//     }    
//     if (warning && warning.severity === 'warning') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'default' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }  
//     }    
//     if (latestSSL.sslValid === true) {    
//       return { show: true, badgeText: `Valid ${warning?.message ? `(${warning.message})` : ''}`, badgeVariant: 'default' as const, tooltip: `SSL certificate is valid${warning?.message ? ` and expires in ${latestSSL.sslExpiryDays} days` : ''}` }  
//     }    
//     return { show: true, badgeText: 'Unknown', badgeVariant: 'outline' as const, tooltip: 'SSL status unknown' }
//   }

//   if (isLoading) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground font-medium text-sm animate-pulse">Syncing cluster metrics...</p>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   if (!monitor) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
//             <Button onClick={() => router.push('/dashboard')} size="sm">Return to Dashboard</Button>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   const isPaused = !monitor.isActive
//   const statusBadge = getStatusBadge(monitor.status, !isPaused)
//   const StatusIcon = statusBadge.icon

//   return (
//     <main 
//       className="min-h-screen bg-background flex flex-col transition-all duration-200"
//       style={{ marginLeft: isMobile ? 0 : '80px' }}
//     >
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 w-full">
//         <div className="max-w-7xl mx-auto">
//           {/* Navigation Header */}
//           <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//             <div className="flex items-center gap-3">
//               <Link href="/dashboard">
//                 <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                   <ArrowLeft size={20} />
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//                   {monitor.name || 'Monitor Details'}
//                   <span className="text-primary">.</span>
//                   {isPaused && (
//                     <span className="ml-2 text-sm bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium">
//                       PAUSED
//                     </span>
//                   )}
//                 </h1>
//                 <div className="flex items-center gap-2 mt-1">
//                   <p className="text-xs font-mono text-muted-foreground select-all">{monitor.url}</p>
//                   <button
//                     onClick={() => handleCopyUrl(monitor.url)}
//                     className="p-1 rounded-md hover:bg-muted transition-colors group focus:outline-none focus:ring-2 focus:ring-primary"
//                     title="Copy URL to clipboard"
//                   >
//                     {copied ? (
//                       <Check size={12} className="text-green-500" />
//                     ) : (
//                       <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Button 
//                 onClick={handleToggleMonitor} 
//                 variant={isPaused ? "default" : "outline"}
//                 size="sm" 
//                 className={`gap-2 h-9 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'}`}
//                 disabled={isToggling}
//               >
//                 {isToggling ? (
//                   <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
//                 ) : isPaused ? (
//                   <Play size={14} />
//                 ) : (
//                   <Pause size={14} />
//                 )}
//                 {isToggling ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
//               </Button>

//               <Button 
//                 onClick={handlePingNow} 
//                 variant="outline" 
//                 size="sm" 
//                 className="gap-2 h-9"
//                 disabled={isPaused}
//               >
//                 <Zap size={14} />
//                 Ping Now
//               </Button>

//               <Link href={`/monitors/${monitor.id}/edit`}>
//                 <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//                   Edit Monitor
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Status Overview Cards */}
//           <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
//                 <Activity size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
//                   <StatusIcon size={13} />
//                   {statusBadge.text}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-2.5">
//                   Last check: {formatDate(monitor.lastPingAt)}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
//                 <Server size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
//                 <Clock size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
//                 <Calendar size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">
//                   {monitor.intervalSeconds >= 60 
//                     ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
//                     : `${monitor.intervalSeconds}s`}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Next scheduled trigger: {isPaused ? 'Paused' : formatDate(monitor.nextPingAt)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Monitor Configuration Details & Activity Logs */}
//           <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
//                 <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-1 text-xs">
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Hash size={13} /> Monitor ID
//                   </span>
//                   <span className="font-mono font-bold text-foreground">{monitor.id}</span>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Globe size={13} /> Request Method
//                   </span>
//                   <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Cpu size={13} /> Node Region
//                   </span>
//                   <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
//                 </div>
                
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Eye size={13} /> SSL Certificate
//                   </span>
//                   {(() => {
//                     const sslDisplay = formatSSLDisplay()
//                     if (!sslDisplay.show && !monitor?.sslEnabled) {
//                       return (
//                         <Badge variant="secondary" className="font-semibold text-[10px] px-2 h-5">
//                           Ignored
//                         </Badge>
//                       )
//                     }
//                     return (
//                       <div className="flex items-center gap-2">
//                         <Badge variant={sslDisplay.badgeVariant} className="font-semibold text-[10px] px-2 h-5">
//                           {sslDisplay.badgeText}
//                         </Badge>
//                         {latestSSL?.sslExpiryDays !== null && latestSSL?.sslExpiryDays !== undefined && latestSSL.sslExpiryDays <= 30 && (
//                           <span className="text-[10px] text-amber-500 font-medium animate-pulse">
//                             ⚠️ Expiring soon
//                           </span>
//                         )}
//                       </div>
//                     )
//                   })()}
//                 </div>

//                 <div className="flex justify-between py-2.5">
//                   <span className="text-muted-foreground font-medium">Description</span>
//                   <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
//                 </div>
                
//                 {/* Active Status Row */}
//                 <div className="flex justify-between py-2.5 pt-3 border-t border-border/60 mt-1">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     {isPaused ? <Play size={13} /> : <Pause size={13} />} Monitor State
//                   </span>
//                   <Badge variant={isPaused ? "secondary" : "default"} className="font-semibold text-[10px] px-2 h-5">
//                     {isPaused ? 'Paused' : 'Active'}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
//                 <CardDescription className="text-xs">
//                   {isPaused 
//                     ? 'Monitoring is paused. No new logs will appear until resumed.' 
//                     : 'Telemetry results tracking the last 20 health checks'}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {recentPings.length === 0 ? (
//                   <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
//                     <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
//                     <p className="text-[11px] text-muted-foreground/60 mt-0.5">
//                       {isPaused 
//                         ? 'Resume monitoring to start collecting data.' 
//                         : 'Execute an on-demand "Ping Now" pulse to establish metrics.'}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
//                     {recentPings.map((ping) => (
//                       <div
//                         key={ping.id}
//                         className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border cursor-pointer hover:bg-accent/40 hover:border-primary/20 transition-all duration-150 group"
//                         onClick={() => setSelectedPing(ping)}
//                       >
//                         <div className="flex items-center gap-2.5 min-w-0">
//                           <div className="transition-transform group-hover:scale-105">
//                             {getPingIcon(ping)}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="text-xs font-bold text-foreground">
//                               {ping.success ? 'Healthy Connection' : 'Outage Event'}
//                               {ping.isWakeUp && <span className="text-[10px] text-orange-400 font-medium ml-1">🌙 Wake</span>}
//                             </p>
//                             <p className="text-[10px] text-muted-foreground mt-0.5">
//                               {formatDate(ping.createdAt)}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="text-right flex-shrink-0 font-mono">
//                           {ping.responseTimeMs !== null && (
//                             <p className="text-xs font-bold text-foreground/90">{ping.responseTimeMs}ms</p>
//                           )}
//                           {ping.statusCode && (
//                             <p className={`text-[10px] font-medium ${ping.success ? 'text-muted-foreground' : 'text-red-400'}`}>
//                               HTTP {ping.statusCode}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* JSON Response Viewer Backdrop Overlay Modal */}
//           {selectedPing && selectedPing.jsonResponse && (
//             <div 
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//               onClick={() => setSelectedPing(null)}
//             >
//               <div 
//                 className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden" 
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
//                   <div>
//                     <h3 className="text-sm font-bold tracking-tight text-foreground">JSON Response Stream</h3>
//                     <p className="text-[11px] text-muted-foreground mt-0.5">Historic event parameters mapped for Node reference #{selectedPing.id}</p>
//                   </div>
//                   <Button type="button" variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setSelectedPing(null)}>
//                     Close Logs
//                   </Button>
//                 </div>
//                 <div className="p-4 overflow-y-auto flex-1 bg-slate-950/40 font-mono">
//                   <pre className="text-xs text-blue-400 overflow-x-auto selection:bg-blue-500/20 leading-relaxed p-2">
//                     {typeof selectedPing.jsonResponse === 'string'
//                       ? selectedPing.jsonResponse
//                       : JSON.stringify(selectedPing.jsonResponse, null, 2)}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }



































// // app/monitors/[id]/page.tsx

// 'use client'

// import { 
//   ArrowLeft, 
//   Eye, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   AlertCircle, 
//   Zap, 
//   Server, 
//   Activity, 
//   Calendar, 
//   Globe, 
//   Hash, 
//   Cpu,
//   Copy,
//   Check,
//   Pause,
//   Play
// } from 'lucide-react'
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState, useEffect, use } from 'react'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   description: string | null
//   monitorType: string
//   method: string
//   intervalSeconds: number
//   region: string
//   timeoutMs: number
//   sslEnabled: boolean
//   isActive: boolean
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   createdAt: string
//   updatedAt: string
//   lastPingAt: string | null
//   nextPingAt: string | null
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   averageResponseMs: number
// }

// interface PingResult {
//   id: number
//   statusCode: number | null
//   responseTimeMs: number | null
//   success: boolean
//   isWakeUp: boolean
//   errorMessage: string | null
//   errorType: string | null
//   responsePreview: string | null
//   jsonResponse: any
//   createdAt: string
//   sslValid?: boolean | null
//   sslExpiryDays?: number | null
// }

// interface LatestSSLData {  
//   sslValid: boolean | null  
//   sslExpiryDays: number | null
// }

// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default function MonitorDetailPage({ params }: PageProps) {
//   const resolvedParams = use(params)
//   const monitorId = resolvedParams.id

//   const router = useRouter()
//   const { toast } = useToast()
//   const [isMobile, setIsMobile] = useState(false)

//   const [monitor, setMonitor] = useState<Monitor | null>(null)
//   const [recentPings, setRecentPings] = useState<PingResult[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
//   const [copied, setCopied] = useState(false)
//   const [isToggling, setIsToggling] = useState(false)
//   const [latestSSL, setLatestSSL] = useState<LatestSSLData | null>(null)

//   // New deletion state metrics
//   const [selectedPings, setSelectedPings] = useState<number[]>([]);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isClearingAll, setIsClearingAll] = useState(false);
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Toggle selection of a ping
//   const togglePingSelection = (pingId: number) => {
//     setSelectedPings(prev => 
//       prev.includes(pingId) 
//         ? prev.filter(id => id !== pingId)
//         : [...prev, pingId]
//     );
//   };

//   // Select all pings
//   const selectAllPings = () => {
//     if (selectedPings.length === recentPings.length) {
//       setSelectedPings([]);
//     } else {
//       setSelectedPings(recentPings.map(p => p.id));
//     }
//   };

//   // Delete selected pings
//   const handleDeleteSelected = async () => {
//     if (selectedPings.length === 0) return;
    
//     setIsDeleting(true);
//     try {
//       const response = await fetch(`/api/pings?ids=${selectedPings.join(',')}`, {
//         method: 'DELETE',
//         headers: { 'X-API-Key': apiKey }
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '✅ Pings Deleted',
//           description: `Successfully deleted ${data.deletedCount} ping records.`,
//         });
//         window.location.reload();
//       } else {
//         toast({
//           title: '❌ Delete Failed',
//           description: data.error || 'Failed to delete selected pings',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while deleting pings.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Clear all pings for this monitor
//   const handleClearAllPings = async () => {
//     setIsClearingAll(true);
//     setShowClearConfirm(false);
    
//     try {
//       const response = await fetch(`/api/pings?action=clear-all&monitorId=${monitorId}`, {
//         method: 'DELETE',
//         headers: { 'X-API-Key': apiKey }
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '🗑️ All Pings Cleared',
//           description: `Successfully cleared ${data.deletedCount} ping records.`,
//         });
//         window.location.reload();
//       } else {
//         toast({
//           title: '❌ Clear Failed',
//           description: data.error || 'Failed to clear ping history',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while clearing pings.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsClearingAll(false);
//     }
//   };

//   const handleCopyUrl = async (url: string) => {
//     try {
//       await navigator.clipboard.writeText(url)
//       setCopied(true)
//       toast({
//         title: '✅ URL Copied',
//         description: 'Monitor endpoint address has been copied to clipboard.',
//         duration: 2000,
//       })
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       toast({
//         title: '❌ Copy Failed',
//         description: 'Unable to copy URL to clipboard.',
//         variant: 'destructive',
//         duration: 2000,
//       })
//     }
//   }

//   const getLatestSSLData = (pings: PingResult[]) => {  
//     if (!pings || pings.length === 0) return null    
//     const pingWithSSL = pings.find(ping =>  
//       ping.sslValid !== undefined || ping.sslExpiryDays !== undefined  
//     )    
//     if (!pingWithSSL) return null    
//     return {    
//       sslValid: pingWithSSL.sslValid ?? null,    
//       sslExpiryDays: pingWithSSL.sslExpiryDays ?? null,  
//     }
//   }

//   const handleToggleMonitor = async () => {
//     if (!monitor) return
//     setIsToggling(true)
//     const newStatus = !monitor.isActive
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}`, {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//           'X-API-Key': apiKey 
//         },
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       const data = await response.json()
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus 
//             ? 'Monitoring has been reactivated. Pings will resume shortly.'
//             : 'Monitoring has been paused. No further pings will be sent.',
//         })
//         setMonitor({ ...monitor, isActive: newStatus })
//         setTimeout(() => {
//           window.location.reload()
//         }, 2000)
//       } else {
//         toast({ 
//           title: '❌ Failed to toggle monitor', 
//           description: data.error || 'Unknown error occurred',
//           variant: 'destructive' 
//         })
//       }
//     } catch (error) {
//       toast({ 
//         title: '❌ Network error', 
//         description: 'Could not update monitor status',
//         variant: 'destructive' 
//       })
//     } finally {
//       setIsToggling(false)
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!monitorId) return

//         console.log(`📡 Detail Request Dispatched for Monitor ID: ${monitorId}`)

//         const monitorRes = await fetch(`/api/monitors/${monitorId}`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (!monitorRes.ok) {
//           const errorPayload = await monitorRes.text()
//           console.error(`❌ Server rejected request with status ${monitorRes.status}:`, errorPayload)
//           throw new Error(`Server returned HTTP Status ${monitorRes.status}`)
//         }
        
//         const monitorData = await monitorRes.json()
        
//         const targetNode = Array.isArray(monitorData.monitor) 
//           ? monitorData.monitor[0] 
//           : monitorData.monitor

//         if (!targetNode) {
//           throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
//         }
        
//         setMonitor(targetNode)

//         const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (pingsRes.ok) {
//           const pingsData = await pingsRes.json()
//           const pingsList = pingsData.pings || []
//           setRecentPings(pingsList)
//           const sslData = getLatestSSLData(pingsList)
//           setLatestSSL(sslData)
//         }
//       } catch (error: any) {
//         console.error('🚨 DETAILED PROFILE RESOLUTION EXCEPTION:', error)
//         toast({
//           title: '❌ Monitor Link Failure',
//           description: error.message || 'The requested monitor profile could not be fetched.',
//           variant: 'destructive',
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [monitorId, router, toast, apiKey])

//   const handlePingNow = async () => {
//     if (!monitor?.isActive) {
//       toast({
//         title: '⏸️ Monitor is Paused',
//         description: 'Resume the monitor before pinging.',
//         variant: 'destructive',
//       })
//       return
//     }
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}/ping`, {
//         method: 'POST',
//         headers: { 'X-API-Key': apiKey }
//       })
      
//       if (response.ok) {
//         toast({
//           title: '🔄 Ping triggered',
//           description: 'Recalibrating endpoint calculations, standing by...',
//         })
//         setTimeout(() => {
//           window.location.reload()
//         }, 3500)
//       } else {
//         toast({
//           title: '❌ Failed to ping',
//           description: 'Could not trigger automated ping at this time',
//           variant: 'destructive',
//         })
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while executing link check.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'Never'
//     return new Date(dateString).toLocaleString()
//   }

//   const getStatusBadge = (status: Monitor['status'], isActive: boolean = true) => {
//     if (!isActive) {
//       return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Pause, text: 'Paused' }
//     }
//     switch (status) {
//       case 'up':
//         return { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle, text: 'Operational' }
//       case 'down':
//         return { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle, text: 'Outage Detected' }
//       case 'waking':
//         return { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Zap, text: 'Waking Engine' }
//       case 'degraded':
//         return { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: AlertCircle, text: 'Degraded' }
//       default:
//         return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Clock, text: 'Pending Verification' }
//     }
//   }

//   const getPingIcon = (ping: PingResult) => {
//     if (ping.isWakeUp) return <Zap size={14} className="text-orange-500" />
//     if (ping.success) return <CheckCircle size={14} className="text-green-500" />
//     return <XCircle size={14} className="text-red-500" />
//   }

//   const getSSLWarning = (daysRemaining: number | null | undefined) => {  
//     if (daysRemaining === null || daysRemaining === undefined) return null  
//     if (daysRemaining <= 0) return { severity: 'critical', message: 'EXPIRED', color: 'bg-red-500' }  
//     if (daysRemaining <= 7) return { severity: 'critical', message: `${daysRemaining}d left`, color: 'bg-red-500' }  
//     if (daysRemaining <= 30) return { severity: 'warning', message: `${daysRemaining}d left`, color: 'bg-yellow-500' }  
//     if (daysRemaining <= 60) return { severity: 'info', message: `${daysRemaining}d left`, color: 'bg-blue-500' }  
//     return { severity: 'good', message: `${daysRemaining}d left`, color: 'bg-green-500' }
//   }

//   const formatSSLDisplay = () => {  
//     if (!monitor?.sslEnabled) {    
//       return { show: false, badgeText: 'Ignored', badgeVariant: 'secondary' as const, tooltip: 'SSL monitoring is disabled for this monitor' }  
//     }    
//     if (!latestSSL) {    
//       return { show: true, badgeText: 'Pending', badgeVariant: 'outline' as const, tooltip: 'No SSL data yet. Run a ping to check certificate.' }  
//     }    
//     if (latestSSL.sslValid === false) {    
//       return { show: true, badgeText: 'Invalid', badgeVariant: 'destructive' as const, tooltip: 'SSL certificate is invalid or expired' }  
//     }    
    
//     const warning = getSSLWarning(latestSSL.sslExpiryDays)  
//     if (warning && warning.severity === 'critical') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'destructive' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }  
//     }    
//     if (warning && warning.severity === 'warning') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'default' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }  
//     }    
//     if (latestSSL.sslValid === true) {    
//       return { show: true, badgeText: `Valid ${warning?.message ? `(${warning.message})` : ''}`, badgeVariant: 'default' as const, tooltip: `SSL certificate is valid${warning?.message ? ` and expires in ${latestSSL.sslExpiryDays} days` : ''}` }  
//     }    
//     return { show: true, badgeText: 'Unknown', badgeVariant: 'outline' as const, tooltip: 'SSL status unknown' }
//   }

//   if (isLoading) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground font-medium text-sm animate-pulse">Syncing cluster metrics...</p>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   if (!monitor) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
//             <Button onClick={() => router.push('/dashboard')} size="sm">Return to Dashboard</Button>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   const isPaused = !monitor.isActive
//   const statusBadge = getStatusBadge(monitor.status, !isPaused)
//   const StatusIcon = statusBadge.icon

//   return (
//     <main 
//       className="min-h-screen bg-background flex flex-col transition-all duration-200"
//       style={{ marginLeft: isMobile ? 0 : '80px' }}
//     >
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 w-full">
//         <div className="max-w-7xl mx-auto">
//           {/* Navigation Header */}
//           <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//             <div className="flex items-center gap-3">
//               <Link href="/dashboard">
//                 <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                   <ArrowLeft size={20} />
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//                   {monitor.name || 'Monitor Details'}
//                   <span className="text-primary">.</span>
//                   {isPaused && (
//                     <span className="ml-2 text-sm bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium">
//                       PAUSED
//                     </span>
//                   )}
//                 </h1>
//                 <div className="flex items-center gap-2 mt-1">
//                   <p className="text-xs font-mono text-muted-foreground select-all">{monitor.url}</p>
//                   <button
//                     onClick={() => handleCopyUrl(monitor.url)}
//                     className="p-1 rounded-md hover:bg-muted transition-colors group focus:outline-none focus:ring-2 focus:ring-primary"
//                     title="Copy URL to clipboard"
//                   >
//                     {copied ? (
//                       <Check size={12} className="text-green-500" />
//                     ) : (
//                       <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Button 
//                 onClick={handleToggleMonitor} 
//                 variant={isPaused ? "default" : "outline"}
//                 size="sm" 
//                 className={`gap-2 h-9 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'}`}
//                 disabled={isToggling}
//               >
//                 {isToggling ? (
//                   <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
//                 ) : isPaused ? (
//                   <Play size={14} />
//                 ) : (
//                   <Pause size={14} />
//                 )}
//                 {isToggling ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
//               </Button>

//               <Button 
//                 onClick={handlePingNow} 
//                 variant="outline" 
//                 size="sm" 
//                 className="gap-2 h-9"
//                 disabled={isPaused}
//               >
//                 <Zap size={14} />
//                 Ping Now
//               </Button>

//               <Link href={`/monitors/${monitor.id}/edit`}>
//                 <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//                   Edit Monitor
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Status Overview Cards */}
//           <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
//                 <Activity size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
//                   <StatusIcon size={13} />
//                   {statusBadge.text}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-2.5">
//                   Last check: {formatDate(monitor.lastPingAt)}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
//                 <Server size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
//                 <Clock size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
//                 <Calendar size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">
//                   {monitor.intervalSeconds >= 60 
//                     ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
//                     : `${monitor.intervalSeconds}s`}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Next scheduled trigger: {isPaused ? 'Paused' : formatDate(monitor.nextPingAt)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Monitor Configuration Details & Activity Logs */}
//           <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
//                 <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-1 text-xs">
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Hash size={13} /> Monitor ID
//                   </span>
//                   <span className="font-mono font-bold text-foreground">{monitor.id}</span>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Globe size={13} /> Request Method
//                   </span>
//                   <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Cpu size={13} /> Node Region
//                   </span>
//                   <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
//                 </div>
                
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Eye size={13} /> SSL Certificate
//                   </span>
//                   {(() => {
//                     const sslDisplay = formatSSLDisplay()
//                     if (!sslDisplay.show && !monitor?.sslEnabled) {
//                       return (
//                         <Badge variant="secondary" className="font-semibold text-[10px] px-2 h-5">
//                           Ignored
//                         </Badge>
//                       )
//                     }
//                     return (
//                       <div className="flex items-center gap-2">
//                         <Badge variant={sslDisplay.badgeVariant} className="font-semibold text-[10px] px-2 h-5">
//                           {sslDisplay.badgeText}
//                         </Badge>
//                         {latestSSL?.sslExpiryDays !== null && latestSSL?.sslExpiryDays !== undefined && latestSSL.sslExpiryDays <= 30 && (
//                           <span className="text-[10px] text-amber-500 font-medium animate-pulse">
//                             ⚠️ Expiring soon
//                           </span>
//                         )}
//                       </div>
//                     )
//                   })()}
//                 </div>

//                 <div className="flex justify-between py-2.5">
//                   <span className="text-muted-foreground font-medium">Description</span>
//                   <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
//                 </div>
                
//                 {/* Active Status Row */}
//                 <div className="flex justify-between py-2.5 pt-3 border-t border-border/60 mt-1">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     {isPaused ? <Play size={13} /> : <Pause size={13} />} Monitor State
//                   </span>
//                   <Badge variant={isPaused ? "secondary" : "default"} className="font-semibold text-[10px] px-2 h-5">
//                     {isPaused ? 'Paused' : 'Active'}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <div className="flex items-center justify-between flex-wrap gap-2">
//                   <div>
//                     <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
//                     <CardDescription className="text-xs">
//                       {isPaused 
//                         ? 'Monitoring is paused. No new logs will appear until resumed.' 
//                         : 'Telemetry results tracking the last 20 health checks'}
//                     </CardDescription>
//                   </div>
//                   {!isPaused && recentPings.length > 0 && (
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       className="h-7 text-xs"
//                       onClick={() => setShowClearConfirm(true)}
//                       disabled={isClearingAll}
//                     >
//                       {isClearingAll ? 'Clearing...' : '🗑️ Clear All Logs'}
//                     </Button>
//                   )}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {recentPings.length === 0 ? (
//                   <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
//                     <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
//                     <p className="text-[11px] text-muted-foreground/60 mt-0.5">
//                       {isPaused 
//                         ? 'Resume monitoring to start collecting data.' 
//                         : 'Execute an on-demand "Ping Now" pulse to establish metrics.'}
//                     </p>
//                   </div>
//                 ) : (
//                   <>
//                     {/* Selection Header */}
//                     <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={selectedPings.length === recentPings.length && recentPings.length > 0}
//                           onChange={selectAllPings}
//                           className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary"
//                         />
//                         <span className="text-xs text-muted-foreground">
//                           {selectedPings.length === 0 
//                             ? 'Select' 
//                             : `${selectedPings.length} selected`}
//                         </span>
//                       </div>
//                       {selectedPings.length > 0 && (
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           className="h-7 text-xs"
//                           onClick={handleDeleteSelected}
//                           disabled={isDeleting}
//                         >
//                           {isDeleting ? 'Deleting...' : `Delete Selected (${selectedPings.length})`}
//                         </Button>
//                       )}
//                     </div>
                    
//                     {/* Ping List with Customized Dark Scrollbar Overrides */}
//                     <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted/30 scrollbar-track-transparent">
//                       {recentPings.map((ping) => (
//                         <div
//                           key={ping.id}
//                           className={`flex items-center gap-2 p-2.5 rounded-lg bg-card border transition-all duration-150 ${
//                             selectedPings.includes(ping.id) 
//                               ? 'border-primary/50 bg-primary/5' 
//                               : 'border-border hover:bg-accent/40 hover:border-primary/20'
//                           }`}
//                         >
//                           {/* Checkbox */}
//                           <input
//                             type="checkbox"
//                             checked={selectedPings.includes(ping.id)}
//                             onChange={() => togglePingSelection(ping.id)}
//                             className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary flex-shrink-0"
//                             onClick={(e) => e.stopPropagation()}
//                           />
                          
//                           {/* Clickable content area */}
//                           <div 
//                             className="flex items-center justify-between flex-1 cursor-pointer"
//                             onClick={() => setSelectedPing(ping)}
//                           >
//                             <div className="flex items-center gap-2.5 min-w-0">
//                               <div className="transition-transform group-hover:scale-105">
//                                 {getPingIcon(ping)}
//                               </div>
//                               <div className="min-w-0">
//                                 <p className="text-xs font-bold text-foreground">
//                                   {ping.success ? 'Healthy Connection' : 'Outage Event'}
//                                   {ping.isWakeUp && <span className="text-[10px] text-orange-400 font-medium ml-1">🌙 Wake</span>}
//                                 </p>
//                                 <p className="text-[10px] text-muted-foreground mt-0.5">
//                                   {formatDate(ping.createdAt)}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="text-right flex-shrink-0 font-mono">
//                               {ping.responseTimeMs !== null && (
//                                 <p className="text-xs font-bold text-foreground/90">{ping.responseTimeMs}ms</p>
//                               )}
//                               {ping.statusCode && (
//                                 <p className={`text-[10px] font-medium ${ping.success ? 'text-muted-foreground' : 'text-red-400'}`}>
//                                   HTTP {ping.statusCode}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* JSON Response Viewer Backdrop Overlay Modal */}
//           {selectedPing && selectedPing.jsonResponse && (
//             <div 
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//               onClick={() => setSelectedPing(null)}
//             >
//               <div 
//                 className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden" 
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
//                   <div>
//                     <h3 className="text-sm font-bold tracking-tight text-foreground">JSON Response Stream</h3>
//                     <p className="text-[11px] text-muted-foreground mt-0.5">Historic event parameters mapped for Node reference #{selectedPing.id}</p>
//                   </div>
//                   <Button type="button" variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setSelectedPing(null)}>
//                     Close Logs
//                   </Button>
//                 </div>
//                 {/* Scrollbar container optimization for modal JSON container */}
//                 <div className="p-4 overflow-y-auto flex-1 bg-slate-950/40 font-mono scrollbar-thin scrollbar-thumb-muted/30 scrollbar-track-transparent">
//                   <pre className="text-xs text-blue-400 overflow-x-auto selection:bg-blue-500/20 leading-relaxed p-2">
//                     {typeof selectedPing.jsonResponse === 'string'
//                       ? selectedPing.jsonResponse
//                       : JSON.stringify(selectedPing.jsonResponse, null, 2)}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Clear All Confirmation Modal */}
//           {showClearConfirm && (
//             <div 
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//               onClick={() => setShowClearConfirm(false)}
//             >
//               <div 
//                 className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="text-center">
//                   <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
//                     <AlertCircle className="w-6 h-6 text-red-500" />
//                   </div>
//                   <h3 className="text-lg font-bold text-foreground mb-2">Clear All Activity Logs?</h3>
//                   <p className="text-sm text-muted-foreground mb-6">
//                     This action will permanently delete all {recentPings.length} ping records for this monitor. 
//                     This cannot be undone.
//                   </p>
//                   <div className="flex gap-3 justify-center">
//                     <Button
//                       variant="outline"
//                       onClick={() => setShowClearConfirm(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       onClick={handleClearAllPings}
//                       disabled={isClearingAll}
//                     >
//                       {isClearingAll ? 'Clearing...' : 'Yes, Clear All'}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }




























































// 'use client'

// import { 
//   ArrowLeft, 
//   Eye, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   AlertCircle, 
//   Zap, 
//   Server, 
//   Activity, 
//   Calendar, 
//   Globe, 
//   Hash, 
//   Cpu,
//   Copy,
//   Check,
//   Pause,
//   Play,
//   Trash2
// } from 'lucide-react'
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState, useEffect, use } from 'react'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   description: string | null
//   monitorType: string
//   method: string
//   intervalSeconds: number
//   region: string
//   timeoutMs: number
//   sslEnabled: boolean
//   isActive: boolean
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   createdAt: string
//   updatedAt: string
//   lastPingAt: string | null
//   nextPingAt: string | null
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   averageResponseMs: number
// }

// interface PingResult {
//   id: number
//   statusCode: number | null
//   responseTimeMs: number | null
//   success: boolean
//   isWakeUp: boolean
//   errorMessage: string | null
//   errorType: string | null
//   responsePreview: string | null
//   jsonResponse: any
//   createdAt: string
//   sslValid?: boolean | null
//   sslExpiryDays?: number | null
// }

// interface LatestSSLData {  
//   sslValid: boolean | null  
//   sslExpiryDays: number | null
// }

// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default function MonitorDetailPage({ params }: PageProps) {
//   const resolvedParams = use(params)
//   const monitorId = resolvedParams.id

//   const router = useRouter()
//   const { toast } = useToast()
//   const [isMobile, setIsMobile] = useState(false)

//   const [monitor, setMonitor] = useState<Monitor | null>(null)
//   const [recentPings, setRecentPings] = useState<PingResult[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
//   const [copied, setCopied] = useState(false)
//   const [isToggling, setIsToggling] = useState(false)
//   const [latestSSL, setLatestSSL] = useState<LatestSSLData | null>(null)

//   // Deletion and history state metrics
//   const [selectedPings, setSelectedPings] = useState<number[]>([]);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isClearingAll, setIsClearingAll] = useState(false);
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

//   // Helper formatting logic
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'Never'
//     return new Date(dateString).toLocaleString()
//   }

//   const getStatusBadge = (status: Monitor['status'], isActive: boolean = true) => {
//     if (!isActive) {
//       return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Pause, text: 'Paused' }
//     }
//     switch (status) {
//       case 'up':
//         return { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle, text: 'Operational' }
//       case 'down':
//         return { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle, text: 'Outage Detected' }
//       case 'waking':
//         return { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Zap, text: 'Waking Engine' }
//       case 'degraded':
//         return { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: AlertCircle, text: 'Degraded' }
//       default:
//         return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Clock, text: 'Pending Verification' }
//     }
//   }

//   // Safe global derived flags lifted up away from the temporal dead zone
//   const isPaused = monitor ? !monitor.isActive : false
//   const statusBadge = getStatusBadge(monitor?.status || 'pending', !isPaused)
//   const StatusIcon = statusBadge.icon

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Toggle selection of a ping
//   const togglePingSelection = (pingId: number) => {
//     setSelectedPings(prev => 
//       prev.includes(pingId) 
//         ? prev.filter(id => id !== pingId)
//         : [...prev, pingId]
//     );
//   };

//   // Select all pings
//   const selectAllPings = () => {
//     if (selectedPings.length === recentPings.length) {
//       setSelectedPings([]);
//     } else {
//       setSelectedPings(recentPings.map(p => p.id));
//     }
//   };

//   // Delete selected pings
//   const handleDeleteSelected = async () => {
//     if (selectedPings.length === 0) return;
    
//     setIsDeleting(true);
//     try {
//       const queryParams = new URLSearchParams();
//       queryParams.append('ids', selectedPings.join(','));
//       selectedPings.forEach(id => queryParams.append('idList', id.toString()));
      
//       const response = await fetch(`/api/pings?${queryParams.toString()}`, {
//         method: 'DELETE',
//         headers: { 
//           'X-API-Key': apiKey,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ ids: selectedPings })
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '✅ Pings Permanently Deleted',
//           description: `Successfully wiped logs from core database clusters.`,
//         });
        
//         setRecentPings(prev => prev.filter(ping => !selectedPings.includes(ping.id)));
//         setSelectedPings([]);
//       } else {
//         toast({
//           title: '❌ Database Sync Failure',
//           description: data.error || 'The remote database engine rejected the deletion block.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ System Error',
//         description: 'Failed to dispatch deletion array sequence to backend clusters.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Clear all pings for this monitor
//   const handleClearAllPings = async () => {
//     setIsClearingAll(true);
//     setShowClearConfirm(false);
    
//     try {
//       const response = await fetch(`/api/pings?action=clear-all&monitorId=${monitorId}`, {
//         method: 'DELETE',
//         headers: { 
//           'X-API-Key': apiKey,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ action: 'clear-all', monitorId: Number(monitorId) })
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '🗑️ History Erased',
//           description: `Telemetry activity history for this node cleared completely.`,
//         });
        
//         setRecentPings([]);
//         setSelectedPings([]);
//       } else {
//         toast({
//           title: '❌ Clear Action Rejected',
//           description: data.error || 'Failed to wipe data rows.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Network failure encountered while wiping monitor metrics context.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsClearingAll(false);
//     }
//   };

//   const handleCopyUrl = async (url: string) => {
//     try {
//       await navigator.clipboard.writeText(url)
//       setCopied(true)
//       toast({
//         title: '✅ URL Copied',
//         description: 'Monitor endpoint address has been copied to clipboard.',
//         duration: 2000,
//       })
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       toast({
//         title: '❌ Copy Failed',
//         description: 'Unable to copy URL to clipboard.',
//         variant: 'destructive',
//         duration: 2000,
//       })
//     }
//   }

//   const getLatestSSLData = (pings: PingResult[]) => {  
//     if (!pings || pings.length === 0) return null    
//     const pingWithSSL = pings.find(ping =>  
//       ping.sslValid !== undefined || ping.sslExpiryDays !== undefined  
//     )    
//     if (!pingWithSSL) return null    
//     return {    
//       sslValid: pingWithSSL.sslValid ?? null,    
//       sslExpiryDays: pingWithSSL.sslExpiryDays ?? null,  
//     }
//   }

//   const handleToggleMonitor = async () => {
//     if (!monitor) return
//     setIsToggling(true)
//     const newStatus = !monitor.isActive
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}`, {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//           'X-API-Key': apiKey 
//         },
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       const data = await response.json()
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus 
//             ? 'Monitoring has been reactivated. Pings will resume shortly.'
//             : 'Monitoring has been paused. No further pings will be sent.',
//         })
//         setMonitor({ ...monitor, isActive: newStatus })
//       } else {
//         toast({ 
//           title: '❌ Failed to toggle monitor', 
//           description: data.error || 'Unknown error occurred',
//           variant: 'destructive' 
//         })
//       }
//     } catch (error) {
//       toast({ 
//         title: '❌ Network error', 
//         description: 'Could not update monitor status',
//         variant: 'destructive' 
//       })
//     } finally {
//       setIsToggling(false)
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!monitorId) return

//         console.log(`📡 Detail Request Dispatched for Monitor ID: ${monitorId}`)

//         const monitorRes = await fetch(`/api/monitors/${monitorId}`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (!monitorRes.ok) {
//           const errorPayload = await monitorRes.text()
//           console.error(`❌ Server rejected request with status ${monitorRes.status}:`, errorPayload)
//           throw new Error(`Server returned HTTP Status ${monitorRes.status}`)
//         }
        
//         const monitorData = await monitorRes.json()
        
//         const targetNode = Array.isArray(monitorData.monitor) 
//           ? monitorData.monitor[0] 
//           : monitorData.monitor

//         if (!targetNode) {
//           throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
//         }
        
//         setMonitor(targetNode)

//         const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (pingsRes.ok) {
//           const pingsData = await pingsRes.json()
//           const pingsList = pingsData.pings || []
//           setRecentPings(pingsList)
//           const sslData = getLatestSSLData(pingsList)
//           setLatestSSL(sslData)
//         }
//       } catch (error: any) {
//         console.error('🚨 DETAILED PROFILE RESOLUTION EXCEPTION:', error)
//         toast({
//           title: '❌ Monitor Link Failure',
//           description: error.message || 'The requested monitor profile could not be fetched.',
//           variant: 'destructive',
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [monitorId, router, toast, apiKey])

//   const handlePingNow = async () => {
//     if (!monitor?.isActive) {
//       toast({
//         title: '⏸️ Monitor is Paused',
//         description: 'Resume the monitor before pinging.',
//         variant: 'destructive',
//       })
//       return
//     }
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}/ping`, {
//         method: 'POST',
//         headers: { 'X-API-Key': apiKey }
//       })
      
//       if (response.ok) {
//         toast({
//           title: '🔄 Ping triggered',
//           description: 'Recalibrating endpoint calculations, standing by...',
//         })
//         setTimeout(async () => {
//           const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//             headers: { 'X-API-Key': apiKey }
//           })
//           if (pingsRes.ok) {
//             const pingsData = await pingsRes.json()
//             setRecentPings(pingsData.pings || [])
//           }
//         }, 2000)
//       } else {
//         toast({
//           title: '❌ Failed to ping',
//           description: 'Could not trigger automated ping at this time',
//           variant: 'destructive',
//         })
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while executing link check.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const getPingIcon = (ping: PingResult) => {
//     if (ping.isWakeUp) return <Zap size={14} className="text-orange-500" />
//     if (ping.success) return <CheckCircle size={14} className="text-green-500" />
//     return <XCircle size={14} className="text-red-500" />
//   }

//   const getSSLWarning = (daysRemaining: number | null | undefined) => {  
//     if (daysRemaining === null || daysRemaining === undefined) return null  
//     if (daysRemaining <= 0) return { severity: 'critical', message: 'EXPIRED', color: 'bg-red-500' }  
//     if (daysRemaining <= 7) return { severity: 'critical', message: `${daysRemaining}d left`, color: 'bg-red-500' }  
//     if (daysRemaining <= 30) return { severity: 'warning', message: `${daysRemaining}d left`, color: 'bg-yellow-500' }  
//     if (daysRemaining <= 60) return { severity: 'info', message: `${daysRemaining}d left`, color: 'bg-blue-500' }  
//     return { severity: 'good', message: `${daysRemaining}d left`, color: 'bg-green-500' }
//   }

//   const formatSSLDisplay = () => {  
//     if (!monitor?.sslEnabled) {    
//       return { show: false, badgeText: 'Ignored', badgeVariant: 'secondary' as const, tooltip: 'SSL monitoring is disabled for this monitor' }  
//     }    
//     if (!latestSSL) {    
//       return { show: true, badgeText: 'Pending', badgeVariant: 'outline' as const, tooltip: 'No SSL data yet. Run a ping to check certificate.' }  
//     }    
//     if (latestSSL.sslValid === false) {    
//       return { show: true, badgeText: 'Invalid', badgeVariant: 'destructive' as const, tooltip: 'SSL certificate is invalid or expired' }  
//     }    
    
//     const warning = getSSLWarning(latestSSL.sslExpiryDays)  
//     if (warning && warning.severity === 'critical') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'destructive' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }  
//     }    
//     if (warning && warning.severity === 'warning') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'default' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }  
//     }    
//     if (latestSSL.sslValid === true) {    
//       return { show: true, badgeText: `Valid ${warning?.message ? `(${warning.message})` : ''}`, badgeVariant: 'default' as const, tooltip: `SSL certificate is valid${warning?.message ? ` and expires in ${latestSSL.sslExpiryDays} days` : ''}` }  
//     }    
//     return { show: true, badgeText: 'Unknown', badgeVariant: 'outline' as const, tooltip: 'SSL status unknown' }
//   }

//   if (isLoading) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground font-medium text-sm animate-pulse">Syncing cluster metrics...</p>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   if (!monitor) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
//             <Button onClick={() => router.push('/dashboard')} size="sm">Return to Dashboard</Button>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   return (
//     <main 
//       className="min-h-screen bg-background flex flex-col transition-all duration-200"
//       style={{ marginLeft: isMobile ? 0 : '80px' }}
//     >
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 w-full">
//         <div className="max-w-7xl mx-auto">
//           {/* Navigation Header */}
//           <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//             <div className="flex items-center gap-3">
//               <Link href="/dashboard">
//                 <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                   <ArrowLeft size={20} />
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//                   {monitor.name || 'Monitor Details'}
//                   <span className="text-primary">.</span>
//                   {isPaused && (
//                     <span className="ml-2 text-sm bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium">
//                       PAUSED
//                     </span>
//                   )}
//                 </h1>
//                 <div className="flex items-center gap-2 mt-1">
//                   <p className="text-xs font-mono text-muted-foreground select-all">{monitor.url}</p>
//                   <button
//                     onClick={() => handleCopyUrl(monitor.url)}
//                     className="p-1 rounded-md hover:bg-muted transition-colors group focus:outline-none focus:ring-2 focus:ring-primary"
//                     title="Copy URL to clipboard"
//                   >
//                     {copied ? (
//                       <Check size={12} className="text-green-500" />
//                     ) : (
//                       <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Button 
//                 onClick={handleToggleMonitor} 
//                 variant={isPaused ? "default" : "outline"}
//                 size="sm" 
//                 className={`gap-2 h-9 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'}`}
//                 disabled={isToggling}
//               >
//                 {isToggling ? (
//                   <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
//                 ) : isPaused ? (
//                   <Play size={14} />
//                 ) : (
//                   <Pause size={14} />
//                 )}
//                 {isToggling ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
//               </Button>

//               <Button 
//                 onClick={handlePingNow} 
//                 variant="outline" 
//                 size="sm" 
//                 className="gap-2 h-9"
//                 disabled={isPaused}
//               >
//                 <Zap size={14} />
//                 Ping Now
//               </Button>

//               <Link href={`/monitors/${monitor.id}/edit`}>
//                 <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//                   Edit Monitor
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Status Overview Cards */}
//           <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
//                 <Activity size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
//                   <StatusIcon size={13} />
//                   {statusBadge.text}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-2.5">
//                   Last check: {formatDate(monitor.lastPingAt)}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
//                 <Server size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
//                 <Clock size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
//                 <Calendar size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">
//                   {monitor.intervalSeconds >= 60 
//                     ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
//                     : `${monitor.intervalSeconds}s`}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Next scheduled trigger: {isPaused ? 'Paused' : formatDate(monitor.nextPingAt)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Monitor Configuration Details & Activity Logs */}
//           <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
//                 <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-1 text-xs">
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Hash size={13} /> Monitor ID
//                   </span>
//                   <span className="font-mono font-bold text-foreground">{monitor.id}</span>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Globe size={13} /> Request Method
//                   </span>
//                   <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Cpu size={13} /> Node Region
//                   </span>
//                   <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
//                 </div>
                
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Eye size={13} /> SSL Certificate
//                   </span>
//                   {(() => {
//                     const sslDisplay = formatSSLDisplay()
//                     if (!sslDisplay.show && !monitor?.sslEnabled) {
//                       return (
//                         <Badge variant="secondary" className="font-semibold text-[10px] px-2 h-5">
//                           Ignored
//                         </Badge>
//                       )
//                     }
//                     return (
//                       <div className="flex items-center gap-2">
//                         <Badge variant={sslDisplay.badgeVariant} className="font-semibold text-[10px] px-2 h-5">
//                           {sslDisplay.badgeText}
//                         </Badge>
//                         {latestSSL?.sslExpiryDays !== null && latestSSL?.sslExpiryDays !== undefined && latestSSL.sslExpiryDays <= 30 && (
//                           <span className="text-[10px] text-amber-500 font-medium animate-pulse">
//                             ⚠️ Expiring soon
//                           </span>
//                         )}
//                       </div>
//                     )
//                   })()}
//                 </div>

//                 <div className="flex justify-between py-2.5">
//                   <span className="text-muted-foreground font-medium">Description</span>
//                   <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
//                 </div>
                
//                 {/* Active Status Row */}
//                 <div className="flex justify-between py-2.5 pt-3 border-t border-border/60 mt-1">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     {isPaused ? <Play size={13} /> : <Pause size={13} />} Monitor State
//                   </span>
//                   <Badge variant={isPaused ? "secondary" : "default"} className="font-semibold text-[10px] px-2 h-5">
//                     {isPaused ? 'Paused' : 'Active'}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <div className="flex items-center justify-between flex-wrap gap-2">
//                   <div className="flex items-center gap-2.5">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
//                         {/* Dynamic Counter Display */}
//                         <span className="bg-muted text-muted-foreground text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-border/80">
//                           {recentPings.length}
//                         </span>
//                       </div>
//                       <CardDescription className="text-xs mt-0.5">
//                         {isPaused 
//                           ? 'Monitoring is paused. No new logs will appear until resumed.' 
//                           : 'Telemetry results tracking health checks'}
//                       </CardDescription>
//                     </div>
//                   </div>
//                   {/* Modernized Neon Glowing Clear Button */}
//                   {!isPaused && recentPings.length > 0 && (
//                     <button
//                       type="button"
//                       onClick={() => setShowClearConfirm(true)}
//                       disabled={isClearingAll}
//                       className="px-3 py-1 text-xs rounded-md bg-transparent border border-red-500/40 text-red-400 font-semibold tracking-wide transition-all duration-300 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.35)] focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none"
//                     >
//                       {isClearingAll ? 'Clearing...' : 'Clear All'}
//                     </button>
//                   )}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {recentPings.length === 0 ? (
//                   <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
//                     <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
//                     <p className="text-[11px] text-muted-foreground/60 mt-0.5">
//                       {isPaused 
//                         ? 'Resume monitoring to start collecting data.' 
//                         : 'Execute an on-demand "Ping Now" pulse to establish metrics.'}
//                     </p>
//                   </div>
//                 ) : (
//                   <>
//                     {/* Selection Sub-Header */}
//                     <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60 min-h-[36px]">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={selectedPings.length === recentPings.length && recentPings.length > 0}
//                           onChange={selectAllPings}
//                           className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary cursor-pointer"
//                         />
//                         <span className="text-xs text-muted-foreground font-medium">
//                           {selectedPings.length === 0 
//                             ? 'Select All' 
//                             : `${selectedPings.length} Selected`}
//                         </span>
//                       </div>
                      
//                       {/* Modernized Neon Glowing Delete Button */}
//                       <div className={`transition-all duration-300 transform ${selectedPings.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
//                         <button
//                           type="button"
//                           onClick={handleDeleteSelected}
//                           disabled={isDeleting}
//                           className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-md bg-red-600 font-bold text-white tracking-wide transition-all duration-300 hover:bg-red-500 shadow-[0_0_12px_rgba(220,38,38,0.3)] hover:shadow-[0_0_18px_rgba(239,68,68,0.6)] focus:outline-none focus:ring-2 focus:ring-red-500/50"
//                         >
//                           <Trash2 size={12} />
//                           {isDeleting ? 'Deleting...' : `Delete (${selectedPings.length})`}
//                         </button>
//                       </div>
//                     </div>
                    
//                     {/* Dark Scrollbar Viewport container targeting background layer manually */}
//                     <div className="space-y-2 max-h-80 overflow-y-auto pr-1 bg-card rounded-md [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-md hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
//                       {recentPings.map((ping) => (
//                         <div
//                           key={ping.id}
//                           className={`flex items-center gap-2 p-2.5 rounded-lg bg-card border transition-all duration-150 group ${
//                             selectedPings.includes(ping.id) 
//                               ? 'border-primary/50 bg-primary/5' 
//                               : 'border-border hover:bg-accent/40 hover:border-primary/20'
//                           }`}
//                         >
//                           {/* Checkbox item */}
//                           <input
//                             type="checkbox"
//                             checked={selectedPings.includes(ping.id)}
//                             onChange={() => togglePingSelection(ping.id)}
//                             className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary flex-shrink-0 cursor-pointer"
//                             onClick={(e) => e.stopPropagation()}
//                           />
                          
//                           {/* Clickable panel */}
//                           <div 
//                             className="flex items-center justify-between flex-1 cursor-pointer"
//                             onClick={() => setSelectedPing(ping)}
//                           >
//                             <div className="flex items-center gap-2.5 min-w-0">
//                               <div className="transition-transform group-hover:scale-105">
//                                 {getPingIcon(ping)}
//                               </div>
//                               <div className="min-w-0">
//                                 <p className="text-xs font-bold text-foreground">
//                                   {ping.success ? 'Healthy Connection' : 'Outage Event'}
//                                   {ping.isWakeUp && <span className="text-[10px] text-orange-400 font-medium ml-1">🌙 Wake</span>}
//                                 </p>
//                                 <p className="text-[10px] text-muted-foreground mt-0.5">
//                                   {formatDate(ping.createdAt)}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="text-right flex-shrink-0 font-mono">
//                               {ping.responseTimeMs !== null && (
//                                 <p className="text-xs font-bold text-foreground/90">{ping.responseTimeMs}ms</p>
//                               )}
//                               {ping.statusCode && (
//                                 <p className={`text-[10px] font-medium ${ping.success ? 'text-muted-foreground' : 'text-red-400'}`}>
//                                   HTTP {ping.statusCode}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* JSON Response Viewer Backdrop Overlay Modal */}
//           {selectedPing && selectedPing.jsonResponse && (
//             <div 
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//               onClick={() => setSelectedPing(null)}
//             >
//               <div 
//                 className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden" 
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
//                   <div>
//                     <h3 className="text-sm font-bold tracking-tight text-foreground">JSON Response Stream</h3>
//                     <p className="text-[11px] text-muted-foreground mt-0.5">Historic event parameters mapped for Node reference #{selectedPing.id}</p>
//                   </div>
//                   <Button type="button" variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setSelectedPing(null)}>
//                     Close Logs
//                   </Button>
//                 </div>
//                 <div className="p-4 overflow-y-auto flex-1 bg-slate-950/40 font-mono [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-md">
//                   <pre className="text-xs text-blue-400 overflow-x-auto selection:bg-blue-500/20 leading-relaxed p-2">
//                     {typeof selectedPing.jsonResponse === 'string'
//                       ? selectedPing.jsonResponse
//                       : JSON.stringify(selectedPing.jsonResponse, null, 2)}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Clear All Confirmation Modal */}
//           {showClearConfirm && (
//             <div 
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//               onClick={() => setShowClearConfirm(false)}
//             >
//               <div 
//                 className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="text-center">
//                   <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
//                     <AlertCircle className="w-6 h-6 text-red-500" />
//                   </div>
//                   <h3 className="text-lg font-bold text-foreground mb-2">Clear All Activity Logs?</h3>
//                   <p className="text-sm text-muted-foreground mb-6">
//                     This action will permanently delete all {recentPings.length} ping records for this monitor. 
//                     This cannot be undone.
//                   </p>
//                   <div className="flex gap-3 justify-center">
//                     <Button
//                       variant="outline"
//                       onClick={() => setShowClearConfirm(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       onClick={handleClearAllPings}
//                       disabled={isClearingAll}
//                     >
//                       {isClearingAll ? 'Clearing...' : 'Yes, Clear All'}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }














































// 'use client'

// import { 
//   ArrowLeft, 
//   Eye, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   AlertCircle, 
//   Zap, 
//   Server, 
//   Activity, 
//   Calendar, 
//   Globe, 
//   Hash, 
//   Cpu,
//   Copy,
//   Check,
//   Pause,
//   Play,
//   Trash2
// } from 'lucide-react'
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState, useEffect, use } from 'react'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   description: string | null
//   monitorType: string
//   method: string
//   intervalSeconds: number
//   region: string
//   timeoutMs: number
//   sslEnabled: boolean
//   isActive: boolean
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   createdAt: string
//   updatedAt: string
//   lastPingAt: string | null
//   nextPingAt: string | null
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   averageResponseMs: number
// }

// interface PingResult {
//   id: number
//   statusCode: number | null
//   responseTimeMs: number | null
//   success: boolean
//   isWakeUp: boolean
//   errorMessage: string | null
//   errorType: string | null
//   responsePreview: string | null
//   jsonResponse: any
//   createdAt: string
//   sslValid?: boolean | null
//   sslExpiryDays?: number | null
// }

// interface LatestSSLData {  
//   sslValid: boolean | null  
//   sslExpiryDays: number | null
// }

// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default function MonitorDetailPage({ params }: PageProps) {
//   const resolvedParams = use(params)
//   const monitorId = resolvedParams.id

//   const router = useRouter()
//   const { toast } = useToast()
//   const [isMobile, setIsMobile] = useState(false)

//   const [monitor, setMonitor] = useState<Monitor | null>(null)
//   const [recentPings, setRecentPings] = useState<PingResult[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
//   const [copied, setCopied] = useState(false)
//   const [isToggling, setIsToggling] = useState(false)
//   const [latestSSL, setLatestSSL] = useState<LatestSSLData | null>(null)

//   // Deletion and history state metrics
//   const [selectedPings, setSelectedPings] = useState<number[]>([]);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isClearingAll, setIsClearingAll] = useState(false);
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

//   // Helper formatting logic
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'Never'
//     return new Date(dateString).toLocaleString()
//   }

//   const getStatusBadge = (status: Monitor['status'], isActive: boolean = true) => {
//     if (!isActive) {
//       return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Pause, text: 'Paused' }
//     }
//     switch (status) {
//       case 'up':
//         return { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle, text: 'Operational' }
//       case 'down':
//         return { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle, text: 'Outage Detected' }
//       case 'waking':
//         return { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Zap, text: 'Waking Engine' }
//       case 'degraded':
//         return { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: AlertCircle, text: 'Degraded' }
//       default:
//         return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Clock, text: 'Pending Verification' }
//     }
//   }

//   // Safe global derived flags lifted up away from the temporal dead zone
//   const isPaused = monitor ? !monitor.isActive : false
//   const statusBadge = getStatusBadge(monitor?.status || 'pending', !isPaused)
//   const StatusIcon = statusBadge.icon

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Toggle selection of a ping
//   const togglePingSelection = (pingId: number) => {
//     setSelectedPings(prev => 
//       prev.includes(pingId) 
//         ? prev.filter(id => id !== pingId)
//         : [...prev, pingId]
//     );
//   };

//   // Select all pings
//   const selectAllPings = () => {
//     if (selectedPings.length === recentPings.length) {
//       setSelectedPings([]);
//     } else {
//       setSelectedPings(recentPings.map(p => p.id));
//     }
//   };


// // Safe Batch Deletion Handler
//   const handleDeleteSelected = async () => {
//     if (selectedPings.length === 0) return;
    
//     setIsDeleting(true);
//     try {
//       // Cast integers into an explicit string query sequence
//       const stringIds = selectedPings.map(id => id.toString()).join(',');
      
//       const response = await fetch(`/api/pings?ids=${stringIds}`, {
//         method: 'DELETE',
//         headers: { 'X-API-Key': apiKey }
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '✅ Pings Permanently Deleted',
//           description: `Successfully cleared logs from core database clusters.`,
//         });
        
//         // Use loose string vs number normalization to safely wipe items from state
//         setRecentPings(prev => prev.filter(ping => !selectedPings.map(Number).includes(Number(ping.id))));
//         setSelectedPings([]);
        
//         // Refresh monitor totals metadata
//         const monitorRes = await fetch(`/api/monitors/${monitorId}`, { headers: { 'X-API-Key': apiKey } });
//         if (monitorRes.ok) {
//           const monitorData = await monitorRes.json();
//           const targetNode = Array.isArray(monitorData.monitor) ? monitorData.monitor[0] : monitorData.monitor;
//           if (targetNode) setMonitor(targetNode);
//         }
//       } else {
//         toast({
//           title: '❌ Database Sync Failure',
//           description: data.error || 'The remote database engine rejected the deletion block.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ System Error',
//         description: 'Failed to dispatch deletion array sequence to backend clusters.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Safe Clear All Handler
//   const handleClearAllPings = async () => {
//     setIsClearingAll(true);
//     setShowClearConfirm(false);
    
//     try {
//       const cleanMonitorId = parseInt(monitorId.toString(), 10);
      
//       const response = await fetch(`/api/pings?action=clear-all&monitorId=${cleanMonitorId}`, {
//         method: 'DELETE',
//         headers: { 'X-API-Key': apiKey }
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '🗑️ History Erased',
//           description: `Telemetry activity history for this node cleared completely.`,
//         });
        
//         setRecentPings([]);
//         setSelectedPings([]);

//         if (monitor) {
//           setMonitor({
//             ...monitor,
//             uptimePercentage: '100.00',
//             totalPings: 0,
//             successfulPings: 0,
//             averageResponseMs: 0,
//             lastPingAt: null
//           });
//         }
//       } else {
//         toast({
//           title: '❌ Clear Action Rejected',
//           description: data.error || 'Failed to wipe data rows.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Network failure encountered while wiping monitor metrics context.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsClearingAll(false);
//     }
//   };

//   const handleCopyUrl = async (url: string) => {
//     try {
//       await navigator.clipboard.writeText(url)
//       setCopied(true)
//       toast({
//         title: '✅ URL Copied',
//         description: 'Monitor endpoint address has been copied to clipboard.',
//         duration: 2000,
//       })
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       toast({
//         title: '❌ Copy Failed',
//         description: 'Unable to copy URL to clipboard.',
//         variant: 'destructive',
//         duration: 2000,
//       })
//     }
//   }

//   const getLatestSSLData = (pings: PingResult[]) => {  
//     if (!pings || pings.length === 0) return null    
//     const pingWithSSL = pings.find(ping =>  
//       ping.sslValid !== undefined || ping.sslExpiryDays !== undefined  
//     )    
//     if (!pingWithSSL) return null    
//     return {    
//       sslValid: pingWithSSL.sslValid ?? null,    
//       sslExpiryDays: pingWithSSL.sslExpiryDays ?? null,  
//     }
//   }

//   const handleToggleMonitor = async () => {
//     if (!monitor) return
//     setIsToggling(true)
//     const newStatus = !monitor.isActive
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}`, {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//           'X-API-Key': apiKey 
//         },
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       const data = await response.json()
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus 
//             ? 'Monitoring has been reactivated. Pings will resume shortly.'
//             : 'Monitoring has been paused. No further pings will be sent.',
//         })
//         setMonitor({ ...monitor, isActive: newStatus })
//       } else {
//         toast({ 
//           title: '❌ Failed to toggle monitor', 
//           description: data.error || 'Unknown error occurred',
//           variant: 'destructive' 
//         })
//       }
//     } catch (error) {
//       toast({ 
//         title: '❌ Network error', 
//         description: 'Could not update monitor status',
//         variant: 'destructive' 
//       })
//     } finally {
//       setIsToggling(false)
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!monitorId) return

//         console.log(`📡 Detail Request Dispatched for Monitor ID: ${monitorId}`)

//         const monitorRes = await fetch(`/api/monitors/${monitorId}`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (!monitorRes.ok) {
//           const errorPayload = await monitorRes.text()
//           console.error(`❌ Server rejected request with status ${monitorRes.status}:`, errorPayload)
//           throw new Error(`Server returned HTTP Status ${monitorRes.status}`)
//         }
        
//         const monitorData = await monitorRes.json()
        
//         const targetNode = Array.isArray(monitorData.monitor) 
//           ? monitorData.monitor[0] 
//           : monitorData.monitor

//         if (!targetNode) {
//           throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
//         }
        
//         setMonitor(targetNode)

//         const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (pingsRes.ok) {
//           const pingsData = await pingsRes.json()
//           const pingsList = pingsData.pings || []
//           setRecentPings(pingsList)
//           const sslData = getLatestSSLData(pingsList)
//           setLatestSSL(sslData)
//         }
//       } catch (error: any) {
//         console.error('🚨 DETAILED PROFILE RESOLUTION EXCEPTION:', error)
//         toast({
//           title: '❌ Monitor Link Failure',
//           description: error.message || 'The requested monitor profile could not be fetched.',
//           variant: 'destructive',
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [monitorId, router, toast, apiKey])

//   const handlePingNow = async () => {
//     if (!monitor?.isActive) {
//       toast({
//         title: '⏸️ Monitor is Paused',
//         description: 'Resume the monitor before pinging.',
//         variant: 'destructive',
//       })
//       return
//     }
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}/ping`, {
//         method: 'POST',
//         headers: { 'X-API-Key': apiKey }
//       })
      
//       if (response.ok) {
//         toast({
//           title: '🔄 Ping triggered',
//           description: 'Recalibrating endpoint calculations, standing by...',
//         })
//         setTimeout(async () => {
//           const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//             headers: { 'X-API-Key': apiKey }
//           })
//           if (pingsRes.ok) {
//             const pingsData = await pingsRes.json()
//             setRecentPings(pingsData.pings || [])
//           }
//         }, 2000)
//       } else {
//         toast({
//           title: '❌ Failed to ping',
//           description: 'Could not trigger automated ping at this time',
//           variant: 'destructive',
//         })
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while executing link check.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const getPingIcon = (ping: PingResult) => {
//     if (ping.isWakeUp) return <Zap size={14} className="text-orange-500" />
//     if (ping.success) return <CheckCircle size={14} className="text-green-500" />
//     return <XCircle size={14} className="text-red-500" />
//   }

//   const getSSLWarning = (daysRemaining: number | null | undefined) => {  
//     if (daysRemaining === null || daysRemaining === undefined) return null  
//     if (daysRemaining <= 0) return { severity: 'critical', message: 'EXPIRED', color: 'bg-red-500' }  
//     if (daysRemaining <= 7) return { severity: 'critical', message: `${daysRemaining}d left`, color: 'bg-red-500' }  
//     if (daysRemaining <= 30) return { severity: 'warning', message: `${daysRemaining}d left`, color: 'bg-yellow-500' }  
//     if (daysRemaining <= 60) return { severity: 'info', message: `${daysRemaining}d left`, color: 'bg-blue-500' }  
//     return { severity: 'good', message: `${daysRemaining}d left`, color: 'bg-green-500' }
//   }

//   const formatSSLDisplay = () => {  
//     if (!monitor?.sslEnabled) {    
//       return { show: false, badgeText: 'Ignored', badgeVariant: 'secondary' as const, tooltip: 'SSL monitoring is disabled for this monitor' }  
//     }    
//     if (!latestSSL) {    
//       return { show: true, badgeText: 'Pending', badgeVariant: 'outline' as const, tooltip: 'No SSL data yet. Run a ping to check certificate.' }  
//     }    
//     if (latestSSL.sslValid === false) {    
//       return { show: true, badgeText: 'Invalid', badgeVariant: 'destructive' as const, tooltip: 'SSL certificate is invalid or expired' }  
//     }    
    
//     const warning = getSSLWarning(latestSSL.sslExpiryDays)  
//     if (warning && warning.severity === 'critical') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'destructive' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }  
//     }    
//     if (warning && warning.severity === 'warning') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'default' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }  
//     }    
//     if (latestSSL.sslValid === true) {    
//       return { show: true, badgeText: `Valid ${warning?.message ? `(${warning.message})` : ''}`, badgeVariant: 'default' as const, tooltip: `SSL certificate is valid${warning?.message ? ` and expires in ${latestSSL.sslExpiryDays} days` : ''}` }  
//     }    
//     return { show: true, badgeText: 'Unknown', badgeVariant: 'outline' as const, tooltip: 'SSL status unknown' }
//   }

//   if (isLoading) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground font-medium text-sm animate-pulse">Syncing cluster metrics...</p>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   if (!monitor) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
//             <Button onClick={() => router.push('/dashboard')} size="sm">Return to Dashboard</Button>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   return (
//     <main 
//       className="min-h-screen bg-background flex flex-col transition-all duration-200"
//       style={{ marginLeft: isMobile ? 0 : '80px' }}
//     >
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 w-full">
//         <div className="max-w-7xl mx-auto">
//           {/* Navigation Header */}
//           <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//             <div className="flex items-center gap-3">
//               <Link href="/dashboard">
//                 <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                   <ArrowLeft size={20} />
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//                   {monitor.name || 'Monitor Details'}
//                   <span className="text-primary">.</span>
//                   {isPaused && (
//                     <span className="ml-2 text-sm bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium">
//                       PAUSED
//                     </span>
//                   )}
//                 </h1>
//                 <div className="flex items-center gap-2 mt-1">
//                   <p className="text-xs font-mono text-muted-foreground select-all">{monitor.url}</p>
//                   <button
//                     onClick={() => handleCopyUrl(monitor.url)}
//                     className="p-1 rounded-md hover:bg-muted transition-colors group focus:outline-none focus:ring-2 focus:ring-primary"
//                     title="Copy URL to clipboard"
//                   >
//                     {copied ? (
//                       <Check size={12} className="text-green-500" />
//                     ) : (
//                       <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Button 
//                 onClick={handleToggleMonitor} 
//                 variant={isPaused ? "default" : "outline"}
//                 size="sm" 
//                 className={`gap-2 h-9 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'}`}
//                 disabled={isToggling}
//               >
//                 {isToggling ? (
//                   <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
//                 ) : isPaused ? (
//                   <Play size={14} />
//                 ) : (
//                   <Pause size={14} />
//                 )}
//                 {isToggling ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
//               </Button>

//               <Button 
//                 onClick={handlePingNow} 
//                 variant="outline" 
//                 size="sm" 
//                 className="gap-2 h-9"
//                 disabled={isPaused}
//               >
//                 <Zap size={14} />
//                 Ping Now
//               </Button>

//               <Link href={`/monitors/${monitor.id}/edit`}>
//                 <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//                   Edit Monitor
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Status Overview Cards */}
//           <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
//                 <Activity size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
//                   <StatusIcon size={13} />
//                   {statusBadge.text}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-2.5">
//                   Last check: {formatDate(monitor.lastPingAt)}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
//                 <Server size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
//                 <Clock size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
//                 <Calendar size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">
//                   {monitor.intervalSeconds >= 60 
//                     ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
//                     : `${monitor.intervalSeconds}s`}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Next scheduled trigger: {isPaused ? 'Paused' : formatDate(monitor.nextPingAt)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Monitor Configuration Details & Activity Logs */}
//           <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
//                 <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-1 text-xs">
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Hash size={13} /> Monitor ID
//                   </span>
//                   <span className="font-mono font-bold text-foreground">{monitor.id}</span>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Globe size={13} /> Request Method
//                   </span>
//                   <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Cpu size={13} /> Node Region
//                   </span>
//                   <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
//                 </div>
                
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Eye size={13} /> SSL Certificate
//                   </span>
//                   {(() => {
//                     const sslDisplay = formatSSLDisplay()
//                     if (!sslDisplay.show && !monitor?.sslEnabled) {
//                       return (
//                         <Badge variant="secondary" className="font-semibold text-[10px] px-2 h-5">
//                           Ignored
//                         </Badge>
//                       )
//                     }
//                     return (
//                       <div className="flex items-center gap-2">
//                         <Badge variant={sslDisplay.badgeVariant} className="font-semibold text-[10px] px-2 h-5">
//                           {sslDisplay.badgeText}
//                         </Badge>
//                         {latestSSL?.sslExpiryDays !== null && latestSSL?.sslExpiryDays !== undefined && latestSSL.sslExpiryDays <= 30 && (
//                           <span className="text-[10px] text-amber-500 font-medium animate-pulse">
//                             ⚠️ Expiring soon
//                           </span>
//                         )}
//                       </div>
//                     )
//                   })()}
//                 </div>

//                 <div className="flex justify-between py-2.5">
//                   <span className="text-muted-foreground font-medium">Description</span>
//                   <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
//                 </div>
                
//                 {/* Active Status Row */}
//                 <div className="flex justify-between py-2.5 pt-3 border-t border-border/60 mt-1">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     {isPaused ? <Play size={13} /> : <Pause size={13} />} Monitor State
//                   </span>
//                   <Badge variant={isPaused ? "secondary" : "default"} className="font-semibold text-[10px] px-2 h-5">
//                     {isPaused ? 'Paused' : 'Active'}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <div className="flex items-center justify-between flex-wrap gap-2">
//                   <div className="flex items-center gap-2.5">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
//                         {/* Dynamic Counter Display */}
//                         <span className="bg-muted text-muted-foreground text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-border/80">
//                           {recentPings.length}
//                         </span>
//                       </div>
//                       <CardDescription className="text-xs mt-0.5">
//                         {isPaused 
//                           ? 'Monitoring is paused. No new logs will appear until resumed.' 
//                           : 'Telemetry results tracking health checks'}
//                       </CardDescription>
//                     </div>
//                   </div>
//                   {/* Modernized Neon Glowing Clear Button */}
//                   {!isPaused && recentPings.length > 0 && (
//                     <button
//                       type="button"
//                       onClick={() => setShowClearConfirm(true)}
//                       disabled={isClearingAll}
//                       className="px-3 py-1 text-xs rounded-md bg-transparent border border-red-500/40 text-red-400 font-semibold tracking-wide transition-all duration-300 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.35)] focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none"
//                     >
//                       {isClearingAll ? 'Clearing...' : 'Clear All'}
//                     </button>
//                   )}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {recentPings.length === 0 ? (
//                   <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
//                     <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
//                     <p className="text-[11px] text-muted-foreground/60 mt-0.5">
//                       {isPaused 
//                         ? 'Resume monitoring to start collecting data.' 
//                         : 'Execute an on-demand "Ping Now" pulse to establish metrics.'}
//                     </p>
//                   </div>
//                 ) : (
//                   <>
//                     {/* Selection Sub-Header */}
//                     <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60 min-h-[36px]">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={selectedPings.length === recentPings.length && recentPings.length > 0}
//                           onChange={selectAllPings}
//                           className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary cursor-pointer"
//                         />
//                         <span className="text-xs text-muted-foreground font-medium">
//                           {selectedPings.length === 0 
//                             ? 'Select All' 
//                             : `${selectedPings.length} Selected`}
//                         </span>
//                       </div>
                      
//                       {/* Modernized Neon Glowing Delete Button */}
//                       <div className={`transition-all duration-300 transform ${selectedPings.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
//                         <button
//                           type="button"
//                           onClick={handleDeleteSelected}
//                           disabled={isDeleting}
//                           className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-md bg-red-600 font-bold text-white tracking-wide transition-all duration-300 hover:bg-red-500 shadow-[0_0_12px_rgba(220,38,38,0.3)] hover:shadow-[0_0_18px_rgba(239,68,68,0.6)] focus:outline-none focus:ring-2 focus:ring-red-500/50"
//                         >
//                           <Trash2 size={12} />
//                           {isDeleting ? 'Deleting...' : `Delete (${selectedPings.length})`}
//                         </button>
//                       </div>
//                     </div>
                    
//                     {/* Dark Scrollbar Viewport container targeting background layer manually */}
//                     <div className="space-y-2 max-h-80 overflow-y-auto pr-1 bg-card rounded-md [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-md hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
//                       {recentPings.map((ping) => (
//                         <div
//                           key={ping.id}
//                           className={`flex items-center gap-2 p-2.5 rounded-lg bg-card border transition-all duration-150 group ${
//                             selectedPings.includes(ping.id) 
//                               ? 'border-primary/50 bg-primary/5' 
//                               : 'border-border hover:bg-accent/40 hover:border-primary/20'
//                           }`}
//                         >
//                           {/* Checkbox item */}
//                           <input
//                             type="checkbox"
//                             checked={selectedPings.includes(ping.id)}
//                             onChange={() => togglePingSelection(ping.id)}
//                             className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary flex-shrink-0 cursor-pointer"
//                             onClick={(e) => e.stopPropagation()}
//                           />
                          
//                           {/* Clickable panel */}
//                           <div 
//                             className="flex items-center justify-between flex-1 cursor-pointer"
//                             onClick={() => setSelectedPing(ping)}
//                           >
//                             <div className="flex items-center gap-2.5 min-w-0">
//                               <div className="transition-transform group-hover:scale-105">
//                                 {getPingIcon(ping)}
//                               </div>
//                               <div className="min-w-0">
//                                 <p className="text-xs font-bold text-foreground">
//                                   {ping.success ? 'Healthy Connection' : 'Outage Event'}
//                                   {ping.isWakeUp && <span className="text-[10px] text-orange-400 font-medium ml-1">🌙 Wake</span>}
//                                 </p>
//                                 <p className="text-[10px] text-muted-foreground mt-0.5">
//                                   {formatDate(ping.createdAt)}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="text-right flex-shrink-0 font-mono">
//                               {ping.responseTimeMs !== null && (
//                                 <p className="text-xs font-bold text-foreground/90">{ping.responseTimeMs}ms</p>
//                               )}
//                               {ping.statusCode && (
//                                 <p className={`text-[10px] font-medium ${ping.success ? 'text-muted-foreground' : 'text-red-400'}`}>
//                                   HTTP {ping.statusCode}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* JSON Response Viewer Backdrop Overlay Modal */}
//           {selectedPing && selectedPing.jsonResponse && (
//             <div 
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//               onClick={() => setSelectedPing(null)}
//             >
//               <div 
//                 className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden" 
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
//                   <div>
//                     <h3 className="text-sm font-bold tracking-tight text-foreground">JSON Response Stream</h3>
//                     <p className="text-[11px] text-muted-foreground mt-0.5">Historic event parameters mapped for Node reference #{selectedPing.id}</p>
//                   </div>
//                   <Button type="button" variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setSelectedPing(null)}>
//                     Close Logs
//                   </Button>
//                 </div>
//                 <div className="p-4 overflow-y-auto flex-1 bg-slate-950/40 font-mono [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-md">
//                   <pre className="text-xs text-blue-400 overflow-x-auto selection:bg-blue-500/20 leading-relaxed p-2">
//                     {typeof selectedPing.jsonResponse === 'string'
//                       ? selectedPing.jsonResponse
//                       : JSON.stringify(selectedPing.jsonResponse, null, 2)}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Clear All Confirmation Modal */}
//           {showClearConfirm && (
//             <div 
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//               onClick={() => setShowClearConfirm(false)}
//             >
//               <div 
//                 className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="text-center">
//                   <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
//                     <AlertCircle className="w-6 h-6 text-red-500" />
//                   </div>
//                   <h3 className="text-lg font-bold text-foreground mb-2">Clear All Activity Logs?</h3>
//                   <p className="text-sm text-muted-foreground mb-6">
//                     This action will permanently delete all {recentPings.length} ping records for this monitor. 
//                     This cannot be undone.
//                   </p>
//                   <div className="flex gap-3 justify-center">
//                     <Button
//                       variant="outline"
//                       onClick={() => setShowClearConfirm(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       onClick={handleClearAllPings}
//                       disabled={isClearingAll}
//                     >
//                       {isClearingAll ? 'Clearing...' : 'Yes, Clear All'}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }




























































// 'use client'

// import { 
//   ArrowLeft, 
//   Eye, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   AlertCircle, 
//   Zap, 
//   Server, 
//   Activity, 
//   Calendar, 
//   Globe, 
//   Hash, 
//   Cpu,
//   Copy,
//   Check,
//   Pause,
//   Play,
//   Trash2
// } from 'lucide-react'
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState, useEffect, use } from 'react'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   description: string | null
//   monitorType: string
//   method: string
//   intervalSeconds: number
//   region: string
//   timeoutMs: number
//   sslEnabled: boolean
//   isActive: boolean
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   createdAt: string
//   updatedAt: string
//   lastPingAt: string | null
//   nextPingAt: string | null
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   averageResponseMs: number
// }

// interface PingResult {
//   id: number
//   statusCode: number | null
//   responseTimeMs: number | null
//   success: boolean
//   isWakeUp: boolean
//   errorMessage: string | null
//   errorType: string | null
//   responsePreview: string | null
//   jsonResponse: any
//   createdAt: string
//   sslValid?: boolean | null
//   sslExpiryDays?: number | null
// }

// interface LatestSSLData {  
//   sslValid: boolean | null  
//   sslExpiryDays: number | null
// }

// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default function MonitorDetailPage({ params }: PageProps) {
//   const resolvedParams = use(params)
//   const monitorId = resolvedParams.id

//   const router = useRouter()
//   const { toast } = useToast()
//   const [isMobile, setIsMobile] = useState(false)

//   const [monitor, setMonitor] = useState<Monitor | null>(null)
//   const [recentPings, setRecentPings] = useState<PingResult[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
//   const [copied, setCopied] = useState(false)
//   const [isToggling, setIsToggling] = useState(false)
//   const [latestSSL, setLatestSSL] = useState<LatestSSLData | null>(null)

//   // Deletion and history state metrics
//   const [selectedPings, setSelectedPings] = useState<number[]>([]);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isClearingAll, setIsClearingAll] = useState(false);
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

//   // Helper formatting logic
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'Never'
//     return new Date(dateString).toLocaleString()
//   }

//   const getStatusBadge = (status: Monitor['status'], isActive: boolean = true) => {
//     if (!isActive) {
//       return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Pause, text: 'Paused' }
//     }
//     switch (status) {
//       case 'up':
//         return { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle, text: 'Operational' }
//       case 'down':
//         return { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle, text: 'Outage Detected' }
//       case 'waking':
//         return { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Zap, text: 'Waking Engine' }
//       case 'degraded':
//         return { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: AlertCircle, text: 'Degraded' }
//       default:
//         return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Clock, text: 'Pending Verification' }
//     }
//   }

//   // Safe global derived flags lifted up away from the temporal dead zone
//   const isPaused = monitor ? !monitor.isActive : false
//   const statusBadge = getStatusBadge(monitor?.status || 'pending', !isPaused)
//   const StatusIcon = statusBadge.icon

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Toggle selection of a ping
//   const togglePingSelection = (pingId: number) => {
//     setSelectedPings(prev => 
//       prev.includes(pingId) 
//         ? prev.filter(id => id !== pingId)
//         : [...prev, pingId]
//     );
//   };

//   // Select all pings
//   const selectAllPings = () => {
//     if (selectedPings.length === recentPings.length) {
//       setSelectedPings([]);
//     } else {
//       setSelectedPings(recentPings.map(p => p.id));
//     }
//   };

//   // 🔄 Automated background runner to load older logs immediately into screen space
//   const fetchRecentPings = async () => {
//     try {
//       const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//         headers: { 'X-API-Key': apiKey }
//       });
//       if (pingsRes.ok) {
//         const pingsData = await pingsRes.json();
//         setRecentPings(pingsData.pings || []);
//       }
//     } catch (error) {
//       console.error("Failed to re-fetch logs:", error);
//     }
//   };

//   // Safe Batch Deletion Handler
//   const handleDeleteSelected = async () => {
//     if (selectedPings.length === 0) return;
    
//     setIsDeleting(true);
//     try {
//       // Cast integers into an explicit string query sequence
//       const stringIds = selectedPings.map(id => id.toString()).join(',');
      
//       const response = await fetch(`/api/pings?ids=${stringIds}`, {
//         method: 'DELETE',
//         headers: { 'X-API-Key': apiKey }
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '✅ Pings Permanently Deleted',
//           description: `Successfully cleared logs from core database clusters.`,
//         });
        
//         // 1. Clear out active checkbox checked reference arrays
//         setSelectedPings([]);
        
//         // 2. 🔄 Pull fresh entries down from the database window immediately
//         await fetchRecentPings();
        
//         // 3. Refresh monitor totals metadata card stats
//         const monitorRes = await fetch(`/api/monitors/${monitorId}`, { headers: { 'X-API-Key': apiKey } });
//         if (monitorRes.ok) {
//           const monitorData = await monitorRes.json();
//           const targetNode = Array.isArray(monitorData.monitor) ? monitorData.monitor[0] : monitorData.monitor;
//           if (targetNode) setMonitor(targetNode);
//         }
//       } else {
//         toast({
//           title: '❌ Database Sync Failure',
//           description: data.error || 'The remote database engine rejected the deletion block.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ System Error',
//         description: 'Failed to dispatch deletion array sequence to backend clusters.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Safe Clear All Handler
//   const handleClearAllPings = async () => {
//     setIsClearingAll(true);
//     setShowClearConfirm(false);
    
//     try {
//       const cleanMonitorId = parseInt(monitorId.toString(), 10);
      
//       const response = await fetch(`/api/pings?action=clear-all&monitorId=${cleanMonitorId}`, {
//         method: 'DELETE',
//         headers: { 'X-API-Key': apiKey }
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '🗑️ History Erased',
//           description: `Telemetry activity history for this node cleared completely.`,
//         });
        
//         setRecentPings([]);
//         setSelectedPings([]);

//         if (monitor) {
//           setMonitor({
//             ...monitor,
//             uptimePercentage: '100.00',
//             totalPings: 0,
//             successfulPings: 0,
//             averageResponseMs: 0,
//             lastPingAt: null
//           });
//         }
//       } else {
//         toast({
//           title: '❌ Clear Action Rejected',
//           description: data.error || 'Failed to wipe data rows.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Network failure encountered while wiping monitor metrics context.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsClearingAll(false);
//     }
//   };

//   const handleCopyUrl = async (url: string) => {
//     try {
//       await navigator.clipboard.writeText(url)
//       setCopied(true)
//       toast({
//         title: '✅ URL Copied',
//         description: 'Monitor endpoint address has been copied to clipboard.',
//         duration: 2000,
//       })
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       toast({
//         title: '❌ Copy Failed',
//         description: 'Unable to copy URL to clipboard.',
//         variant: 'destructive',
//         duration: 2000,
//       })
//     }
//   }

//   const getLatestSSLData = (pings: PingResult[]) => {  
//     if (!pings || pings.length === 0) return null    
//     const pingWithSSL = pings.find(ping =>  
//       ping.sslValid !== undefined || ping.sslExpiryDays !== undefined  
//     )    
//     if (!pingWithSSL) return null    
//     return {    
//       sslValid: pingWithSSL.sslValid ?? null,    
//       sslExpiryDays: pingWithSSL.sslExpiryDays ?? null,  
//     }
//   }

//   const handleToggleMonitor = async () => {
//     if (!monitor) return
//     setIsToggling(true)
//     const newStatus = !monitor.isActive
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}`, {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//           'X-API-Key': apiKey 
//         },
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       const data = await response.json()
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus 
//             ? 'Monitoring has been reactivated. Pings will resume shortly.'
//             : 'Monitoring has been paused. No further pings will be sent.',
//         })
//         setMonitor({ ...monitor, isActive: newStatus })
//       } else {
//         toast({ 
//           title: '❌ Failed to toggle monitor', 
//           description: data.error || 'Unknown error occurred',
//           variant: 'destructive' 
//         })
//       }
//     } catch (error) {
//       toast({ 
//         title: '❌ Network error', 
//         description: 'Could not update monitor status',
//         variant: 'destructive' 
//       })
//     } finally {
//       setIsToggling(false)
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!monitorId) return

//         console.log(`📡 Detail Request Dispatched for Monitor ID: ${monitorId}`)

//         const monitorRes = await fetch(`/api/monitors/${monitorId}`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (!monitorRes.ok) {
//           const errorPayload = await monitorRes.text()
//           console.error(`❌ Server rejected request with status ${monitorRes.status}:`, errorPayload)
//           throw new Error(`Server returned HTTP Status ${monitorRes.status}`)
//         }
        
//         const monitorData = await monitorRes.json()
        
//         const targetNode = Array.isArray(monitorData.monitor) 
//           ? monitorData.monitor[0] 
//           : monitorData.monitor

//         if (!targetNode) {
//           throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
//         }
        
//         setMonitor(targetNode)

//         const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (pingsRes.ok) {
//           const pingsData = await pingsRes.json()
//           const pingsList = pingsData.pings || []
//           setRecentPings(pingsList)
//           const sslData = getLatestSSLData(pingsList)
//           setLatestSSL(sslData)
//         }
//       } catch (error: any) {
//         console.error('🚨 DETAILED PROFILE RESOLUTION EXCEPTION:', error)
//         toast({
//           title: '❌ Monitor Link Failure',
//           description: error.message || 'The requested monitor profile could not be fetched.',
//           variant: 'destructive',
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [monitorId, router, toast, apiKey])

//   const handlePingNow = async () => {
//     if (!monitor?.isActive) {
//       toast({
//         title: '⏸️ Monitor is Paused',
//         description: 'Resume the monitor before pinging.',
//         variant: 'destructive',
//       })
//       return
//     }
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}/ping`, {
//         method: 'POST',
//         headers: { 'X-API-Key': apiKey }
//       })
      
//       if (response.ok) {
//         toast({
//           title: '🔄 Ping triggered',
//           description: 'Recalibrating endpoint calculations, standing by...',
//         })
//         setTimeout(async () => {
//           const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//             headers: { 'X-API-Key': apiKey }
//           })
//           if (pingsRes.ok) {
//             const pingsData = await pingsRes.json()
//             setRecentPings(pingsData.pings || [])
//           }
//         }, 2000)
//       } else {
//         toast({
//           title: '❌ Failed to ping',
//           description: 'Could not trigger automated ping at this time',
//           variant: 'destructive',
//         })
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while executing link check.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const getPingIcon = (ping: PingResult) => {
//     if (ping.isWakeUp) return <Zap size={14} className="text-orange-500" />
//     if (ping.success) return <CheckCircle size={14} className="text-green-500" />
//     return <XCircle size={14} className="text-red-500" />
//   }

//   const getSSLWarning = (daysRemaining: number | null | undefined) => {  
//     if (daysRemaining === null || daysRemaining === undefined) return null  
//     if (daysRemaining <= 0) return { severity: 'critical', message: 'EXPIRED', color: 'bg-red-500' }  
//     if (daysRemaining <= 7) return { severity: 'critical', message: `${daysRemaining}d left`, color: 'bg-red-500' }  
//     if (daysRemaining <= 30) return { severity: 'warning', message: `${daysRemaining}d left`, color: 'bg-yellow-500' }  
//     if (daysRemaining <= 60) return { severity: 'info', message: `${daysRemaining}d left`, color: 'bg-blue-500' }  
//     return { severity: 'good', message: `${daysRemaining}d left`, color: 'bg-green-500' }
//   }

//   const formatSSLDisplay = () => {  
//     if (!monitor?.sslEnabled) {    
//       return { show: false, badgeText: 'Ignored', badgeVariant: 'secondary' as const, tooltip: 'SSL monitoring is disabled for this monitor' }    
//     }    
//     if (!latestSSL) {    
//       return { show: true, badgeText: 'Pending', badgeVariant: 'outline' as const, tooltip: 'No SSL data yet. Run a ping to check certificate.' }    
//     }    
//     if (latestSSL.sslValid === false) {    
//       return { show: true, badgeText: 'Invalid', badgeVariant: 'destructive' as const, tooltip: 'SSL certificate is invalid or expired' }    
//     }    
    
//     const warning = getSSLWarning(latestSSL.sslExpiryDays)  
//     if (warning && warning.severity === 'critical') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'destructive' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }    
//     }    
//     if (warning && warning.severity === 'warning') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'default' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }    
//     }    
//     if (latestSSL.sslValid === true) {    
//       return { show: true, badgeText: `Valid ${warning?.message ? `(${warning.message})` : ''}`, badgeVariant: 'default' as const, tooltip: `SSL certificate is valid${warning?.message ? ` and expires in ${latestSSL.sslExpiryDays} days` : ''}` }    
//     }    
//     return { show: true, badgeText: 'Unknown', badgeVariant: 'outline' as const, tooltip: 'SSL status unknown' }
//   }

//   if (isLoading) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground font-medium text-sm animate-pulse">Syncing cluster metrics...</p>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   if (!monitor) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
//             <Button onClick={() => router.push('/dashboard')} size="sm">Return to Dashboard</Button>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   return (
//     <main 
//       className="min-h-screen bg-background flex flex-col transition-all duration-200"
//       style={{ marginLeft: isMobile ? 0 : '80px' }}
//     >
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 w-full">
//         <div className="max-w-7xl mx-auto">
//           {/* Navigation Header */}
//           <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//             <div className="flex items-center gap-3">
//               <Link href="/dashboard">
//                 <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                   <ArrowLeft size={20} />
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//                   {monitor.name || 'Monitor Details'}
//                   <span className="text-primary">.</span>
//                   {isPaused && (
//                     <span className="ml-2 text-sm bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium">
//                       PAUSED
//                     </span>
//                   )}
//                 </h1>
//                 <div className="flex items-center gap-2 mt-1">
//                   <p className="text-xs font-mono text-muted-foreground select-all">{monitor.url}</p>
//                   <button
//                     onClick={() => handleCopyUrl(monitor.url)}
//                     className="p-1 rounded-md hover:bg-muted transition-colors group focus:outline-none focus:ring-2 focus:ring-primary"
//                     title="Copy URL to clipboard"
//                   >
//                     {copied ? (
//                       <Check size={12} className="text-green-500" />
//                     ) : (
//                       <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Button 
//                 onClick={handleToggleMonitor} 
//                 variant={isPaused ? "default" : "outline"}
//                 size="sm" 
//                 className={`gap-2 h-9 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'}`}
//                 disabled={isToggling}
//               >
//                 {isToggling ? (
//                   <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
//                 ) : isPaused ? (
//                   <Play size={14} />
//                 ) : (
//                   <Pause size={14} />
//                 )}
//                 {isToggling ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
//               </Button>

//               <Button 
//                 onClick={handlePingNow} 
//                 variant="outline" 
//                 size="sm" 
//                 className="gap-2 h-9"
//                 disabled={isPaused}
//               >
//                 <Zap size={14} />
//                 Ping Now
//               </Button>

//               <Link href={`/monitors/${monitor.id}/edit`}>
//                 <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//                   Edit Monitor
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Status Overview Cards */}
//           <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
//                 <Activity size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
//                   <StatusIcon size={13} />
//                   {statusBadge.text}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-2.5">
//                   Last check: {formatDate(monitor.lastPingAt)}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
//                 <Server size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
//                 <Clock size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
//                 <Calendar size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">
//                   {monitor.intervalSeconds >= 60 
//                     ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
//                     : `${monitor.intervalSeconds}s`}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Next scheduled trigger: {isPaused ? 'Paused' : formatDate(monitor.nextPingAt)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Monitor Configuration Details & Activity Logs */}
//           <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
//                 <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-1 text-xs">
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Hash size={13} /> Monitor ID
//                   </span>
//                   <span className="font-mono font-bold text-foreground">{monitor.id}</span>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Globe size={13} /> Request Method
//                   </span>
//                   <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Cpu size={13} /> Node Region
//                   </span>
//                   <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
//                 </div>
                
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Eye size={13} /> SSL Certificate
//                   </span>
//                   {(() => {
//                     const sslDisplay = formatSSLDisplay()
//                     if (!sslDisplay.show && !monitor?.sslEnabled) {
//                       return (
//                         <Badge variant="secondary" className="font-semibold text-[10px] px-2 h-5">
//                           Ignored
//                         </Badge>
//                       )
//                     }
//                     return (
//                       <div className="flex items-center gap-2">
//                         <Badge variant={sslDisplay.badgeVariant} className="font-semibold text-[10px] px-2 h-5">
//                           {sslDisplay.badgeText}
//                         </Badge>
//                         {latestSSL?.sslExpiryDays !== null && latestSSL?.sslExpiryDays !== undefined && latestSSL.sslExpiryDays <= 30 && (
//                           <span className="text-[10px] text-amber-500 font-medium animate-pulse">
//                             ⚠️ Expiring soon
//                           </span>
//                         )}
//                       </div>
//                     )
//                   })()}
//                 </div>

//                 <div className="flex justify-between py-2.5">
//                   <span className="text-muted-foreground font-medium">Description</span>
//                   <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
//                 </div>
                
//                 {/* Active Status Row */}
//                 <div className="flex justify-between py-2.5 pt-3 border-t border-border/60 mt-1">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     {isPaused ? <Play size={13} /> : <Pause size={13} />} Monitor State
//                   </span>
//                   <Badge variant={isPaused ? "secondary" : "default"} className="font-semibold text-[10px] px-2 h-5">
//                     {isPaused ? 'Paused' : 'Active'}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <div className="flex items-center justify-between flex-wrap gap-2">
//                   <div className="flex items-center gap-2.5">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
//                         <span className="bg-muted text-muted-foreground text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-border/80">
//                           {recentPings.length}
//                         </span>
//                       </div>
//                       <CardDescription className="text-xs mt-0.5">
//                         {isPaused 
//                           ? 'Monitoring is paused. No new logs will appear until resumed.' 
//                           : 'Telemetry results tracking health checks'}
//                       </CardDescription>
//                     </div>
//                   </div>
//                   {!isPaused && recentPings.length > 0 && (
//                     <button
//                       type="button"
//                       onClick={() => setShowClearConfirm(true)}
//                       disabled={isClearingAll}
//                       className="px-3 py-1 text-xs rounded-md bg-transparent border border-red-500/40 text-red-400 font-semibold tracking-wide transition-all duration-300 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.35)] focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none"
//                     >
//                       {isClearingAll ? 'Clearing...' : 'Clear All'}
//                     </button>
//                   )}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {recentPings.length === 0 ? (
//                   <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
//                     <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
//                     <p className="text-[11px] text-muted-foreground/60 mt-0.5">
//                       {isPaused 
//                         ? 'Resume monitoring to start collecting data.' 
//                         : 'Execute an on-demand "Ping Now" pulse to establish metrics.'}
//                     </p>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60 min-h-[36px]">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={selectedPings.length === recentPings.length && recentPings.length > 0}
//                           onChange={selectAllPings}
//                           className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary cursor-pointer"
//                         />
//                         <span className="text-xs text-muted-foreground font-medium">
//                           {selectedPings.length === 0 
//                             ? 'Select All' 
//                             : `${selectedPings.length} Selected`}
//                         </span>
//                       </div>
                      
//                       {selectedPings.length > 0 && (
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={handleDeleteSelected}
//                           disabled={isDeleting}
//                           className="h-7 text-xs px-2.5 bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-1.5"
//                         >
//                           <Trash2 size={12} />
//                           {isDeleting ? 'Dropping...' : 'Delete Selected'}
//                         </Button>
//                       )}
//                     </div>

//                     {/* Confirmation Overlay Modal for Clearing Wipes */}
//                     {showClearConfirm && (
//                       <div className="mb-4 p-3 border border-red-500/30 rounded-lg bg-red-500/5 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
//                         <p className="font-bold text-red-400 flex items-center gap-1.5 mb-1">
//                           <AlertCircle size={14} /> Critical Action Confirmation
//                         </p>
//                         <p className="text-muted-foreground mb-2.5">
//                           Are you sure you want to completely erase the heartbeat history metrics for this monitor? This action cannot be reversed.
//                         </p>
//                         <div className="flex gap-2 justify-end">
//                           <Button 
//                             variant="ghost" 
//                             size="sm" 
//                             className="h-7 text-xs text-muted-foreground"
//                             onClick={() => setShowClearConfirm(false)}
//                           >
//                             Cancel
//                           </Button>
//                           <Button 
//                             variant="destructive" 
//                             size="sm" 
//                             className="h-7 text-xs bg-red-600 text-white hover:bg-red-700"
//                             onClick={handleClearAllPings}
//                           >
//                             Confirm Purge
//                           </Button>
//                         </div>
//                       </div>
//                     )}

//                     {/* Interactive Telemetry Log Table Feed */}
//                     <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
//                       {recentPings.map((ping) => {
//                         const isChecked = selectedPings.includes(ping.id);
//                         return (
//                           <div 
//                             key={ping.id}
//                             onClick={() => setSelectedPing(ping)}
//                             className={`flex items-center justify-between p-2.5 rounded-md border text-xs transition-all cursor-pointer group select-none ${
//                               isChecked 
//                                 ? 'bg-primary/5 border-primary/40 shadow-[0_0_8px_rgba(var(--primary),0.05)]' 
//                                 : 'bg-card/50 border-border/60 hover:bg-muted/40 hover:border-border'
//                             }`}
//                           >
//                             <div className="flex items-center gap-3 min-w-0">
//                               <input
//                                 type="checkbox"
//                                 checked={isChecked}
//                                 onClick={(e) => e.stopPropagation()}
//                                 onChange={() => togglePingSelection(ping.id)}
//                                 className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary cursor-pointer"
//                               />
//                               <div className="p-1 rounded bg-background border border-border/40 shrink-0">
//                                 {getPingIcon(ping)}
//                               </div>
//                               <div className="min-w-0">
//                                 <div className="flex items-center gap-2">
//                                   <span className={`font-mono font-bold ${ping.success ? 'text-green-500' : 'text-red-500'}`}>
//                                     {ping.statusCode || (ping.isWakeUp ? 'WAKE' : 'ERR')}
//                                   </span>
//                                   <span className="text-muted-foreground/40 font-light">|</span>
//                                   <span className="font-mono text-[11px] text-foreground font-semibold">
//                                     {ping.responseTimeMs !== null ? `${ping.responseTimeMs}ms` : '---'}
//                                   </span>
//                                 </div>
//                                 <p className="text-[10px] text-muted-foreground/80 mt-0.5 truncate font-medium">
//                                   {formatDate(ping.createdAt)}
//                                 </p>
//                               </div>
//                             </div>

//                             <div className="flex items-center gap-2 shrink-0">
//                               {!ping.success && ping.errorType && (
//                                 <Badge variant="destructive" className="text-[9px] px-1.5 py-0 font-mono tracking-tight shrink-0">
//                                   {ping.errorType}
//                                 </Badge>
//                               )}
//                               <ArrowLeft size={12} className="text-muted-foreground/0 -translate-x-1 group-hover:text-muted-foreground/60 group-hover:translate-x-0 transition-all duration-200" />
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }













































// 'use client'

// import { 
//   ArrowLeft, 
//   Eye, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   AlertCircle, 
//   Zap, 
//   Server, 
//   Activity, 
//   Calendar, 
//   Globe, 
//   Hash, 
//   Cpu,
//   Copy,
//   Check,
//   Pause,
//   Play,
//   Trash2,
//   X,
//   FileCode
// } from 'lucide-react'
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState, useEffect, use } from 'react'

// interface Monitor {
//   id: number
//   name: string
//   url: string
//   description: string | null
//   monitorType: string
//   method: string
//   intervalSeconds: number
//   region: string
//   timeoutMs: number
//   sslEnabled: boolean
//   isActive: boolean
//   status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
//   createdAt: string
//   updatedAt: string
//   lastPingAt: string | null
//   nextPingAt: string | null
//   uptimePercentage: string
//   totalPings: number
//   successfulPings: number
//   averageResponseMs: number
// }

// interface PingResult {
//   id: number
//   statusCode: number | null
//   responseTimeMs: number | null
//   success: boolean
//   isWakeUp: boolean
//   errorMessage: string | null
//   errorType: string | null
//   responsePreview: string | null
//   jsonResponse: any
//   createdAt: string
//   sslValid?: boolean | null
//   sslExpiryDays?: number | null
// }

// interface LatestSSLData {  
//   sslValid: boolean | null  
//   sslExpiryDays: number | null
// }

// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default function MonitorDetailPage({ params }: PageProps) {
//   const resolvedParams = use(params)
//   const monitorId = resolvedParams.id

//   const router = useRouter()
//   const { toast } = useToast()
//   const [isMobile, setIsMobile] = useState(false)

//   const [monitor, setMonitor] = useState<Monitor | null>(null)
//   const [recentPings, setRecentPings] = useState<PingResult[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
//   const [copied, setCopied] = useState(false)
//   const [isToggling, setIsToggling] = useState(false)
//   const [latestSSL, setLatestSSL] = useState<LatestSSLData | null>(null)

//   // Deletion and history state metrics
//   const [selectedPings, setSelectedPings] = useState<number[]>([]);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isClearingAll, setIsClearingAll] = useState(false);
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

//   // Helper formatting logic
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'Never'
//     return new Date(dateString).toLocaleString()
//   }

//   const getStatusBadge = (status: Monitor['status'], isActive: boolean = true) => {
//     if (!isActive) {
//       return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Pause, text: 'Paused' }
//     }
//     switch (status) {
//       case 'up':
//         return { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle, text: 'Operational' }
//       case 'down':
//         return { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle, text: 'Outage Detected' }
//       case 'waking':
//         return { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Zap, text: 'Waking Engine' }
//       case 'degraded':
//         return { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: AlertCircle, text: 'Degraded' }
//       default:
//         return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Clock, text: 'Pending Verification' }
//     }
//   }

//   // Safe global derived flags lifted up away from the temporal dead zone
//   const isPaused = monitor ? !monitor.isActive : false
//   const statusBadge = getStatusBadge(monitor?.status || 'pending', !isPaused)
//   const StatusIcon = statusBadge.icon

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Toggle selection of a ping
//   const togglePingSelection = (pingId: number) => {
//     setSelectedPings(prev => 
//       prev.includes(pingId) 
//         ? prev.filter(id => id !== pingId)
//         : [...prev, pingId]
//     );
//   };

//   // Select all pings
//   const selectAllPings = () => {
//     if (selectedPings.length === recentPings.length) {
//       setSelectedPings([]);
//     } else {
//       setSelectedPings(recentPings.map(p => p.id));
//     }
//   };

//   // 🔄 Automated background runner updated to pull down up to 100 records per cascade loop
//   const fetchRecentPings = async () => {
//     try {
//       const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=100`, {
//         headers: { 'X-API-Key': apiKey }
//       });
//       if (pingsRes.ok) {
//         const pingsData = await pingsRes.json();
//         setRecentPings(pingsData.pings || []);
//       }
//     } catch (error) {
//       console.error("Failed to re-fetch logs:", error);
//     }
//   };

//   // Safe Batch Deletion Handler
//   const handleDeleteSelected = async () => {
//     if (selectedPings.length === 0) return;
    
//     setIsDeleting(true);
//     try {
//       const stringIds = selectedPings.map(id => id.toString()).join(',');
      
//       const response = await fetch(`/api/pings?ids=${stringIds}`, {
//         method: 'DELETE',
//         headers: { 'X-API-Key': apiKey }
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '✅ Pings Permanently Deleted',
//           description: `Successfully cleared logs from core database clusters.`,
//         });
        
//         // 1. Reset check references
//         setSelectedPings([]);
        
//         // 2. 🔄 Cascaded loader populates the active window from DB pool
//         await fetchRecentPings();
        
//         // 3. Refresh monitor totals metadata card stats
//         const monitorRes = await fetch(`/api/monitors/${monitorId}`, { headers: { 'X-API-Key': apiKey } });
//         if (monitorRes.ok) {
//           const monitorData = await monitorRes.json();
//           const targetNode = Array.isArray(monitorData.monitor) ? monitorData.monitor[0] : monitorData.monitor;
//           if (targetNode) setMonitor(targetNode);
//         }
//       } else {
//         toast({
//           title: '❌ Database Sync Failure',
//           description: data.error || 'The remote database engine rejected the deletion block.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ System Error',
//         description: 'Failed to dispatch deletion array sequence to backend clusters.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Safe Clear All Handler
//   const handleClearAllPings = async () => {
//     setIsClearingAll(true);
//     setShowClearConfirm(false);
    
//     try {
//       const cleanMonitorId = parseInt(monitorId.toString(), 10);
      
//       const response = await fetch(`/api/pings?action=clear-all&monitorId=${cleanMonitorId}`, {
//         method: 'DELETE',
//         headers: { 'X-API-Key': apiKey }
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         toast({
//           title: '🗑️ History Erased',
//           description: `Telemetry activity history for this node cleared completely.`,
//         });
        
//         setRecentPings([]);
//         setSelectedPings([]);
//         setSelectedPing(null); // Close sidebar code context details if open

//         if (monitor) {
//           setMonitor({
//             ...monitor,
//             uptimePercentage: '100.00',
//             totalPings: 0,
//             successfulPings: 0,
//             averageResponseMs: 0,
//             lastPingAt: null
//           });
//         }
//       } else {
//         toast({
//           title: '❌ Clear Action Rejected',
//           description: data.error || 'Failed to wipe data rows.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Network failure encountered while wiping monitor metrics context.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsClearingAll(false);
//     }
//   };

//   const handleCopyUrl = async (url: string) => {
//     try {
//       await navigator.clipboard.writeText(url)
//       setCopied(true)
//       toast({
//         title: '✅ URL Copied',
//         description: 'Monitor endpoint address has been copied to clipboard.',
//         duration: 2000,
//       })
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       toast({
//         title: '❌ Copy Failed',
//         description: 'Unable to copy URL to clipboard.',
//         variant: 'destructive',
//         duration: 2000,
//       })
//     }
//   }

//   const getLatestSSLData = (pings: PingResult[]) => {  
//     if (!pings || pings.length === 0) return null    
//     const pingWithSSL = pings.find(ping =>  
//       ping.sslValid !== undefined || ping.sslExpiryDays !== undefined  
//     )    
//     if (!pingWithSSL) return null    
//     return {    
//       sslValid: pingWithSSL.sslValid ?? null,    
//       sslExpiryDays: pingWithSSL.sslExpiryDays ?? null,  
//     }
//   }

//   const handleToggleMonitor = async () => {
//     if (!monitor) return
//     setIsToggling(true)
//     const newStatus = !monitor.isActive
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}`, {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//           'X-API-Key': apiKey 
//         },
//         body: JSON.stringify({ isActive: newStatus })
//       })
      
//       const data = await response.json()
      
//       if (response.ok) {
//         toast({ 
//           title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
//           description: newStatus 
//             ? 'Monitoring has been reactivated. Pings will resume shortly.'
//             : 'Monitoring has been paused. No further pings will be sent.',
//         })
//         setMonitor({ ...monitor, isActive: newStatus })
//       } else {
//         toast({ 
//           title: '❌ Failed to toggle monitor', 
//           description: data.error || 'Unknown error occurred',
//           variant: 'destructive' 
//         })
//       }
//     } catch (error) {
//       toast({ 
//         title: '❌ Network error', 
//         description: 'Could not update monitor status',
//         variant: 'destructive' 
//       })
//     } finally {
//       setIsToggling(false)
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!monitorId) return

//         console.log(`📡 Detail Request Dispatched for Monitor ID: ${monitorId}`)

//         const monitorRes = await fetch(`/api/monitors/${monitorId}`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (!monitorRes.ok) {
//           const errorPayload = await monitorRes.text()
//           console.error(`❌ Server rejected request with status ${monitorRes.status}:`, errorPayload)
//           throw new Error(`Server returned HTTP Status ${monitorRes.status}`)
//         }
        
//         const monitorData = await monitorRes.json()
        
//         const targetNode = Array.isArray(monitorData.monitor) 
//           ? monitorData.monitor[0] 
//           : monitorData.monitor

//         if (!targetNode) {
//           throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
//         }
        
//         setMonitor(targetNode)

//         // Updated initial check window threshold to limit=100
//         const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=100`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (pingsRes.ok) {
//           const pingsData = await pingsRes.json()
//           const pingsList = pingsData.pings || []
//           setRecentPings(pingsList)
//           const sslData = getLatestSSLData(pingsList)
//           setLatestSSL(sslData)
//         }
//       } catch (error: any) {
//         console.error('🚨 DETAILED PROFILE RESOLUTION EXCEPTION:', error)
//         toast({
//           title: '❌ Monitor Link Failure',
//           description: error.message || 'The requested monitor profile could not be fetched.',
//           variant: 'destructive',
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [monitorId, router, toast, apiKey])

//   const handlePingNow = async () => {
//     if (!monitor?.isActive) {
//       toast({
//         title: '⏸️ Monitor is Paused',
//         description: 'Resume the monitor before pinging.',
//         variant: 'destructive',
//       })
//       return
//     }
    
//     try {
//       const response = await fetch(`/api/monitors/${monitorId}/ping`, {
//         method: 'POST',
//         headers: { 'X-API-Key': apiKey }
//       })
      
//       if (response.ok) {
//         toast({
//           title: '🔄 Ping triggered',
//           description: 'Recalibrating endpoint calculations, standing by...',
//         })
//         setTimeout(async () => {
//           // Updated internal manual pulse checker to limit=100
//           const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=100`, {
//             headers: { 'X-API-Key': apiKey }
//           })
//           if (pingsRes.ok) {
//             const pingsData = await pingsRes.json()
//             setRecentPings(pingsData.pings || [])
//           }
//         }, 2000)
//       } else {
//         toast({
//           title: '❌ Failed to ping',
//           description: 'Could not trigger automated ping at this time',
//           variant: 'destructive',
//         })
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while executing link check.',
//         variant: 'destructive',
//       })
//     }
//   }

//   const getPingIcon = (ping: PingResult) => {
//     if (ping.isWakeUp) return <Zap size={14} className="text-orange-500" />
//     if (ping.success) return <CheckCircle size={14} className="text-green-500" />
//     return <XCircle size={14} className="text-red-500" />
//   }

//   const getSSLWarning = (daysRemaining: number | null | undefined) => {  
//     if (daysRemaining === null || daysRemaining === undefined) return null  
//     if (daysRemaining <= 0) return { severity: 'critical', message: 'EXPIRED', color: 'bg-red-500' }  
//     if (daysRemaining <= 7) return { severity: 'critical', message: `${daysRemaining}d left`, color: 'bg-red-500' }  
//     if (daysRemaining <= 30) return { severity: 'warning', message: `${daysRemaining}d left`, color: 'bg-yellow-500' }  
//     if (daysRemaining <= 60) return { severity: 'info', message: `${daysRemaining}d left`, color: 'bg-blue-500' }  
//     return { severity: 'good', message: `${daysRemaining}d left`, color: 'bg-green-500' }
//   }

//   const formatSSLDisplay = () => {  
//     if (!monitor?.sslEnabled) {    
//       return { show: false, badgeText: 'Ignored', badgeVariant: 'secondary' as const, tooltip: 'SSL monitoring is disabled for this monitor' }    
//     }    
//     if (!latestSSL) {    
//       return { show: true, badgeText: 'Pending', badgeVariant: 'outline' as const, tooltip: 'No SSL data yet. Run a ping to check certificate.' }    
//     }    
//     if (latestSSL.sslValid === false) {    
//       return { show: true, badgeText: 'Invalid', badgeVariant: 'destructive' as const, tooltip: 'SSL certificate is invalid or expired' }    
//     }    
    
//     const warning = getSSLWarning(latestSSL.sslExpiryDays)  
//     if (warning && warning.severity === 'critical') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'destructive' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }    
//     }    
//     if (warning && warning.severity === 'warning') {    
//       return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'default' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }    
//     }    
//     if (latestSSL.sslValid === true) {    
//       return { show: true, badgeText: `Valid ${warning?.message ? `(${warning.message})` : ''}`, badgeVariant: 'default' as const, tooltip: `SSL certificate is valid${warning?.message ? ` and expires in ${latestSSL.sslExpiryDays} days` : ''}` }    
//     }    
//     return { show: true, badgeText: 'Unknown', badgeVariant: 'outline' as const, tooltip: 'SSL status unknown' }
//   }

//   if (isLoading) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground font-medium text-sm animate-pulse">Syncing cluster metrics...</p>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   if (!monitor) {
//     return (
//       <main 
//         className="min-h-screen bg-background flex flex-col transition-all duration-200"
//         style={{ marginLeft: isMobile ? 0 : '80px' }}
//       >
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
//             <Button onClick={() => router.push('/dashboard')} size="sm">Return to Dashboard</Button>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   return (
//     <main 
//       className="min-h-screen bg-background flex flex-col transition-all duration-200"
//       style={{ marginLeft: isMobile ? 0 : '80px' }}
//     >
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 w-full">
//         <div className="max-w-7xl mx-auto">
//           {/* Navigation Header */}
//           <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//             <div className="flex items-center gap-3">
//               <Link href="/dashboard">
//                 <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                   <ArrowLeft size={20} />
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//                   {monitor.name || 'Monitor Details'}
//                   <span className="text-primary">.</span>
//                   {isPaused && (
//                     <span className="ml-2 text-sm bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium">
//                       PAUSED
//                     </span>
//                   )}
//                 </h1>
//                 <div className="flex items-center gap-2 mt-1">
//                   <p className="text-xs font-mono text-muted-foreground select-all">{monitor.url}</p>
//                   <button
//                     onClick={() => handleCopyUrl(monitor.url)}
//                     className="p-1 rounded-md hover:bg-muted transition-colors group focus:outline-none focus:ring-2 focus:ring-primary"
//                     title="Copy URL to clipboard"
//                   >
//                     {copied ? (
//                       <Check size={12} className="text-green-500" />
//                     ) : (
//                       <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Button 
//                 onClick={handleToggleMonitor} 
//                 variant={isPaused ? "default" : "outline"}
//                 size="sm" 
//                 className={`gap-2 h-9 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'}`}
//                 disabled={isToggling}
//               >
//                 {isToggling ? (
//                   <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
//                 ) : isPaused ? (
//                   <Play size={14} />
//                 ) : (
//                   <Pause size={14} />
//                 )}
//                 {isToggling ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
//               </Button>

//               <Button 
//                 onClick={handlePingNow} 
//                 variant="outline" 
//                 size="sm" 
//                 className="gap-2 h-9"
//                 disabled={isPaused}
//               >
//                 <Zap size={14} />
//                 Ping Now
//               </Button>

//               <Link href={`/monitors/${monitor.id}/edit`}>
//                 <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//                   Edit Monitor
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Status Overview Cards */}
//           <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
//                 <Activity size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
//                   <StatusIcon size={13} />
//                   {statusBadge.text}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-2.5">
//                   Last check: {formatDate(monitor.lastPingAt)}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
//                 <Server size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
//                 <Clock size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
//                 <Calendar size={16} className="text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold tracking-tight">
//                   {monitor.intervalSeconds >= 60 
//                     ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
//                     : `${monitor.intervalSeconds}s`}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-1">
//                   Next scheduled trigger: {isPaused ? 'Paused' : formatDate(monitor.nextPingAt)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Monitor Configuration Details & Activity Logs */}
//           <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
//                 <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-1 text-xs">
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Hash size={13} /> Monitor ID
//                   </span>
//                   <span className="font-mono font-bold text-foreground">{monitor.id}</span>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Globe size={13} /> Request Method
//                   </span>
//                   <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
//                 </div>
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Cpu size={13} /> Node Region
//                   </span>
//                   <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
//                 </div>
                
//                 <div className="flex justify-between py-2.5 border-b border-border/60">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     <Eye size={13} /> SSL Certificate
//                   </span>
//                   {(() => {
//                     const sslDisplay = formatSSLDisplay()
//                     if (!sslDisplay.show && !monitor?.sslEnabled) {
//                       return (
//                         <Badge variant="secondary" className="font-semibold text-[10px] px-2 h-5">
//                           Ignored
//                         </Badge>
//                       )
//                     }
//                     return (
//                       <div className="flex items-center gap-2">
//                         <Badge variant={sslDisplay.badgeVariant} className="font-semibold text-[10px] px-2 h-5">
//                           {sslDisplay.badgeText}
//                         </Badge>
//                         {latestSSL?.sslExpiryDays !== null && latestSSL?.sslExpiryDays !== undefined && latestSSL.sslExpiryDays <= 30 && (
//                           <span className="text-[10px] text-amber-500 font-medium animate-pulse">
//                             ⚠️ Expiring soon
//                           </span>
//                         )}
//                       </div>
//                     )
//                   })()}
//                 </div>

//                 <div className="flex justify-between py-2.5">
//                   <span className="text-muted-foreground font-medium">Description</span>
//                   <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
//                 </div>
                
//                 {/* Active Status Row */}
//                 <div className="flex justify-between py-2.5 pt-3 border-t border-border/60 mt-1">
//                   <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                     {isPaused ? <Play size={13} /> : <Pause size={13} />} Monitor State
//                   </span>
//                   <Badge variant={isPaused ? "secondary" : "default"} className="font-semibold text-[10px] px-2 h-5">
//                     {isPaused ? 'Paused' : 'Active'}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-card border-border shadow-sm">
//               <CardHeader>
//                 <div className="flex items-center justify-between flex-wrap gap-2">
//                   <div className="flex items-center gap-2.5">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
//                         <span className="bg-muted text-muted-foreground text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-border/80">
//                           {recentPings.length}
//                         </span>
//                       </div>
//                       <CardDescription className="text-xs mt-0.5">
//                         {isPaused 
//                           ? 'Monitoring is paused. No new logs will appear until resumed.' 
//                           : 'Telemetry results tracking health checks'}
//                       </CardDescription>
//                     </div>
//                   </div>
//                   {!isPaused && recentPings.length > 0 && (
//                     <button
//                       type="button"
//                       onClick={() => setShowClearConfirm(true)}
//                       disabled={isClearingAll}
//                       className="px-3 py-1 text-xs rounded-md bg-transparent border border-red-500/40 text-red-400 font-semibold tracking-wide transition-all duration-300 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.35)] focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none"
//                     >
//                       {isClearingAll ? 'Clearing...' : 'Clear All'}
//                     </button>
//                   )}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {recentPings.length === 0 ? (
//                   <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
//                     <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
//                     <p className="text-[11px] text-muted-foreground/60 mt-0.5">
//                       {isPaused 
//                         ? 'Resume monitoring to start collecting data.' 
//                         : 'Execute an on-demand "Ping Now" pulse to establish metrics.'}
//                     </p>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60 min-h-[36px]">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={selectedPings.length === recentPings.length && recentPings.length > 0}
//                           onChange={selectAllPings}
//                           className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary cursor-pointer"
//                         />
//                         <span className="text-xs text-muted-foreground font-medium">
//                           {selectedPings.length === 0 
//                             ? 'Select All' 
//                             : `${selectedPings.length} Selected`}
//                         </span>
//                       </div>
                      
//                       {selectedPings.length > 0 && (
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={handleDeleteSelected}
//                           disabled={isDeleting}
//                           className="h-7 text-xs px-2.5 bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-1.5"
//                         >
//                           <Trash2 size={12} />
//                           {isDeleting ? 'Dropping...' : 'Delete Selected'}
//                         </Button>
//                       )}
//                     </div>

//                     {/* Confirmation Overlay Modal for Clearing Wipes */}
//                     {showClearConfirm && (
//                       <div className="mb-4 p-3 border border-red-500/30 rounded-lg bg-red-500/5 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
//                         <p className="font-bold text-red-400 flex items-center gap-1.5 mb-1">
//                           <AlertCircle size={14} /> Critical Action Confirmation
//                         </p>
//                         <p className="text-muted-foreground mb-2.5">
//                           Are you sure you want to completely erase the heartbeat history metrics for this monitor? This action cannot be reversed.
//                         </p>
//                         <div className="flex gap-2 justify-end">
//                           <Button 
//                             variant="ghost" 
//                             size="sm" 
//                             className="h-7 text-xs text-muted-foreground"
//                             onClick={() => setShowClearConfirm(false)}
//                           >
//                             Cancel
//                           </Button>
//                           <Button 
//                             variant="destructive" 
//                             size="sm" 
//                             className="h-7 text-xs bg-red-600 text-white hover:bg-red-700"
//                             onClick={handleClearAllPings}
//                           >
//                             Confirm Purge
//                           </Button>
//                         </div>
//                       </div>
//                     )}

//                     {/* Interactive Telemetry Log Scroll Area with forced dark browser-level scrollbars */}
//                     <div 
//                       className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1"
//                       style={{
//                         scrollbarWidth: 'thin',
//                         scrollbarColor: 'rgba(255,255,255,0.15) transparent'
//                       }}
//                     >
//                       {/* CSS Injection to force Webkit dark tracks layout */}
//                       <style dangerouslySetInnerHTML={{__html: `
//                         ::-webkit-scrollbar { width: 5px; height: 5px; }
//                         ::-webkit-scrollbar-track { background: transparent !important; }
//                         ::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.12) !important; border-radius: 9999px; }
//                         ::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.25) !important; }
//                       `}} />

//                       {recentPings.map((ping) => {
//                         const isChecked = selectedPings.includes(ping.id);
//                         return (
//                           <div 
//                             key={ping.id}
//                             onClick={() => setSelectedPing(ping)}
//                             className={`flex items-center justify-between p-2.5 rounded-md border text-xs transition-all cursor-pointer group select-none ${
//                               isChecked 
//                                 ? 'bg-primary/5 border-primary/40 shadow-[0_0_8px_rgba(var(--primary),0.05)]' 
//                                 : 'bg-card/50 border-border/60 hover:bg-muted/40 hover:border-border'
//                             }`}
//                           >
//                             {/* Clickable body wrapper that catches row clicks without event-hijacking check boxes */}
//                             <div className="flex items-center gap-3 min-w-0 flex-1">
//                               <input
//                                 type="checkbox"
//                                 checked={isChecked}
//                                 onClick={(e) => e.stopPropagation()}
//                                 onChange={() => togglePingSelection(ping.id)}
//                                 className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary cursor-pointer shrink-0"
//                               />
//                               <div className="p-1 rounded bg-background border border-border/40 shrink-0">
//                                 {getPingIcon(ping)}
//                               </div>
//                               <div className="min-w-0 flex-1">
//                                 <div className="flex items-center gap-2">
//                                   <span className={`font-mono font-bold ${ping.success ? 'text-green-500' : 'text-red-500'}`}>
//                                     {ping.statusCode || (ping.isWakeUp ? 'WAKE' : 'ERR')}
//                                   </span>
//                                   <span className="text-muted-foreground/40 font-light">|</span>
//                                   <span className="font-mono text-[11px] text-foreground font-semibold">
//                                     {ping.responseTimeMs !== null ? `${ping.responseTimeMs}ms` : '---'}
//                                   </span>
//                                 </div>
//                                 <p className="text-[10px] text-muted-foreground/80 mt-0.5 truncate font-medium">
//                                   {formatDate(ping.createdAt)}
//                                 </p>
//                               </div>
//                             </div>

//                             <div className="flex items-center gap-2 shrink-0 pl-2">
//                               {!ping.success && ping.errorType && (
//                                 <Badge variant="destructive" className="text-[9px] px-1.5 py-0 font-mono tracking-tight shrink-0">
//                                   {ping.errorType}
//                                 </Badge>
//                               )}
//                               <ArrowLeft size={12} className="text-muted-foreground/0 -translate-x-1 group-hover:text-muted-foreground/60 group-hover:translate-x-0 transition-all duration-200" />
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* 💻 JSON Response Details Slidedown Drawer Panel */}
//           {selectedPing && (
//             <Card className="bg-card border-border shadow-md animate-in slide-in-from-bottom-4 duration-300 mb-8 overflow-hidden">
//               <CardHeader className="bg-muted/30 border-b border-border/60 py-3 flex flex-row items-center justify-between space-y-0">
//                 <div className="flex items-center gap-2 text-xs">
//                   <FileCode size={14} className="text-primary" />
//                   <span className="font-bold text-muted-foreground">Payload Context Inspector:</span>
//                   <span className="font-mono bg-background px-2 py-0.5 rounded border border-border/80 font-bold text-foreground">
//                     Log node ID #{selectedPing.id}
//                   </span>
//                 </div>
//                 <Button 
//                   variant="ghost" 
//                   size="icon" 
//                   className="h-6 w-6 text-muted-foreground hover:text-foreground"
//                   onClick={() => setSelectedPing(null)}
//                 >
//                   <X size={14} />
//                 </Button>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 text-xs font-mono">
//                   <div className="p-4 space-y-2">
//                     <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Metrics Context</p>
//                     <div className="flex justify-between py-1">
//                       <span className="text-muted-foreground">Status Flag:</span>
//                       <span className={selectedPing.success ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
//                         {selectedPing.success ? "SUCCESS" : "CRITICAL_ERR"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between py-1">
//                       <span className="text-muted-foreground">HTTP Code:</span>
//                       <span className="text-foreground font-bold">{selectedPing.statusCode || 'None'}</span>
//                     </div>
//                     <div className="flex justify-between py-1">
//                       <span className="text-muted-foreground">Latency Stack:</span>
//                       <span className="text-foreground font-bold">{selectedPing.responseTimeMs ? `${selectedPing.responseTimeMs}ms` : '---'}</span>
//                     </div>
//                     <div className="flex justify-between py-1">
//                       <span className="text-muted-foreground">Wake Event:</span>
//                       <span className="text-foreground font-bold">{selectedPing.isWakeUp ? "TRUE" : "FALSE"}</span>
//                     </div>
//                   </div>

//                   <div className="p-4 md:col-span-2 bg-zinc-950 text-zinc-200">
//                     <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-2 font-sans flex justify-between items-center">
//                       <span>Server Response Body JSON</span>
//                       <span className="text-[10px] lowercase text-zinc-600 font-mono">application/json</span>
//                     </p>
//                     <pre 
//                       className="text-[11px] p-3 rounded bg-zinc-900 border border-zinc-800 max-h-[220px] overflow-y-auto leading-relaxed whitespace-pre-wrap font-mono text-green-400"
//                       style={{
//                         scrollbarWidth: 'thin',
//                         scrollbarColor: 'rgba(255,255,255,0.1) transparent'
//                       }}
//                     >
//                       {selectedPing.jsonResponse 
//                         ? JSON.stringify(selectedPing.jsonResponse, null, 2) 
//                         : JSON.stringify({ 
//                             message: selectedPing.errorMessage || "No metadata schema response returned from endpoint stream.", 
//                             type: selectedPing.errorType || "NullResponse" 
//                           }, null, 2)
//                       }
//                     </pre>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//         </div>
//       </div>
//     </main>
//   )
// }
















































'use client'

import { 
  ArrowLeft, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Zap, 
  Server, 
  Activity, 
  Calendar, 
  Globe, 
  Hash, 
  Cpu,
  Copy,
  Check,
  Pause,
  Play,
  Trash2,
  X,
  FileCode
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/sidebar'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect, use } from 'react'

interface Monitor {
  id: number
  name: string
  url: string
  description: string | null
  monitorType: string
  method: string
  intervalSeconds: number
  region: string
  timeoutMs: number
  sslEnabled: boolean
  isActive: boolean
  status: 'pending' | 'up' | 'down' | 'waking' | 'degraded'
  createdAt: string
  updatedAt: string
  lastPingAt: string | null
  nextPingAt: string | null
  uptimePercentage: string
  totalPings: number
  successfulPings: number
  averageResponseMs: number
}

interface PingResult {
  id: number
  statusCode: number | null
  responseTimeMs: number | null
  success: boolean
  isWakeUp: boolean
  errorMessage: string | null
  errorType: string | null
  responsePreview: string | null
  jsonResponse: any
  createdAt: string
  sslValid?: boolean | null
  sslExpiryDays?: number | null
}

interface LatestSSLData {  
  sslValid: boolean | null  
  sslExpiryDays: number | null
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function MonitorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const monitorId = resolvedParams.id

  const router = useRouter()
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)

  const [monitor, setMonitor] = useState<Monitor | null>(null)
  const [recentPings, setRecentPings] = useState<PingResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [latestSSL, setLatestSSL] = useState<LatestSSLData | null>(null)

  // Deletion and history state metrics
  const [selectedPings, setSelectedPings] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

  // Helper formatting logic
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  const getStatusBadge = (status: Monitor['status'], isActive: boolean = true) => {
    if (!isActive) {
      return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Pause, text: 'Paused' }
    }
    switch (status) {
      case 'up':
        return { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle, text: 'Operational' }
      case 'down':
        return { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle, text: 'Outage Detected' }
      case 'waking':
        return { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Zap, text: 'Waking Engine' }
      case 'degraded':
        return { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: AlertCircle, text: 'Degraded' }
      default:
        return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Clock, text: 'Pending Verification' }
    }
  }

  // Safe global derived flags lifted up away from the temporal dead zone
  const isPaused = monitor ? !monitor.isActive : false
  const statusBadge = getStatusBadge(monitor?.status || 'pending', !isPaused)
  const StatusIcon = statusBadge.icon

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle selection of a ping
  const togglePingSelection = (pingId: number) => {
    setSelectedPings(prev => 
      prev.includes(pingId) 
        ? prev.filter(id => id !== pingId)
        : [...prev, pingId]
    );
  };

  // Select all pings
  const selectAllPings = () => {
    if (selectedPings.length === recentPings.length) {
      setSelectedPings([]);
    } else {
      setSelectedPings(recentPings.map(p => p.id));
    }
  };

  // 🔄 Automated background runner updated to pull down up to 100 records per cascade loop
  const fetchRecentPings = async () => {
    try {
      const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=100`, {
        headers: { 'X-API-Key': apiKey }
      });
      if (pingsRes.ok) {
        const pingsData = await pingsRes.json();
        setRecentPings(pingsData.pings || []);
      }
    } catch (error) {
      console.error("Failed to re-fetch logs:", error);
    }
  };

  // Safe Batch Deletion Handler
  const handleDeleteSelected = async () => {
    if (selectedPings.length === 0) return;
    
    setIsDeleting(true);
    try {
      const stringIds = selectedPings.map(id => id.toString()).join(',');
      
      const response = await fetch(`/api/pings?ids=${stringIds}`, {
        method: 'DELETE',
        headers: { 'X-API-Key': apiKey }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: '✅ Pings Permanently Deleted',
          description: `Successfully cleared logs from core database clusters.`,
        });
        
        // 1. Reset check references
        setSelectedPings([]);
        
        // 2. 🔄 Cascaded loader populates the active window from DB pool
        await fetchRecentPings();
        
        // 3. Refresh monitor totals metadata card stats
        const monitorRes = await fetch(`/api/monitors/${monitorId}`, { headers: { 'X-API-Key': apiKey } });
        if (monitorRes.ok) {
          const monitorData = await monitorRes.json();
          const targetNode = Array.isArray(monitorData.monitor) ? monitorData.monitor[0] : monitorData.monitor;
          if (targetNode) setMonitor(targetNode);
        }
      } else {
        toast({
          title: '❌ Database Sync Failure',
          description: data.error || 'The remote database engine rejected the deletion block.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '❌ System Error',
        description: 'Failed to dispatch deletion array sequence to backend clusters.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Safe Clear All Handler
  const handleClearAllPings = async () => {
    setIsClearingAll(true);
    setShowClearConfirm(false);
    
    try {
      const cleanMonitorId = parseInt(monitorId.toString(), 10);
      
      const response = await fetch(`/api/pings?action=clear-all&monitorId=${cleanMonitorId}`, {
        method: 'DELETE',
        headers: { 'X-API-Key': apiKey }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: '🗑️ History Erased',
          description: `Telemetry activity history for this node cleared completely.`,
        });
        
        setRecentPings([]);
        setSelectedPings([]);
        setSelectedPing(null); // Close sidebar code context details if open

        if (monitor) {
          setMonitor({
            ...monitor,
            uptimePercentage: '100.00',
            totalPings: 0,
            successfulPings: 0,
            averageResponseMs: 0,
            lastPingAt: null
          });
        }
      } else {
        toast({
          title: '❌ Clear Action Rejected',
          description: data.error || 'Failed to wipe data rows.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Network failure encountered while wiping monitor metrics context.',
        variant: 'destructive',
      });
    } finally {
      setIsClearingAll(false);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: '✅ URL Copied',
        description: 'Monitor endpoint address has been copied to clipboard.',
        duration: 2000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: '❌ Copy Failed',
        description: 'Unable to copy URL to clipboard.',
        variant: 'destructive',
        duration: 2000,
      })
    }
  }

  const getLatestSSLData = (pings: PingResult[]) => {  
    if (!pings || pings.length === 0) return null    
    const pingWithSSL = pings.find(ping =>  
      ping.sslValid !== undefined || ping.sslExpiryDays !== undefined  
    )    
    if (!pingWithSSL) return null    
    return {    
      sslValid: pingWithSSL.sslValid ?? null,    
      sslExpiryDays: pingWithSSL.sslExpiryDays ?? null,  
    }
  }

  const handleToggleMonitor = async () => {
    if (!monitor) return
    setIsToggling(true)
    const newStatus = !monitor.isActive
    
    try {
      const response = await fetch(`/api/monitors/${monitorId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': apiKey 
        },
        body: JSON.stringify({ isActive: newStatus })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({ 
          title: newStatus ? '▶️ Monitor Resumed' : '⏸️ Monitor Paused',
          description: newStatus 
            ? 'Monitoring has been reactivated. Pings will resume shortly.'
            : 'Monitoring has been paused. No further pings will be sent.',
        })
        setMonitor({ ...monitor, isActive: newStatus })
      } else {
        toast({ 
          title: '❌ Failed to toggle monitor', 
          description: data.error || 'Unknown error occurred',
          variant: 'destructive' 
        })
      }
    } catch (error) {
      toast({ 
        title: '❌ Network error', 
        description: 'Could not update monitor status',
        variant: 'destructive' 
      })
    } finally {
      setIsToggling(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!monitorId) return

        console.log(`📡 Detail Request Dispatched for Monitor ID: ${monitorId}`)

        const monitorRes = await fetch(`/api/monitors/${monitorId}`, {
          headers: { 'X-API-Key': apiKey }
        })
        
        if (!monitorRes.ok) {
          const errorPayload = await monitorRes.text()
          console.error(`❌ Server rejected request with status ${monitorRes.status}:`, errorPayload)
          throw new Error(`Server returned HTTP Status ${monitorRes.status}`)
        }
        
        const monitorData = await monitorRes.json()
        
        const targetNode = Array.isArray(monitorData.monitor) 
          ? monitorData.monitor[0] 
          : monitorData.monitor

        if (!targetNode) {
          throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
        }
        
        setMonitor(targetNode)

        // Updated initial check window threshold to limit=100
        const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=100`, {
          headers: { 'X-API-Key': apiKey }
        })
        
        if (pingsRes.ok) {
          const pingsData = await pingsRes.json()
          const pingsList = pingsData.pings || []
          setRecentPings(pingsList)
          const sslData = getLatestSSLData(pingsList)
          setLatestSSL(sslData)
        }
      } catch (error: any) {
        console.error('🚨 DETAILED PROFILE RESOLUTION EXCEPTION:', error)
        toast({
          title: '❌ Monitor Link Failure',
          description: error.message || 'The requested monitor profile could not be fetched.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [monitorId, router, toast, apiKey])

  const handlePingNow = async () => {
    if (!monitor?.isActive) {
      toast({
        title: '⏸️ Monitor is Paused',
        description: 'Resume the monitor before pinging.',
        variant: 'destructive',
      })
      return
    }
    
    try {
      const response = await fetch(`/api/monitors/${monitorId}/ping`, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey }
      })
      
      if (response.ok) {
        toast({
          title: '🔄 Ping triggered',
          description: 'Recalibrating endpoint calculations, standing by...',
        })
        setTimeout(async () => {
          // Updated internal manual pulse checker to limit=100
          const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=100`, {
            headers: { 'X-API-Key': apiKey }
          })
          if (pingsRes.ok) {
            const pingsData = await pingsRes.json()
            setRecentPings(pingsData.pings || [])
          }
        }, 2000)
      } else {
        toast({
          title: '❌ Failed to ping',
          description: 'Could not trigger automated ping at this time',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Something went wrong while executing link check.',
        variant: 'destructive',
      })
    }
  }

  const getPingIcon = (ping: PingResult) => {
    if (ping.isWakeUp) return <Zap size={14} className="text-orange-500" />
    if (ping.success) return <CheckCircle size={14} className="text-green-500" />
    return <XCircle size={14} className="text-red-500" />
  }

  const getSSLWarning = (daysRemaining: number | null | undefined) => {  
    if (daysRemaining === null || daysRemaining === undefined) return null  
    if (daysRemaining <= 0) return { severity: 'critical', message: 'EXPIRED', color: 'bg-red-500' }  
    if (daysRemaining <= 7) return { severity: 'critical', message: `${daysRemaining}d left`, color: 'bg-red-500' }  
    if (daysRemaining <= 30) return { severity: 'warning', message: `${daysRemaining}d left`, color: 'bg-yellow-500' }  
    if (daysRemaining <= 60) return { severity: 'info', message: `${daysRemaining}d left`, color: 'bg-blue-500' }  
    return { severity: 'good', message: `${daysRemaining}d left`, color: 'bg-green-500' }
  }

  const formatSSLDisplay = () => {  
    if (!monitor?.sslEnabled) {    
      return { show: false, badgeText: 'Ignored', badgeVariant: 'secondary' as const, tooltip: 'SSL monitoring is disabled for this monitor' }    
    }    
    if (!latestSSL) {    
      return { show: true, badgeText: 'Pending', badgeVariant: 'outline' as const, tooltip: 'No SSL data yet. Run a ping to check certificate.' }    
    }    
    if (latestSSL.sslValid === false) {    
      return { show: true, badgeText: 'Invalid', badgeVariant: 'destructive' as const, tooltip: 'SSL certificate is invalid or expired' }    
    }    
    
    const warning = getSSLWarning(latestSSL.sslExpiryDays)  
    if (warning && warning.severity === 'critical') {    
      return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'destructive' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }    
    }    
    if (warning && warning.severity === 'warning') {    
      return { show: true, badgeText: `⚠️ ${warning.message}`, badgeVariant: 'default' as const, tooltip: `SSL certificate expires in ${latestSSL.sslExpiryDays} days` }    
    }    
    if (latestSSL.sslValid === true) {    
      return { show: true, badgeText: `Valid ${warning?.message ? `(${warning.message})` : ''}`, badgeVariant: 'default' as const, tooltip: `SSL certificate is valid${warning?.message ? ` and expires in ${latestSSL.sslExpiryDays} days` : ''}` }    
    }    
    return { show: true, badgeText: 'Unknown', badgeVariant: 'outline' as const, tooltip: 'SSL status unknown' }
  }

  if (isLoading) {
    return (
      <main 
        className="min-h-screen bg-background flex flex-col transition-all duration-200"
        style={{ marginLeft: isMobile ? 0 : '80px' }}
      >
        <Sidebar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium text-sm animate-pulse">Syncing cluster metrics...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!monitor) {
    return (
      <main 
        className="min-h-screen bg-background flex flex-col transition-all duration-200"
        style={{ marginLeft: isMobile ? 0 : '80px' }}
      >
        <Sidebar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
            <Button onClick={() => router.push('/dashboard')} size="sm">Return to Dashboard</Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main 
      className="min-h-screen bg-background flex flex-col transition-all duration-200"
      style={{ marginLeft: isMobile ? 0 : '80px' }}
    >
      <Sidebar />
      <div className="px-4 sm:px-6 py-8 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {monitor.name || 'Monitor Details'}
                  <span className="text-primary">.</span>
                  {isPaused && (
                    <span className="ml-2 text-sm bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                      PAUSED
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs font-mono text-muted-foreground select-all">{monitor.url}</p>
                  <button
                    onClick={() => handleCopyUrl(monitor.url)}
                    className="p-1 rounded-md hover:bg-muted transition-colors group focus:outline-none focus:ring-2 focus:ring-primary"
                    title="Copy URL to clipboard"
                  >
                    {copied ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleToggleMonitor} 
                variant={isPaused ? "default" : "outline"}
                size="sm" 
                className={`gap-2 h-9 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'}`}
                disabled={isToggling}
              >
                {isToggling ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
                ) : isPaused ? (
                  <Play size={14} />
                ) : (
                  <Pause size={14} />
                )}
                {isToggling ? 'Updating...' : (isPaused ? 'Resume' : 'Pause')}
              </Button>

              <Button 
                onClick={handlePingNow} 
                variant="outline" 
                size="sm" 
                className="gap-2 h-9"
                disabled={isPaused}
              >
                <Zap size={14} />
                Ping Now
              </Button>

              <Link href={`/monitors/${monitor.id}/edit`}>
                <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Edit Monitor
                </Button>
              </Link>
            </div>
          </div>

          {/* Status Overview Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
                <Activity size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                  <StatusIcon size={13} />
                  {statusBadge.text}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2.5">
                  Last check: {formatDate(monitor.lastPingAt)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
                <Server size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
                <Clock size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
                <Calendar size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {monitor.intervalSeconds >= 60 
                    ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
                    : `${monitor.intervalSeconds}s`}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Next scheduled trigger: {isPaused ? 'Paused' : formatDate(monitor.nextPingAt)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monitor Configuration Details & Activity Logs */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 ${isPaused ? 'opacity-75' : ''}`}>
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
                <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <div className="flex justify-between py-2.5 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Hash size={13} /> Monitor ID
                  </span>
                  <span className="font-mono font-bold text-foreground">{monitor.id}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Globe size={13} /> Request Method
                  </span>
                  <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
                </div>
                <div className="flex justify-between py-2.5 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Cpu size={13} /> Node Region
                  </span>
                  <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
                </div>
                
                <div className="flex justify-between py-2.5 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Eye size={13} /> SSL Certificate
                  </span>
                  {(() => {
                    const sslDisplay = formatSSLDisplay()
                    if (!sslDisplay.show && !monitor?.sslEnabled) {
                      return (
                        <Badge variant="secondary" className="font-semibold text-[10px] px-2 h-5">
                          Ignored
                        </Badge>
                      )
                    }
                    return (
                      <div className="flex items-center gap-2">
                        <Badge variant={sslDisplay.badgeVariant} className="font-semibold text-[10px] px-2 h-5">
                          {sslDisplay.badgeText}
                        </Badge>
                        {latestSSL?.sslExpiryDays !== null && latestSSL?.sslExpiryDays !== undefined && latestSSL.sslExpiryDays <= 30 && (
                          <span className="text-[10px] text-amber-500 font-medium animate-pulse">
                            ⚠️ Expiring soon
                          </span>
                        )}
                      </div>
                    )
                  })()}
                </div>

                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-medium">Description</span>
                  <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
                </div>
                
                {/* Active Status Row */}
                <div className="flex justify-between py-2.5 pt-3 border-t border-border/60 mt-1">
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    {isPaused ? <Play size={13} /> : <Pause size={13} />} Monitor State
                  </span>
                  <Badge variant={isPaused ? "secondary" : "default"} className="font-semibold text-[10px] px-2 h-5">
                    {isPaused ? 'Paused' : 'Active'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
                        <span className="bg-muted text-muted-foreground text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-border/80">
                          {recentPings.length}
                        </span>
                      </div>
                      <CardDescription className="text-xs mt-0.5">
                        {isPaused 
                          ? 'Monitoring is paused. No new logs will appear until resumed.' 
                          : 'Telemetry results tracking health checks'}
                      </CardDescription>
                    </div>
                  </div>
                  {!isPaused && recentPings.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      disabled={isClearingAll}
                      className="px-3 py-1 text-xs rounded-md bg-transparent border border-red-500/40 text-red-400 font-semibold tracking-wide transition-all duration-300 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.35)] focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isClearingAll ? 'Clearing...' : 'Clear All'}
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {recentPings.length === 0 ? (
                  <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
                    <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                      {isPaused 
                        ? 'Resume monitoring to start collecting data.' 
                        : 'Execute an on-demand "Ping Now" pulse to establish metrics.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60 min-h-[36px]">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPings.length === recentPings.length && recentPings.length > 0}
                          onChange={selectAllPings}
                          className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary cursor-pointer"
                        />
                        <span className="text-xs text-muted-foreground font-medium">
                          {selectedPings.length === 0 
                            ? 'Select All' 
                            : `${selectedPings.length} Selected`}
                        </span>
                      </div>
                      
                      {selectedPings.length > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteSelected}
                          disabled={isDeleting}
                          className="h-7 text-xs px-2.5 bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          {isDeleting ? 'Dropping...' : 'Delete Selected'}
                        </Button>
                      )}
                    </div>

                    {/* Confirmation Overlay Modal for Clearing Wipes */}
                    {showClearConfirm && (
                      <div className="mb-4 p-3 border border-red-500/30 rounded-lg bg-red-500/5 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="font-bold text-red-400 flex items-center gap-1.5 mb-1">
                          <AlertCircle size={14} /> Critical Action Confirmation
                        </p>
                        <p className="text-muted-foreground mb-2.5">
                          Are you sure you want to completely erase the heartbeat history metrics for this monitor? This action cannot be reversed.
                        </p>
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-muted-foreground"
                            onClick={() => setShowClearConfirm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-7 text-xs bg-red-600 text-white hover:bg-red-700"
                            onClick={handleClearAllPings}
                          >
                            Confirm Purge
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Interactive Telemetry Log Scroll Area with forced dark browser-level scrollbars */}
                    <div 
                      className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.15) transparent'
                      }}
                    >
                      {/* CSS Injection to force Webkit dark tracks layout */}
                      <style dangerouslySetInnerHTML={{__html: `
                        ::-webkit-scrollbar { width: 5px; height: 5px; }
                        ::-webkit-scrollbar-track { background: transparent !important; }
                        ::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.12) !important; border-radius: 9999px; }
                        ::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.25) !important; }
                      `}} />

                      {/* ✅ SURGICALLY UPDATED LOG DISPLAY SECTION */}
                      {recentPings.map((ping) => (
                        <div
                          key={ping.id}
                          className={`flex items-center gap-2 p-2.5 rounded-lg bg-card border transition-all duration-150 ${
                            selectedPings.includes(ping.id) 
                              ? 'border-primary/50 bg-primary/5' 
                              : 'border-border hover:bg-accent/40 hover:border-primary/20'
                          }`}
                        >
                          {/* ✅ LEFT SIDE: Checkbox - Does NOT open JSON */}
                          <input
                            type="checkbox"
                            checked={selectedPings.includes(ping.id)}
                            onChange={() => togglePingSelection(ping.id)}
                            className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary flex-shrink-0 cursor-pointer"
                            onClick={(e) => e.stopPropagation()} // ← Prevents JSON modal from opening
                          />
                              
                          {/* ✅ RIGHT SIDE: Clickable content - Opens JSON modal */}
                          <div 
                            className="flex items-center justify-between flex-1 cursor-pointer min-w-0"
                            onClick={() => setSelectedPing(ping)} // ← THIS opens the JSON popup
                          >
                            {/* Left side of content - Icon + Status + Date */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="transition-transform group-hover:scale-105">
                                {getPingIcon(ping)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-foreground flex items-center gap-1">
                                  {ping.success ? 'Healthy Connection' : 'Outage Event'}
                                  {ping.isWakeUp && <span className="text-[10px] text-orange-400 font-medium ml-1">🌙 Wake</span>}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {formatDate(ping.createdAt)}
                                </p>
                              </div>
                            </div>
                                  
                            {/* Right side of content - Response Time + HTTP Status */}
                            <div className="text-right flex-shrink-0 font-mono">
                              {ping.responseTimeMs !== null && (
                                <p className="text-xs font-bold text-foreground/90">{ping.responseTimeMs}ms</p>
                              )}
                              {ping.statusCode && (
                                <p className={`text-[10px] font-medium ${ping.success ? 'text-muted-foreground' : 'text-red-400'}`}>
                                  HTTP {ping.statusCode}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ✅ SURGICALLY UPDATED JSON RESPONSE VIEWER MODAL */}
          {selectedPing && selectedPing.jsonResponse && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
              onClick={() => setSelectedPing(null)} // ← Clicking backdrop closes modal
            >
              <div 
                className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden" 
                onClick={(e) => e.stopPropagation()} // ← Prevents closing when clicking inside
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-foreground">JSON Response Stream</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Historic event parameters mapped for Node reference #{selectedPing.id}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setSelectedPing(null)}>
                    Close Logs
                  </Button>
                </div>
                      
                {/* Modal Body - JSON Content */}
                <div className="p-4 overflow-y-auto flex-1 bg-slate-950/40 font-mono [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <pre className="text-xs text-blue-400 overflow-x-auto selection:bg-blue-500/20 leading-relaxed p-2">
                    {typeof selectedPing.jsonResponse === 'string'
                      ? selectedPing.jsonResponse
                      : JSON.stringify(selectedPing.jsonResponse, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}

