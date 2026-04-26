/**
 * Authentication Debug & Logging Utility
 * Comprehensive logging for all auth operations
 */

export interface AuthDebugLog {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN' | 'SUCCESS';
  component: string;
  message: string;
  data?: any;
}

class AuthDebugger {
  private logs: AuthDebugLog[] = [];
  private maxLogs = 100;

  log(
    level: 'INFO' | 'ERROR' | 'WARN' | 'SUCCESS',
    component: string,
    message: string,
    data?: any
  ) {
    const logEntry: AuthDebugLog = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data,
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with styling
    const styles = {
      INFO: 'color: #0ea5e9; font-weight: bold',
      ERROR: 'color: #ef4444; font-weight: bold',
      WARN: 'color: #f59e0b; font-weight: bold',
      SUCCESS: 'color: #10b981; font-weight: bold',
    };

    const icon = {
      INFO: 'ℹ️',
      ERROR: '❌',
      WARN: '⚠️',
      SUCCESS: '✅',
    };

    console.log(`%c${icon[level]} [${component}] ${message}`, styles[level], data ? data : '');

    // Store in localStorage for inspection
    try {
      localStorage.setItem('authDebugLogs', JSON.stringify(this.logs));
    } catch (e) {
      // Quota exceeded, ignore
    }

    // Store in window for debugging in browser console
    if (typeof window !== 'undefined') {
      (window as any).__authDebugLogs = this.logs;
    }
  }

  info(component: string, message: string, data?: any) {
    this.log('INFO', component, message, data);
  }

  error(component: string, message: string, data?: any) {
    this.log('ERROR', component, message, data);
  }

  warn(component: string, message: string, data?: any) {
    this.log('WARN', component, message, data);
  }

  success(component: string, message: string, data?: any) {
    this.log('SUCCESS', component, message, data);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('authDebugLogs');
  }

  printLogs() {
    console.table(this.logs);
  }

  exportLogs() {
    const logsText = this.logs
      .map(
        (log) =>
          `[${log.timestamp}] ${log.level} [${log.component}] ${log.message} ${
            log.data ? JSON.stringify(log.data) : ''
          }`
      )
      .join('\n');
    return logsText;
  }
}

export const authDebug = new AuthDebugger();

/**
 * Environment & Connection Debug Info
 */
export function debugEnvironment() {
  authDebug.info('ENV', 'GraphQL Endpoint Configuration', {
    httpEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://api.navbharatlabs.com/graphql',
    wsEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT || 'wss://api.navbharatlabs.com/graphql',
    nodeEnv: process.env.NODE_ENV,
  });
}

/**
 * Storage Debug Info
 */
export function debugStorage() {
  const authToken = localStorage.getItem('authToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const user = localStorage.getItem('user');

  authDebug.info('STORAGE', 'LocalStorage Auth State', {
    authTokenExists: !!authToken,
    authTokenLength: authToken?.length,
    authTokenPreview: authToken ? authToken.substring(0, 30) + '...' : 'none',
    refreshTokenExists: !!refreshToken,
    refreshTokenLength: refreshToken?.length,
    userExists: !!user,
    userData: user ? JSON.parse(user) : null,
  });
}

/**
 * Apollo Client Debug
 */
export function debugApolloClient(apolloClient: any) {
  if (!apolloClient) {
    authDebug.error('APOLLO', 'Apollo Client not initialized');
    return;
  }

  authDebug.info('APOLLO', 'Apollo Client Status', {
    cacheSize: apolloClient.cache?.data?.data
      ? Object.keys(apolloClient.cache.data.data).length
      : 0,
    linkChain: apolloClient.link?.constructor?.name,
  });
}

/**
 * Test GraphQL Connection
 */
export async function testGraphQLConnection(endpoint: string) {
  authDebug.info('TEST', 'Testing GraphQL Connection', { endpoint });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'query { __schema { types { name } } }',
      }),
    });

    if (response.ok) {
      authDebug.success('TEST', 'GraphQL Connection Successful', {
        status: response.status,
        statusText: response.statusText,
      });
      return true;
    } else {
      authDebug.error('TEST', 'GraphQL Connection Failed', {
        status: response.status,
        statusText: response.statusText,
      });
      return false;
    }
  } catch (error) {
    authDebug.error('TEST', 'GraphQL Connection Error', {
      message: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Test Login Mutation
 */
export async function testLoginMutation(endpoint: string, email: string, password: string) {
  authDebug.info('TEST', 'Testing Login Mutation', { email, endpoint });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            login(email: "${email}", password: "${password}") {
              token
              refreshToken
              expiresIn
              user {
                id
                email
                name
                role
                isActive
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      authDebug.error('TEST', 'Login Mutation Failed', {
        errors: data.errors.map((e: any) => e.message),
      });
      return { success: false, error: data.errors[0]?.message };
    }

    if (data.data?.login?.token) {
      authDebug.success('TEST', 'Login Mutation Successful', {
        userEmail: data.data.login.user.email,
        userRole: data.data.login.user.role,
        tokenPreview: data.data.login.token.substring(0, 20) + '...',
      });
      return { success: true, data: data.data.login };
    }

    // If we get here, response was ok but didn't have expected data
    authDebug.warn('TEST', 'Login Mutation returned unexpected response', { data });
    return { success: false, error: 'Unexpected response format' };
  } catch (error) {
    authDebug.error('TEST', 'Login Mutation Error', {
      message: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// Initialize debug logging
if (typeof window !== 'undefined') {
  console.log(
    '%c🔐 Auth Debugger Initialized',
    'color: #6366f1; font-size: 14px; font-weight: bold'
  );
  console.log(
    '%cAvailable commands:\n  authDebug.info()\n  authDebug.error()\n  authDebug.success()\n  debugEnvironment()\n  debugStorage()\n  testGraphQLConnection()\n  testLoginMutation()',
    'color: #8b5cf6'
  );
}
