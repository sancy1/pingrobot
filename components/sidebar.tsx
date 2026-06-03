// 'use client'

// import { Home, Plus, LayoutGrid, Filter, ArrowDownUp, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { useState, useRef, useEffect } from 'react'

// const NAV_ITEMS = [
//   { icon: Home, label: 'Home', href: '/', id: 'home' },
//   { icon: Plus, label: 'New Monitor', href: '/add-monitor', id: 'new' },
// ]

// const FILTER_ITEMS = [
//   { icon: LayoutGrid, label: 'Show Groups', id: 'groups' },
//   { icon: Filter, label: 'Filter', id: 'filter' },
//   { icon: ArrowDownUp, label: 'Sort Down First', id: 'sort' },
// ]

// export function Sidebar() {
//   const pathname = usePathname()
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [width, setWidth] = useState(80)
//   const sidebarRef = useRef<HTMLDivElement>(null)
//   const isResizingRef = useRef(false)

//   // Handle resize
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizingRef.current) return
      
//       const newWidth = Math.max(80, Math.min(e.clientX, 280))
//       setWidth(newWidth)
//       setIsExpanded(newWidth > 120)
//     }

//     const handleMouseUp = () => {
//       isResizingRef.current = false
//     }

//     document.addEventListener('mousemove', handleMouseMove)
//     document.addEventListener('mouseup', handleMouseUp)

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove)
//       document.removeEventListener('mouseup', handleMouseUp)
//     }
//   }, [])

//   const isActive = (href: string) => pathname === href
//   const expandedWidth = Math.max(width, 80)

//   return (
//     <>
//       <aside
//         ref={sidebarRef}
//         className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col items-start py-8 gap-4 transition-all duration-300 z-50"
//         style={{ width: `${expandedWidth}px` }}
//       >
//         {/* Top Section - Logo and Toggle */}
//         <div className="w-full px-4 flex items-center justify-between">
//           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-lg shadow-lg flex-shrink-0">
//             P
//           </div>
//           {expandedWidth > 120 && (
//             <button
//               onClick={() => {
//                 setIsExpanded(false)
//                 setWidth(80)
//               }}
//               className="p-1 hover:bg-card rounded-lg transition-colors"
//               title="Collapse Sidebar"
//             >
//               <ChevronLeft size={18} className="text-muted-foreground" />
//             </button>
//           )}
//         </div>

//         {/* Navigation Buttons */}
//         <nav className="flex flex-col gap-3 w-full px-2">
//           {NAV_ITEMS.map((item) => {
//             const Icon = item.icon
//             const active = isActive(item.href)
//             const isNewButton = item.id === 'new'
//             const newPageActive = pathname === '/add-monitor'

//             return (
//               <Link
//                 key={item.id}
//                 href={item.href}
//                 className="w-full flex justify-center"
//               >
//                 <button
//                   className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
//                     isNewButton
//                       ? newPageActive
//                         ? 'bg-gray-500 text-white cursor-not-allowed opacity-60'
//                         : 'bg-green-600 text-white shadow-lg hover:bg-green-700'
//                       : active
//                       ? 'bg-blue-600 text-white shadow-lg'
//                       : 'text-muted-foreground hover:text-foreground hover:bg-card'
//                   }`}
//                   disabled={isNewButton && newPageActive}
//                   style={{
//                     minWidth: `${Math.max(48, expandedWidth - 16)}px`,
//                     width: expandedWidth > 120 ? 'auto' : '48px',
//                     justifyContent: expandedWidth > 120 ? 'flex-start' : 'center',
//                   }}
//                   title={item.label}
//                 >
//                   <Icon size={expandedWidth > 120 ? 18 : 22} strokeWidth={2} />
//                   {expandedWidth > 120 && (
//                     <span className="text-sm whitespace-nowrap">{item.label}</span>
//                   )}
//                 </button>
//               </Link>
//             )
//           })}
//         </nav>

//         {/* Filter Buttons */}
//         <div className="flex flex-col gap-2 w-full px-2 border-t border-sidebar-border pt-4">
//           {FILTER_ITEMS.map((item) => {
//             const Icon = item.icon
//             return (
//               <button
//                 key={item.id}
//                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-card"
//                 style={{
//                   minWidth: `${Math.max(48, expandedWidth - 16)}px`,
//                   width: expandedWidth > 120 ? 'auto' : '48px',
//                   justifyContent: expandedWidth > 120 ? 'flex-start' : 'center',
//                 }}
//                 title={item.label}
//               >
//                 <Icon size={expandedWidth > 120 ? 18 : 20} strokeWidth={2} />
//                 {expandedWidth > 120 && (
//                   <span className="text-sm whitespace-nowrap">{item.label}</span>
//                 )}
//               </button>
//             )
//           })}
//         </div>

