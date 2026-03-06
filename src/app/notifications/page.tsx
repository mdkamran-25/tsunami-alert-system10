'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { useNotifications } from '@/hooks/useSystem';

const typeIcon = (type: string) => {
  switch (type) {
    case 'ALERT':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'WARNING':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'INFO':
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'SENT':
      return <Badge className="border-green-200 bg-green-100 text-green-700">Sent</Badge>;
    case 'DELIVERED':
      return <Badge className="border-blue-200 bg-blue-100 text-blue-700">Delivered</Badge>;
    case 'FAILED':
      return <Badge className="border-red-200 bg-red-100 text-red-700">Failed</Badge>;
    case 'PENDING':
      return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-700">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function NotificationsPage() {
  const { notifications, loading, error, refetch } = useNotifications({ pollInterval: 30000 });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <Bell className="h-8 w-8" />
              Notifications
            </h1>
            <p className="text-muted-foreground">Your alert notifications and system messages</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 py-6">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">Failed to load notifications: {error.message}</p>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="mb-4 h-16 w-16 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600">No notifications yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                You&apos;ll see alert notifications, system messages, and status updates here when
                they&apos;re available.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Summary Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-4">
              <SummaryCard
                label="Total"
                value={notifications.length}
                icon={<Bell className="h-5 w-5 text-gray-500" />}
              />
              <SummaryCard
                label="Delivered"
                value={notifications.filter((n: any) => n.status === 'DELIVERED').length}
                icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
              />
              <SummaryCard
                label="Pending"
                value={notifications.filter((n: any) => n.status === 'PENDING').length}
                icon={<Clock className="h-5 w-5 text-yellow-500" />}
              />
              <SummaryCard
                label="Failed"
                value={notifications.filter((n: any) => n.status === 'FAILED').length}
                icon={<XCircle className="h-5 w-5 text-red-500" />}
              />
            </div>

            {/* Notification List */}
            {notifications.map((notif: any) => (
              <Card
                key={notif.id}
                className={`transition-colors hover:border-blue-200 ${
                  notif.status === 'FAILED' ? 'border-red-200 bg-red-50/30' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{typeIcon(notif.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-medium">
                          {notif.subject || notif.type || 'Notification'}
                        </h4>
                        {statusBadge(notif.status)}
                        <Badge variant="outline" className="text-xs">
                          {notif.type}
                        </Badge>
                      </div>
                      {notif.message && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {notif.message}
                        </p>
                      )}
                      {notif.recipient && (
                        <p className="mt-1 text-xs text-muted-foreground">To: {notif.recipient}</p>
                      )}
                      {notif.failureReason && (
                        <p className="mt-1 text-xs text-red-600">
                          Error: {notif.failureReason}
                          {notif.retryCount > 0 && ` (${notif.retryCount} retries)`}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {notif.createdAt
                            ? new Date(Number(notif.createdAt)).toLocaleString()
                            : '—'}
                        </span>
                        {notif.deliveredAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            Delivered {new Date(Number(notif.deliveredAt)).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── Helper ─────────────────────────────────────────

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        {icon}
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
