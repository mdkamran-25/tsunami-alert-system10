'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Clock, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { useAlertHistory, useAcknowledgeAlert, useResolveAlert, Alert } from '@/hooks/useAlert';

export default function AlertManagementPage() {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const { alerts, loading, error } = useAlertHistory();
  const { acknowledge: acknowledgeAlert, loading: acknowledging } = useAcknowledgeAlert();
  const { resolve: resolveAlert, loading: resolving } = useResolveAlert();

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
      setSelectedAlertId(null);
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await resolveAlert(alertId);
      setSelectedAlertId(null);
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE':
        return 'bg-green-100 text-green-800';
      case 'WATCH':
        return 'bg-yellow-100 text-yellow-800';
      case 'WARNING':
        return 'bg-orange-100 text-orange-800';
      case 'ALERT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
          <p className="mt-1 text-gray-600">View and manage tsunami alerts</p>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <div>
                  <h2 className="font-bold text-blue-600">Loading Alerts</h2>
                  <p className="text-sm text-blue-600">Fetching alert data...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-2 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <h2 className="font-bold text-red-600">Error Loading Alerts</h2>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          {!loading && alerts && alerts.length > 0 ? (
            alerts.map((alert: Alert) => (
              <Card key={alert.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        {alert.isActive ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Bell className="h-5 w-5 text-gray-400" />
                        )}
                        <h3 className="text-lg font-semibold">{alert.message}</h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                        <Badge variant="outline" className={getLevelColor(alert.level)}>
                          {alert.level}
                        </Badge>
                        <Badge variant="outline">{alert.region}</Badge>
                      </div>

                      <div className="flex items-center gap-2 pt-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {new Date(alert.createdAt).toLocaleString()}
                      </div>

                      <div className="flex gap-4 pt-2 text-sm">
                        {alert.gpsTriggered && (
                          <span className="inline-block rounded bg-blue-50 px-2 py-1">
                            📍 GPS Triggered
                          </span>
                        )}
                        {alert.satelliteTriggered && (
                          <span className="inline-block rounded bg-blue-50 px-2 py-1">
                            🛰️ Satellite Triggered
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {alert?.isActive && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledge(alert.id)}
                            disabled={acknowledging}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {acknowledging ? 'Acknowledging...' : 'Acknowledge'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleResolve(alert.id)}
                            disabled={resolving}
                            className="flex items-center gap-1"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            {resolving ? 'Resolving...' : 'Resolve'}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No alerts to display</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
