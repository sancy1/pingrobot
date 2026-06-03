// app/api/auth/[...nextauth]/route.ts
// NextAuth.js API route for Google and GitHub authentication
// Handles OAuth flow, session management, and callbacks

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };