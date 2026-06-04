// 'use client'

// import { ArrowLeft, ChevronDown } from 'lucide-react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Slider } from '@/components/ui/slider'
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState } from 'react'

// export default function AddMonitorPage() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(false)

//   // Slider controls default tracking intervals in whole minutes (Default: 5 mins)
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

//   // 🚀 FIXED: Dynamic Environment variable binding with secure fallback string assignment
//   const API_KEY = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || "ZoY098Sd0aDIl7TdLi4V4fiYIoyo"

//   // Simplified auth headers using bound environment constants
//   const getAuthHeaders = () => ({
//     'Content-Type': 'application/json',
//     'X-API-Key': API_KEY,
//   })

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

//   // Orchestrates POST request to register a new monitor instance
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       // Validate URL is provided
//       if (!formData.url) {
//         toast({
//           title: '❌ Validation Error',
//           description: 'URL is required',
//           variant: 'destructive',
//         })
//         setIsLoading(false)
//         return
//       }

//       let name = formData.name
//       // Auto-extract hostname fallback if an explicit friendly name string is omitted
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

//       console.log('📤 Sending request to /api/monitors with:', {
//         name: name || 'Untitled Monitor',
//         url: formData.url,
//       })

//       // Sends the POST request with the validated API authentication keys included
//       const response = await fetch('/api/monitors', {
//         method: 'POST',
//         headers: getAuthHeaders(),
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
//           title: '✅ Monitor created',
//           description: data.warning || 'Your monitor configuration is now active.',
//         })
        
//         // Safe navigation frame delays to shield App Router initialization contexts
//         setTimeout(() => {
//           router.push('/')
//           setTimeout(() => {
//             router.refresh()
//           }, 100)
//         }, 50)
//       } else {
//         console.error(`❌ Monitor submission failed with status code ${response.status}`, data)
        
//         // 🚀 FIXED: Contextual fallback evaluation for handling 409 database conflicts cleanly
//         let errorMessage = data.error || 'Server rejected configuration inputs.'
//         if (response.status === 409) {
//           errorMessage = 'This URL target endpoint is already registered inside your database mapping pipeline.'
//         }

//         toast({
//           title: `❌ Failed to create monitor (${response.status})`,
//           description: errorMessage,
//           variant: 'destructive',
//         })
//       }
//     } catch (error) {
//       console.error('🚨 SUBMIT ERROR:', error)
//       toast({
//         title: '❌ Error',
//         description: 'Something went wrong while connecting to the endpoint.',
//         variant: 'destructive',
//       })
//     } finally {
//       setIsLoading(false)
//     }
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
//             Add single monitor<span className="text-primary">.</span>
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
//                   type="text"
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
//                         className="rounded border-border bg-card text-primary focus:ring-primary h-4 w-4"
//                         checked={formData.sslEnabled}
//                         onChange={(e) => setFormData({ ...formData, sslEnabled: e.target.checked })}
//                       />
//                       <div>
//                         <Label htmlFor="sslEnabled" className="text-xs font-semibold text-foreground cursor-pointer">
//                           Enable SSL Expiry Verification
//                         </Label>
//                         <p className="text-[11px] text-muted-foreground mt-0.5">
//                           Alert will toggle automatically when certificate chains cross beneath threshold parameters.
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
//                   {isLoading ? 'Creating Monitor...' : 'Create monitor'}
//                 </Button>
//               </div>
//             </div>

//             {/* Right Informational Sidebar */}
//             <div className="col-span-1">
//               <div className="sticky top-6 space-y-4">
//                 <div className="p-4 rounded-lg bg-card border border-border">
//                   <h3 className="text-sm font-semibold text-primary mb-2">Monitor details</h3>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     Additional tracking options and parameters will appear here as you configure your heartbeat checks.
//                   </p>
//                 </div>

//                 <div className="p-4 rounded-lg bg-card border border-border">
//                   <h3 className="text-sm font-semibold text-foreground mb-2">In-App Alerts</h3>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     Failures and wake cycles will bubble up instantly to your integrated operational dashboard feed.
//                   </p>
//                 </div>

//                 <div className="p-4 rounded-lg bg-card border border-border">
//                   <h3 className="text-sm font-semibold text-foreground mb-2">Maintenance info</h3>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     Schedule localized service windows where health check execution triggers are paused.
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

















































// 'use client'

// import { ArrowLeft, ChevronDown, AlertTriangle } from 'lucide-react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Slider } from '@/components/ui/slider'
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
// import { Sidebar } from '@/components/sidebar'
// import { useToast } from '@/hooks/use-toast'
// import { useState } from 'react'

// export default function AddMonitorPage() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(false)
  
//   // 🚀 FIXED: Added local layout error string tracker state
//   const [submissionError, setSubmissionError] = useState<string | null>(null)

//   // Slider controls default tracking intervals in whole minutes (Default: 5 mins)
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

