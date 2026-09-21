import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isGuest?: boolean;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    isGuest?: boolean;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    sub?: string;
    isGuest?: boolean;
    role?: string;
  }
}
