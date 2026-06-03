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
//   Cpu 
// } from 'lucide-react'
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState, useEffect, use } from 'react' // 🚀 Added 'use' to cleanly unwrap async params

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
// }

// // Next.js App Router dynamic page standard signature
// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default function MonitorDetailPage({ params }: PageProps) {
//   // 🚀 FIXED: Unwrapping the dynamic route parameters safely using the native 'use' hook
//   const resolvedParams = use(params)
//   const monitorId = resolvedParams.id

//   const router = useRouter()
//   const { toast } = useToast()

//   const [monitor, setMonitor] = useState<Monitor | null>(null)
//   const [recentPings, setRecentPings] = useState<PingResult[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)

//   const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

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
        
//         // 🚀 FIXED: Safely extracting individual object from Drizzle's array structure
//         const targetNode = Array.isArray(monitorData.monitor) 
//           ? monitorData.monitor[0] 
//           : monitorData.monitor

//         if (!targetNode) {
//           throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
//         }
        
//         setMonitor(targetNode)

//         // Historic telemetry pipeline data lookups
//         const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (pingsRes.ok) {
//           const pingsData = await pingsRes.json()
//           setRecentPings(pingsData.pings || [])
//         }
//       } catch (error: any) {
//         console.error('🚨 DETAILED PROFILE RESOLUTION EXCEPTION:', error)
//         toast({
//           title: '❌ Monitor Link Failure',
//           description: error.message || 'The requested monitor profile could not be fetched.',
//           variant: 'destructive',
//         })
//         // 🚀 DISABLED AUTO-KICK: Commented out so it leaves you on the page to see errors
//         // router.push('/')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [monitorId, router, toast, apiKey])

//   const handlePingNow = async () => {
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

//   const getStatusBadge = (status: Monitor['status']) => {
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

//   if (isLoading) {
//     return (
//       <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
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
//       <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
//             <Button onClick={() => router.push('/')} size="sm">Return to Dashboard</Button>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   const statusBadge = getStatusBadge(monitor.status)
//   const StatusIcon = statusBadge.icon

