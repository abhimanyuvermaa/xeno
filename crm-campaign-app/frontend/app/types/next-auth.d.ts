import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  rules: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'push';
  segmentId: string;
  message: {
    subject: string;
    body: string;
  };
  status: 'draft' | 'scheduled' | 'running' | 'completed';
  scheduledDate: string;
  userId: string;
}