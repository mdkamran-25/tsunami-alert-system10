'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Bell,
  BellOff,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Palette,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';
import { useMe, useUpdatePreferences } from '@/hooks/useSystem';

const ALERT_TYPE_OPTIONS = ['TSUNAMI', 'EARTHQUAKE', 'FLOOD', 'STORM', 'VOLCANIC'];
const REGION_OPTIONS = [
  'Pacific Ocean',
  'Indian Ocean',
  'Atlantic Ocean',
  'Mediterranean Sea',
  'Caribbean Sea',
  'South China Sea',
];

export default function SettingsPage() {
  const { user, loading, error, refetch } = useMe();
  const { updatePreferences, loading: saving, error: saveError } = useUpdatePreferences();

  const [alertTypes, setAlertTypes] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [success, setSuccess] = useState(false);
  const [customRegion, setCustomRegion] = useState('');

  useEffect(() => {
    if (user?.preferences) {
      const p = user.preferences;
      setAlertTypes(p.alertTypes || []);
      setRegions(p.regions || []);
      setEmailNotifications(p.emailNotifications ?? true);
      setSmsNotifications(p.smsNotifications ?? false);
      setPushNotifications(p.pushNotifications ?? true);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updatePreferences({
        alertTypes,
        regions,
        emailNotifications,
        smsNotifications,
        pushNotifications,
        theme,
        language,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      refetch();
    } catch {
      // error captured in saveError
    }
  };

  const toggleAlertType = (type: string) => {
    setAlertTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleRegion = (region: string) => {
    setRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const addCustomRegion = () => {
    const r = customRegion.trim();
    if (r && !regions.includes(r)) {
      setRegions((prev) => [...prev, r]);
      setCustomRegion('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your notification preferences and app settings
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 py-6">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">Failed to load settings: {error.message}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {success && (
              <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">Settings saved successfully!</span>
              </div>
            )}
            {saveError && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{saveError.message}</span>
              </div>
            )}

            {/* Alert Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Types
                </CardTitle>
                <CardDescription>Select which types of alerts you want to receive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ALERT_TYPE_OPTIONS.map((type) => {
                    const active = alertTypes.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleAlertType(type)}
                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
                {alertTypes.length === 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    No types selected — you will receive all alert types
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Monitored Regions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Monitored Regions
                </CardTitle>
                <CardDescription>
                  Choose specific regions to monitor or leave empty for global coverage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {REGION_OPTIONS.map((region) => {
                    const active = regions.includes(region);
                    return (
                      <button
                        key={region}
                        onClick={() => toggleRegion(region)}
                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>

                {/* Custom regions */}
                {regions
                  .filter((r) => !REGION_OPTIONS.includes(r))
                  .map((r) => (
                    <Badge key={r} variant="secondary" className="mr-1">
                      {r}
                      <button onClick={() => toggleRegion(r)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                <div className="flex max-w-sm gap-2">
                  <Input
                    placeholder="Add custom region..."
                    value={customRegion}
                    onChange={(e) => setCustomRegion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomRegion()}
                  />
                  <Button size="sm" variant="outline" onClick={addCustomRegion}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Notification Channels
                </CardTitle>
                <CardDescription>How do you want to be notified?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <NotifToggle
                    icon={<Mail className="h-5 w-5" />}
                    label="Email Notifications"
                    description="Receive alert emails at your registered email address"
                    enabled={emailNotifications}
                    onToggle={() => setEmailNotifications(!emailNotifications)}
                  />
                  <Separator />
                  <NotifToggle
                    icon={<Smartphone className="h-5 w-5" />}
                    label="SMS Notifications"
                    description="Get text messages for critical alerts"
                    enabled={smsNotifications}
                    onToggle={() => setSmsNotifications(!smsNotifications)}
                  />
                  <Separator />
                  <NotifToggle
                    icon={<Bell className="h-5 w-5" />}
                    label="Push Notifications"
                    description="Browser push notifications for real-time alerts"
                    enabled={pushNotifications}
                    onToggle={() => setPushNotifications(!pushNotifications)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Theme</Label>
                    <div className="flex gap-2">
                      {['light', 'dark', 'system'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`rounded-md px-4 py-2 text-sm capitalize transition-colors ${
                            theme === t
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Language</Label>
                    <div className="flex gap-2">
                      {[
                        { code: 'en', label: 'English' },
                        { code: 'ja', label: '日本語' },
                        { code: 'id', label: 'Indonesia' },
                      ].map((l) => (
                        <button
                          key={l.code}
                          onClick={() => setLanguage(l.code)}
                          className={`rounded-md px-4 py-2 text-sm transition-colors ${
                            language === l.code
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save */}
            <div className="flex justify-end">
              <Button size="lg" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── Helper component ──────────────────────────────

function NotifToggle({
  icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={enabled ? 'text-blue-600' : 'text-gray-400'}>{icon}</div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