//   return (
//     <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 max-w-full">
//         {/* Navigation Header */}
//         <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//           <div className="flex items-center gap-3">
//             <Link href="/">
//               <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                 <ArrowLeft size={20} />
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//                 {monitor.name || 'Monitor Details'}
//                 <span className="text-primary">.</span>
//               </h1>
//               <p className="text-xs font-mono text-muted-foreground mt-1 select-all">{monitor.url}</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <Button onClick={handlePingNow} variant="outline" size="sm" className="gap-2 h-9">
//               <Zap size={14} />
//               Ping Now
//             </Button>
//             <Link href={`/monitors/${monitor.id}/edit`}>
//               <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//                 Edit Monitor
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Status Overview Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
//               <Activity size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
//                 <StatusIcon size={13} />
//                 {statusBadge.text}
//               </div>
//               <p className="text-[11px] text-muted-foreground mt-2.5">
//                 Last check: {formatDate(monitor.lastPingAt)}
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
//               <Server size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
//               <p className="text-[11px] text-muted-foreground mt-1">
//                 {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
//               <Clock size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
//               <p className="text-[11px] text-muted-foreground mt-1">
//                 Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
//               <Calendar size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold tracking-tight">
//                 {monitor.intervalSeconds >= 60 
//                   ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
//                   : `${monitor.intervalSeconds}s`}
//               </div>
//               <p className="text-[11px] text-muted-foreground mt-1">
//                 Next scheduled trigger: {formatDate(monitor.nextPingAt)}
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Monitor Configuration Details & Activity Logs */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
//               <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-1 text-xs">
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Hash size={13} /> Monitor ID
//                 </span>
//                 <span className="font-mono font-bold text-foreground">{monitor.id}</span>
//               </div>
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Globe size={13} /> Request Method
//                 </span>
//                 <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
//               </div>
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Cpu size={13} /> Node Region
//                 </span>
//                 <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
//               </div>
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Eye size={13} /> SSL Certificate Checks
//                 </span>
//                 <Badge variant={monitor.sslEnabled ? 'default' : 'secondary'} className="font-semibold text-[10px] px-2 h-5">
//                   {monitor.sslEnabled ? 'Active Chain' : 'Ignored'}
//                 </Badge>
//               </div>
//               <div className="flex justify-between py-2.5">
//                 <span className="text-muted-foreground font-medium">Description</span>
//                 <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
//               <CardDescription className="text-xs">Telemetry results tracking the last 20 health checks</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {recentPings.length === 0 ? (
//                 <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
//                   <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
//                   <p className="text-[11px] text-muted-foreground/60 mt-0.5">Execute an on-demand "Ping Now" pulse to establish metrics.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
//                   {recentPings.map((ping) => (
//                     <div
//                       key={ping.id}
//                       className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border cursor-pointer hover:bg-accent/40 hover:border-primary/20 transition-all duration-150 group"
//                       onClick={() => setSelectedPing(ping)}
//                     >
//                       <div className="flex items-center gap-2.5 min-w-0">
//                         <div className="transition-transform group-hover:scale-105">
//                           {getPingIcon(ping)}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-xs font-bold text-foreground">
//                             {ping.success ? 'Healthy Connection' : 'Outage Event'}
//                             {ping.isWakeUp && <span className="text-[10px] text-orange-400 font-medium ml-1">🌙 Wake</span>}
//                           </p>
//                           <p className="text-[10px] text-muted-foreground mt-0.5">
//                             {formatDate(ping.createdAt)}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right flex-shrink-0 font-mono">
//                         {ping.responseTimeMs !== null && (
//                           <p className="text-xs font-bold text-foreground/90">{ping.responseTimeMs}ms</p>
//                         )}
//                         {ping.statusCode && (
//                           <p className={`text-[10px] font-medium ${ping.success ? 'text-muted-foreground' : 'text-red-400'}`}>
//                             HTTP {ping.statusCode}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* JSON Response Viewer Backdrop Overlay Modal */}
//         {selectedPing && selectedPing.jsonResponse && (
//           <div 
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//             onClick={() => setSelectedPing(null)}
//           >
//             <div 
//               className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden" 
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
//                 <div>
//                   <h3 className="text-sm font-bold tracking-tight text-foreground">JSON Response Stream</h3>
//                   <p className="text-[11px] text-muted-foreground mt-0.5">Historic event parameters mapped for Node reference #{selectedPing.id}</p>
//                 </div>
//                 <Button type="button" variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setSelectedPing(null)}>
//                   Close Logs
//                 </Button>
//               </div>
//               <div className="p-4 overflow-y-auto flex-1 bg-slate-950/40 font-mono">
//                 <pre className="text-xs text-blue-400 overflow-x-auto selection:bg-blue-500/20 leading-relaxed p-2">
//                   {typeof selectedPing.jsonResponse === 'string'
//                     ? selectedPing.jsonResponse
//                     : JSON.stringify(selectedPing.jsonResponse, null, 2)}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         )}
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
//   Check
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
// }

// // Next.js App Router dynamic page standard signature
// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default function MonitorDetailPage({ params }: PageProps) {
//   // Unwrapping the dynamic route parameters safely using the native 'use' hook
//   const resolvedParams = use(params)
//   const monitorId = resolvedParams.id

//   const router = useRouter()
//   const { toast } = useToast()

//   const [monitor, setMonitor] = useState<Monitor | null>(null)
//   const [recentPings, setRecentPings] = useState<PingResult[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
//   const [copied, setCopied] = useState(false)

//   const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

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
        
//         // Safely extracting individual object from Drizzle's array structure
//         const targetNode = Array.isArray(monitorData.monitor) 
//           ? monitorData.monitor[0] 
//           : monitorData.monitor

//         if (!targetNode) {
//           throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
//         }
        
//         setMonitor(targetNode)

//         // Historic telemetry pipeline data lookups
//         const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (pingsRes.ok) {
//           const pingsData = await pingsRes.json()
//           setRecentPings(pingsData.pings || [])
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

