'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Radio,
  Satellite,
  BarChart3,
  Shield,
  Bell,
  Settings,
  User,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Activity,
  Map,
  Waves,
  Zap,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'Alerts',
    question: 'How does the tsunami alert system work?',
    answer:
      'The system continuously monitors GPS ground-displacement data and satellite imagery for anomalies. When thresholds are exceeded, the alert engine evaluates combined confidence scores and issues appropriate alert levels (SAFE → WATCH → WARNING → CRITICAL).',
  },
  {
    category: 'Alerts',
    question: 'What do the different alert levels mean?',
    answer:
      'SAFE: No threat detected. WATCH: Minor anomaly detected, monitoring closely. WARNING: Significant anomaly, take precautions. CRITICAL: Imminent threat, evacuate immediately. Each level includes a confidence percentage indicating detection certainty.',
  },
  {
    category: 'Alerts',
    question: 'How do I acknowledge or resolve an alert?',
    answer:
      'Go to Alert Management, find the active alert, and click "Acknowledge" to mark that you have seen it, or "Resolve" to close it once the situation is handled. Only operators and admins can resolve alerts.',
  },
  {
    category: 'GPS',
    question: 'What GPS data is monitored?',
    answer:
      'The system tracks real-time ground displacement from GPS stations across monitored regions. It measures displacement along X, Y, and Z axes and calculates overall magnitude. Sudden spikes in displacement may indicate seismic activity.',
  },
  {
    category: 'GPS',
    question: 'What does "magnitude" mean in GPS readings?',
    answer:
      'Magnitude represents the total 3D displacement computed from X, Y, and Z components (sqrt of x² + y² + z²). Higher values indicate larger ground movement. The system flags readings that exceed configurable thresholds.',
  },
  {
    category: 'Satellite',
    question: 'How is satellite imagery analyzed?',
    answer:
      'Satellite images are processed for sea-surface anomalies using change-detection algorithms. An anomaly score (0–1) is computed; scores above the configured threshold trigger further evaluation by the alert engine.',
  },
  {
    category: 'Satellite',
    question: 'What does the anomaly score mean?',
    answer:
      'The anomaly score ranges from 0.0 (no anomaly) to 1.0 (extreme anomaly). It reflects how much the current image deviates from the baseline. Scores above ~0.6 are typically flagged for investigation.',
  },
  {
    category: 'Account',
    question: 'How do I update my profile?',
    answer:
      'Navigate to Profile from the user menu. Click "Edit" to change your display name or avatar URL, then click "Save Changes".',
  },
  {
    category: 'Account',
    question: 'How do I change my notification preferences?',
    answer:
      'Go to Settings from the user menu. You can select which alert types to receive, choose monitored regions, toggle email/SMS/push notification channels, and set your preferred theme and language.',
  },
  {
    category: 'Admin',
    question: 'Who can access the Admin Panel?',
    answer:
      'Only users with the ADMIN role can access the Admin Panel. Admins can view system statistics, manage users (change roles, enable/disable accounts), review data ingestion logs, and audit system activity.',
  },
  {
    category: 'System',
    question: 'How do I check if the system is healthy?',
    answer:
      'Visit the System Health page from the sidebar. It displays the overall status and individual component health (Database, GPS Ingestion, Satellite Processing, Alert Engine, Notification Service) with response times and error rates.',
  },
  {
    category: 'System',
    question: 'What should I do if a component shows "DEGRADED" or "DOWN"?',
    answer:
      'If a non-critical component is degraded, the system may still function normally. If a critical component (like Database or Alert Engine) is down, contact your system administrator immediately. Check the error message in the component details for specifics.',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Topics', icon: BookOpen },
  { key: 'Alerts', label: 'Alerts', icon: AlertTriangle },
  { key: 'GPS', label: 'GPS Monitoring', icon: Radio },
  { key: 'Satellite', label: 'Satellite', icon: Satellite },
  { key: 'Account', label: 'Account', icon: User },
  { key: 'Admin', label: 'Admin', icon: Shield },
  { key: 'System', label: 'System', icon: Activity },
];

const QUICK_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3, desc: 'Overview of current status' },
  {
    label: 'Alert Management',
    href: '/alert-management',
    icon: AlertTriangle,
    desc: 'View and manage alerts',
  },
  {
    label: 'GPS Monitoring',
    href: '/gps-monitoring',
    icon: Radio,
    desc: 'Real-time ground displacement',
  },
  {
    label: 'Satellite Imagery',
    href: '/satellite-imagery',
    icon: Satellite,
    desc: 'Satellite anomaly analysis',
  },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, desc: 'Historical data insights' },
  {
    label: 'System Health',
    href: '/system-health',
    icon: Activity,
    desc: 'Component status checks',
  },
  { label: 'Profile', href: '/profile', icon: User, desc: 'Your account information' },
  { label: 'Settings', href: '/settings', icon: Settings, desc: 'Notification preferences' },
  { label: 'Notifications', href: '/notifications', icon: Bell, desc: 'Your notification history' },
  { label: 'Admin Panel', href: '/admin', icon: Shield, desc: 'User & system management' },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !search ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="mt-2 text-muted-foreground">
            Everything you need to know about the Tsunami Early Warning System
          </p>
        </div>

        {/* Search */}
        <div className="relative mx-auto max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-blue-500" />
              How the System Works
            </CardTitle>
            <CardDescription>End-to-end tsunami detection pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <StepCard
                step={1}
                icon={<Radio className="h-6 w-6 text-green-600" />}
                title="GPS Ingestion"
                desc="Ground-displacement data is collected from coastal GPS stations in real time."
              />
              <StepCard
                step={2}
                icon={<Satellite className="h-6 w-6 text-purple-600" />}
                title="Satellite Analysis"
                desc="Satellite imagery is processed to detect sea-surface and coastal anomalies."
              />
              <StepCard
                step={3}
                icon={<Zap className="h-6 w-6 text-orange-600" />}
                title="Alert Engine"
                desc="Data from both sources is fused. A combined confidence score determines the alert level."
              />
              <StepCard
                step={4}
                icon={<Bell className="h-6 w-6 text-red-600" />}
                title="Notification"
                desc="Alerts are dispatched via email, SMS, and push notifications to subscribed users."
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h2>

          {/* Category Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* FAQ List */}
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No matching questions found. Try a different search term or category.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filtered.map((item, idx) => {
                const isOpen = openId === idx;
                return (
                  <Card key={idx} className="overflow-hidden">
                    <button
                      onClick={() => setOpenId(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {item.category}
                        </Badge>
                        <span className="text-sm font-medium">{item.question}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0">
                        <Separator className="mb-3" />
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Quick Navigation</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 rounded-lg border p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <div className="rounded-md bg-gray-100 p-2 transition-colors group-hover:bg-blue-100">
                    <Icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{link.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Contact / Support */}
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="flex flex-col items-center gap-4 py-6 sm:flex-row">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold">Still need help?</h3>
              <p className="text-sm text-muted-foreground">
                Contact the system administrator or your organization&apos;s support team for
                additional assistance with deployment, configuration, or technical issues.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// ─── Helper ─────────────────────────────────────────

function StepCard({
  step,
  icon,
  title,
  desc,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative rounded-lg border p-4 text-center">
      <div className="absolute -top-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {step}
      </div>
      <div className="mb-2 mt-2 flex justify-center">{icon}</div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
