import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      isGuest?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    isGuest?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isGuest?: boolean;
  }
}
