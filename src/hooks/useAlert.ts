'use client';

import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

// Types
export interface Alert {
  id: string;
  status: string;
  level: string;
  message: string;
  region: string;
  gpsTriggered: boolean;
  satelliteTriggered: boolean;
  isActive: boolean;
  createdAt: string;
}

// GraphQL Queries
const GET_CURRENT_ALERT = gql`
  query GetCurrentAlert {
    currentAlert {
      id
      status
      level
      message
      region
      gpsTriggered
      satelliteTriggered
      isActive
      createdAt
    }
  }
`;

const GET_ALERT_HISTORY = gql`
  query GetAlertHistory($filter: AlertFilterInput, $pagination: PaginationInput) {
    alertHistory(filter: $filter, pagination: $pagination) {
      id
      status
      level
      message
      region
      gpsTriggered
      satelliteTriggered
      isActive
      createdAt
    }
  }
`;

// GraphQL Mutations
const ACKNOWLEDGE_ALERT = gql`
  mutation AcknowledgeAlert($alertId: String!) {
    acknowledgeAlert(alertId: $alertId) {
      id
      status
      level
      message
      region
      gpsTriggered
      satelliteTriggered
      isActive
      createdAt
    }
  }
`;

const RESOLVE_ALERT = gql`
  mutation ResolveAlert($alertId: String!) {
    resolveAlert(alertId: $alertId) {
      id
      status
      level
      message
      region
      gpsTriggered
      satelliteTriggered
      isActive
      createdAt
    }
  }
`;

// Hooks
export function useCurrentAlert(options?: { skip?: boolean; pollInterval?: number }) {
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_CURRENT_ALERT, {
    skip: options?.skip,
    pollInterval: options?.pollInterval,
    notifyOnNetworkStatusChange: true,
  });

  return {
    alert: data?.currentAlert ?? null,
    loading: loading || networkStatus === 4,
    error: error?.message,
    refetch,
    networkStatus,
  };
}

export function useAlertHistory(
  filter?: Record<string, any>,
  pagination?: Record<string, any>,
  options?: {
    skip?: boolean;
    pollInterval?: number;
  }
) {
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_ALERT_HISTORY, {
    variables: {
      filter,
      pagination,
    },
    skip: options?.skip,
    pollInterval: options?.pollInterval,
    notifyOnNetworkStatusChange: true,
  });

  return {
    alerts: data?.alertHistory ?? [],
    loading: loading || networkStatus === 4,
    error: error?.message,
    refetch,
    networkStatus,
  };
}

export function useAcknowledgeAlert() {
  const [acknowledge, { loading, error, data }] = useMutation(ACKNOWLEDGE_ALERT);

  const handleAcknowledge = async (alertId: string) => {
    try {
      const result = await acknowledge({
        variables: { alertId },
      });
      return result.data?.acknowledgeAlert ?? null;
    } catch (err) {
      console.error('Error acknowledging alert:', err);
      throw err;
    }
  };

  return {
    acknowledge: handleAcknowledge,
    loading,
    error: error?.message,
    alert: data?.acknowledgeAlert ?? null,
  };
}

export function useResolveAlert() {
  const [resolve, { loading, error, data }] = useMutation(RESOLVE_ALERT);

  const handleResolve = async (alertId: string) => {
    try {
      const result = await resolve({
        variables: { alertId },
      });
      return result.data?.resolveAlert ?? null;
    } catch (err) {
      console.error('Error resolving alert:', err);
      throw err;
    }
  };

  return {
    resolve: handleResolve,
    loading,
    error: error?.message,
    alert: data?.resolveAlert ?? null,
  };
}
