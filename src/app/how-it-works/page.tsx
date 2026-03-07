'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Waves,
  Radio,
  Satellite,
  Zap,
  Bell,
  Database,
  Globe,
  Shield,
  Monitor,
  Server,
  Smartphone,
  Mail,
  Eye,
  ArrowDown,
  ArrowRight,
  Layers,
  GitBranch,
  Lock,
  RefreshCw,
  BarChart3,
  Users,
  Cloud,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Activity,
  MousePointer,
} from 'lucide-react';

/* ────────────────────────────────────────────────
 *  Colour palette for the flow nodes
 * ──────────────────────────────────────────────── */
const C = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-700',
    ring: 'ring-blue-200',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-700',
    ring: 'ring-green-200',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-700',
    ring: 'ring-purple-200',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-700',
    ring: 'ring-orange-200',
  },
  red: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', ring: 'ring-red-200' },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-300',
    text: 'text-teal-700',
    ring: 'ring-teal-200',
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-700',
    ring: 'ring-gray-200',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
  },
};

export default function HowItWorksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-12 pb-12">
        {/* ───── Hero ───── */}
        <section className="mx-auto max-w-3xl space-y-3 text-center">
          <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">
            <Waves className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            How the System Works
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            A visual walkthrough of the Tsunami Early Warning System — from raw sensor data to
            life-saving alerts.
          </p>
        </section>

        {/* ═══════════════════════════════════════════
         *  1. HIGH-LEVEL ARCHITECTURE
         * ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading
            number={1}
            title="High-Level Architecture"
            subtitle="Three-tier system: Data Sources → Backend Processing → Frontend Dashboard"
          />

          {/* Architecture Diagram */}
          <div className="grid items-start gap-0 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {/* Data Sources */}
            <ArchBlock
              color={C.green}
              icon={<Globe className="h-6 w-6" />}
              title="Data Sources"
              items={[
                { icon: <Radio className="h-4 w-4" />, label: 'Coastal GPS Stations' },
                { icon: <Satellite className="h-4 w-4" />, label: 'Satellite Imagery' },
                { icon: <Wifi className="h-4 w-4" />, label: 'USGS Seismic Feed' },
                { icon: <Cloud className="h-4 w-4" />, label: 'Google Earth Engine' },
              ]}
            />
            <FlowArrow />
            {/* Backend */}
            <ArchBlock
              color={C.purple}
              icon={<Server className="h-6 w-6" />}
              title="Backend (Node.js)"
              items={[
                { icon: <Zap className="h-4 w-4" />, label: 'GraphQL API (Apollo)' },
                { icon: <Database className="h-4 w-4" />, label: 'PostgreSQL + Prisma' },
                { icon: <Cpu className="h-4 w-4" />, label: 'Alert Engine' },
                { icon: <RefreshCw className="h-4 w-4" />, label: 'Cron Data Fetchers' },
              ]}
            />
            <FlowArrow />
            {/* Frontend */}
            <ArchBlock
              color={C.blue}
              icon={<Monitor className="h-6 w-6" />}
              title="Frontend (Next.js)"
              items={[
                { icon: <Eye className="h-4 w-4" />, label: 'Real-time Dashboard' },
                { icon: <BarChart3 className="h-4 w-4" />, label: 'Analytics & Maps' },
                { icon: <Bell className="h-4 w-4" />, label: 'Alert Notifications' },
                { icon: <Shield className="h-4 w-4" />, label: 'Admin Panel' },
              ]}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         *  2. DATA PIPELINE (vertical flow)
         * ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading
            number={2}
            title="Data Collection Pipeline"
            subtitle="How raw data flows from sensors to actionable intelligence"
          />

          <div className="mx-auto max-w-2xl space-y-0">
            <PipelineStep
              step={1}
              color={C.green}
              icon={<Radio className="h-6 w-6" />}
              title="GPS Ground-Displacement Ingestion"
              description="Coastal GPS stations send real-time position data. The system ingests latitude, longitude, and 3D displacement (X/Y/Z) every few seconds. Sudden spikes in magnitude indicate potential seismic activity."
              tech={['GPS Stations', 'USGS API', 'node-cron']}
            />
            <VerticalConnector />

            <PipelineStep
              step={2}
              color={C.teal}
              icon={<Satellite className="h-6 w-6" />}
              title="Satellite Imagery Analysis"
              description="Satellite images from Earth observation platforms are fetched periodically. Change-detection algorithms compare current images against baselines to compute an anomaly score (0.0–1.0) for each monitored region."
              tech={['Google Earth Engine', 'Anomaly Detection', 'Region Bounds']}
            />
            <VerticalConnector />

            <PipelineStep
              step={3}
              color={C.purple}
              icon={<Database className="h-6 w-6" />}
              title="Data Storage & Normalization"
              description="All GPS readings, satellite data, and computed scores are stored in PostgreSQL via Prisma ORM. Data is indexed by region, timestamp, and station for fast querying."
              tech={['PostgreSQL', 'Prisma ORM', 'Supabase / Render']}
            />
            <VerticalConnector />

            <PipelineStep
              step={4}
              color={C.orange}
              icon={<Zap className="h-6 w-6" />}
              title="Alert Engine — Threat Evaluation"
              description="The core intelligence module. It fuses GPS displacement data and satellite anomaly scores to compute a combined confidence level. Thresholds determine the alert level: SAFE → WATCH → WARNING → CRITICAL."
              tech={['Confidence Scoring', 'Multi-source Fusion', 'Threshold Engine']}
            />
            <VerticalConnector />

            <PipelineStep
              step={5}
              color={C.red}
              icon={<Bell className="h-6 w-6" />}
              title="Alert Dispatch & Notification"
              description="When an alert level changes, the notification service dispatches alerts via Email, SMS, and Push notifications to all subscribed users based on their preferences and monitored regions."
              tech={['Email (SMTP)', 'Push Notifications', 'Real-time WebSocket']}
            />
            <VerticalConnector />

            <PipelineStep
              step={6}
              color={C.blue}
              icon={<Monitor className="h-6 w-6" />}
              title="Live Dashboard & Visualization"
              description="Users see the current alert level, GPS station map, satellite imagery, analytics charts, and system health — all updating in real-time via GraphQL subscriptions over WebSocket."
              tech={['Next.js', 'Apollo Client', 'graphql-ws']}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         *  3. TECH STACK VISUAL
         * ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading
            number={3}
            title="Technology Stack"
            subtitle="The tools and frameworks powering each layer"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TechCard
              title="Frontend"
              color={C.blue}
              items={[
                'Next.js 14 (App Router)',
                'React 18 (Client Components)',
                'Apollo Client 3 (GraphQL)',
                'Tailwind CSS + shadcn/ui',
                'Lucide Icons',
                'Deployed on Vercel',
              ]}
            />
            <TechCard
              title="Backend"
              color={C.purple}
              items={[
                'Node.js + TypeScript (ESM)',
                'Apollo Server 4 (GraphQL)',
                'Prisma 5 (ORM)',
                'graphql-ws (Subscriptions)',
                'bcryptjs + JWT Auth',
                'Deployed on Render (Docker)',
              ]}
            />
            <TechCard
              title="Database & Infra"
              color={C.green}
              items={[
                'PostgreSQL 16',
                '13 Prisma Models',
                'Render Managed Postgres',
                'SSL / TLS Encryption',
                'Automated Migrations',
                'Health Check Endpoint',
              ]}
            />
            <TechCard
              title="Data Sources"
              color={C.teal}
              items={[
                'USGS Earthquake Feed API',
                'Google Earth Engine',
                'Coastal GPS Networks',
                'Satellite Imagery Providers',
                'Scheduled Cron Jobs',
                'Anomaly Detection Algorithms',
              ]}
            />
            <TechCard
              title="Real-time"
              color={C.orange}
              items={[
                'WebSocket (graphql-ws)',
                'GraphQL Subscriptions',
                'Alert Status Updates',
                'GPS Reading Streams',
                'Satellite Data Streams',
                'Live Dashboard Refresh',
              ]}
            />
            <TechCard
              title="Security"
              color={C.red}
              items={[
                'JWT Access + Refresh Tokens',
                'bcrypt Password Hashing',
                'Role-Based Access (RBAC)',
                'CORS Policy Enforcement',
                'Helmet Security Headers',
                'Auth Guards on All Pages',
              ]}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         *  4. ALERT MECHANISM VISUAL
         * ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading
            number={4}
            title="Alert Mechanism"
            subtitle="How threat levels are determined and communicated"
          />

          {/* Alert Levels */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Level Escalation</CardTitle>
              <CardDescription>
                Each level is triggered by combined GPS + Satellite confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row">
                <AlertLevelBox
                  level="SAFE"
                  color="bg-green-100 border-green-400 text-green-800"
                  range="0% – 25%"
                  desc="No anomaly detected. Normal monitoring."
                />
                <EscalationArrow />
                <AlertLevelBox
                  level="WATCH"
                  color="bg-yellow-100 border-yellow-400 text-yellow-800"
                  range="25% – 50%"
                  desc="Minor anomaly. Enhanced monitoring active."
                />
                <EscalationArrow />
                <AlertLevelBox
                  level="WARNING"
                  color="bg-orange-100 border-orange-400 text-orange-800"
                  range="50% – 75%"
                  desc="Significant threat. Take precautions."
                />
                <EscalationArrow />
                <AlertLevelBox
                  level="CRITICAL"
                  color="bg-red-100 border-red-400 text-red-800"
                  range="75% – 100%"
                  desc="Imminent danger! Evacuate immediately."
                />
              </div>
            </CardContent>
          </Card>

          {/* Confidence Scoring */}
          <Card>
            <CardHeader>
              <CardTitle>Confidence Score Calculation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border-2 border-dashed border-green-300 p-4 text-center">
                  <Radio className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <p className="text-sm font-semibold">GPS Confidence</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Based on displacement magnitude, triggered station count, and data freshness
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-700">40% weight</Badge>
                </div>
                <div className="rounded-lg border-2 border-dashed border-purple-300 p-4 text-center">
                  <Satellite className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                  <p className="text-sm font-semibold">Satellite Confidence</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Based on anomaly score, change detection, and regional baseline comparison
                  </p>
                  <Badge className="mt-2 bg-purple-100 text-purple-700">35% weight</Badge>
                </div>
                <div className="rounded-lg border-2 border-dashed border-orange-300 p-4 text-center">
                  <Activity className="mx-auto mb-2 h-8 w-8 text-orange-600" />
                  <p className="text-sm font-semibold">Combined Score</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Weighted fusion + regional risk factor + historical context = final alert level
                  </p>
                  <Badge className="mt-2 bg-orange-100 text-orange-700">100% decision</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ═══════════════════════════════════════════
         *  5. API & COMMUNICATION FLOW
         * ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading
            number={5}
            title="API & Communication Flow"
            subtitle="How the frontend and backend communicate"
          />

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Request Flow */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                    Query / Mutation Flow (HTTP)
                  </h3>
                  <div className="space-y-2 border-l-2 border-blue-200 pl-4">
                    <FlowItem emoji="👤" text="User interacts with dashboard" />
                    <FlowItem emoji="⚛️" text="React hook calls Apollo useQuery / useMutation" />
                    <FlowItem emoji="📡" text="HTTP POST to /graphql with JWT in header" />
                    <FlowItem emoji="🔐" text="Backend verifies JWT, extracts user context" />
                    <FlowItem emoji="📊" text="Resolver fetches data from PostgreSQL via Prisma" />
                    <FlowItem emoji="📦" text="JSON response sent back to frontend" />
                    <FlowItem emoji="🖥️" text="React re-renders with fresh data" />
                  </div>
                </div>

                {/* Subscription Flow */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <RefreshCw className="h-4 w-4 text-green-500" />
                    Subscription Flow (WebSocket)
                  </h3>
                  <div className="space-y-2 border-l-2 border-green-200 pl-4">
                    <FlowItem emoji="🔌" text="Client opens WebSocket to ws:// endpoint" />
                    <FlowItem emoji="🎫" text="Auth token sent in connectionParams" />
                    <FlowItem emoji="📢" text="Client subscribes to alertStatusUpdated" />
                    <FlowItem emoji="🌊" text="Alert Engine detects threshold breach" />
                    <FlowItem emoji="📤" text="Server publishes event via PubSub" />
                    <FlowItem emoji="⚡" text="All subscribed clients receive update instantly" />
                    <FlowItem emoji="🚨" text="Dashboard shows live alert banner" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ═══════════════════════════════════════════
         *  6. DATABASE SCHEMA OVERVIEW
         * ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading
            number={6}
            title="Database Schema"
            subtitle="13 Prisma models powering the system"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'User', desc: 'Accounts, roles, auth data', color: 'bg-blue-500' },
              {
                name: 'UserPreferences',
                desc: 'Alert types, regions, channels',
                color: 'bg-blue-400',
              },
              { name: 'RefreshToken', desc: 'JWT refresh token storage', color: 'bg-blue-300' },
              { name: 'GPSStation', desc: 'Coastal station metadata', color: 'bg-green-500' },
              { name: 'GPSReading', desc: 'Displacement measurements', color: 'bg-green-400' },
              { name: 'SatelliteData', desc: 'Images, anomaly scores', color: 'bg-purple-500' },
              { name: 'AlertStatusRecord', desc: 'Alert history & levels', color: 'bg-red-500' },
              {
                name: 'DetectionResult',
                desc: 'Combined analysis outputs',
                color: 'bg-orange-500',
              },
              { name: 'Notification', desc: 'Sent alerts log', color: 'bg-amber-500' },
              { name: 'SystemHealth', desc: 'Overall system status', color: 'bg-teal-500' },
              { name: 'ComponentHealth', desc: 'Per-service health', color: 'bg-teal-400' },
              { name: 'AuditLog', desc: 'User action tracking', color: 'bg-gray-500' },
              { name: 'DataIngestionLog', desc: 'ETL run history', color: 'bg-gray-400' },
            ].map((model) => (
              <div
                key={model.name}
                className="flex items-center gap-3 rounded-lg border p-3 transition-shadow hover:shadow-sm"
              >
                <div className={`h-3 w-3 rounded-full ${model.color} shrink-0`} />
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm font-semibold">{model.name}</p>
                  <p className="text-xs text-muted-foreground">{model.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         *  7. USER ROLES & ACCESS
         * ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading
            number={7}
            title="User Roles & Access Control"
            subtitle="Role-based permissions across the application"
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <RoleCard
              role="USER"
              color="bg-blue-100 border-blue-300 text-blue-700"
              icon={<Users className="h-6 w-6" />}
              permissions={[
                'View dashboard & alerts',
                'Monitor GPS stations',
                'View satellite imagery',
                'View analytics',
                'Manage own profile & settings',
              ]}
            />
            <RoleCard
              role="OPERATOR"
              color="bg-orange-100 border-orange-300 text-orange-700"
              icon={<Eye className="h-6 w-6" />}
              permissions={[
                'All User permissions',
                'Acknowledge alerts',
                'Resolve alerts',
                'View system health',
                'Access alert management',
              ]}
            />
            <RoleCard
              role="ADMIN"
              color="bg-red-100 border-red-300 text-red-700"
              icon={<Shield className="h-6 w-6" />}
              permissions={[
                'All Operator permissions',
                'Manage users (roles, status)',
                'View audit logs',
                'View admin statistics',
                'Full system control',
              ]}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         *  8. DEPLOYMENT ARCHITECTURE
         * ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading
            number={8}
            title="Deployment Architecture"
            subtitle="Where each component runs in production"
          />

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <DeployBox
                  icon={<Globe className="h-8 w-8 text-blue-600" />}
                  platform="Vercel"
                  component="Frontend (Next.js)"
                  details={[
                    'Edge Network CDN',
                    'Automatic HTTPS',
                    'Git-push deploys',
                    'Serverless functions',
                  ]}
                  url="tsunami-alert-system10.vercel.app"
                />
                <DeployBox
                  icon={<Server className="h-8 w-8 text-purple-600" />}
                  platform="Render"
                  component="Backend (Docker)"
                  details={[
                    'Docker container',
                    'Auto-deploy on push',
                    'Health checks',
                    'Environment variables',
                  ]}
                  url="major-project-backend-o1vb.onrender.com"
                />
                <DeployBox
                  icon={<HardDrive className="h-8 w-8 text-green-600" />}
                  platform="Render"
                  component="PostgreSQL 16"
                  details={[
                    'Managed database',
                    'SSL connections',
                    'Automatic backups',
                    'Virginia region',
                  ]}
                  url="Render Managed Postgres"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ═══════════════════════════════════════════
         *  9. PAGE MAP
         * ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading
            number={9}
            title="Application Pages"
            subtitle="All routes and what they do"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                path: '/dashboard',
                label: 'Dashboard',
                desc: 'Real-time overview, alert banner, quick stats',
                icon: <Monitor className="h-4 w-4" />,
              },
              {
                path: '/gps-monitoring',
                label: 'GPS Monitoring',
                desc: 'Station list, live displacement readings, maps',
                icon: <Radio className="h-4 w-4" />,
              },
              {
                path: '/satellite-imagery',
                label: 'Satellite Imagery',
                desc: 'Satellite images, anomaly scores, regions',
                icon: <Satellite className="h-4 w-4" />,
              },
              {
                path: '/alert-management',
                label: 'Alert Management',
                desc: 'Active alerts, acknowledge, resolve',
                icon: <AlertTriangle className="h-4 w-4" />,
              },
              {
                path: '/analytics',
                label: 'Analytics',
                desc: 'Historical data, trends, statistics',
                icon: <BarChart3 className="h-4 w-4" />,
              },
              {
                path: '/system-health',
                label: 'System Health',
                desc: 'Component status, uptime, error rates',
                icon: <Activity className="h-4 w-4" />,
              },
              {
                path: '/profile',
                label: 'Profile',
                desc: 'View/edit name, avatar, account info',
                icon: <Users className="h-4 w-4" />,
              },
              {
                path: '/settings',
                label: 'Settings',
                desc: 'Notification preferences, theme, language',
                icon: <MousePointer className="h-4 w-4" />,
              },
              {
                path: '/notifications',
                label: 'Notifications',
                desc: 'Notification history, delivery status',
                icon: <Bell className="h-4 w-4" />,
              },
              {
                path: '/admin',
                label: 'Admin Panel',
                desc: 'User management, stats, audit logs',
                icon: <Shield className="h-4 w-4" />,
              },
              {
                path: '/help',
                label: 'Help & Support',
                desc: 'FAQ, guides, quick navigation',
                icon: <Layers className="h-4 w-4" />,
              },
              {
                path: '/how-it-works',
                label: 'How It Works',
                desc: 'This page — system architecture visual',
                icon: <GitBranch className="h-4 w-4" />,
              },
            ].map((page) => (
              <a
                key={page.path}
                href={page.path}
                className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:border-blue-300 hover:bg-blue-50/40"
              >
                <div className="mt-0.5 rounded-md bg-gray-100 p-2 transition-colors group-hover:bg-blue-100">
                  {page.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{page.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{page.path}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{page.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>Tsunami Early Warning System — Major Project</p>
          <p className="mt-1">Built with Next.js, Apollo GraphQL, PostgreSQL & Prisma</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ─────────────────────────────────────────────────────
 *  HELPER COMPONENTS
 * ───────────────────────────────────────────────────── */

function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow">
        {number}
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function ArchBlock({
  color,
  icon,
  title,
  items,
}: {
  color: (typeof C)[keyof typeof C];
  icon: React.ReactNode;
  title: string;
  items: { icon: React.ReactNode; label: string }[];
}) {
  return (
    <div className={`rounded-xl border-2 ${color.border} ${color.bg} space-y-3 p-5`}>
      <div className={`flex items-center gap-2 font-bold ${color.text}`}>
        {icon}
        {title}
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className={color.text}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center px-2 lg:flex">
      <div className="flex flex-col items-center">
        <div className="h-0.5 w-8 bg-gray-300" />
        <ArrowRight className="-mt-[13px] h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}

function VerticalConnector() {
  return (
    <div className="flex justify-center py-1">
      <div className="flex flex-col items-center">
        <div className="h-6 w-0.5 bg-gray-300" />
        <ArrowDown className="-mt-1 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}

function PipelineStep({
  step,
  color,
  icon,
  title,
  description,
  tech,
}: {
  step: number;
  color: (typeof C)[keyof typeof C];
  icon: React.ReactNode;
  title: string;
  description: string;
  tech: string[];
}) {
  return (
    <Card className={`border-2 ${color.border} ${color.bg} overflow-hidden`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`h-12 w-12 flex-shrink-0 rounded-xl ${color.bg} border-2 ${color.border} flex items-center justify-center ${color.text}`}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${color.text} border-current`}>
                Step {step}
              </Badge>
              <h3 className="text-sm font-bold">{title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tech.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TechCard({
  title,
  color,
  items,
}: {
  title: string;
  color: (typeof C)[keyof typeof C];
  items: string[];
}) {
  return (
    <Card className={`border-2 ${color.border}`}>
      <CardHeader className={`${color.bg} pb-3`}>
        <CardTitle className={`text-base ${color.text}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className={`h-3.5 w-3.5 ${color.text} shrink-0`} />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function AlertLevelBox({
  level,
  color,
  range,
  desc,
}: {
  level: string;
  color: string;
  range: string;
  desc: string;
}) {
  return (
    <div className={`flex-1 rounded-lg border-2 p-4 text-center ${color}`}>
      <p className="text-lg font-extrabold">{level}</p>
      <p className="mt-1 font-mono text-xs">{range}</p>
      <p className="mt-1 text-xs opacity-80">{desc}</p>
    </div>
  );
}

function EscalationArrow() {
  return (
    <div className="hidden items-center justify-center sm:flex">
      <ArrowRight className="h-5 w-5 text-gray-400" />
    </div>
  );
}

function FlowItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>{emoji}</span>
      <span>{text}</span>
    </div>
  );
}

function RoleCard({
  role,
  color,
  icon,
  permissions,
}: {
  role: string;
  color: string;
  icon: React.ReactNode;
  permissions: string[];
}) {
  return (
    <Card className={`border-2 ${color}`}>
      <CardContent className="pt-6">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-2">{icon}</div>
          <Badge className={color}>{role}</Badge>
        </div>
        <ul className="space-y-1.5">
          {permissions.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
              {p}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function DeployBox({
  icon,
  platform,
  component,
  details,
  url,
}: {
  icon: React.ReactNode;
  platform: string;
  component: string;
  details: string[];
  url: string;
}) {
  return (
    <div className="space-y-3 rounded-xl border-2 border-dashed border-gray-300 p-5 text-center">
      <div className="mx-auto">{icon}</div>
      <div>
        <Badge variant="outline" className="text-xs">
          {platform}
        </Badge>
        <p className="mt-1 text-sm font-bold">{component}</p>
      </div>
      <ul className="space-y-1 text-xs text-muted-foreground">
        {details.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
      <p className="break-all font-mono text-xs text-blue-600">{url}</p>
    </div>
  );
}
