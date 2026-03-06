'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  MapPin,
  Satellite,
  Loader,
  AlertCircle,
} from 'lucide-react';
import { useCurrentAlert, useAlertHistory } from '@/hooks/useAlert';
import { useGPSStations, useGPSReadings } from '@/hooks/useGPS';
import { useSatelliteData } from '@/hooks/useSatellite';

export default function AnalyticsPage() {
  const { alert, loading: alertLoading } = useCurrentAlert({ pollInterval: 15000 });
  const { alerts, loading: historyLoading } = useAlertHistory(undefined, { take: 50 });
  const { stations, loading: stationsLoading } = useGPSStations(undefined, { pollInterval: 30000 });
  const { readings, loading: readingsLoading } = useGPSReadings(undefined, { take: 50 });
  const { data: satelliteDataArray, loading: satLoading } = useSatelliteData(undefined, undefined, {
    pollInterval: 30000,
  });

  const isLoading =
    alertLoading || historyLoading || stationsLoading || readingsLoading || satLoading;

  // Derived analytics
  const totalAlerts = alerts?.length || 0;
  const activeAlerts = alerts?.filter((a: any) => a.isActive)?.length || 0;
  const resolvedAlerts = totalAlerts - activeAlerts;

  const totalStations = stations?.length || 0;
  const activeStations = stations?.filter((s: any) => s.isActive)?.length || 0;

  const totalReadings = readings?.length || 0;
  const avgMagnitude =
    totalReadings > 0
      ? (
          readings.reduce((sum: number, r: any) => sum + (r.magnitude || 0), 0) / totalReadings
        ).toFixed(3)
      : '0.000';
  const maxMagnitude =
    totalReadings > 0
      ? Math.max(...readings.map((r: any) => r.magnitude || 0)).toFixed(3)
      : '0.000';

  const totalSatImages = satelliteDataArray?.length || 0;
  const anomaliesDetected = satelliteDataArray?.filter((s: any) => s.anomalyDetected)?.length || 0;
  const avgAnomalyScore =
    totalSatImages > 0
      ? (
          satelliteDataArray.reduce((sum: number, s: any) => sum + (s.anomalyScore || 0), 0) /
          totalSatImages
        ).toFixed(2)
      : '0.00';

  // Region breakdown
  const regionMap: Record<string, number> = {};
  alerts?.forEach((a: any) => {
    regionMap[a.region] = (regionMap[a.region] || 0) + 1;
  });
  satelliteDataArray?.forEach((s: any) => {
    regionMap[s.region] = regionMap[s.region] || 0;
  });
  const regions = Object.entries(regionMap).sort((a, b) => b[1] - a[1]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'SAFE':
        return 'bg-green-100 text-green-700';
      case 'WATCH':
        return 'bg-yellow-100 text-yellow-700';
      case 'WARNING':
        return 'bg-orange-100 text-orange-700';
      case 'ALERT':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <BarChart3 className="h-8 w-8 text-tsunami-blue-600" />
            Analytics
          </h1>
          <p className="mt-1 text-gray-600">Data analysis and trends overview</p>
        </div>

        {isLoading && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="flex items-center gap-3 p-4">
              <Loader className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm text-blue-700">Loading analytics data...</span>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">Current Status</p>
                  <Badge className={`mt-1 ${statusColor(alert?.status || 'SAFE')}`}>
                    {alert?.status || 'SAFE'}
                  </Badge>
                </div>
                <Activity className="h-8 w-8 text-tsunami-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">Total Alerts</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{totalAlerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {activeAlerts} active · {resolvedAlerts} resolved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">GPS Stations</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{totalStations}</p>
                </div>
                <MapPin className="h-8 w-8 text-green-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500">{activeStations} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">Satellite Images</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{totalSatImages}</p>
                </div>
                <Satellite className="h-8 w-8 text-purple-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500">{anomaliesDetected} anomalies</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* GPS Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-green-600" />
                GPS Displacement Analysis
              </CardTitle>
              <CardDescription>Recent readings summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium uppercase text-gray-500">Avg Magnitude</p>
                  <p className="mt-1 flex items-center gap-1 text-xl font-bold text-gray-900">
                    {avgMagnitude}
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium uppercase text-gray-500">Max Magnitude</p>
                  <p className="mt-1 flex items-center gap-1 text-xl font-bold text-gray-900">
                    {maxMagnitude}
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium uppercase text-gray-500">Total Readings</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{totalReadings}</p>
              </div>
              {!readingsLoading && totalReadings === 0 && (
                <p className="flex items-center gap-2 text-sm text-gray-400">
                  <AlertCircle className="h-4 w-4" /> No GPS readings available yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Satellite Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Satellite className="h-5 w-5 text-purple-600" />
                Satellite Anomaly Analysis
              </CardTitle>
              <CardDescription>Ocean surface anomaly scores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium uppercase text-gray-500">Avg Anomaly Score</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{avgAnomalyScore}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium uppercase text-gray-500">Anomalies Found</p>
                  <p className="mt-1 text-xl font-bold text-red-600">{anomaliesDetected}</p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium uppercase text-gray-500">Detection Rate</p>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-red-500"
                    style={{
                      width: `${totalSatImages > 0 ? (anomaliesDetected / totalSatImages) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {totalSatImages > 0 ? ((anomaliesDetected / totalSatImages) * 100).toFixed(1) : 0}
                  % of images show anomalies
                </p>
              </div>
              {!satLoading && totalSatImages === 0 && (
                <p className="flex items-center gap-2 text-sm text-gray-400">
                  <AlertCircle className="h-4 w-4" /> No satellite data available yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Alert Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Alert Breakdown
              </CardTitle>
              <CardDescription>Recent alerts by status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['ALERT', 'WARNING', 'WATCH', 'SAFE'].map((status) => {
                const count = alerts?.filter((a: any) => a.status === status)?.length || 0;
                const pct = totalAlerts > 0 ? (count / totalAlerts) * 100 : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <Badge className={`w-20 justify-center ${statusColor(status)}`}>{status}</Badge>
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${
                            status === 'ALERT'
                              ? 'bg-red-500'
                              : status === 'WARNING'
                                ? 'bg-orange-500'
                                : status === 'WATCH'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-10 text-right text-sm font-medium text-gray-700">
                      {count}
                    </span>
                  </div>
                );
              })}
              {!historyLoading && totalAlerts === 0 && (
                <p className="flex items-center gap-2 text-sm text-gray-400">
                  <AlertCircle className="h-4 w-4" /> No alert history available yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Region Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-tsunami-blue-600" />
                Regional Activity
              </CardTitle>
              <CardDescription>Alerts by region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {regions.length > 0 ? (
                regions.slice(0, 8).map(([region, count]) => (
                  <div
                    key={region}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-gray-700">{region}</span>
                    <Badge variant="outline">{count} alerts</Badge>
                  </div>
                ))
              ) : (
                <p className="flex items-center gap-2 text-sm text-gray-400">
                  <AlertCircle className="h-4 w-4" /> No regional data available yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
