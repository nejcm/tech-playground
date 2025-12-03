// Import the generated route tree
import { StrictMode } from 'react';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { DirectionProvider } from './context/direction-provider';
import { FontProvider } from './context/font-provider';
import { ThemeProvider } from './context/theme-provider';
import { Provider as QueryClientProvider, getContext, setRouter } from './integrations/tanstack-query/root-provider';
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const getRouter = () => {
  const rqContext = getContext();

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <StrictMode>
          <ThemeProvider>
            <FontProvider>
              <DirectionProvider>
                <QueryClientProvider {...rqContext}>{props.children}</QueryClientProvider>
              </DirectionProvider>
            </FontProvider>
          </ThemeProvider>
        </StrictMode>
      );
    },
  });

  // Set router instance so it can be used in QueryCache error handlers
  setRouter(router);

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient });

  return router;
};
