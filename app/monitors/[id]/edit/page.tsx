// 'use client'

// import { ArrowLeft, ChevronDown } from 'lucide-react'
// import Link from 'next/link'
// import { useRouter, useParams } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Slider } from '@/components/ui/slider'
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState, useEffect } from 'react'

// export default function EditMonitorPage() {
//   const router = useRouter()
//   const params = useParams()
//   const monitorId = params.id as string
//   const { toast } = useToast()
  
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFetching, setIsFetching] = useState(true)
//   const [hasError, setHasError] = useState(false)
  
//   // Slider controls default tracking intervals in whole minutes
//   const [interval, setInterval] = useState([5])

//   // Unified State Model fully mapping properties expected by secure API endpoints
//   const [formData, setFormData] = useState({
//     name: '',
//     url: '',
//     intervalSeconds: 300,
//     timeoutMs: 60000,
//     monitorType: 'http',
//     method: 'GET',
//     region: 'auto',
//     sslEnabled: false,
//     customHeaders: {},
//     requestBody: '',
//     expectedStatusCodes: [200, 201, 202, 204],
//   })

//   // 🚀 ACTIVE KEY REALIGNMENT
//   const AUTH_HEADERS = {
//     'Content-Type': 'application/json',
//     'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
//   }

//   // Fetch existing monitor data on page load
//   useEffect(() => {
//     const fetchMonitor = async () => {
//       try {
//         setHasError(false)
//         console.log(`🔍 Attempting to fetch monitor with ID: "${monitorId}" (Type: ${typeof monitorId})`);
        
//         // Guard check: If ID is literally the string "[id]" or undefined, stop early
//         if (!monitorId || monitorId === '[id]') {
//           console.warn('⚠️ Next.js router params are not fully initialized yet.');
//           return;
//         }

//         const response = await fetch(`/api/monitors/${monitorId}`, {
//           method: 'GET',
//           headers: AUTH_HEADERS
//         })
        
//         if (!response.ok) {
//           console.error(`❌ API Server responded with status: ${response.status} (${response.statusText})`);
//           try {
//             const errorData = await response.json();
//             console.error('📋 Backend Error Details:', errorData);
//           } catch (_) {
//             console.error('📋 Could not parse JSON error response from server.');
//           }
//           throw new Error(`Server returned status ${response.status}`);
//         }
        
//         const data = await response.json()
//         const monitor = data.monitor
        
//         // Pre-populate form with existing data safely
//         let parsedHeaders = {}
//         try {
//           parsedHeaders = typeof monitor.customHeaders === 'string' 
//             ? JSON.parse(monitor.customHeaders) 
//             : monitor.customHeaders || {}
//         } catch (_) {}

//         let parsedCodes = [200, 201, 202, 204]
//         try {
//           if (monitor.expectedStatusCodes) {
//             parsedCodes = typeof monitor.expectedStatusCodes === 'string'
//               ? JSON.parse(monitor.expectedStatusCodes)
//               : monitor.expectedStatusCodes
//           }
//         } catch (_) {}
        
//         setFormData({
//           name: monitor.name || '',
//           url: monitor.url || '',
//           intervalSeconds: monitor.intervalSeconds || 300,
//           timeoutMs: monitor.timeoutMs || 60000,
//           monitorType: monitor.monitorType || 'http',
//           method: monitor.method || 'GET',
//           region: monitor.region || 'auto',
//           sslEnabled: monitor.sslEnabled || false,
//           customHeaders: parsedHeaders,
//           requestBody: monitor.requestBody || '',
//           expectedStatusCodes: parsedCodes,
//         })
        
//         // Sync slider with existing interval
//         const minutes = Math.max(1, Math.min(60, Math.floor((monitor.intervalSeconds || 300) / 60)))
//         setInterval([minutes])
        
//       } catch (error: any) {
//         console.error('Error fetching monitor:', error)
//         setHasError(true)
//         toast({
//           title: '❌ Error Loading Data',
//           description: error.message || 'Failed to load monitor data',
//           variant: 'destructive',
//         })
//       } finally {
//         setIsFetching(false)
//       }
//     }
    
//     if (monitorId) {
//       fetchMonitor()
//     }
//   }, [monitorId, toast])