//   // Dynamic Environment variable binding with secure fallback string assignment
//   const API_KEY = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || "ZoY098Sd0aDIl7TdLi4V4fiYIoyo"

//   // Simplified auth headers using bound environment constants
//   const getAuthHeaders = () => ({
//     'Content-Type': 'application/json',
//     'X-API-Key': API_KEY,
//   })

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

//   // Orchestrates POST request to register a new monitor instance
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setSubmissionError(null) // Reset any existing structural layouts errors on recalculation trigger

//     try {
//       // Validate URL is provided
//       if (!formData.url) {
//         setSubmissionError('URL field cannot be blank.')
//         setIsLoading(false)
//         return
//       }

//       let name = formData.name
//       // Auto-extract hostname fallback if an explicit friendly name string is omitted
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

//       console.log('📤 Sending request to /api/monitors with:', {
//         name: name || 'Untitled Monitor',
//         url: formData.url,
//       })

//       // Sends the POST request with the validated API authentication keys included
//       const response = await fetch('/api/monitors', {
//         method: 'POST',
//         headers: getAuthHeaders(),
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

//       // Safely read body text first to protect the UI thread from crashing if response isn't valid JSON
//       const responseText = await response.text()
//       let data: any = {}
      
//       try {
//         if (responseText) {
//           data = JSON.parse(responseText)
//         }
//       } catch (jsonError) {
//         console.warn('⚠️ Response was not JSON, falling back to raw text parsing.', jsonError)
//       }

//       if (response.ok) {
//         toast({
//           title: '✅ Monitor created',
//           description: data?.warning || 'Your monitor configuration is now active.',
//         })
        
//         // Safe navigation frame delays to shield App Router initialization contexts
//         setTimeout(() => {
//           router.push('/')
//           setTimeout(() => {
//             router.refresh()
//           }, 100)
//         }, 50)
//       } else {
//         console.warn(`⚠️ Monitor submission handling response fallback status code ${response.status}`, data)
        
//         // 🚀 FIXED: Route error string messages straight into UI state rendering pipelines
//         if (response.status === 409) {
//           setSubmissionError('This monitor URL target endpoint is already registered inside your database tracking pipeline. Try configuring a unique endpoint tracking query parameter or check your inactive repository feed list.')
//         } else if (data?.error) {
//           setSubmissionError(data.error)
//         } else if (responseText && responseText.length < 150) {
//           setSubmissionError(responseText)
//         } else {
//           setSubmissionError(`Server rejected operational configuration values with transaction status code: ${response.status}`)
//         }
//       }
//     } catch (error) {
//       console.error('🚨 SUBMIT ERROR:', error)
//       setSubmissionError('Network Connection Error: Failed to establish a clean processing pipe execution channel to your database connector.')
//     } finally {
//       setIsLoading(false)
//     }
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
//             Add single monitor<span className="text-primary">.</span>
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
//               <div className="space-y-2">
//                 <Label htmlFor="url" className="text-sm font-semibold text-foreground block">
//                   URL to monitor
//                 </Label>
//                 <Input
//                   id="url"
//                   type="text"
//                   placeholder="https://"
//                   className={`bg-card border text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-primary ${submissionError ? 'border-red-500/80 focus:ring-red-500 bg-red-500/5' : 'border-border'}`}
//                   value={formData.url}
//                   onChange={(e) => {
//                     setFormData({ ...formData, url: e.target.value })
//                     if (submissionError) setSubmissionError(null) // Dynamic clearing when typing restarts
//                   }}
//                   required
//                 />
                
//                 {/* 🚀 FIXED: Dynamic Persistent Red UI Warning Panel Component Block */}
//                 {submissionError && (
//                   <div className="mt-3 p-4 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
//                     <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                     <div className="flex-1">
//                       <h4 className="text-sm font-bold text-red-400 tracking-tight">Configuration Error Rule Exception</h4>
//                       <p className="text-xs text-red-200/90 leading-relaxed mt-1">{submissionError}</p>
//                     </div>
//                   </div>
//                 )}
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
//                         className="rounded border-border bg-card text-primary focus:ring-primary h-4 w-4"
//                         checked={formData.sslEnabled}
//                         onChange={(e) => setFormData({ ...formData, sslEnabled: e.target.checked })}
//                       />
//                       <div>
//                         <Label htmlFor="sslEnabled" className="text-xs font-semibold text-foreground cursor-pointer">
//                           Enable SSL Expiry Verification
//                         </Label>
//                         <p className="text-[11px] text-muted-foreground mt-0.5">
//                           Alert will toggle automatically when certificate chains cross beneath threshold parameters.
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
//                   {isLoading ? 'Creating Monitor...' : 'Create monitor'}
//                 </Button>
//               </div>
//             </div>

//             {/* Right Informational Sidebar */}
//             <div className="col-span-1">
//               <div className="sticky top-6 space-y-4">
//                 <div className="p-4 rounded-lg bg-card border border-border">
//                   <h3 className="text-sm font-semibold text-primary mb-2">Monitor details</h3>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     Additional tracking options and parameters will appear here as you configure your heartbeat checks.
//                   </p>
//                 </div>

