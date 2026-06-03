// 'use client'

// import { Search } from 'lucide-react'

// export function Header() {
//   return (
//     <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden" style={{ marginLeft: '80px' }}>
//       <div className="px-4 sm:px-6 py-4">
//         {/* Title and Search */}
//         <div className="flex items-center gap-3 w-full">
//           <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight whitespace-nowrap">
//             PingRobot<span className="text-primary">.</span>
//           </h1>
          
//           {/* Search Field */}
//           <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border min-w-0">
//             <Search size={16} className="text-muted-foreground flex-shrink-0" />
//             <input
//               type="text"
//               placeholder="Search by name or URL..."
//               className="bg-transparent text-xs sm:text-sm text-foreground placeholder-muted-foreground outline-none flex-1 min-w-0"
//             />
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }





























// // components/header.tsx
// // Header Component - Displays user avatar, name, and logout button when authenticated

// 'use client';

// import { useSession, signOut } from 'next-auth/react';
// import { LogOut, User } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// export function Header() {
//   const { data: session } = useSession();

//   const getInitials = (name: string | null | undefined) => {
//     if (!name) return 'U';
//     return name
//       .split(' ')
//       .map(part => part[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <header className="bg-background border-b border-border px-6 py-3 flex items-center justify-end">
//       {session?.user && (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="flex items-center gap-3 hover:bg-accent px-3 py-2 h-auto focus-visible:ring-0 focus-visible:ring-offset-0">
//               <Avatar className="w-8 h-8">
//                 <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
//                 <AvatarFallback className="bg-primary/10 text-primary">
//                   {getInitials(session.user.name)}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-medium text-foreground">{session.user.name}</p>
//                 <p className="text-xs text-muted-foreground">{session.user.email}</p>
//               </div>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-56">
//             <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer" onClick={() => signOut({ callbackUrl: '/' })}>
//               <LogOut size={14} />
//               <span>Sign out</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )}
//     </header>
//   );
// }


































// components/header.tsx
// Header Component - Displays application branding on the left, user avatar and actions on the right

'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const { data: session } = useSession();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-background border-b border-border px-6 py-3 flex items-center justify-between">
      
      {/* Left Flank: Pure Brand Signature matching the True-Dark Landing Theme */}
      <div className="flex items-center gap-2 select-none">
        <Zap className="w-5 h-5 text-orange-500 filter drop-shadow-[0_0_5px_rgba(249,115,22,0.6)] animate-pulse" />
        <span className="text-lg font-black tracking-tight text-white uppercase font-sans">
          Ping<span className="text-orange-500 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">Robot</span>
        </span>
      </div>

      {/* Right Flank: Tenant Identity Dropdown Menu */}
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 hover:bg-accent px-3 py-2 h-auto focus-visible:ring-0 focus-visible:ring-offset-0">
              <Avatar className="w-8 h-8">
                <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer" onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut size={14} />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}