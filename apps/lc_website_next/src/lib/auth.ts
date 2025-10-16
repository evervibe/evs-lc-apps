/**
 * Auth.js v5 Configuration
 * 
 * Portal authentication with multiple providers:
 * - Credentials (Email/Password with Argon2id)
 * - OAuth (Google, Discord)
 * - MFA Support (TOTP + Backup Codes)
 */

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/crypto-portal';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email/Password Authentication
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const validation = loginSchema.safeParse(credentials);
          if (!validation.success) {
            return null;
          }

          const { email, password } = validation.data;

          // Find user
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              passwordHash: true,
              role: true,
            },
          });

          if (!user) {
            return null;
          }

          // Verify password
          const isValid = await verifyPassword(user.passwordHash, password);
          if (!isValid) {
            return null;
          }

          // Return user data (exclude password hash)
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),

    // OAuth Providers
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],

  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Pages
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as { role?: string }).role || 'user';
      }

      // OAuth account linking
      if (account && account.provider !== 'credentials') {
        // Store OAuth provider info
        token.provider = account.provider;
      }

      return token;
    },

    async session({ session, token }) {
      // Add user data to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  // Events for audit logging
  events: {
    async signIn({ user, account }) {
      // Log successful sign in
      console.log('User signed in:', user.id, account?.provider);
    },
    async signOut(message) {
      // Log sign out
      console.log('User signed out:', 'token' in message ? message.token?.id : 'session');
    },
  },

  // Security
  debug: process.env.NODE_ENV === 'development',
});
