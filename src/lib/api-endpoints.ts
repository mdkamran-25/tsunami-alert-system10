const DEFAULT_API_BASE_URL = 'http://localhost:4000';
const DEFAULT_GRAPHQL_PATH = '/graphql';

// Use local API proxy in production to avoid CORS issues
const GRAPHQL_PROXY_PATH = '/api/graphql';

export function getApiBaseUrl() {
  // In production (browser environment), use relative path to proxy
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '';
  }

  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.replace(/\/graphql$/, '') ||
    DEFAULT_API_BASE_URL
  );
}

export function getGraphQLEndpoint() {
  // In production (browser environment), use local proxy
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return GRAPHQL_PROXY_PATH;
  }

  return process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || `${getApiBaseUrl()}${DEFAULT_GRAPHQL_PATH}`;
}

export function getGraphQLWsEndpoint() {
  const explicitWsEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT;
  if (explicitWsEndpoint) {
    return explicitWsEndpoint;
  }

  const baseUrl = getApiBaseUrl();
  return baseUrl.replace(/^http/, 'ws') + DEFAULT_GRAPHQL_PATH;
}