//         {/* Expand Button (when collapsed) */}
//         {expandedWidth <= 120 && (
//           <div className="mt-auto w-full px-2 pb-4">
//             <button
//               onClick={() => {
//                 setWidth(240)
//                 setIsExpanded(true)
//               }}
//               className="w-full flex justify-center p-2 hover:bg-card rounded-lg transition-colors"
//               title="Expand Sidebar"
//             >
//               <ChevronRight size={18} className="text-muted-foreground" />
//             </button>
//           </div>
//         )}
//       </aside>

//       {/* Resize Handle */}
//       <div
//         onMouseDown={() => {
//           isResizingRef.current = true
//         }}
//         className="fixed left-[80px] top-0 h-screen w-1 hover:w-1.5 bg-transparent hover:bg-blue-500/30 cursor-col-resize transition-all z-40"
//         style={{ left: `${expandedWidth}px` }}
//         title="Drag to resize sidebar"
//       />

//       {/* Content margin adjustment */}
//       <style>{`
//         main {
//           transition: margin-left 0.3s ease;
//         }
//       `}</style>
//     </>
//   )
// }






































// 'use client'

// import { Home, Plus, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Search, X, ArrowUp, ArrowDown, Circle, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { useState, useRef, useEffect } from 'react'

// const NAV_ITEMS = [
//   { icon: Home, label: 'Home', href: '/', id: 'home' },
//   { icon: Plus, label: 'New Monitor', href: '/add-monitor', id: 'new' },
// ]

// // Filter options for status
// const STATUS_FILTERS = [
//   { value: 'all', label: 'All', icon: Circle, color: 'text-gray-400' },
//   { value: 'up', label: 'Up', icon: CheckCircle, color: 'text-green-500' },
//   { value: 'down', label: 'Down', icon: XCircle, color: 'text-red-500' },
//   { value: 'waking', label: 'Waking', icon: AlertCircle, color: 'text-orange-500' },
//   { value: 'degraded', label: 'Degraded', icon: AlertCircle, color: 'text-yellow-500' },
// ]

// type SortOption = 'status-desc' | 'status-asc' | 'name-asc' | 'name-desc' | 'uptime-desc' | 'uptime-asc'

// const SORT_OPTIONS: { value: SortOption; label: string }[] = [
//   { value: 'status-desc', label: 'Down First' },
//   { value: 'status-asc', label: 'Up First' },
//   { value: 'name-asc', label: 'Name A-Z' },
//   { value: 'name-desc', label: 'Name Z-A' },
//   { value: 'uptime-desc', label: 'Uptime (High to Low)' },
//   { value: 'uptime-asc', label: 'Uptime (Low to High)' },
// ]

// // Export these for use in parent component
// export type SidebarState = {
//   searchQuery: string
//   statusFilter: string
//   sortBy: SortOption
//   isFilterOpen: boolean
// }

// export function Sidebar({ 
//   onFilterChange 
// }: { 
//   onFilterChange?: (state: SidebarState) => void 
// }) {
//   const pathname = usePathname()
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [width, setWidth] = useState(80)
//   const sidebarRef = useRef<HTMLDivElement>(null)
//   const isResizingRef = useRef(false)
  
//   // Filter state
//   const [searchQuery, setSearchQuery] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [sortBy, setSortBy] = useState<SortOption>('status-desc')
//   const [isFilterOpen, setIsFilterOpen] = useState(false)

//   // Notify parent component of filter changes (client-side)
//   useEffect(() => {
//     if (onFilterChange) {
//       onFilterChange({
//         searchQuery,
//         statusFilter,
//         sortBy,
//         isFilterOpen,
//       })
//     }
//   }, [searchQuery, statusFilter, sortBy, isFilterOpen, onFilterChange])

//   // Handle resize
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizingRef.current) return
      
//       const newWidth = Math.max(80, Math.min(e.clientX, 280))
//       setWidth(newWidth)
//       setIsExpanded(newWidth > 120)
//     }