//   const getStatusBadge = (status: Monitor['status']) => {
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

//   if (isLoading) {
//     return (
//       <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
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
//       <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
//             <Button onClick={() => router.push('/')} size="sm">Return to Dashboard</Button>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   const statusBadge = getStatusBadge(monitor.status)
//   const StatusIcon = statusBadge.icon

//   return (
//     <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 max-w-full">
//         {/* Navigation Header */}
//         <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//           <div className="flex items-center gap-3">
//             <Link href="/">
//               <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                 <ArrowLeft size={20} />
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//                 {monitor.name || 'Monitor Details'}
//                 <span className="text-primary">.</span>
//               </h1>
//               {/* URL with Copy Icon - Added here */}
//               <div className="flex items-center gap-2 mt-1">
//                 <p className="text-xs font-mono text-muted-foreground select-all">{monitor.url}</p>
//                 <button
//                   onClick={() => handleCopyUrl(monitor.url)}
//                   className="p-1 rounded-md hover:bg-muted transition-colors group focus:outline-none focus:ring-2 focus:ring-primary"
//                   title="Copy URL to clipboard"
//                 >
//                   {copied ? (
//                     <Check size={12} className="text-green-500" />
//                   ) : (
//                     <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <Button onClick={handlePingNow} variant="outline" size="sm" className="gap-2 h-9">
//               <Zap size={14} />
//               Ping Now
//             </Button>
//             <Link href={`/monitors/${monitor.id}/edit`}>
//               <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//                 Edit Monitor
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Status Overview Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
//               <Activity size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
//                 <StatusIcon size={13} />
//                 {statusBadge.text}
//               </div>
//               <p className="text-[11px] text-muted-foreground mt-2.5">
//                 Last check: {formatDate(monitor.lastPingAt)}
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
//               <Server size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
//               <p className="text-[11px] text-muted-foreground mt-1">
//                 {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
//               <Clock size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
//               <p className="text-[11px] text-muted-foreground mt-1">
//                 Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
//               <Calendar size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold tracking-tight">
//                 {monitor.intervalSeconds >= 60 
//                   ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
//                   : `${monitor.intervalSeconds}s`}
//               </div>
//               <p className="text-[11px] text-muted-foreground mt-1">
//                 Next scheduled trigger: {formatDate(monitor.nextPingAt)}
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Monitor Configuration Details & Activity Logs */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
//               <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-1 text-xs">
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Hash size={13} /> Monitor ID
//                 </span>
//                 <span className="font-mono font-bold text-foreground">{monitor.id}</span>
//               </div>
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Globe size={13} /> Request Method
//                 </span>
//                 <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
//               </div>
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Cpu size={13} /> Node Region
//                 </span>
//                 <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
//               </div>
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Eye size={13} /> SSL Certificate Checks
//                 </span>
//                 <Badge variant={monitor.sslEnabled ? 'default' : 'secondary'} className="font-semibold text-[10px] px-2 h-5">
//                   {monitor.sslEnabled ? 'Active Chain' : 'Ignored'}
//                 </Badge>
//               </div>
//               <div className="flex justify-between py-2.5">
//                 <span className="text-muted-foreground font-medium">Description</span>
//                 <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
//               <CardDescription className="text-xs">Telemetry results tracking the last 20 health checks</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {recentPings.length === 0 ? (
//                 <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
//                   <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
//                   <p className="text-[11px] text-muted-foreground/60 mt-0.5">Execute an on-demand "Ping Now" pulse to establish metrics.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
//                   {recentPings.map((ping) => (
//                     <div
//                       key={ping.id}
//                       className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border cursor-pointer hover:bg-accent/40 hover:border-primary/20 transition-all duration-150 group"
//                       onClick={() => setSelectedPing(ping)}
//                     >
//                       <div className="flex items-center gap-2.5 min-w-0">
//                         <div className="transition-transform group-hover:scale-105">
//                           {getPingIcon(ping)}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-xs font-bold text-foreground">
//                             {ping.success ? 'Healthy Connection' : 'Outage Event'}
//                             {ping.isWakeUp && <span className="text-[10px] text-orange-400 font-medium ml-1">🌙 Wake</span>}
//                           </p>
//                           <p className="text-[10px] text-muted-foreground mt-0.5">
//                             {formatDate(ping.createdAt)}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right flex-shrink-0 font-mono">
//                         {ping.responseTimeMs !== null && (
//                           <p className="text-xs font-bold text-foreground/90">{ping.responseTimeMs}ms</p>
//                         )}
//                         {ping.statusCode && (
//                           <p className={`text-[10px] font-medium ${ping.success ? 'text-muted-foreground' : 'text-red-400'}`}>
//                             HTTP {ping.statusCode}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* JSON Response Viewer Backdrop Overlay Modal */}
//         {selectedPing && selectedPing.jsonResponse && (
//           <div 
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//             onClick={() => setSelectedPing(null)}
//           >
//             <div 
//               className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden" 
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
//                 <div>
//                   <h3 className="text-sm font-bold tracking-tight text-foreground">JSON Response Stream</h3>
//                   <p className="text-[11px] text-muted-foreground mt-0.5">Historic event parameters mapped for Node reference #{selectedPing.id}</p>
//                 </div>
//                 <Button type="button" variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setSelectedPing(null)}>
//                   Close Logs
//                 </Button>
//               </div>
//               <div className="p-4 overflow-y-auto flex-1 bg-slate-950/40 font-mono">
//                 <pre className="text-xs text-blue-400 overflow-x-auto selection:bg-blue-500/20 leading-relaxed p-2">
//                   {typeof selectedPing.jsonResponse === 'string'
//                     ? selectedPing.jsonResponse
//                     : JSON.stringify(selectedPing.jsonResponse, null, 2)}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         )}
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
//   Check
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
//   // Dynamic SSL metrics extracted from backend checking runner instances
//   sslValid?: boolean | null
//   sslExpiryDays?: number | null
// }

