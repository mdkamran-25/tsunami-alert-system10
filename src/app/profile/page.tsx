'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Pencil,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useMe, useUpdateProfile } from '@/hooks/useSystem';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { user, loading, error, refetch } = useMe();
  const { updateProfile, loading: saving, error: saveError } = useUpdateProfile();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateProfile({ name: name || undefined, avatar: avatar || undefined });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      refetch();
    } catch {
      // error is captured in saveError
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setAvatar(user?.avatar || '');
    setEditing(false);
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="border-red-200 bg-red-100 text-red-700">Admin</Badge>;
      case 'OPERATOR':
        return <Badge className="border-blue-200 bg-blue-100 text-blue-700">Operator</Badge>;
      default:
        return <Badge className="border-gray-200 bg-gray-100 text-gray-700">User</Badge>;
    }
  };

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 py-6">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">Failed to load profile: {error.message}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardContent className="flex flex-col items-center pt-6">
                <Avatar className="mb-4 h-24 w-24">
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback className="bg-blue-100 text-2xl text-blue-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{user?.name || 'Unnamed User'}</h2>
                <p className="mb-2 text-sm text-muted-foreground">{user?.email}</p>
                {roleBadge(user?.role || 'USER')}

                <Separator className="my-4 w-full" />

                <div className="w-full space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{' '}
                      {user?.createdAt
                        ? new Date(Number(user.createdAt)).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Role: {user?.role || 'USER'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!editing && (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {success && (
                  <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Profile updated successfully!</span>
                  </div>
                )}
                {saveError && (
                  <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{saveError.message}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ''} disabled className="bg-gray-50" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Display Name</Label>
                    {editing ? (
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    ) : (
                      <Input id="name" value={user?.name || '—'} disabled className="bg-gray-50" />
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    {editing ? (
                      <Input
                        id="avatar"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://example.com/avatar.png"
                      />
                    ) : (
                      <Input
                        id="avatar"
                        value={user?.avatar || '—'}
                        disabled
                        className="bg-gray-50"
                      />
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Input value={user?.role || 'USER'} disabled className="bg-gray-50" />
                    <p className="text-xs text-muted-foreground">
                      Role can only be changed by an administrator
                    </p>
                  </div>
                </div>

                {editing && (
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-1 h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="mr-1 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preferences Summary */}
            {user?.preferences && (
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg">Notification Preferences</CardTitle>
                  <CardDescription>
                    Quick overview — go to{' '}
                    <a href="/settings" className="text-blue-600 underline">
                      Settings
                    </a>{' '}
                    to modify
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-sm">
                      <p className="mb-1 font-medium">Alert Types</p>
                      <div className="flex flex-wrap gap-1">
                        {user.preferences.alertTypes?.length > 0 ? (
                          user.preferences.alertTypes.map((t: string) => (
                            <Badge key={t} variant="secondary" className="text-xs">
                              {t}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">All types</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="mb-1 font-medium">Monitored Regions</p>
                      <div className="flex flex-wrap gap-1">
                        {user.preferences.regions?.length > 0 ? (
                          user.preferences.regions.map((r: string) => (
                            <Badge key={r} variant="secondary" className="text-xs">
                              {r}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">All regions</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="mb-1 font-medium">Channels</p>
                      <p>
                        Email:{' '}
                        {user.preferences.emailNotifications ? (
                          <span className="text-green-600">On</span>
                        ) : (
                          <span className="text-gray-400">Off</span>
                        )}
                      </p>
                      <p>
                        SMS:{' '}
                        {user.preferences.smsNotifications ? (
                          <span className="text-green-600">On</span>
                        ) : (
                          <span className="text-gray-400">Off</span>
                        )}
                      </p>
                      <p>
                        Push:{' '}
                        {user.preferences.pushNotifications ? (
                          <span className="text-green-600">On</span>
                        ) : (
                          <span className="text-gray-400">Off</span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
