const DEFAULT_API_BASE_URL = 'http://localhost:4000';
const DEFAULT_GRAPHQL_PATH = '/graphql';

export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.replace(/\/graphql$/, '') ||
    DEFAULT_API_BASE_URL
  );
}

export function getGraphQLEndpoint() {
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