//     const handleMouseUp = () => {
//       isResizingRef.current = false
//     }

//     document.addEventListener('mousemove', handleMouseMove)
//     document.addEventListener('mouseup', handleMouseUp)

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove)
//       document.removeEventListener('mouseup', handleMouseUp)
//     }
//   }, [])

//   const isActive = (href: string) => pathname === href
//   const expandedWidth = Math.max(width, 80)
//   const isCollapsed = expandedWidth <= 120

//   // Get current sort label
//   const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Sort'

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchQuery('')
//     setStatusFilter('all')
//     setSortBy('status-desc')
//   }

//   // Check if any filter is active
//   const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || sortBy !== 'status-desc'

//   return (
//     <>
//       <aside
//         ref={sidebarRef}
//         className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col items-start py-8 z-50"
//         style={{ width: `${expandedWidth}px`, transition: 'width 0.2s ease' }}
//       >
//         {/* Top Section - Logo and Toggle */}
//         <div className="w-full px-3 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2 group">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-lg shadow-lg flex-shrink-0 transition-transform group-hover:scale-105">
//               P
//             </div>
//             {!isCollapsed && (
//               <span className="text-sm font-semibold text-foreground">PingRobot</span>
//             )}
//           </Link>
//           {!isCollapsed && (
//             <button
//               onClick={() => {
//                 setIsExpanded(false)
//                 setWidth(80)
//               }}
//               className="p-1.5 hover:bg-card rounded-lg transition-colors"
//               title="Collapse Sidebar"
//             >
//               <ChevronLeft size={16} className="text-muted-foreground" />
//             </button>
//           )}
//         </div>

//         {/* Navigation Buttons */}
//         <nav className="flex flex-col gap-1.5 w-full px-2 mt-6">
//           {NAV_ITEMS.map((item) => {
//             const Icon = item.icon
//             const active = isActive(item.href)

//             return (
//               <Link
//                 key={item.id}
//                 href={item.href}
//                 className="w-full"
//               >
//                 <button
//                   className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium w-full ${
//                     active
//                       ? 'bg-primary/10 text-primary hover:bg-primary/15'
//                       : 'text-muted-foreground hover:text-foreground hover:bg-card'
//                   }`}
//                   style={{
//                     justifyContent: isCollapsed ? 'center' : 'flex-start',
//                   }}
//                   title={isCollapsed ? item.label : undefined}
//                 >
//                   <Icon size={20} strokeWidth={active ? 2.5 : 2} />
//                   {!isCollapsed && (
//                     <span className="text-sm whitespace-nowrap">{item.label}</span>
//                   )}
//                 </button>
//               </Link>
//             )
//           })}
//         </nav>

//         {/* Divider */}
//         <div className="w-full px-3 my-3">
//           <div className="h-px bg-border" />
//         </div>