// // 🚀 Dynamic SSL Data display configuration contract definition
// interface LatestSSLData {  
//   sslValid: boolean | null  
//   sslExpiryDays: number | null
// }

// // Next.js App Router dynamic page standard signature
// interface PageProps {
//   params: Promise<{ id: string }>
// }

// export default function MonitorDetailPage({ params }: PageProps) {
//   // Unwrapping the dynamic route parameters safely using the native 'use' hook
//   const resolvedParams = use(params)
//   const monitorId = resolvedParams.id

//   const router = useRouter()
//   const { toast } = useToast()

//   const [monitor, setMonitor] = useState<Monitor | null>(null)
//   const [recentPings, setRecentPings] = useState<PingResult[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
//   const [copied, setCopied] = useState(false)

//   // 🚀 Track telemetry response updates for SSL evaluations
//   const [latestSSL, setLatestSSL] = useState<LatestSSLData | null>(null)

//   const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

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

//   // 🚀 Helper to parse through historical ping results for telemetry matching
//   const getLatestSSLData = (pings: PingResult[]) => {  
//     if (!pings || pings.length === 0) return null    
    
//     // Find the most recent ping that contains evaluated certificate data
//     const pingWithSSL = pings.find(ping =>     
//       ping.sslValid !== undefined || ping.sslExpiryDays !== undefined  
//     )    
    
//     if (!pingWithSSL) return null    
    
//     return {    
//       sslValid: pingWithSSL.sslValid ?? null,    
//       sslExpiryDays: pingWithSSL.sslExpiryDays ?? null,  
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
        
//         // Safely extracting individual object from Drizzle's array structure
//         const targetNode = Array.isArray(monitorData.monitor) 
//           ? monitorData.monitor[0] 
//           : monitorData.monitor

//         if (!targetNode) {
//           throw new Error('Database lookup succeeded but returned an empty cluster node definition.')
//         }
        
//         setMonitor(targetNode)

//         // Historic telemetry pipeline data lookups
//         const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
//           headers: { 'X-API-Key': apiKey }
//         })
        
