'use client';

import { useQuery, ApolloError } from '@apollo/client';
import { gql } from '@apollo/client';

// Types
export interface GPSStation {
  id: string;
  stationId: string;
  name: string;
  latitude: number;
  longitude: number;
  network: string;
  isActive: boolean;
  elevation?: number;
  description?: string;
  quality?: string;
  displacementX?: number;
  displacementY?: number;
  displacementZ?: number;
  magnitude?: number;
  lastUpdate?: string;
}

export interface GPSReading {
  id: string;
  stationId: string;
  station: GPSStation;
  latitude: number;
  longitude: number;
  displacementX: number;
  displacementY: number;
  displacementZ: number;
  magnitude: number;
  quality: string;
  confidence?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

// GraphQL Queries
const GET_GPS_STATIONS = gql`
  query GetGPSStations($isActive: Boolean, $pagination: PaginationInput) {
    gpsStations(isActive: $isActive, pagination: $pagination) {
      id
      stationId
      name
      latitude
      longitude
      network
      isActive
      elevation
      description
    }
  }
`;

const GET_GPS_READINGS = gql`
  query GetGPSReadings($filter: GPSReadingFilterInput, $pagination: PaginationInput) {
    gpsReadings(filter: $filter, pagination: $pagination) {
      id
      stationId
      station {
        id
        stationId
        name
        latitude
        longitude
        network
        isActive
        elevation
        description
      }
      latitude
      longitude
      displacementX
      displacementY
      displacementZ
      magnitude
      quality
      confidence
      timestamp
      metadata
    }
  }
`;

const GET_GPS_READING = gql`
  query GetGPSReading($id: String!) {
    gpsReading(id: $id) {
      id
      stationId
      station {
        id
        stationId
        name
        latitude
        longitude
      }
      latitude
      longitude
      displacementX
      displacementY
      displacementZ
      magnitude
      quality
      confidence
      timestamp
      metadata
    }
  }
`;

const GET_GPS_STATION = gql`
  query GetGPSStation($stationId: String!) {
    gpsStation(stationId: $stationId) {
      id
      stationId
      name
      latitude
      longitude
      network
      isActive
      elevation
      description
    }
  }
`;

// Hooks
export function useGPSStations(
  isActive?: boolean,
  options?: {
    skip?: boolean;
    pollInterval?: number;
  }
) {
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_GPS_STATIONS, {
    variables: {
      isActive,
    },
    skip: options?.skip,
    pollInterval: options?.pollInterval,
    notifyOnNetworkStatusChange: true,
  });

  return {
    stations: data?.gpsStations ?? [],
    loading: loading || networkStatus === 4,
    error: error?.message,
    refetch,
    networkStatus,
  };
}

export function useGPSReadings(
  filter?: Record<string, any>,
  pagination?: Record<string, any>,
  options?: {
    skip?: boolean;
    pollInterval?: number;
  }
) {
  const { data, loading, error, refetch, fetchMore, networkStatus } = useQuery(GET_GPS_READINGS, {
    variables: {
      filter,
      pagination,
    },
    skip: options?.skip,
    pollInterval: options?.pollInterval,
    notifyOnNetworkStatusChange: true,
  });

  return {
    readings: data?.gpsReadings ?? [],
    loading: loading || networkStatus === 4,
    error: error?.message,
    refetch,
    networkStatus,
  };
}

export function useGPSReading(
  id?: string,
  options?: {
    skip?: boolean;
  }
) {
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_GPS_READING, {
    variables: { id: id ?? '' },
    skip: !id || options?.skip,
    notifyOnNetworkStatusChange: true,
  });

  return {
    reading: data?.gpsReading ?? null,
    loading: loading || networkStatus === 4,
    error: error?.message,
    refetch,
    networkStatus,
  };
}

export function useGPSStation(
  stationId?: string,
  options?: {
    skip?: boolean;
  }
) {
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_GPS_STATION, {
    variables: { stationId: stationId ?? '' },
    skip: !stationId || options?.skip,
    notifyOnNetworkStatusChange: true,
  });

  return {
    station: data?.gpsStation ?? null,
    loading: loading || networkStatus === 4,
    error: error?.message,
    refetch,
    networkStatus,
  };
}
