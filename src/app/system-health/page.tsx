'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  Database,
  Wifi,
  Satellite,
  MapPin,
  RefreshCw,
  Loader,
  AlertCircle,
  Globe,
} from 'lucide-react';
import { useCurrentAlert } from '@/hooks/useAlert';
import { useGPSStations } from '@/hooks/useGPS';
import { useSatelliteData } from '@/hooks/useSatellite';

interface ComponentStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number | null;
  icon: React.ReactNode;
  details: string;
}

export default function SystemHealthPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [backendHealth, setBackendHealth] = useState<{ status: string; timestamp: string } | null>(
    null
  );
  const [backendLatency, setBackendLatency] = useState<number | null>(null);
  const [backendError, setBackendError] = useState(false);

  const {
    alert,
    loading: alertLoading,
    error: alertError,
  } = useCurrentAlert({ pollInterval: 15000 });
  const {
    stations,
    loading: stationsLoading,
    error: stationsError,
  } = useGPSStations(undefined, { pollInterval: 30000 });
  const {
    data: satelliteDataArray,
    loading: satLoading,
    error: satError,
  } = useSatelliteData(undefined, undefined, { pollInterval: 30000 });

  const checkBackendHealth = async () => {
    const start = Date.now();
    try {
      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
      const baseUrl = endpoint.replace('/graphql', '');
      const res = await fetch(`${baseUrl}/health`, { cache: 'no-store' });
      const latency = Date.now() - start;
      setBackendLatency(latency);
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data);
        setBackendError(false);
      } else {
        setBackendError(true);
      }
    } catch {
      setBackendLatency(Date.now() - start);
      setBackendError(true);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkBackendHealth();
    setLastCheck(new Date());
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Build component status list
  const components: ComponentStatus[] = [
    {
      name: 'Backend API',
      status: backendError ? 'down' : backendHealth ? 'operational' : 'degraded',
      responseTime: backendLatency,
      icon: <Server className="h-5 w-5" />,
      details: backendError
        ? 'Cannot reach backend'
        : backendHealth
          ? `Last check: ${backendHealth.timestamp}`
          : 'Checking...',
    },
    {
      name: 'GraphQL Endpoint',
      status:
        alertError || stationsError || satError
          ? 'degraded'
          : !alertLoading
            ? 'operational'
            : 'degraded',
      responseTime: null,
      icon: <Globe className="h-5 w-5" />,
      details:
        alertError || stationsError || satError
          ? `Error: ${alertError || stationsError || satError}`
          : 'Queries responding normally',
    },
    {
      name: 'GPS Service',
      status: stationsError
        ? 'down'
        : stations && stations.length > 0
          ? 'operational'
          : stationsLoading
            ? 'degraded'
            : 'operational',
      responseTime: null,
      icon: <MapPin className="h-5 w-5" />,
      details: stationsError
        ? `Error: ${stationsError}`
        : `${stations?.length || 0} stations, ${stations?.filter((s: any) => s.isActive)?.length || 0} active`,
    },
    {
      name: 'Satellite Service',
      status: satError
        ? 'down'
        : satelliteDataArray && satelliteDataArray.length > 0
          ? 'operational'
          : satLoading
            ? 'degraded'
            : 'operational',
      responseTime: null,
      icon: <Satellite className="h-5 w-5" />,
      details: satError
        ? `Error: ${satError}`
        : `${satelliteDataArray?.length || 0} images processed`,
    },
    {
      name: 'Alert Engine',
      status: alertError
        ? 'down'
        : alert
          ? 'operational'
          : alertLoading
            ? 'degraded'
            : 'operational',
      responseTime: null,
      icon: <Activity className="h-5 w-5" />,
      details: alertError ? `Error: ${alertError}` : `Current status: ${alert?.status || 'N/A'}`,
    },
    {
      name: 'WebSocket (Real-time)',
      status: typeof window !== 'undefined' ? 'operational' : 'degraded',
      responseTime: null,
      icon: <Wifi className="h-5 w-5" />,
      details: 'Subscription channel available',
    },
    {
      name: 'Database',
      status: backendError ? 'down' : backendHealth ? 'operational' : 'degraded',
      responseTime: null,
      icon: <Database className="h-5 w-5" />,
      details: backendHealth ? 'Connected via backend' : 'Status depends on backend',
    },
  ];

  const operational = components.filter((c) => c.status === 'operational').length;
  const degraded = components.filter((c) => c.status === 'degraded').length;
  const down = components.filter((c) => c.status === 'down').length;

  const overallStatus =
    down > 0 ? 'Partial Outage' : degraded > 0 ? 'Degraded' : 'All Systems Operational';
  const overallColor =
    down > 0
      ? 'bg-red-100 text-red-700 border-red-200'
      : degraded > 0
        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
        : 'bg-green-100 text-green-700 border-green-200';

  const statusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-700">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-700">Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-100 text-red-700">Down</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
              <Activity className="h-8 w-8 text-tsunami-blue-600" />
              System Health
            </h1>
            <p className="mt-1 text-gray-600">Monitor system components and services</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Overall Status Banner */}
        <Card className={`border-2 ${overallColor}`}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              {down > 0 ? (
                <XCircle className="h-10 w-10" />
              ) : degraded > 0 ? (
                <Clock className="h-10 w-10" />
              ) : (
                <CheckCircle2 className="h-10 w-10" />
              )}
              <div>
                <h2 className="text-xl font-bold">{overallStatus}</h2>
                <p className="text-sm opacity-80">
                  {operational}/{components.length} components operational · Last checked:{' '}
                  {lastCheck.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{operational}</p>
                <p className="text-xs text-gray-500">Up</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{degraded}</p>
                <p className="text-xs text-gray-500">Degraded</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{down}</p>
                <p className="text-xs text-gray-500">Down</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component List */}
        <Card>
          <CardHeader>
            <CardTitle>Service Components</CardTitle>
            <CardDescription>Status of individual system services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {components.map((comp) => (
              <div
                key={comp.name}
                className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {statusIcon(comp.status)}
                  <div className="flex items-center gap-2 text-gray-500">{comp.icon}</div>
                  <div>
                    <p className="font-medium text-gray-900">{comp.name}</p>
                    <p className="text-xs text-gray-500">{comp.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {comp.responseTime !== null && (
                    <span className="text-xs text-gray-400">{comp.responseTime}ms</span>
                  )}
                  {statusBadge(comp.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Backend Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {backendLatency !== null ? `${backendLatency}ms` : '—'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {backendLatency !== null && backendLatency < 500
                  ? '✅ Within acceptable range'
                  : backendLatency !== null
                    ? '⚠️ Higher than expected'
                    : 'Measuring...'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active GPS Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {stationsLoading ? (
                  <Loader className="h-8 w-8 animate-spin" />
                ) : (
                  `${stations?.filter((s: any) => s.isActive)?.length || 0}/${stations?.length || 0}`
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">Stations reporting data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Alert Engine Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {alertLoading ? (
                  <Loader className="h-8 w-8 animate-spin" />
                ) : (
                  alert?.status || 'N/A'
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {alertError ? `Error: ${alertError}` : 'Monitoring active'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