//                 <div className="p-4 rounded-lg bg-card border border-border">
//                   <h3 className="text-sm font-semibold text-foreground mb-2">In-App Alerts</h3>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     Failures and wake cycles will bubble up instantly to your integrated operational dashboard feed.
//                   </p>
//                 </div>

//                 <div className="p-4 rounded-lg bg-card border border-border">
//                   <h3 className="text-sm font-semibold text-foreground mb-2">Maintenance info</h3>
//                   <p className="text-xs text-muted-foreground leading-relaxed">
//                     Schedule localized service windows where health check execution triggers are paused.
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

import { ArrowLeft, ChevronDown, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Sidebar } from '@/components/sidebar'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'

export default function AddMonitorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  // Slider controls
  const [interval, setInterval] = useState([5])

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

  const API_KEY = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY || "ZoY098Sd0aDIl7TdLi4V4fiYIoyo"

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  })

  const handleSliderChange = (newVal: number[]) => {
    setInterval(newVal)
    setFormData(prev => ({ ...prev, intervalSeconds: newVal[0] * 60 }))
  }

  const handleSetCustomInterval = () => {
    const customInput = document.getElementById('customInterval') as HTMLInputElement
    if (!customInput) return

    const value = parseInt(customInput.value)
    if (!isNaN(value) && value >= 30 && value <= 86400) {
      setFormData(prev => ({ ...prev, intervalSeconds: value }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmissionError(null)

    try {
      if (!formData.url) {
        setSubmissionError('URL field cannot be blank.')
        setIsLoading(false)
        return
      }

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

      const response = await fetch('/api/monitors', {
        method: 'POST',
        headers: getAuthHeaders(),
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

      const responseText = await response.text()
      let data: any = {}
      
      try {
        if (responseText) {
          data = JSON.parse(responseText)
        }
      } catch (jsonError) {
        console.warn('⚠️ Response was not JSON', jsonError)
      }

      if (response.ok) {
        toast({
          title: '✅ Monitor created',
          description: data?.warning || 'Your monitor configuration is now active.',
        })
        
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 100)
      } else if (response.status === 409) {
        setSubmissionError('This URL is already registered. Please use a different URL.')
      } else if (data?.error) {
        setSubmissionError(data.error)
      } else {
        setSubmissionError(`Server error: ${response.status}`)
      }
    } catch (error) {
      console.error('SUBMIT ERROR:', error)
      setSubmissionError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
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
              Add single monitor<span className="text-primary">.</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Main Form - Left Column */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                
                {/* Monitor Type */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-4 block">Monitor type</Label>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/30 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                      H
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">HTTP / website monitoring</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Monitor your website, API endpoint, or anything running on HTTP/HTTPS
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-sm font-semibold text-foreground block">
                    URL to monitor
                  </Label>
                  <Input
                    id="url"
                    type="text"
                    placeholder="https://"
                    className={`bg-card border text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-primary ${submissionError ? 'border-red-500/80 bg-red-500/5' : 'border-border'}`}
                    value={formData.url}
                    onChange={(e) => {
                      setFormData({ ...formData, url: e.target.value })
                      if (submissionError) setSubmissionError(null)
                    }}
                    required
                  />
                  
                  {submissionError && (
                    <div className="mt-3 p-4 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-red-400">Configuration Error</h4>
                        <p className="text-xs text-red-200/90 leading-relaxed mt-1">{submissionError}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Monitor Name */}
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

                {/* Monitor Interval */}
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

                  {/* Custom interval */}
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
                          className="text-xs h-9 border-border bg-card/60 hover:bg-accent"
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

                {/* Region */}
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

                {/* Expandable Sections */}
                <div className="space-y-4 pt-2">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group">
                      <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-transform duration-200" />
                      SSL certificate and Domain checks
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 px-6 text-xs text-muted-foreground space-y-4 border-l-2 border-border ml-2 mt-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="sslEnabled"
                          className="rounded border-border bg-card text-primary focus:ring-primary h-4 w-4"
                          checked={formData.sslEnabled}
                          onChange={(e) => setFormData({ ...formData, sslEnabled: e.target.checked })}
                        />
                        <div>
                          <Label htmlFor="sslEnabled" className="text-xs font-semibold text-foreground cursor-pointer">
                            Enable SSL Expiry Verification
                          </Label>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Alerts when SSL certificates are about to expire.
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group">
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

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Monitor...' : 'Create monitor'}
                  </Button>
                </div>
              </div>

              {/* Right Sidebar - Info Panel */}
              <div className="col-span-1">
                <div className="sticky top-6 space-y-4">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="text-sm font-semibold text-primary mb-2">Monitor details</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Configure your monitoring settings here.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-2">In-App Alerts</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Failures and wake cycles will appear in your dashboard.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-card border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Wake-up Detection</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      60-second timeout + 3 retries = aggressive wake-up handling.
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