//         if (pingsRes.ok) {
//           const pingsData = await pingsRes.json()
//           const pingsList = pingsData.pings || []
//           setRecentPings(pingsList)

//           // 🚀 Parse and extract dynamic certificate data from ping list tracking
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

//   const getStatusBadge = (status: Monitor['status']) => {
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

//   // 🚀 Get severity rules based on remaining validity durations
//   const getSSLWarning = (daysRemaining: number | null | undefined) => {  
//     if (daysRemaining === null || daysRemaining === undefined) return null  
//     if (daysRemaining <= 0) return { severity: 'critical', message: 'EXPIRED', color: 'bg-red-500' }  
//     if (daysRemaining <= 7) return { severity: 'critical', message: `${daysRemaining}d left`, color: 'bg-red-500' }  
//     if (daysRemaining <= 30) return { severity: 'warning', message: `${daysRemaining}d left`, color: 'bg-yellow-500' }  
//     if (daysRemaining <= 60) return { severity: 'info', message: `${daysRemaining}d left`, color: 'bg-blue-500' }  
//     return { severity: 'good', message: `${daysRemaining}d left`, color: 'bg-green-500' }
//   }

//   // 🚀 Computes final visual component states based on evaluation logic checks
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
//       <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
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
//       <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
//             <Button onClick={() => router.push('/')} size="sm">Return to Dashboard</Button>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   const statusBadge = getStatusBadge(monitor.status)
//   const StatusIcon = statusBadge.icon

//   return (
//     <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 max-w-full">
//         {/* Navigation Header */}
//         <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//           <div className="flex items-center gap-3">
//             <Link href="/">
//               <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//                 <ArrowLeft size={20} />
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//                 {monitor.name || 'Monitor Details'}
//                 <span className="text-primary">.</span>
//               </h1>
//               {/* URL with Copy Icon */}
//               <div className="flex items-center gap-2 mt-1">
//                 <p className="text-xs font-mono text-muted-foreground select-all">{monitor.url}</p>
//                 <button
//                   onClick={() => handleCopyUrl(monitor.url)}
//                   className="p-1 rounded-md hover:bg-muted transition-colors group focus:outline-none focus:ring-2 focus:ring-primary"
//                   title="Copy URL to clipboard"
//                 >
//                   {copied ? (
//                     <Check size={12} className="text-green-500" />
//                   ) : (
//                     <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <Button onClick={handlePingNow} variant="outline" size="sm" className="gap-2 h-9">
//               <Zap size={14} />
//               Ping Now
//             </Button>
//             <Link href={`/monitors/${monitor.id}/edit`}>
//               <Button size="sm" className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//                 Edit Monitor
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Status Overview Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</CardTitle>
//               <Activity size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
//                 <StatusIcon size={13} />
//                 {statusBadge.text}
//               </div>
//               <p className="text-[11px] text-muted-foreground mt-2.5">
//                 Last check: {formatDate(monitor.lastPingAt)}
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime Summary</CardTitle>
//               <Server size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold tracking-tight">{parseFloat(monitor.uptimePercentage || '100').toFixed(2)}%</div>
//               <p className="text-[11px] text-muted-foreground mt-1">
//                 {monitor.successfulPings} / {monitor.totalPings} verified heartbeat checks
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Latency</CardTitle>
//               <Clock size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold font-mono tracking-tight">{monitor.averageResponseMs || 0}ms</div>
//               <p className="text-[11px] text-muted-foreground mt-1">
//                 Timeout gateway cap: {(monitor.timeoutMs || 60000) / 1000}s
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency Window</CardTitle>
//               <Calendar size={16} className="text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold tracking-tight">
//                 {monitor.intervalSeconds >= 60 
//                   ? `${Math.floor(monitor.intervalSeconds / 60)}m` 
//                   : `${monitor.intervalSeconds}s`}
//               </div>
//               <p className="text-[11px] text-muted-foreground mt-1">
//                 Next scheduled trigger: {formatDate(monitor.nextPingAt)}
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Monitor Configuration Details & Activity Logs */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-sm font-bold tracking-tight">Configuration Profile</CardTitle>
//               <CardDescription className="text-xs">Active runtime definitions and environmental variables</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-1 text-xs">
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Hash size={13} /> Monitor ID
//                 </span>
//                 <span className="font-mono font-bold text-foreground">{monitor.id}</span>
//               </div>
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Globe size={13} /> Request Method
//                 </span>
//                 <Badge variant="outline" className="font-bold font-mono text-[10px] px-2 h-5">{monitor.method || 'GET'}</Badge>
//               </div>
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Cpu size={13} /> Node Region
//                 </span>
//                 <span className="font-medium text-foreground uppercase">{monitor.region || 'auto'}</span>
//               </div>
              
