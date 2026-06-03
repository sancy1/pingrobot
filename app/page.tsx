// 'use client'

// import { Sidebar } from '@/components/sidebar'
// import { Header } from '@/components/header'
// import { MonitorList } from '@/components/monitor-list'
// import { StatusSummary } from '@/components/status-summary'

// export default function Page() {
//   return (
//     <main className="min-h-screen bg-background flex flex-col" style={{ marginLeft: '80px' }}>
//       <Sidebar />
//       <Header />
      
//       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
//         {/* Main Content */}
//         <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full lg:w-0 min-w-0">
//           <MonitorList />
//         </div>

//         {/* Status Summary - Responsive: Stacks below on smaller screens, sidebar on lg+ */}
//         <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border lg:flex-shrink-0 overflow-y-auto">
//           <StatusSummary />
//         </div>
//       </div>
//     </main>
//   )
// }























// // app/page.tsx

// 'use client'

// import { Sidebar } from '@/components/sidebar'
// import { Header } from '@/components/header'
// import { MonitorList } from '@/components/monitor-list'
// import { StatusSummary } from '@/components/status-summary'
// import { useState, useEffect } from 'react'

// export default function Page() {
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//     }
    
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   return (
//     <main 
//       className="min-h-screen bg-background flex flex-col transition-all duration-200"
//       style={{ 
//         marginLeft: isMobile ? 0 : '80px',
//       }}
//     >
//       <Sidebar />
//       <Header />
      
//       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
//         {/* Main Content */}
//         <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full lg:w-0 min-w-0">
//           <MonitorList />
//         </div>

//         {/* Status Summary - Responsive: Stacks below on smaller screens, sidebar on lg+ */}
//         <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border lg:flex-shrink-0 overflow-y-auto">
//           <StatusSummary />
//         </div>
//       </div>
//     </main>
//   )
// }






























// // app/page.tsx
// // Landing Page - Beautiful, no-scroll, one-window design
// // Features: App description, feature highlights, Google/GitHub login buttons

// 'use client';

// import { signIn, useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { Chrome, Github, Zap, Clock, RefreshCw, FileJson, Shield, Globe } from 'lucide-react';

// export default function LandingPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null);

//   // Redirect to dashboard if already authenticated
//   useEffect(() => {
//     if (status === 'authenticated') {
//       router.push('/dashboard');
//     }
//   }, [status, router]);

//   const handleSignIn = async (provider: 'google' | 'github') => {
//     setIsLoading(provider);
//     try {
//       await signIn(provider, { callbackUrl: '/dashboard', redirect: true });
//     } catch (error) {
//       console.error('Sign in error:', error);
//     } finally {
//       setIsLoading(null);
//     }
//   };

//   // Show loading state while checking auth
//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   // If already authenticated, don't render landing page (redirect happens in useEffect)
//   if (session) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       {/* Main Container - No scroll, fits in one window */}
//       <div className="max-w-5xl w-full mx-auto">
        
//         {/* Card Container */}
//         <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          
//           {/* Content Area */}
//           <div className="p-8 md:p-12">
            
//             {/* Logo & Title */}
//             <div className="text-center mb-8">
//               <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg mb-4">
//                 <Zap className="w-10 h-10 text-white" />
//               </div>
//               <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
//                 PingRobot
//               </h1>
//               <p className="text-gray-400 mt-2 text-sm tracking-wide">AGGRESSIVE URL MONITORING & WAKE-UP TOOL</p>
//             </div>

//             {/* Description */}
//             <div className="text-center max-w-2xl mx-auto mb-10">
//               <p className="text-gray-300 text-base md:text-lg leading-relaxed">
//                 Keep your cloud services awake with <span className="text-orange-400 font-semibold">60-second timeout</span> + 
//                 <span className="text-orange-400 font-semibold"> 3 retry attempts</span>. Perfect for Render, Heroku, 
//                 Railway, and Fly.io free tiers.
//               </p>
//             </div>

//             {/* Feature Grid */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
//               <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
//                 <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
//                 <p className="text-xs text-gray-300">60s Timeout</p>
//               </div>
//               <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
//                 <RefreshCw className="w-6 h-6 text-orange-400 mx-auto mb-2" />
//                 <p className="text-xs text-gray-300">3 Retries</p>
//               </div>
//               <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
//                 <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
//                 <p className="text-xs text-gray-300">Wake-up Detection</p>
//               </div>
//               <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
//                 <FileJson className="w-6 h-6 text-orange-400 mx-auto mb-2" />
//                 <p className="text-xs text-gray-300">JSON Viewer</p>
//               </div>
//             </div>

//             {/* Login Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={() => handleSignIn('google')}
//                 disabled={isLoading !== null}
//                 className="group relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
//               >
//                 {isLoading === 'google' ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <Chrome className="w-5 h-5 text-white/80 group-hover:scale-110 transition-transform" />
//                 )}
//                 <span className="text-white font-medium">
//                   {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
//                 </span>
//               </button>

//               <button
//                 onClick={() => handleSignIn('github')}
//                 disabled={isLoading !== null}
//                 className="group relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
//               >
//                 {isLoading === 'github' ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <Github className="w-5 h-5 text-white/80 group-hover:scale-110 transition-transform" />
//                 )}
//                 <span className="text-white font-medium">
//                   {isLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
//                 </span>
//               </button>
//             </div>

//             {/* Footer Info */}
//             <div className="text-center mt-8 pt-6 border-t border-white/10">
//               <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
//                 <span className="flex items-center gap-1">
//                   <Shield className="w-3 h-3" /> Secure OAuth
//                 </span>
//                 <span>•</span>
//                 <span className="flex items-center gap-1">
//                   <Globe className="w-3 h-3" /> No password required
//                 </span>
//                 <span>•</span>
//                 <span>Free forever</span>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


































// app/page.tsx
// Landing Page - Beautiful, no-scroll, one-window design
// Features: App description, feature highlights, Google/GitHub login buttons with custom neon glow states

'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Chrome, Github, Zap, Clock, RefreshCw, FileJson, Shield, Globe } from 'lucide-react';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl: '/dashboard', redirect: true });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  // Show loading state while checking auth - Styled in pure deep dark mode
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(249,115,22,0.4)]"></div>
      </div>
    );
  }

  // If already authenticated, don't render landing page (redirect happens in useEffect)
  if (session) return null;

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 selection:bg-orange-500/30">
      {/* Decorative ambient background grid line or tiny glow emitter to anchor the dark theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015),transparent_70%)] pointer-events-none" />

      {/* Main Container - No scroll, fits in one window */}
      <div className="max-w-4xl w-full mx-auto relative z-10">
        
        {/* Card Container with a sharp orange neon top edge border highlight */}
        <div className="bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden relative group">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80 shadow-[0_1px_10px_rgba(249,115,22,0.8)]" />
          
          {/* Content Area */}
          <div className="p-8 md:p-12">
            
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700 shadow-[0_0_15px_rgba(249,115,22,0.2)] mb-4">
                <Zap className="w-8 h-8 text-orange-500 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white uppercase">
                Ping<span className="text-orange-500 filter drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">Robot</span>
              </h1>
              <p className="text-neutral-500 mt-1 text-xs font-mono tracking-widest">AGGRESSIVE URL MONITORING & WAKE-UP TOOL</p>
            </div>

            {/* Description */}
            <div className="text-center max-w-xl mx-auto mb-10">
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                Keep your cloud services awake with a <span className="text-white font-mono font-bold bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">60-second</span> timeout + 
                <span className="text-white font-mono font-bold bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700 ml-1">3 retry</span> attempts. Isolated deployment ideal for Render, Heroku, Railway, and Fly.io free tiers.
              </p>
            </div>

            {/* Feature Grid - Muted borders, sharp transitions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="text-center p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-colors duration-200">
                <Clock className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs font-mono text-neutral-300">60s Timeout</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-colors duration-200">
                <RefreshCw className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs font-mono text-neutral-300">3 Retries</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-colors duration-200">
                <Zap className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs font-mono text-neutral-300">Wake Detection</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-colors duration-200">
                <FileJson className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs font-mono text-neutral-300">JSON Viewer</p>
              </div>
            </div>

            {/* Login Buttons - Dynamic Custom Neon Glow Implementations */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              
              {/* Google Button: Neon Blue Glow on Hover */}
              <button
                onClick={() => handleSignIn('google')}
                disabled={isLoading !== null}
                className="group relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 font-medium tracking-wide text-sm transition-all duration-300 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed min-w-[220px]"
              >
                {isLoading === 'google' ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Chrome className="w-4 h-4 text-neutral-400 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-200" />
                )}
                <span>
                  {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
                </span>
              </button>

              {/* GitHub Button: Neon White/Silver Glow on Hover */}
              <button
                onClick={() => handleSignIn('github')}
                disabled={isLoading !== null}
                className="group relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 font-medium tracking-wide text-sm transition-all duration-300 hover:text-white hover:border-neutral-400 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] disabled:opacity-40 disabled:cursor-not-allowed min-w-[220px]"
              >
                {isLoading === 'github' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Github className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
                )}
                <span>
                  {isLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
                </span>
              </button>
              
            </div>

            {/* Footer Info */}
            <div className="text-center mt-10 pt-6 border-t border-neutral-800/60">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono text-neutral-600">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-neutral-500" /> Secure OAuth
                </span>
                <span className="hidden sm:inline text-neutral-800">•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-neutral-500" /> Multi-Tenant Sandbox
                </span>
                <span className="hidden sm:inline text-neutral-800">•</span>
                <span className="text-neutral-500">Free Tier Ready</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}