//         {/* Search Input - Only show when expanded */}
//         {!isCollapsed && (
//           <div className="w-full px-3 mb-2">
//             <div className="relative">
//               <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search monitors..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-8 pr-8 py-1.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery('')}
//                   className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                 >
//                   <X size={12} />
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Filter Toggle Button */}
//         <div className="w-full px-2">
//           <button
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full ${
//               isFilterOpen || hasActiveFilters
//                 ? 'bg-primary/10 text-primary'
//                 : 'text-muted-foreground hover:text-foreground hover:bg-card'
//             }`}
//             style={{
//               justifyContent: isCollapsed ? 'center' : 'flex-start',
//             }}
//             title={isCollapsed ? 'Filters' : undefined}
//           >
//             <Filter size={18} strokeWidth={isFilterOpen || hasActiveFilters ? 2.5 : 2} />
//             {!isCollapsed && (
//               <span className="text-sm whitespace-nowrap">
//                 Filters
//                 {hasActiveFilters && (
//                   <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary/20 rounded-full">
//                     Active
//                   </span>
//                 )}
//               </span>
//             )}
//           </button>
//         </div>

//         {/* Filter Panel - Expanded when filter is open */}
//         {!isCollapsed && isFilterOpen && (
//           <div className="w-full px-3 mt-2 space-y-3">
//             {/* Status Filter */}
//             <div>
//               <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
//               <div className="flex flex-wrap gap-1.5">
//                 {STATUS_FILTERS.map((filter) => {
//                   const Icon = filter.icon
//                   const isSelected = statusFilter === filter.value
//                   return (
//                     <button
//                       key={filter.value}
//                       onClick={() => setStatusFilter(filter.value)}
//                       className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all ${
//                         isSelected
//                           ? 'bg-primary/10 text-primary border border-primary/20'
//                           : 'bg-card border border-border text-muted-foreground hover:bg-card/80'
//                       }`}
//                     >
//                       <Icon size={10} className={filter.color} />
//                       <span>{filter.label}</span>
//                     </button>
//                   )
//                 })}
//               </div>
//             </div>

//             {/* Sort Options */}
//             <div>
//               <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1 block">
//                 <ArrowUpDown size={10} />
//                 Sort by
//               </label>
//               <div className="flex flex-wrap gap-1.5">
//                 {SORT_OPTIONS.map((option) => {
//                   const isSelected = sortBy === option.value
//                   return (
//                     <button
//                       key={option.value}
//                       onClick={() => setSortBy(option.value)}
//                       className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
//                         isSelected
//                           ? 'bg-primary/10 text-primary border border-primary/20'
//                           : 'bg-card border border-border text-muted-foreground hover:bg-card/80'
//                       }`}
//                     >
//                       {option.value.includes('asc') ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
//                       <span>{option.label}</span>
//                     </button>
//                   )
//                 })}
//               </div>
//             </div>

//             {/* Clear Filters Button */}
//             {hasActiveFilters && (
//               <button
//                 onClick={clearFilters}
//                 className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-1"
//               >
//                 <X size={10} />
//                 Clear all filters
//               </button>
//             )}
//           </div>
//         )}

//         {/* Expand Button (when collapsed) */}
//         {isCollapsed && (
//           <div className="mt-auto w-full px-2 pb-4">
//             <button
//               onClick={() => {
//                 setWidth(260)
//                 setIsExpanded(true)
//               }}
//               className="w-full flex justify-center p-2 hover:bg-card rounded-lg transition-colors"
//               title="Expand Sidebar"
//             >
//               <ChevronRight size={16} className="text-muted-foreground" />
//             </button>
//           </div>
//         )}
//       </aside>

//       {/* Resize Handle */}
//       <div
//         onMouseDown={() => {
//           isResizingRef.current = true
//         }}
//         className="fixed top-0 h-screen w-1 hover:w-1.5 bg-transparent hover:bg-blue-500/30 cursor-col-resize transition-all z-40"
//         style={{ left: `${expandedWidth}px` }}
//         title="Drag to resize sidebar"
//       />
//     </>
//   )
// }



























// 'use client'

// import { Home, Plus, Filter, ArrowDownUp, ChevronLeft, ChevronRight } from 'lucide-react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { useState, useRef, useEffect } from 'react'

// const NAV_ITEMS = [
//   { icon: Home, label: 'Home', href: '/', id: 'home' },
//   { icon: Plus, label: 'New Monitor', href: '/add-monitor', id: 'new' },
// ]

// export function Sidebar() {
//   const pathname = usePathname()
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [width, setWidth] = useState(80)
  
//   // Client-side sort state manager ('asc' or 'desc')
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
//   const sidebarRef = useRef<HTMLDivElement>(null)
//   const isResizingRef = useRef(false)

//   // Handle sidebar panel resizing hooks
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizingRef.current) return
      
//       const newWidth = Math.max(80, Math.min(e.clientX, 280))
//       setWidth(newWidth)
//       setIsExpanded(newWidth > 120)
//     }

//     const handleMouseUp = () => {
//       isResizingRef.current = false
//     }

//     document.addEventListener('mousemove', handleMouseMove)
//     document.addEventListener('mouseup', handleMouseUp)

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove)
//       document.removeEventListener('mouseup', handleMouseUp)
//     }
//   }, [])

//   // Dispatches state changes to the UI grid layout views dynamically
//   const toggleSortDirection = () => {
//     const nextDirection = sortDirection === 'desc' ? 'asc' : 'desc'
//     setSortDirection(nextDirection)
    
//     // Broadcast message payload globally across client window thread instances
//     const event = new CustomEvent('sidebar-sort-changed', { 
//       detail: { direction: nextDirection } 
//     })
//     window.dispatchEvent(event)
//   }

//   const expandedWidth = Math.max(width, 80)