//   // Synchronizes slider position directly into interval seconds payload
//   const handleSliderChange = (newVal: number[]) => {
//     setInterval(newVal)
//     setFormData(prev => ({ ...prev, intervalSeconds: newVal[0] * 60 }))
//   }

//   // Intercepts custom manual seconds inputs and safely parses numeric validation boundaries
//   const handleSetCustomInterval = () => {
//     const customInput = document.getElementById('customInterval') as HTMLInputElement
//     if (!customInput) return

//     const value = parseInt(customInput.value)
//     if (!isNaN(value) && value >= 30 && value <= 86400) {
//       setFormData(prev => ({ ...prev, intervalSeconds: value }))
      
//       // Keep slider value updated inside its 1-60 bounds for structural beauty
//       const clampedMinutes = Math.max(1, Math.min(60, Math.floor(value / 60)))
//       setInterval([clampedMinutes])

//       toast({
//         title: 'Interval updated',
//         description: `Now checking every ${value} seconds`,
//       })
//     } else {
//       toast({
//         title: 'Invalid interval',
//         description: 'Must be between 30 and 86400 seconds',
//         variant: 'destructive',
//       })
//     }
//   }

//   // Orchestrates PUT request to update existing monitor
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       let name = formData.name
//       if (!name && formData.url) {
//         try {
//           let parseableUrl = formData.url.trim()
//           if (!parseableUrl.startsWith('http://') && !parseableUrl.startsWith('https://')) {
//             parseableUrl = 'https://' + parseableUrl
//           }
//           name = new URL(parseableUrl).hostname
//         } catch {
//           name = 'Untitled Monitor'
//         }
//       }

//       const response = await fetch(`/api/monitors/${monitorId}`, {
//         method: 'PUT',
//         headers: AUTH_HEADERS,
//         body: JSON.stringify({
//           name: name || 'Untitled Monitor',
//           url: formData.url,
//           description: formData.name ? `Configured for ${formData.name}` : 'External API Monitor Instance',
//           intervalSeconds: formData.intervalSeconds,
//           timeoutMs: formData.timeoutMs,
//           monitorType: formData.monitorType,
//           method: formData.method,
//           region: formData.region,
//           sslEnabled: formData.sslEnabled,
//           customHeaders: formData.customHeaders,
//           requestBody: formData.requestBody || null,
//           expectedStatusCodes: formData.expectedStatusCodes,
//         }),
//       })

//       const data = await response.json()

//       if (response.ok) {
//         toast({
//           title: '✅ Monitor updated',
//           description: data.warning || 'Your monitor configuration has been saved.',
//         })
//         router.push('/')
//         router.refresh()
//       } else {
//         toast({
//           title: '❌ Failed to update monitor',
//           description: data.error || 'Server rejected configuration inputs.',
//           variant: 'destructive',
//         })
//       }
//     } catch (error) {
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while connecting to the endpoint.',
//         variant: 'destructive',
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Show loading state while fetching monitor data
//   if (isFetching) {
//     return (
//       <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
//         <Sidebar />
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground">Loading monitor data...</p>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   // If request errored out, show a clean error placeholder instead of an empty form
//   if (hasError) {
//     return (
//       <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
//         <Sidebar />
//         <div className="flex flex-col items-center justify-center h-screen px-4">
//           <div className="text-center max-w-md p-6 bg-card border border-border rounded-lg shadow-sm">
//             <h2 className="text-xl font-bold text-foreground mb-2">Unable to load configuration</h2>
//             <p className="text-sm text-muted-foreground mb-6">
//               The server returned an authentication or configuration error. Check your API token properties to align validation schemas.
//             </p>
//             <div className="flex gap-4 justify-center">
//               <Link href="/">
//                 <Button variant="outline">Back to Dashboard</Button>
//               </Link>
//               <Button onClick={() => window.location.reload()}>Retry Fetch</Button>
//             </div>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   return (
//     <main className="min-h-screen bg-background" style={{ marginLeft: '80px' }}>
//       <Sidebar />
//       <div className="px-4 sm:px-6 py-8 max-w-full">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-8">
//           <Link href="/">
//             <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
//               <ArrowLeft size={20} />
//             </Button>
//           </Link>
//           <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
//             Edit monitor<span className="text-primary">.</span>
//           </h1>
//         </div>

//         {/* Global Action Form Wrapper */}
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//             {/* Main Form Elements Column */}
//             <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              
//               {/* Monitor Type Selection Container */}
//               <div>
//                 <Label className="text-sm font-semibold text-foreground mb-4 block">Monitor type</Label>
//                 <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/30 transition-all">
//                   <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
//                     H
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-sm font-semibold text-foreground">HTTP / website monitoring</h3>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       Use HTTP(S) monitor to monitor your website, API endpoint, or anything running on HTTP
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Monitor Destination Target Input Field */}
//               <div>
//                 <Label htmlFor="url" className="text-sm font-semibold text-foreground mb-2 block">
//                   URL to monitor
//                 </Label>
//                 <Input
//                   id="url"
//                   type="url"
//                   placeholder="https://"
//                   className="bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-primary"
//                   value={formData.url}
//                   onChange={(e) => setFormData({ ...formData, url: e.target.value })}
//                   required
//                 />
//               </div>

//               {/* Optional Name Input Field Component */}
//               <div>
//                 <Label htmlFor="name" className="text-sm font-semibold text-foreground mb-2 block">
//                   Friendly Monitor Name (Optional)
//                 </Label>
//                 <Input
//                   id="name"
//                   type="text"
//                   placeholder="Production Web Server"
//                   className="bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-primary"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 />
//               </div>

//               {/* Monitor Interval Controller Module */}
//               <div>
//                 <Label className="text-sm font-semibold text-foreground mb-3 block">Monitor interval</Label>
//                 <p className="text-xs text-muted-foreground mb-3">
//                   Your monitor will be checked every{' '}
//                   <span className="font-semibold text-foreground">
//                     {formData.intervalSeconds >= 60 ? `${Math.floor(formData.intervalSeconds / 60)} minutes` : `${formData.intervalSeconds} seconds`}
//                   </span>.
//                 </p>
                
//                 <div className="flex items-center gap-4">
//                   <Slider
//                     value={interval}
//                     onValueChange={handleSliderChange}
//                     min={1}
//                     max={60}
//                     step={1}
//                     className="flex-1"
//                   />
//                 </div>

//                 <div className="flex items-center gap-3 justify-between mt-4 text-xs text-muted-foreground">
//                   <span>1m</span>
//                   <span>5m</span>
//                   <span>15m</span>
//                   <span>30m</span>
//                   <span>45m</span>
//                   <span>60m</span>
//                 </div>

//                 {/* Custom interval input panel cleanly styled to match original aesthetics */}
//                 <div className="mt-6 p-4 rounded-lg bg-card/40 border border-border/60 flex items-center gap-4">
//                   <div className="flex-1">
//                     <Label htmlFor="customInterval" className="text-xs font-semibold text-muted-foreground">
//                       Or enter custom duration
//                     </Label>
//                     <div className="flex items-center gap-2 mt-1.5">
//                       <Input
//                         type="number"
//                         id="customInterval"
//                         placeholder="300"
//                         className="bg-card border-border w-32 focus:ring-1 focus:ring-primary text-sm h-9"
//                         min={30}
//                         max={86400}
//                       />
//                       <span className="text-xs text-muted-foreground font-medium">seconds</span>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={handleSetCustomInterval}
//                         className="text-xs h-9 border-border bg-card/60 hover:bg-accent hover:text-accent-foreground"
//                       >
//                         Apply
//                       </Button>
//                     </div>
//                     <p className="text-[11px] text-muted-foreground/70 mt-1.5">
//                       Range: 30 seconds to 24 hours (86,400 seconds)
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Region to monitor from */}
//               <div>
//                 <Label className="text-sm font-semibold text-foreground mb-3 block">Region to monitor from</Label>
                
