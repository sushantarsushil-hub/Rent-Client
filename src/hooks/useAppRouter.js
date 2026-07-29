'use client';

import { useRouter } from 'next/navigation';

export function useAppRouter() {
  const router = useRouter();

  return {
    push: (path) => {
      if (router && typeof router.push === 'function') {
        router.push(path);
      } else if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    },
    replace: (path) => {
      if (router && typeof router.replace === 'function') {
        router.replace(path);
      } else if (typeof window !== 'undefined') {
        window.location.replace(path);
      }
    },
    back: () => {
      if (router && typeof router.back === 'function') {
        router.back();
      } else if (typeof window !== 'undefined') {
        window.history.back();
      }
    },
  };
}

export default useAppRouter;
