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
  Activity,
  Menu,
  X,
  Waves,
  Info,
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
    roles: ['ADMIN', 'OPERATOR'],
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
  {
    name: 'How It Works',
    href: '/how-it-works',
    icon: Info,
    description: 'System architecture',
  },
];

// Account items removed - they exist in the UserMenu dropdown

export function TopNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter((item) => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Fixed Top Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 transition-opacity hover:opacity-80"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 shadow-md">
                  <Waves className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 bg-clip-text text-lg font-bold text-transparent">
                    Tsunami Alert
                  </span>
                  <p className="-mt-1 text-xs text-muted-foreground">Early Warning System</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden items-center space-x-1 lg:flex">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100',
                      active
                        ? 'border border-tsunami-blue-200 bg-tsunami-blue-50 text-tsunami-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side - Status, Account Items, and User Menu */}
            <div className="flex items-center space-x-4">
              {/* Status Indicator */}
              <div className="hidden md:block">
                <CompactStatusIndicator />
              </div>

              {/* Account links removed - they exist in UserMenu dropdown */}

              {/* User Menu */}
              <UserMenu />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white lg:hidden">
            <div className="space-y-1 px-4 py-3">
              {/* Navigation Items */}
              <div className="space-y-1">
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Navigation
                </p>
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'border-l-4 border-tsunami-blue-500 bg-tsunami-blue-50 text-tsunami-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <div>
                        <p>{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Account items removed - they exist in UserMenu dropdown */}

              {/* Status Indicator for Mobile */}
              <div className="border-t border-gray-200 pt-4">
                <CompactStatusIndicator />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
}
