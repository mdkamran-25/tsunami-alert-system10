'use client';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// Types
export interface SatelliteData {
  id: string;
  imageUrl: string;
  region: string;
  regionBounds?: Record<string, any>;
  regionCenter?: Record<string, any>;
  anomalyScore: number;
  anomalyDetected: boolean;
  metadata?: Record<string, any>;
  timestamp: string;
}

// GraphQL Queries
const GET_SATELLITE_DATA = gql`
  query GetSatelliteData($filter: SatelliteDataFilterInput, $pagination: PaginationInput) {
    satelliteData(filter: $filter, pagination: $pagination) {
      id
      imageUrl
      region
      regionBounds
      regionCenter
      anomalyScore
      anomalyDetected
      metadata
      timestamp
    }
  }
`;

const GET_LATEST_SATELLITE_DATA = gql`
  query GetLatestSatelliteData($region: String) {
    latestSatelliteData(region: $region) {
      id
      imageUrl
      region
      regionBounds
      regionCenter
      anomalyScore
      anomalyDetected
      metadata
      timestamp
    }
  }
`;

const GET_SATELLITE_IMAGE = gql`
  query GetSatelliteImage($id: String!) {
    satelliteImage(id: $id) {
      id
      imageUrl
      region
      regionBounds
      regionCenter
      anomalyScore
      anomalyDetected
      metadata
      timestamp
    }
  }
`;

// Hooks
export function useSatelliteData(
  filter?: Record<string, any>,
  pagination?: Record<string, any>,
  options?: {
    skip?: boolean;
    pollInterval?: number;
  }
) {
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_SATELLITE_DATA, {
    variables: {
      filter,
      pagination,
    },
    skip: options?.skip,
    pollInterval: options?.pollInterval,
    notifyOnNetworkStatusChange: true,
  });

  return {
    data: data?.satelliteData ?? [],
    loading: loading || networkStatus === 4,
    error: error?.message,
    refetch,
    networkStatus,
  };
}

export function useLatestSatelliteData(
  region?: string,
  options?: {
    skip?: boolean;
    pollInterval?: number;
  }
) {
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_LATEST_SATELLITE_DATA, {
    variables: {
      region,
    },
    skip: options?.skip,
    pollInterval: options?.pollInterval,
    notifyOnNetworkStatusChange: true,
  });

  return {
    data: data?.latestSatelliteData ?? null,
    loading: loading || networkStatus === 4,
    error: error?.message,
    refetch,
    networkStatus,
  };
}

export function useSatelliteImage(
  id?: string,
  options?: {
    skip?: boolean;
  }
) {
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_SATELLITE_IMAGE, {
    variables: {
      id: id ?? '',
    },
    skip: !id || options?.skip,
    notifyOnNetworkStatusChange: true,
  });

  return {
    image: data?.satelliteImage ?? null,
    loading: loading || networkStatus === 4,
    error: error?.message,
    refetch,
    networkStatus,
  };
}
