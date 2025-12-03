import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useAuthStore } from '@/stores/auth-store';
import { handleServerError } from '@/lib/handle-server-error';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// Store router reference that will be set after router creation
// Using any to avoid complex generic type requirements
let routerInstance: any = null;

// eslint-disable-next-line react-refresh/only-export-components
export function setRouter(router: any) {
  routerInstance = router;
}

// eslint-disable-next-line react-refresh/only-export-components
export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // eslint-disable-next-line no-console
          if (isDev) console.log({ failureCount, error });

          if (failureCount >= 0 && isDev) return false;
          if (failureCount > 3 && isProd) return false;

          return !(error instanceof HTTPError && [401, 403].includes(error.response.status || 0));
        },
        refetchOnWindowFocus: isProd,
        staleTime: 10 * 1000, // 10s
      },
      mutations: {
        onError: (error) => {
          handleServerError(error);

          if (error instanceof HTTPError) {
            if (error.response.status === 304) {
              // toast.error('Content not modified!')
            }
          }
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof HTTPError) {
          if (error.response.status === 401) {
            // toast.error('Session expired!')
            useAuthStore.getState().auth.reset();
            const redirect = window.location.href;
            if (routerInstance) {
              routerInstance.navigate({ to: '/sign-in', search: { redirect } });
            } else {
              // Fallback to window.location if router not available yet
              window.location.href = `/sign-in?redirect=${encodeURIComponent(redirect)}`;
            }
          }
          if (error.response.status === 500) {
            // toast.error('Internal Server Error!')
            // Only navigate to error page in production to avoid disrupting HMR in development
            if (import.meta.env.PROD) {
              if (routerInstance) {
                routerInstance.navigate({ to: '/500' });
              } else {
                // Fallback to window.location if router not available yet
                window.location.href = '/500';
              }
            }
          }
          if (error.response.status === 403) {
            // router.navigate("/forbidden", { replace: true });
          }
        }
      },
    }),
  });
  return {
    queryClient,
  };
}

export function Provider({ children, queryClient }: { children: React.ReactNode; queryClient: QueryClient }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
