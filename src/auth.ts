import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const googleClientId =
  process.env.AUTH_GOOGLE_ID ||
  process.env.GOOGLE_CLIENT_ID ||
  process.env.CLIENT_ID;

const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET ||
  process.env.GOOGLE_CLIENT_SECRET ||
  process.env.CLIENT_SECRET;

const providers: any[] = [];

if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
} else {
  providers.push(
    Google({
      clientId: 'google-client-id-placeholder',
      clientSecret: 'google-client-secret-placeholder',
    })
  );
}

providers.push(
  Credentials({
    name: 'Guest Cinephile',
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'cinephile@moviequest.com' },
      name: { label: 'Name', type: 'text', placeholder: 'Film Buff' },
    },
    async authorize(credentials) {
      const email = (credentials?.email as string) || 'guest@moviequest.com';
      const name = (credentials?.name as string) || 'Film Buff';
      return {
        id: `guest_${Buffer.from(email).toString('hex').slice(0, 12)}`,
        name,
        email,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
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
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'moviequest_secure_auth_session_secret_key_2026',
});
