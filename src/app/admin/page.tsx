'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  Radio,
  Bell,
  Database,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  UserCog,
  BarChart3,
  ScrollText,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  useUsers,
  useAdminStats,
  useAuditLogs,
  useUpdateUserRole,
  useToggleUserActive,
} from '@/hooks/useSystem';

export default function AdminPage() {
  const { user: authUser } = useAuth();
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useAdminStats({ pollInterval: 30000 });
  const { logs, loading: logsLoading, error: logsError } = useAuditLogs();
  const { updateUserRole, loading: roleUpdating } = useUpdateUserRole();
  const { toggleUserActive, loading: toggling } = useToggleUserActive();

  const [showLogs, setShowLogs] = useState(false);

  const isAdmin = authUser?.role === 'ADMIN';

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Shield className="mb-4 h-16 w-16 text-red-300" />
          <h1 className="text-2xl font-bold text-gray-700">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You need administrator privileges to access this page.
          </p>
          <Button className="mt-4" onClick={() => (window.location.href = '/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const loading = usersLoading || statsLoading;

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      refetchUsers();
    } catch {
      // error handled by hook
    }
  };

  const handleToggleActive = async (userId: string) => {
    try {
      await toggleUserActive(userId);
      refetchUsers();
    } catch {
      // error handled by hook
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Shield className="h-8 w-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">System administration and user management</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            {statsError ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="flex items-center gap-3 py-6">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700">{statsError.message}</p>
                </CardContent>
              </Card>
            ) : stats ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  icon={<Users className="h-5 w-5 text-blue-500" />}
                  label="Total Users"
                  value={stats.totalUsers}
                  sub={`${stats.activeUsers} active`}
                />
                <StatCard
                  icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
                  label="Alerts"
                  value={stats.totalAlerts}
                  sub={`${stats.activeAlerts} active`}
                />
                <StatCard
                  icon={<Radio className="h-5 w-5 text-green-500" />}
                  label="GPS Stations"
                  value={stats.totalStations}
                  sub={`${stats.activeStations} active`}
                />
                <StatCard
                  icon={<Bell className="h-5 w-5 text-purple-500" />}
                  label="Notifications"
                  value={stats.totalNotifications}
                  sub="total sent"
                />
              </div>
            ) : null}

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  {users.length} registered user{users.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersError ? (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{usersError.message}</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="pb-3 pr-4">User</th>
                          <th className="pb-3 pr-4">Role</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3 pr-4">Joined</th>
                          <th className="pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {users.map((u: any) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="py-3 pr-4">
                              <div>
                                <p className="font-medium">{u.name || 'Unnamed'}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                disabled={roleUpdating || u.id === authUser?.id}
                                className="rounded border bg-white px-2 py-1 text-xs disabled:opacity-50"
                              >
                                <option value="USER">USER</option>
                                <option value="OPERATOR">OPERATOR</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                            </td>
                            <td className="py-3 pr-4">
                              {u.isActive ? (
                                <Badge className="border-green-200 bg-green-100 text-green-700">
                                  Active
                                </Badge>
                              ) : (
                                <Badge className="border-red-200 bg-red-100 text-red-700">
                                  Disabled
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">
                              {u.createdAt
                                ? new Date(Number(u.createdAt)).toLocaleDateString()
                                : '—'}
                            </td>
                            <td className="py-3">
                              {u.id !== authUser?.id && (
                                <Button
                                  size="sm"
                                  variant={u.isActive ? 'destructive' : 'default'}
                                  disabled={toggling}
                                  onClick={() => handleToggleActive(u.id)}
                                >
                                  {u.isActive ? 'Disable' : 'Enable'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Data Ingestion Logs */}
            {stats?.recentIngestionLogs && stats.recentIngestionLogs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Recent Data Ingestion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.recentIngestionLogs.map((log: any) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between rounded-md bg-gray-50 p-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{log.source}</Badge>
                          <span>
                            {log.recordsProcessed} processed
                            {log.recordsFailed > 0 && (
                              <span className="text-red-600"> / {log.recordsFailed} failed</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={log.status} />
                          <span className="text-xs text-muted-foreground">
                            {log.duration ? `${log.duration}ms` : '—'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Audit Logs */}
            <Card>
              <CardHeader>
                <button
                  className="flex w-full items-center justify-between"
                  onClick={() => setShowLogs(!showLogs)}
                >
                  <div className="flex items-center gap-2">
                    <ScrollText className="h-5 w-5" />
                    <CardTitle>Audit Logs</CardTitle>
                  </div>
                  {showLogs ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </CardHeader>
              {showLogs && (
                <CardContent>
                  {logsLoading ? (
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : logsError ? (
                    <p className="text-sm text-red-600">{logsError.message}</p>
                  ) : logs.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No audit logs recorded yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {logs.map((log: any) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between rounded-md bg-gray-50 p-3 text-sm"
                        >
                          <div>
                            <span className="font-medium">{log.action}</span>
                            {log.resource && (
                              <span className="text-muted-foreground">
                                {' '}
                                on {log.resource}
                                {log.resourceId ? ` #${log.resourceId}` : ''}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {log.createdAt ? new Date(Number(log.createdAt)).toLocaleString() : '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── Helper Components ─────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        {icon}
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'SUCCESS':
      return (
        <Badge className="border-green-200 bg-green-100 text-xs text-green-700">Success</Badge>
      );
    case 'FAILURE':
      return <Badge className="border-red-200 bg-red-100 text-xs text-red-700">Failed</Badge>;
    case 'PARTIAL':
      return (
        <Badge className="border-yellow-200 bg-yellow-100 text-xs text-yellow-700">Partial</Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs">
          {status}
        </Badge>
      );
  }
}
