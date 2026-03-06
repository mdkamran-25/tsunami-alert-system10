'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  MapPin,
  Satellite,
  Activity,
  Waves,
  AlertCircle,
  Loader,
} from 'lucide-react';
import Link from 'next/link';
import { useCurrentAlert } from '@/hooks/useAlert';
import { useGPSStations } from '@/hooks/useGPS';
import { useSatelliteData } from '@/hooks/useSatellite';

export default function DashboardPage() {
  // Poll every 10 seconds for real-time updates
  const {
    alert,
    loading: alertLoading,
    error: alertError,
  } = useCurrentAlert({ pollInterval: 10000 });
  const {
    stations,
    loading: stationsLoading,
    error: stationsError,
  } = useGPSStations(undefined, { pollInterval: 10000 });
  const {
    data: satelliteDataArray,
    loading: satelliteLoading,
    error: satelliteError,
  } = useSatelliteData(undefined, undefined, { pollInterval: 30000 });

  const isLoading = alertLoading || stationsLoading || satelliteLoading;
  const hasError = alertError || stationsError || satelliteError;

  const currentStatus = alert?.status || 'SAFE';
  const gpsCount = stations?.length || 0;
  const satelliteCount = satelliteDataArray?.length || 0;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'SAFE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'WATCH':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'WARNING':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ALERT':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tsunami Alert System</h1>
          <p className="mt-1 text-gray-600">GPS and Satellite Imagery Monitoring</p>
        </div>

        {/* Error Banner */}
        {hasError && (
          <Card className="mb-8 border-2 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <h2 className="font-bold text-red-600">Error Loading Data</h2>
                  <p className="text-sm text-red-600">
                    {alertError || stationsError || satelliteError}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <div>
                  <h2 className="font-bold text-blue-600">Loading Data</h2>
                  <p className="text-sm text-blue-600">Fetching real-time monitoring data...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alert Status Banner */}
        {!isLoading && (
          <Card className={`mb-8 border-2 ${getStatusColor(currentStatus)}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Waves className="h-8 w-8" />
                  <div>
                    <h2 className="text-xl font-bold">Current Status: {currentStatus}</h2>
                    <p className="text-sm">Real-time monitoring active</p>
                  </div>
                </div>
                <Badge variant="outline">{new Date().toLocaleTimeString()}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* GPS Monitoring Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    GPS Monitoring
                  </CardTitle>
                  <CardDescription>Seismic station data</CardDescription>
                </div>
                {stationsLoading ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Loader className="h-3 w-3 animate-spin" />
                    Loading
                  </Badge>
                ) : (
                  <Badge variant="default">{gpsCount} Stations</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                Monitor real-time GPS displacement data from seismic stations.
              </p>
              {stationsError && (
                <p className="mb-4 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {stationsError}
                </p>
              )}
              <Link href="/gps-monitoring">
                <Button className="w-full" disabled={stationsLoading}>
                  <Activity className="mr-2 h-4 w-4" />
                  View GPS Data
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Satellite Imagery Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="h-5 w-5" />
                    Satellite Imagery
                  </CardTitle>
                  <CardDescription>Ocean anomaly detection</CardDescription>
                </div>
                {satelliteLoading ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Loader className="h-3 w-3 animate-spin" />
                    Loading
                  </Badge>
                ) : (
                  <Badge variant="default">{satelliteCount} Recent</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                Analyze satellite imagery for ocean surface anomalies.
              </p>
              {satelliteError && (
                <p className="mb-4 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {satelliteError}
                </p>
              )}
              <Link href="/satellite-imagery">
                <Button className="w-full" disabled={satelliteLoading}>
                  <Satellite className="mr-2 h-4 w-4" />
                  View Satellite Data
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {alertLoading
                ? 'Loading alerts...'
                : alert
                  ? `Current alert: ${alert.status}`
                  : 'No active alerts at this time. System is operating normally.'}
            </p>
            <Link href="/alert-management" className="mt-4 block">
              <Button variant="outline" className="w-full">
                View Alert History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
