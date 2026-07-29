
export const getEnvVar = (key, fallback = '') => {
  try {
   
    const staticEnvMap = {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      VITE_API_URL: process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL,
      VITE_STRIPE_PUBLISHABLE_KEY: process.env.VITE_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    };

    if (staticEnvMap[key]) return staticEnvMap[key];

    
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[key]) return process.env[key];

      if (key.startsWith('NEXT_PUBLIC_')) {
        const viteAlias = key.replace(/^NEXT_PUBLIC_/, 'VITE_');
        if (process.env[viteAlias]) return process.env[viteAlias];
      } else if (key.startsWith('VITE_')) {
        const nextAlias = key.replace(/^VITE_/, 'NEXT_PUBLIC_');
        if (process.env[nextAlias]) return process.env[nextAlias];
      }
    }
  } catch (e) {}

  try {
    
    if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
      if (import.meta.env[key]) return import.meta.env[key];
      if (key.startsWith('NEXT_PUBLIC_')) {
        const viteAlias = key.replace(/^NEXT_PUBLIC_/, 'VITE_');
        if (import.meta.env[viteAlias]) return import.meta.env[viteAlias];
      }
    }
  } catch (e) {}

  return fallback;
};

export default getEnvVar;