//               {/* 🚀 FIXED: Dynamic SSL Certificate display row integration */}
//               <div className="flex justify-between py-2.5 border-b border-border/60">
//                 <span className="text-muted-foreground flex items-center gap-2 font-medium">
//                   <Eye size={13} /> SSL Certificate
//                 </span>
//                 {(() => {
//                   const sslDisplay = formatSSLDisplay()
//                   if (!sslDisplay.show && !monitor?.sslEnabled) {
//                     return (
//                       <Badge variant="secondary" className="font-semibold text-[10px] px-2 h-5">
//                         Ignored
//                       </Badge>
//                     )
//                   }
//                   return (
//                     <div className="flex items-center gap-2">
//                       <Badge variant={sslDisplay.badgeVariant} className="font-semibold text-[10px] px-2 h-5">
//                         {sslDisplay.badgeText}
//                       </Badge>
//                       {latestSSL?.sslExpiryDays !== null && latestSSL?.sslExpiryDays !== undefined && latestSSL.sslExpiryDays <= 30 && (
//                         <span className="text-[10px] text-amber-500 font-medium animate-pulse">
//                           ⚠️ Expiring soon
//                         </span>
//                       )}
//                     </div>
//                   )
//                 })()}
//               </div>

//               <div className="flex justify-between py-2.5">
//                 <span className="text-muted-foreground font-medium">Description</span>
//                 <span className="text-foreground max-w-[70%] text-right truncate font-medium">{monitor.description || 'No custom memo provided'}</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-card border-border shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
//               <CardDescription className="text-xs">Telemetry results tracking the last 20 health checks</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {recentPings.length === 0 ? (
//                 <div className="py-8 text-center border border-dashed rounded-lg bg-muted/20">
//                   <p className="text-xs text-muted-foreground font-medium">No system log files populated yet.</p>
//                   <p className="text-[11px] text-muted-foreground/60 mt-0.5">Execute an on-demand "Ping Now" pulse to establish metrics.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
//                   {recentPings.map((ping) => (
//                     <div
//                       key={ping.id}
//                       className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border cursor-pointer hover:bg-accent/40 hover:border-primary/20 transition-all duration-150 group"
//                       onClick={() => setSelectedPing(ping)}
//                     >
//                       <div className="flex items-center gap-2.5 min-w-0">
//                         <div className="transition-transform group-hover:scale-105">
//                           {getPingIcon(ping)}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-xs font-bold text-foreground">
//                             {ping.success ? 'Healthy Connection' : 'Outage Event'}
//                             {ping.isWakeUp && <span className="text-[10px] text-orange-400 font-medium ml-1">🌙 Wake</span>}
//                           </p>
//                           <p className="text-[10px] text-muted-foreground mt-0.5">
//                             {formatDate(ping.createdAt)}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right flex-shrink-0 font-mono">
//                         {ping.responseTimeMs !== null && (
//                           <p className="text-xs font-bold text-foreground/90">{ping.responseTimeMs}ms</p>
//                         )}
//                         {ping.statusCode && (
//                           <p className={`text-[10px] font-medium ${ping.success ? 'text-muted-foreground' : 'text-red-400'}`}>
//                             HTTP {ping.statusCode}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* JSON Response Viewer Backdrop Overlay Modal */}
//         {selectedPing && selectedPing.jsonResponse && (
//           <div 
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
//             onClick={() => setSelectedPing(null)}
//           >
//             <div 
//               className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden" 
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
//                 <div>
//                   <h3 className="text-sm font-bold tracking-tight text-foreground">JSON Response Stream</h3>
//                   <p className="text-[11px] text-muted-foreground mt-0.5">Historic event parameters mapped for Node reference #{selectedPing.id}</p>
//                 </div>
//                 <Button type="button" variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setSelectedPing(null)}>
//                   Close Logs
//                 </Button>
//               </div>
//               <div className="p-4 overflow-y-auto flex-1 bg-slate-950/40 font-mono">
//                 <pre className="text-xs text-blue-400 overflow-x-auto selection:bg-blue-500/20 leading-relaxed p-2">
//                   {typeof selectedPing.jsonResponse === 'string'
//                     ? selectedPing.jsonResponse
//                     : JSON.stringify(selectedPing.jsonResponse, null, 2)}
//                 </pre>
//               </div>
//             </div>
//           </div>
//         )}
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
  Play
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

