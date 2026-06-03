// lib/auth.ts
// Authentication configuration for NextAuth.js
// Supports Google and GitHub OAuth providers with session management

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],
    callbacks: {
        async jwt({ token, account, profile }) {
        // Add user email to token when first signing in
        if (account && profile) {
            // Cast profile to any once to bypass individual property check errors safely
            const anyProfile = profile as any;

            token.email = anyProfile.email;
            token.name = anyProfile.name;
            
            // Safely extract the profile image across GitHub (avatar_url) or Google (picture)
            token.picture = anyProfile.avatar_url || anyProfile.picture || anyProfile.image;
            token.provider = account.provider;
        }
        return token;
        },
        async session({ session, token }) {
        // Add user data to session for client-side access
        if (session.user) {
            session.user.email = token.email as string;
            session.user.name = token.name as string;
            session.user.image = token.picture as string;
            (session.user as any).provider = token.provider as string;
        }
        return session;
        },
    },

  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};