//                 <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-primary/30 bg-primary/5">
//                   <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M13 7H7v6h6V7z" />
//                   </svg>
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold text-foreground">Default Regional Worker (Auto-Select)</p>
//                     <p className="text-xs text-muted-foreground mt-0.5">
//                       Requests will automatically route via your primary ping cluster engine.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Expandable Advanced Configurations */}
//               <div className="space-y-4 pt-2">
//                 <Collapsible>
//                   <CollapsibleTrigger type="button" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group">
//                     <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-transform duration-200" />
//                     SSL certificate and Domain checks
//                   </CollapsibleTrigger>
//                   <CollapsibleContent className="pt-4 px-6 text-xs text-muted-foreground space-y-4 border-l-2 border-border ml-2 mt-1">
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="checkbox"
//                         id="sslEnabled"
//                         className="rounded border border-border bg-card text-primary focus:ring-primary h-4 w-4"
//                         checked={formData.sslEnabled}
//                         onChange={(e) => setFormData({ ...formData, sslEnabled: e.target.checked })}
//                       />
//                       <div>
//                         <Label htmlFor="sslEnabled" className="text-xs font-semibold text-foreground cursor-pointer">
//                           Enable SSL Expiry Verification
//                         </Label>
//                         <p className="text-[11px] text-muted-foreground mt-0.5">
//                           Alerts will toggle automatically when certificate chains cross beneath threshold parameters.
//                         </p>
//                       </div>
//                     </div>
//                   </CollapsibleContent>
//                 </Collapsible>

//                 <Collapsible>
//                   <CollapsibleTrigger type="button" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group">
//                     <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-transform duration-200" />
//                     Advanced settings
//                   </CollapsibleTrigger>
//                   <CollapsibleContent className="pt-4 px-6 text-xs text-muted-foreground space-y-4 border-l-2 border-border ml-2 mt-1">
//                     <div className="space-y-3">
//                       <div>
//                         <Label className="text-xs font-semibold text-foreground block mb-1">HTTP Request Method</Label>
//                         <select
//                           className="bg-card border border-border text-foreground text-xs rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-primary"
//                           value={formData.method}
//                           onChange={(e) => setFormData({ ...formData, method: e.target.value })}
//                         >
//                           <option value="GET">GET</option>
//                           <option value="HEAD">HEAD</option>
//                           <option value="POST">POST</option>
//                           <option value="OPTIONS">OPTIONS</option>
//                         </select>
//                       </div>

//                       <div>
//                         <Label htmlFor="timeoutInput" className="text-xs font-semibold text-foreground block mb-1">
//                           Network Timeout Duration (ms)
//                         </Label>
//                         <Input
//                           id="timeoutInput"
//                           type="number"
//                           className="bg-card border-border text-foreground text-xs h-9"
//                           value={formData.timeoutMs}
//                           onChange={(e) => setFormData({ ...formData, timeoutMs: Math.max(1, parseInt(e.target.value) || 0) })}
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="requestBody" className="text-xs font-semibold text-foreground block mb-1">
//                           HTTP Raw Payload Body (Optional)
//                         </Label>
//                         <textarea
//                           id="requestBody"
//                           rows={3}
//                           placeholder='{"status": "ping"}'
//                           className="bg-card border border-border text-foreground text-xs rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground resize-none"
//                           value={formData.requestBody}
//                           onChange={(e) => setFormData({ ...formData, requestBody: e.target.value })}
//                         />
//                       </div>
//                     </div>
//                   </CollapsibleContent>
//                 </Collapsible>
//               </div>

//               {/* Form Actions Submit Button */}
//               <div className="pt-6">
//                 <Button 
//                   type="submit" 
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base shadow-lg transition-colors"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Saving Changes...' : 'Save changes'}
//                 </Button>
//               </div>
//             </div>

//             {/* Right Informational Sidebar */}
//             <div className="col-span-1">
//               <div className="sticky top-6 space-y-4">
//                 <div className="p-4 rounded-lg bg-card border border-border">
//                   <h3 className="text-sm font-semibold text-primary mb-2">Edit monitor</h3>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     Modify your monitor configuration. Changes will take effect on the next ping cycle.
//                   </p>
//                 </div>

//                 <div className="p-4 rounded-lg bg-card border border-border">
//                   <h3 className="text-sm font-semibold text-foreground mb-2">In-App Alerts</h3>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     Failures and wake cycles will bubble up instantly to your integrated operational dashboard feed.
//                   </p>
//                 </div>

//                 <div className="p-4 rounded-lg bg-card border border-border">
//                   <h3 className="text-sm font-semibold text-foreground mb-2">Wake-up detection</h3>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     60-second timeout + 6 retry attempts = aggressive wake-up handling for sleeping servers.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </main>
//   )
// }
































'use client'

import { ArrowLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Sidebar } from '@/components/sidebar'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'

export default function EditMonitorPage() {
  const router = useRouter()
  const params = useParams()
  const monitorId = params.id as string
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Slider controls default tracking intervals in whole minutes
  const [interval, setInterval] = useState([5])

  // Unified State Model fully mapping properties expected by secure API endpoints
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    intervalSeconds: 300,
    timeoutMs: 60000,
    monitorType: 'http',
    method: 'GET',
    region: 'auto',
    sslEnabled: false,
    customHeaders: {},
    requestBody: '',
    expectedStatusCodes: [200, 201, 202, 204],
  })

  // ✅ Mobile responsive check (same as dashboard)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 🚀 ACTIVE KEY REALIGNMENT
  const AUTH_HEADERS = {
    'Content-Type': 'application/json',
    'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'
  }

  // Fetch existing monitor data on page load
  useEffect(() => {
    const fetchMonitor = async () => {
      try {
        setHasError(false)
        console.log(`🔍 Attempting to fetch monitor with ID: "${monitorId}" (Type: ${typeof monitorId})`);
        
        // Guard check: If ID is literally the string "[id]" or undefined, stop early
        if (!monitorId || monitorId === '[id]') {
          console.warn('⚠️ Next.js router params are not fully initialized yet.');
          return;
        }

        const response = await fetch(`/api/monitors/${monitorId}`, {
          method: 'GET',
          headers: AUTH_HEADERS
        })
        
        if (!response.ok) {
          console.error(`❌ API Server responded with status: ${response.status} (${response.statusText})`);
          try {
            const errorData = await response.json();
            console.error('📋 Backend Error Details:', errorData);
          } catch (_) {
            console.error('📋 Could not parse JSON error response from server.');
          }
          throw new Error(`Server returned status ${response.status}`);
        }
        
        const data = await response.json()
        const monitor = data.monitor
        
        // Pre-populate form with existing data safely
        let parsedHeaders = {}
        try {
          parsedHeaders = typeof monitor.customHeaders === 'string' 
            ? JSON.parse(monitor.customHeaders) 
            : monitor.customHeaders || {}
        } catch (_) {}

        let parsedCodes = [200, 201, 202, 204]
        try {
          if (monitor.expectedStatusCodes) {
            parsedCodes = typeof monitor.expectedStatusCodes === 'string'
              ? JSON.parse(monitor.expectedStatusCodes)
              : monitor.expectedStatusCodes
          }
        } catch (_) {}
        
        setFormData({
          name: monitor.name || '',
          url: monitor.url || '',
          intervalSeconds: monitor.intervalSeconds || 300,
          timeoutMs: monitor.timeoutMs || 60000,
          monitorType: monitor.monitorType || 'http',
          method: monitor.method || 'GET',
          region: monitor.region || 'auto',
          sslEnabled: monitor.sslEnabled || false,
          customHeaders: parsedHeaders,
          requestBody: monitor.requestBody || '',
          expectedStatusCodes: parsedCodes,
        })
        
        // Sync slider with existing interval
        const minutes = Math.max(1, Math.min(60, Math.floor((monitor.intervalSeconds || 300) / 60)))
        setInterval([minutes])
        
      } catch (error: any) {
        console.error('Error fetching monitor:', error)
        setHasError(true)
        toast({
          title: '❌ Error Loading Data',
          description: error.message || 'Failed to load monitor data',
          variant: 'destructive',
        })
      } finally {
        setIsFetching(false)
      }
    }
    
    if (monitorId) {
      fetchMonitor()
    }
  }, [monitorId, toast])

  // Synchronizes slider position directly into interval seconds payload
  const handleSliderChange = (newVal: number[]) => {
    setInterval(newVal)
    setFormData(prev => ({ ...prev, intervalSeconds: newVal[0] * 60 }))
  }

  // Intercepts custom manual seconds inputs and safely parses numeric validation boundaries
  const handleSetCustomInterval = () => {
    const customInput = document.getElementById('customInterval') as HTMLInputElement
    if (!customInput) return

    const value = parseInt(customInput.value)
    if (!isNaN(value) && value >= 30 && value <= 86400) {
      setFormData(prev => ({ ...prev, intervalSeconds: value }))
      
      // Keep slider value updated inside its 1-60 bounds for structural beauty
      const clampedMinutes = Math.max(1, Math.min(60, Math.floor(value / 60)))
      setInterval([clampedMinutes])

      toast({
        title: 'Interval updated',
        description: `Now checking every ${value} seconds`,
      })
    } else {
      toast({
        title: 'Invalid interval',
        description: 'Must be between 30 and 86400 seconds',
        variant: 'destructive',
      })
    }
  }

  // Orchestrates PUT request to update existing monitor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let name = formData.name
      if (!name && formData.url) {
        try {
          let parseableUrl = formData.url.trim()
          if (!parseableUrl.startsWith('http://') && !parseableUrl.startsWith('https://')) {
            parseableUrl = 'https://' + parseableUrl
          }
          name = new URL(parseableUrl).hostname
        } catch {
          name = 'Untitled Monitor'
        }
      }

      const response = await fetch(`/api/monitors/${monitorId}`, {
        method: 'PUT',
        headers: AUTH_HEADERS,
        body: JSON.stringify({
          name: name || 'Untitled Monitor',
          url: formData.url,
          description: formData.name ? `Configured for ${formData.name}` : 'External API Monitor Instance',
          intervalSeconds: formData.intervalSeconds,
          timeoutMs: formData.timeoutMs,
          monitorType: formData.monitorType,
          method: formData.method,
          region: formData.region,
          sslEnabled: formData.sslEnabled,
          customHeaders: formData.customHeaders,
          requestBody: formData.requestBody || null,
          expectedStatusCodes: formData.expectedStatusCodes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: '✅ Monitor updated',
          description: data.warning || 'Your monitor configuration has been saved.',
        })
        router.push('/dashboard')
        router.refresh()
      } else {
        toast({
          title: '❌ Failed to update monitor',
          description: data.error || 'Server rejected configuration inputs.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Something went wrong while connecting to the endpoint.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while fetching monitor data
  if (isFetching) {
    return (
      <main 
        className="min-h-screen bg-background flex flex-col transition-all duration-200"
        style={{ marginLeft: isMobile ? 0 : '80px' }}
      >
        <Sidebar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading monitor data...</p>
          </div>
        </div>
      </main>
    )
  }

  // If request errored out, show a clean error placeholder instead of an empty form
  if (hasError) {
    return (
      <main 
        className="min-h-screen bg-background flex flex-col transition-all duration-200"
        style={{ marginLeft: isMobile ? 0 : '80px' }}
      >
        <Sidebar />
        <div className="flex flex-col items-center justify-center h-screen px-4">
          <div className="text-center max-w-md p-6 bg-card border border-border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-2">Unable to load configuration</h2>
            <p className="text-sm text-muted-foreground mb-6">
              The server returned an authentication or configuration error. Check your API token properties to align validation schemas.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Button onClick={() => window.location.reload()}>Retry Fetch</Button>
            </div>
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
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/dashboard">
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Edit monitor<span className="text-primary">.</span>
            </h1>
          </div>

          {/* Global Action Form Wrapper */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Main Form Elements Column */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                
                {/* Monitor Type Selection Container */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-4 block">Monitor type</Label>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/30 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                      H
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">HTTP / website monitoring</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use HTTP(S) monitor to monitor your website, API endpoint, or anything running on HTTP
                      </p>
                    </div>
                  </div>
                </div>

                {/* Monitor Destination Target Input Field */}
                <div>
                  <Label htmlFor="url" className="text-sm font-semibold text-foreground mb-2 block">
                    URL to monitor
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://"
                    className="bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-primary"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                  />
                </div>

                {/* Optional Name Input Field Component */}
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-foreground mb-2 block">
                    Friendly Monitor Name (Optional)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Production Web Server"
                    className="bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-primary"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Monitor Interval Controller Module */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-3 block">Monitor interval</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Your monitor will be checked every{' '}
                    <span className="font-semibold text-foreground">
                      {formData.intervalSeconds >= 60 ? `${Math.floor(formData.intervalSeconds / 60)} minutes` : `${formData.intervalSeconds} seconds`}
                    </span>.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Slider
                      value={interval}
                      onValueChange={handleSliderChange}
                      min={1}
                      max={60}
                      step={1}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-3 justify-between mt-4 text-xs text-muted-foreground">
                    <span>1m</span>
                    <span>5m</span>
                    <span>15m</span>
                    <span>30m</span>
                    <span>45m</span>
                    <span>60m</span>
                  </div>

                  {/* Custom interval input panel cleanly styled to match original aesthetics */}
                  <div className="mt-6 p-4 rounded-lg bg-card/40 border border-border/60 flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="customInterval" className="text-xs font-semibold text-muted-foreground">
                        Or enter custom duration
                      </Label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Input
                          type="number"
                          id="customInterval"
                          placeholder="300"
                          className="bg-card border-border w-32 focus:ring-1 focus:ring-primary text-sm h-9"
                          min={30}
                          max={86400}
                        />
                        <span className="text-xs text-muted-foreground font-medium">seconds</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSetCustomInterval}
                          className="text-xs h-9 border-border bg-card/60 hover:bg-accent hover:text-accent-foreground"
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                        Range: 30 seconds to 24 hours (86,400 seconds)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Region to monitor from */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-3 block">Region to monitor from</Label>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-primary/30 bg-primary/5">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 7H7v6h6V7z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Default Regional Worker (Auto-Select)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Requests will automatically route via your primary ping cluster engine.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expandable Advanced Configurations */}
                <div className="space-y-4 pt-2">
                  <Collapsible>
                    <CollapsibleTrigger type="button" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group">
                      <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-transform duration-200" />
                      SSL certificate and Domain checks
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 px-6 text-xs text-muted-foreground space-y-4 border-l-2 border-border ml-2 mt-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="sslEnabled"
                          className="rounded border border-border bg-card text-primary focus:ring-primary h-4 w-4"
                          checked={formData.sslEnabled}
                          onChange={(e) => setFormData({ ...formData, sslEnabled: e.target.checked })}
                        />
                        <div>
                          <Label htmlFor="sslEnabled" className="text-xs font-semibold text-foreground cursor-pointer">
                            Enable SSL Expiry Verification
                          </Label>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Alerts will toggle automatically when certificate chains cross beneath threshold parameters.
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger type="button" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group">
                      <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-transform duration-200" />
                      Advanced settings
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 px-6 text-xs text-muted-foreground space-y-4 border-l-2 border-border ml-2 mt-1">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-semibold text-foreground block mb-1">HTTP Request Method</Label>
                          <select
                            className="bg-card border border-border text-foreground text-xs rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-primary"
                            value={formData.method}
                            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                          >
                            <option value="GET">GET</option>
                            <option value="HEAD">HEAD</option>
                            <option value="POST">POST</option>
                            <option value="OPTIONS">OPTIONS</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="timeoutInput" className="text-xs font-semibold text-foreground block mb-1">
                            Network Timeout Duration (ms)
                          </Label>
                          <Input
                            id="timeoutInput"
                            type="number"
                            className="bg-card border-border text-foreground text-xs h-9"
                            value={formData.timeoutMs}
                            onChange={(e) => setFormData({ ...formData, timeoutMs: Math.max(1, parseInt(e.target.value) || 0) })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="requestBody" className="text-xs font-semibold text-foreground block mb-1">
                            HTTP Raw Payload Body (Optional)
                          </Label>
                          <textarea
                            id="requestBody"
                            rows={3}
                            placeholder='{"status": "ping"}'
                            className="bg-card border border-border text-foreground text-xs rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-primary placeholder-muted-foreground resize-none"
                            value={formData.requestBody}
                            onChange={(e) => setFormData({ ...formData, requestBody: e.target.value })}
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Form Actions Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base shadow-lg transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving Changes...' : 'Save changes'}
                  </Button>
                </div>
              </div>

              {/* Right Informational Sidebar */}
              <div className="col-span-1">
                <div className="sticky top-6 space-y-4">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="text-sm font-semibold text-primary mb-2">Edit monitor</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Modify your monitor configuration. Changes will take effect on the next ping cycle.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-2">In-App Alerts</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Failures and wake cycles will bubble up instantly to your integrated operational dashboard feed.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Wake-up detection</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      60-second timeout + 6 retry attempts = aggressive wake-up handling for sleeping servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}