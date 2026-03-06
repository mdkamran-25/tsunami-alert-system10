import { ApolloClient, InMemoryCache, createHttpLink, split, from } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createClient } from 'graphql-ws';
import { auth } from './firebase';

// HTTP Link
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  credentials: 'include',
});

// WebSocket Link for subscriptions
const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/graphql',
          connectionParams: async () => {
            try {
              const token = await auth.currentUser?.getIdToken();
              return {
                authorization: token ? `Bearer ${token}` : '',
              };
            } catch (error) {
              console.warn('Failed to get Firebase token for WebSocket connection:', error);
              return {};
            }
          },
          shouldRetry: () => true,
          retryAttempts: 5,
          retryWait: async (retries) => {
            return new Promise((resolve) => {
              setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 30000));
            });
          },
        })
      )
    : null;

// Auth Link
const authLink = setContext(async (_, { headers }) => {
  try {
    // Prefer our own JWT token; fall back to Firebase token if not present
    const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    let token = jwtToken;
    if (!token) {
      token = (await auth.currentUser?.getIdToken()) ?? null;
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  } catch (error) {
    console.warn('Failed to get auth token for HTTP request:', error);
    return { headers };
  }
});

// Error Link
const errorLink = onError((errorResponse) => {
  const { graphQLErrors, networkError } = errorResponse as any;

  if (graphQLErrors) {
    graphQLErrors.forEach((error: any) => {
      console.error(
        `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`,
        error.extensions
      );

      // Handle authentication errors
      if (error.extensions?.code === 'UNAUTHENTICATED') {
        // Redirect to login or refresh token
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
      }

      // Handle rate limiting
      if (error.extensions?.code === 'TOO_MANY_REQUESTS') {
        console.warn('Rate limit exceeded. Please slow down your requests.');
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Handle network errors
    if ((networkError as any).message?.includes('Failed to fetch')) {
      console.warn('Network connection lost. Retrying...');
    }
  }
});

// Split link for HTTP and WebSocket
const splitLink =
  typeof window !== 'undefined' && wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
          );
        },
        wsLink,
        from([errorLink, authLink, httpLink])
      )
    : from([errorLink, authLink, httpLink]);

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        gpsReadings: {
          keyArgs: false,
          merge(existing = [], incoming) {
            // Handle both array format and pagination format
            if (Array.isArray(incoming)) {
              return [...(existing || []), ...incoming];
            }
            return incoming;
          },
        },
        satelliteData: {
          keyArgs: false,
          merge(existing = [], incoming) {
            // Handle both array format and pagination format
            if (Array.isArray(incoming)) {
              return [...(existing || []), ...incoming];
            }
            return incoming;
          },
        },
        alertHistory: {
          keyArgs: false,
          merge(existing = [], incoming) {
            // Handle both array format and pagination format
            if (Array.isArray(incoming)) {
              return [...(existing || []), ...incoming];
            }
            return incoming;
          },
        },
      },
    },
    AlertStatus: {
      fields: {
        lastUpdated: {
          merge: false, // Always use incoming value
        },
      },
    },
    GPSReading: {
      fields: {
        timestamp: {
          merge: false,
        },
      },
    },
    SatelliteData: {
      fields: {
        timestamp: {
          merge: false,
        },
      },
    },
  },
});

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'none',
    },
  },
  // connectToDevTools: process.env.NODE_ENV === 'development', // Removed in Apollo Client v4
});

// Helper function to handle GraphQL errors
export const handleGraphQLError = (error: any) => {
  if (error.networkError) {
    console.error('Network Error:', error.networkError);
    return 'Network error occurred. Please check your connection.';
  }

  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphqlError = error.graphQLErrors[0];
    console.error('GraphQL Error:', graphqlError);

    switch (graphqlError.extensions?.code) {
      case 'UNAUTHENTICATED':
        return 'You need to be logged in to perform this action.';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.';
      case 'BAD_USER_INPUT':
        return graphqlError.message || 'Invalid input provided.';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Too many requests. Please wait before trying again.';
      default:
        return graphqlError.message || 'An error occurred.';
    }
  }

  return 'An unexpected error occurred.';
};

// Helper function to clear cache
export const clearApolloCache = () => {
  apolloClient.clearStore();
};

// Helper function to refetch queries
export const refetchQueries = (queryNames: string[]) => {
  return apolloClient.refetchQueries({
    include: queryNames,
  });
};
