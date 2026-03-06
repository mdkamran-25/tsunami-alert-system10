import { ApolloClient, InMemoryCache, createHttpLink, split, from } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createClient } from 'graphql-ws';

// ── HTTP Link ──
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  credentials: 'omit',
});

// ── WebSocket Link (subscriptions) ──
const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/graphql',
          connectionParams: () => {
            const token = localStorage.getItem('authToken');
            return { authorization: token ? `Bearer ${token}` : '' };
          },
          shouldRetry: () => true,
          retryAttempts: 5,
          retryWait: async (retries) =>
            new Promise((resolve) =>
              setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 30000))
            ),
        })
      )
    : null;

// ── Auth Link – attaches JWT from localStorage ──
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// ── Error Link ──
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error: any) => {
      console.error(
        `[GraphQL error]: Message: ${error.message}, Path: ${error.path}`,
        error.extensions
      );

      // Log UNAUTHENTICATED but don't clear tokens (AuthGuard handles redirect)
      if (error.extensions?.code === 'UNAUTHENTICATED') {
        console.warn('[Auth] Token may be expired – AuthGuard will handle redirect');
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// ── Split: WS for subscriptions, HTTP for everything else ──
const splitLink =
  typeof window !== 'undefined' && wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return def.kind === 'OperationDefinition' && def.operation === 'subscription';
        },
        wsLink,
        from([errorLink, authLink, httpLink])
      )
    : from([errorLink, authLink, httpLink]);

// ── Cache ──
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        gpsReadings: { keyArgs: false, merge: (_e = [], i) => (Array.isArray(i) ? i : i) },
        satelliteData: { keyArgs: false, merge: (_e = [], i) => (Array.isArray(i) ? i : i) },
        alertHistory: { keyArgs: false, merge: (_e = [], i) => (Array.isArray(i) ? i : i) },
      },
    },
  },
});

// ── Client ──
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
  defaultOptions: {
    watchQuery: { errorPolicy: 'all', notifyOnNetworkStatusChange: true },
    query: { errorPolicy: 'all' },
    mutate: { errorPolicy: 'none' },
  },
});

// ── Helpers ──
export const handleGraphQLError = (error: any) => {
  if (error.networkError) return 'Network error. Please check your connection.';
  if (error.graphQLErrors?.[0]) {
    const gql = error.graphQLErrors[0];
    switch (gql.extensions?.code) {
      case 'UNAUTHENTICATED':
        return 'You need to be logged in.';
      case 'FORBIDDEN':
        return 'Permission denied.';
      case 'BAD_USER_INPUT':
        return gql.message || 'Invalid input.';
      default:
        return gql.message || 'An error occurred.';
    }
  }
  return 'An unexpected error occurred.';
};

export const clearApolloCache = () => apolloClient.clearStore();
export const refetchQueries = (names: string[]) => apolloClient.refetchQueries({ include: names });
