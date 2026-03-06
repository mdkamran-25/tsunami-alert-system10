'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { UserMenu } from '@/components/auth/user-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompactStatusIndicator } from '@/components/realtime/status-indicator';
import {
  Home,
  Map,
  Satellite,
  AlertTriangle,
  BarChart3,
  Settings,
  User,
  Shield,
  Activity,
  Bell,
  Menu,
  X,
  Waves,
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and status',
  },
  {
    name: 'GPS Monitoring',
    href: '/gps-monitoring',
    icon: Map,
    description: 'Real-time GPS data',
  },
  {
    name: 'Satellite Imagery',
    href: '/satellite-imagery',
    icon: Satellite,
    description: 'Satellite analysis',
  },
  {
    name: 'Alert Management',
    href: '/alert-management',
    icon: AlertTriangle,
    description: 'Alert system control',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Data analysis & trends',
  },
  {
    name: 'System Health',
    href: '/system-health',
    icon: Activity,
    description: 'System monitoring',
  },
];

const userMenuItems = [
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    roles: ['ADMIN', 'OPERATOR', 'VIEWER'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN', 'OPERATOR', 'VIEWER'],
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['ADMIN', 'OPERATOR', 'VIEWER'],
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: Shield,
    roles: ['ADMIN'],
  },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const hasAccess = (roles: string[]) => {
    return user?.role && roles.includes(user.role);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white/95 lg:backdrop-blur-sm">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500">
              <Waves className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Tsunami Alert</h1>
              <p className="text-xs text-gray-500">Early Warning System</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="space-y-1 px-4 py-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'border border-tsunami-blue-200 bg-gradient-to-r from-tsunami-blue-50 to-tsunami-green-50 text-tsunami-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive(item.href)
                        ? 'text-tsunami-blue-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Menu Items */}
          <div className="border-t border-gray-200 px-4 py-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Account
            </h3>
            <div className="space-y-1">
              {userMenuItems.map((item) => {
                if (!hasAccess(item.roles)) return null;

                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'border border-tsunami-blue-200 bg-gradient-to-r from-tsunami-blue-50 to-tsunami-green-50 text-tsunami-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'mr-3 h-4 w-4 flex-shrink-0',
                        isActive(item.href)
                          ? 'text-tsunami-blue-600'
                          : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    {item.name}
                    {item.name === 'Admin Panel' && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        ADMIN
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <div className="lg:hidden">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500">
              <Waves className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Tsunami Alert</h1>
          </div>

          <div className="flex items-center space-x-2">
            <CompactStatusIndicator />
            <UserMenu />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 border-b border-gray-200 bg-white px-2 pb-3 pt-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center rounded-lg px-3 py-2 text-base font-medium transition-colors',
                      isActive(item.href)
                        ? 'border border-tsunami-blue-200 bg-gradient-to-r from-tsunami-blue-50 to-tsunami-green-50 text-tsunami-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive(item.href)
                          ? 'text-tsunami-blue-600'
                          : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Menu */}
            <div className="space-y-1 bg-gray-50 px-2 py-3">
              {userMenuItems.map((item) => {
                if (!hasAccess(item.roles)) return null;

                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'border border-tsunami-blue-200 bg-gradient-to-r from-tsunami-blue-50 to-tsunami-green-50 text-tsunami-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'mr-3 h-4 w-4 flex-shrink-0',
                        isActive(item.href)
                          ? 'text-tsunami-blue-600'
                          : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    {item.name}
                    {item.name === 'Admin Panel' && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        ADMIN
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
