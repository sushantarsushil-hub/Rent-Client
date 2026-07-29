import { createAuthClient } from 'better-auth/react';
import { getEnvVar } from '../utils/env';

const BETTER_AUTH_URL = getEnvVar(
  'NEXT_PUBLIC_BETTER_AUTH_URL',
  getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:5000').replace(/\/api$/, '')
);

export const authClient = createAuthClient({
  baseURL: BETTER_AUTH_URL,
});

export const { useSession, signIn, signOut, signUp } = authClient;
export default authClient;