//   return (
//     <>
//       <aside
//         ref={sidebarRef}
//         className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col items-start py-8 gap-4 transition-all duration-300 z-50"
//         style={{ width: `${expandedWidth}px` }}
//       >
//         {/* Top Section - Logo and Toggle */}
//         <div className="w-full px-4 flex items-center justify-between">
//           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-lg shadow-lg flex-shrink-0">
//             P
//           </div>
//           {expandedWidth > 120 && (
//             <button
//               onClick={() => {
//                 setIsExpanded(false)
//                 setWidth(80)
//               }}
//               className="p-1 hover:bg-card rounded-lg transition-colors"
//               title="Collapse Sidebar"
//               type="button"
//             >
//               <ChevronLeft size={18} className="text-muted-foreground" />
//             </button>
//           )}
//         </div>

//         {/* Navigation Buttons */}
//         <nav className="flex flex-col gap-3 w-full px-2">
//           {NAV_ITEMS.map((item) => {
//             const Icon = item.icon
//             const isNewButton = item.id === 'new'
            
//             // Refined operational state matching conditions
//             const active = isNewButton 
//               ? pathname === '/add-monitor'
//               : pathname === '/'

//             return (
//               <Link
//                 key={item.id}
//                 href={item.href}
//                 className="w-full flex justify-center"
//               >
//                 <button
//                   type="button"
//                   className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
//                     isNewButton
//                       ? active
//                         ? 'bg-emerald-700 text-white shadow-md'
//                         : 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-500'
//                       : active
//                       ? 'bg-blue-600 text-white shadow-lg'
//                       : 'text-muted-foreground hover:text-foreground hover:bg-card'
//                   }`}
//                   style={{
//                     minWidth: `${Math.max(48, expandedWidth - 16)}px`,
//                     width: expandedWidth > 120 ? 'auto' : '48px',
//                     justifyContent: expandedWidth > 120 ? 'flex-start' : 'center',
//                   }}
//                   title={item.label}
//                 >
//                   <Icon size={expandedWidth > 120 ? 18 : 22} strokeWidth={2} />
//                   {expandedWidth > 120 && (
//                     <span className="text-sm whitespace-nowrap">{item.label}</span>
//                   )}
//                 </button>
//               </Link>
//             )
//           })}
//         </nav>

//         {/* Filter / Operational Control Module Row */}
//         <div className="flex flex-col gap-2 w-full px-2 border-t border-sidebar-border pt-4">
//           {/* Filter Input Placeholder Button */}
//           <button
//             type="button"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-card"
//             style={{
//               minWidth: `${Math.max(48, expandedWidth - 16)}px`,
//               width: expandedWidth > 120 ? 'auto' : '48px',
//               justifyContent: expandedWidth > 120 ? 'flex-start' : 'center',
//             }}
//             title="Filter Elements"
//           >
//             <Filter size={expandedWidth > 120 ? 18 : 20} strokeWidth={2} />
//             {expandedWidth > 120 && (
//               <span className="text-sm whitespace-nowrap">Filter</span>
//             )}
//           </button>

//           {/* Dynamic Client-Side Sort Execution Toggle Button */}
//           <button
//             type="button"
//             onClick={toggleSortDirection}
//             className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
//               sortDirection === 'asc' 
//                 ? 'bg-blue-600/10 text-blue-500 hover:bg-blue-600/20' 
//                 : 'text-muted-foreground hover:text-foreground hover:bg-card'
//             }`}
//             style={{
//               minWidth: `${Math.max(48, expandedWidth - 16)}px`,
//               width: expandedWidth > 120 ? 'auto' : '48px',
//               justifyContent: expandedWidth > 120 ? 'flex-start' : 'center',
//             }}
//             title={sortDirection === 'desc' ? 'Sorting: Latest First' : 'Sorting: Oldest First'}
//           >
//             <ArrowDownUp size={expandedWidth > 120 ? 18 : 20} strokeWidth={2} />
//             {expandedWidth > 120 && (
//               <span className="text-sm whitespace-nowrap">
//                 {sortDirection === 'desc' ? 'Sort: Newest' : 'Sort: Oldest'}
//               </span>
//             )}
//           </button>
//         </div>