// Next.js App Router dynamic page standard signature
interface PageProps {
  params: Promise<{ id: string }>
}

export default function MonitorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const monitorId = resolvedParams.id

  const router = useRouter()
  const { toast } = useToast()

  const [monitor, setMonitor] = useState<Monitor | null>(null)
  const [recentPings, setRecentPings] = useState<PingResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPing, setSelectedPing] = useState<PingResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [latestSSL, setLatestSSL] = useState<LatestSSLData | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || 'my-super-secret-key-123'

  // Copy URL to clipboard function
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

  // Toggle monitor pause/resume
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
        // Update local state
        setMonitor({ ...monitor, isActive: newStatus })
        // Refresh data after 2 seconds
        setTimeout(() => {
          window.location.reload()
        }, 2000)
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

        const pingsRes = await fetch(`/api/pings?monitorId=${monitorId}&limit=20`, {
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
        setTimeout(() => {
          window.location.reload()
        }, 3500)
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
      <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
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
      <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
        <Sidebar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-muted-foreground font-medium mb-4">Monitor not found in active cluster map.</p>
            <Button onClick={() => router.push('/')} size="sm">Return to Dashboard</Button>
          </div>
        </div>
      </main>
    )
  }

  const isPaused = !monitor.isActive
  const statusBadge = getStatusBadge(monitor.status, !isPaused)
  const StatusIcon = statusBadge.icon

  return (
    <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
      <Sidebar />
      <div className="px-4 sm:px-6 py-8 max-w-full">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
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
            {/* Pause/Resume Button */}
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

            {/* Ping Button - Disabled when paused */}
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
              <CardTitle className="text-sm font-bold tracking-tight">Recent Activity Log</CardTitle>
              <CardDescription className="text-xs">
                {isPaused 
                  ? 'Monitoring is paused. No new logs will appear until resumed.' 
                  : 'Telemetry results tracking the last 20 health checks'}
              </CardDescription>
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
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {recentPings.map((ping) => (
                    <div
                      key={ping.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border cursor-pointer hover:bg-accent/40 hover:border-primary/20 transition-all duration-150 group"
                      onClick={() => setSelectedPing(ping)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="transition-transform group-hover:scale-105">
                          {getPingIcon(ping)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground">
                            {ping.success ? 'Healthy Connection' : 'Outage Event'}
                            {ping.isWakeUp && <span className="text-[10px] text-orange-400 font-medium ml-1">🌙 Wake</span>}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {formatDate(ping.createdAt)}
                          </p>
                        </div>
                      </div>
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* JSON Response Viewer Backdrop Overlay Modal */}
        {selectedPing && selectedPing.jsonResponse && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
            onClick={() => setSelectedPing(null)}
          >
            <div 
              className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/20">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground">JSON Response Stream</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Historic event parameters mapped for Node reference #{selectedPing.id}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => setSelectedPing(null)}>
                  Close Logs
                </Button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 bg-slate-950/40 font-mono">
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
    </main>
  )
}