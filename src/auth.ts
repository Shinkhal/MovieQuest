import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import crypto from 'crypto';

const googleClientId =
  process.env.AUTH_GOOGLE_ID ||
  process.env.GOOGLE_CLIENT_ID ||
  process.env.CLIENT_ID;

const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET ||
  process.env.GOOGLE_CLIENT_SECRET ||
  process.env.CLIENT_SECRET;

const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET;

if (!authSecret && process.env.NODE_ENV === 'production') {
  console.warn('[AUTH_WARNING] AUTH_SECRET or NEXTAUTH_SECRET is not set in production environment variables.');
}

const providers: any[] = [];

// Only register Google OAuth provider if valid credentials are configured
if (googleClientId && googleClientSecret && !googleClientId.includes('placeholder')) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

// Guest authentication for testing & instant access
providers.push(
  Credentials({
    name: 'Guest Cinephile',
    credentials: {
      name: { label: 'Name', type: 'text', placeholder: 'Film Buff' },
    },
    async authorize(credentials) {
      const name = (credentials?.name as string)?.trim() || 'Film Buff';
      const guestUniqueId = crypto.randomUUID();
      const guestId = `guest_${guestUniqueId}`;
      const guestEmail = `guest_${guestUniqueId.slice(0, 8)}@guest.moviequest.internal`;

      return {
        id: guestId,
        name,
        email: guestEmail,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(guestUniqueId.slice(0, 8))}`,
        isGuest: true,
      };
    },
  })
);

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers,
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        session.user.isGuest = Boolean(token.isGuest);
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.isGuest = (user as any).isGuest;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: authSecret || 'moviequest_dev_fallback_secret_key_change_in_production',
});