//         {/* Expand Button (when collapsed) */}
//         {expandedWidth <= 120 && (
//           <div className="mt-auto w-full px-2 pb-4">
//             <button
//               onClick={() => {
//                 setWidth(240)
//                 setIsExpanded(true)
//               }}
//               className="w-full flex justify-center p-2 hover:bg-card rounded-lg transition-colors"
//               title="Expand Sidebar"
//               type="button"
//             >
//               <ChevronRight size={18} className="text-muted-foreground" />
//             </button>
//           </div>
//         )}
//       </aside>

//       {/* Resize Handle Handlebar Clickable Edge */}
//       <div
//         onMouseDown={() => {
//           isResizingRef.current = true
//         }}
//         className="fixed left-[80px] top-0 h-screen w-1 hover:w-1.5 bg-transparent hover:bg-blue-500/30 cursor-col-resize transition-all z-40"
//         style={{ left: `${expandedWidth}px` }}
//         title="Drag to resize sidebar"
//       />

//       {/* Content margin adjustment context frames */}
//       <style>{`
//         main {
//           transition: margin-left 0.3s ease;
//         }
//       `}</style>
//     </>
//   )
// }































'use client'

import { Home, Plus, Filter, Zap, ArrowUpDown, LayoutDashboard, Activity, ChevronLeft, ChevronRight, Search, X, ArrowUp, ArrowDown, Circle, CheckCircle, XCircle, AlertCircle, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const NAV_ITEMS = [
  { icon: Home, label: 'Home', href: '/', id: 'home' },
  { icon: Plus, label: 'New Monitor', href: '/add-monitor', id: 'new' },
]

// Filter options for status
const STATUS_FILTERS = [
  { value: 'all', label: 'All', icon: Circle, color: 'text-gray-400' },
  { value: 'up', label: 'Up', icon: CheckCircle, color: 'text-green-500' },
  { value: 'down', label: 'Down', icon: XCircle, color: 'text-red-500' },
  { value: 'waking', label: 'Waking', icon: AlertCircle, color: 'text-orange-500' },
  { value: 'degraded', label: 'Degraded', icon: AlertCircle, color: 'text-yellow-500' },
]

type SortOption = 'status-desc' | 'status-asc' | 'name-asc' | 'name-desc' | 'uptime-desc' | 'uptime-asc'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'status-desc', label: 'Down First' },
  { value: 'status-asc', label: 'Up First' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'uptime-desc', label: 'Uptime (High to Low)' },
  { value: 'uptime-asc', label: 'Uptime (Low to High)' },
]

// Export these for use in parent component
export type SidebarState = {
  searchQuery: string
  statusFilter: string
  sortBy: SortOption
  isFilterOpen: boolean
}

export function Sidebar({ 
  onFilterChange 
}: { 
  onFilterChange?: (state: SidebarState) => void 
}) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [width, setWidth] = useState(80)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const isResizingRef = useRef(false)
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('status-desc')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setIsMobileMenuOpen(false)
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Notify parent component of filter changes (client-side)
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        searchQuery,
        statusFilter,
        sortBy,
        isFilterOpen,
      })
    }
  }, [searchQuery, statusFilter, sortBy, isFilterOpen, onFilterChange])

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return
      
      const newWidth = Math.max(80, Math.min(e.clientX, 280))
      setWidth(newWidth)
      setIsExpanded(newWidth > 120)
    }

    const handleMouseUp = () => {
      isResizingRef.current = false
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isMobileMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile, isMobileMenuOpen])

  const isActive = (href: string) => pathname === href
  const expandedWidth = Math.max(width, 80)
  const isCollapsed = expandedWidth <= 120

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSortBy('status-desc')
  }

  // Check if any filter is active
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || sortBy !== 'status-desc'

  // Close mobile menu when navigating
  const handleNavigation = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  // Sidebar content
  const SidebarContent = () => (
    <>
      {/* Top Section - Logo and Toggle */}
      {/* Top Section - Logo and Toggle */}
      <div className="w-full px-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={handleNavigation}>
          {/* 🛠️ FILED FIX: Swapped emerald-teal for true dark-neutral backing and glowing orange neon signature */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(249,115,22,0.15)] flex-shrink-0 transition-all duration-300 group-hover:border-orange-500/40 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <Zap className="w-5 h-5 text-orange-500 filter drop-shadow-[0_0_4px_rgba(249,115,22,0.6)] group-hover:scale-110 transition-transform" />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="text-sm font-black tracking-tight text-white uppercase font-sans select-none">
              Ping<span className="text-orange-500 filter drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]">Robot</span>
            </span>
          )}
        </Link>
        {!isCollapsed && !isMobile && (
          <button
            onClick={() => {
              setIsExpanded(false)
              setWidth(80)
            }}
            className="p-1.5 hover:bg-neutral-900 rounded-lg transition-colors border border-transparent hover:border-neutral-800"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={16} className="text-neutral-400" />
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 hover:bg-neutral-900 rounded-lg transition-colors border border-transparent hover:border-neutral-800"
          >
            <X size={18} className="text-neutral-400" />
          </button>
        )}
      </div>

      {/* <div className="w-full px-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={handleNavigation}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-lg shadow-lg flex-shrink-0 transition-transform group-hover:scale-105">
            P
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="text-sm font-semibold text-foreground">PingRobot</span>
          )}
        </Link>
        {!isCollapsed && !isMobile && (
          <button
            onClick={() => {
              setIsExpanded(false)
              setWidth(80)
            }}
            className="p-1.5 hover:bg-card rounded-lg transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={16} className="text-muted-foreground" />
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 hover:bg-card rounded-lg transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        )}
      </div> */}

      {/* Navigation Buttons - Centered on mobile */}
      <nav className="flex flex-col gap-1.5 w-full px-2 mt-6">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              className="w-full"
              onClick={handleNavigation}
            >
              <button
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium w-full ${
                  active
                    ? 'bg-primary/10 text-primary hover:bg-primary/15'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                }`}
                style={{
                  justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start',
                }}
                title={(isCollapsed && !isMobile) ? item.label : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {(!isCollapsed || isMobile) && (
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                )}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="w-full px-3 my-3">
        <div className="h-px bg-border" />
      </div>

      {/* Search Input - Only show when expanded or on mobile */}
      {(!isCollapsed || isMobile) && (
        <div className="w-full px-3 mb-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search monitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter Toggle Button */}
      <div className="w-full px-2">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full ${
            isFilterOpen || hasActiveFilters
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-card'
          }`}
          style={{
            justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start',
          }}
          title={(isCollapsed && !isMobile) ? 'Filters' : undefined}
        >
          <Filter size={18} strokeWidth={isFilterOpen || hasActiveFilters ? 2.5 : 2} />
          {(!isCollapsed || isMobile) && (
            <span className="text-sm whitespace-nowrap">
              Filters
              {hasActiveFilters && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary/20 rounded-full">
                  Active
                </span>
              )}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel - Expanded when filter is open */}
      {(!isCollapsed || isMobile) && isFilterOpen && (
        <div className="w-full px-3 mt-2 space-y-3">
          {/* Status Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((filter) => {
                const Icon = filter.icon
                const isSelected = statusFilter === filter.value
                return (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all ${
                      isSelected
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-card border border-border text-muted-foreground hover:bg-card/80'
                    }`}
                  >
                    <Icon size={10} className={filter.color} />
                    <span>{filter.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1 block">
              <ArrowUpDown size={10} />
              Sort by
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map((option) => {
                const isSelected = sortBy === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                      isSelected
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-card border border-border text-muted-foreground hover:bg-card/80'
                    }`}
                  >
                    {option.value.includes('asc') ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-1"
            >
              <X size={10} />
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Expand Button (when collapsed on desktop) */}
      {isCollapsed && !isMobile && (
        <div className="mt-auto w-full px-2 pb-4">
          <button
            onClick={() => {
              setWidth(260)
              setIsExpanded(true)
            }}
            className="w-full flex justify-center p-2 hover:bg-card rounded-lg transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && !isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg shadow-lg hover:bg-card/80 transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-foreground" />
        </button>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col py-8 z-50
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'w-72 shadow-2xl' : ''}
          ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
        style={!isMobile ? { width: `${expandedWidth}px`, transition: 'width 0.2s ease' } : {}}
      >
        <div className="flex flex-col h-full w-full items-start">
          <SidebarContent />
        </div>
      </aside>

      {/* Resize Handle - Only show on desktop */}
      {!isMobile && (
        <div
          onMouseDown={() => {
            isResizingRef.current = true
          }}
          className="fixed top-0 h-screen w-1 hover:w-1.5 bg-transparent hover:bg-blue-500/30 cursor-col-resize transition-all z-40"
          style={{ left: `${expandedWidth}px` }}
          title="Drag to resize sidebar"
        />
      )}
    </>
  )
}