'use client';

import { useSubscription } from '@apollo/client';
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

export interface GPSReading {
  id: string;
  stationId: string;
  station: {
    id: string;
    stationId: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  latitude: number;
  longitude: number;
  displacementX: number;
  displacementY: number;
  displacementZ: number;
  magnitude: number;
  quality: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

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

// GraphQL Subscriptions
const ALERT_STATUS_UPDATED = gql`
  subscription AlertStatusUpdated {
    alertStatusUpdated {
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

const NEW_GPS_READING = gql`
  subscription NewGPSReading {
    newGPSReading {
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
      timestamp
      metadata
    }
  }
`;

const NEW_SATELLITE_DATA = gql`
  subscription NewSatelliteData {
    newSatelliteData {
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

// Subscription Hooks
export function useAlertSubscription(options?: {
  skip?: boolean;
  onAlert?: (alert: Alert) => void;
}) {
  const { data, loading, error } = useSubscription(ALERT_STATUS_UPDATED, {
    skip: options?.skip,
    onData: ({ data }) => {
      if (data.data?.alertStatusUpdated && options?.onAlert) {
        options.onAlert(data.data.alertStatusUpdated);
      }
    },
    onError: (error) => {
      console.error('Alert subscription error:', error);
    },
  });

  return {
    alert: data?.alertStatusUpdated ?? null,
    loading,
    error: error?.message,
  };
}

export function useGPSSubscription(options?: {
  skip?: boolean;
  onReading?: (reading: GPSReading) => void;
}) {
  const { data, loading, error } = useSubscription(NEW_GPS_READING, {
    skip: options?.skip,
    onData: ({ data }) => {
      if (data.data?.newGPSReading && options?.onReading) {
        options.onReading(data.data.newGPSReading);
      }
    },
    onError: (error) => {
      console.error('GPS subscription error:', error);
    },
  });

  return {
    reading: data?.newGPSReading ?? null,
    loading,
    error: error?.message,
  };
}

export function useSatelliteSubscription(options?: {
  skip?: boolean;
  onData?: (data: SatelliteData) => void;
}) {
  const { data, loading, error } = useSubscription(NEW_SATELLITE_DATA, {
    skip: options?.skip,
    onData: ({ data }) => {
      if (data.data?.newSatelliteData && options?.onData) {
        options.onData(data.data.newSatelliteData);
      }
    },
    onError: (error) => {
      console.error('Satellite subscription error:', error);
    },
  });

  return {
    data: data?.newSatelliteData ?? null,
    loading,
    error: error?.message,
  };
}

// Combined subscription hook for real-time monitoring
export function useRealtimeMonitoring(options?: {
  skipAlerts?: boolean;
  skipGPS?: boolean;
  skipSatellite?: boolean;
  onAlert?: (alert: Alert) => void;
  onGPSReading?: (reading: GPSReading) => void;
  onSatelliteData?: (data: SatelliteData) => void;
}) {
  const alertSub = useAlertSubscription({
    skip: options?.skipAlerts,
    onAlert: options?.onAlert,
  });

  const gpsSub = useGPSSubscription({
    skip: options?.skipGPS,
    onReading: options?.onGPSReading,
  });

  const satelliteSub = useSatelliteSubscription({
    skip: options?.skipSatellite,
    onData: options?.onSatelliteData,
  });

  return {
    alert: alertSub.alert,
    gpsReading: gpsSub.reading,
    satelliteData: satelliteSub.data,
    loading: alertSub.loading || gpsSub.loading || satelliteSub.loading,
    error: alertSub.error || gpsSub.error || satelliteSub.error,
  };
}
