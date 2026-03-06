'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { hasFirebaseConfig } from '@/lib/firebase';
import { logoutUser } from '@/lib/firebase-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut, Shield, Bell, HelpCircle, Loader2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export function UserMenu() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Read JWT user from localStorage as fallback
  const jwtUser =
    typeof window !== 'undefined'
      ? (() => {
          try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
          } catch {
            return null;
          }
        })()
      : null;

  // Resolve display user: Firebase > JWT > Demo
  const displayUser = user
    ? { displayName: user.displayName, email: user.email, photoURL: user.photoURL }
    : jwtUser
      ? { displayName: jwtUser.name, email: jwtUser.email, photoURL: null }
      : !hasFirebaseConfig
        ? { displayName: 'Demo User', email: 'demo@tsunami-alert.com', photoURL: null }
        : null;

  const displayProfile =
    userProfile ||
    (jwtUser ? { role: jwtUser.role, isActive: true } : null) ||
    (!hasFirebaseConfig ? { role: 'ADMIN', isActive: true } : null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear JWT tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      if (hasFirebaseConfig && user) {
        await logoutUser();
      }
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/auth/signin');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'OPERATOR':
        return 'warning';
      case 'VIEWER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Show sign in button only if Firebase is configured and no user
  if (!displayUser) {
    return (
      <Button variant="outline" asChild>
        <a href="/auth/signin">Sign In</a>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={displayUser.photoURL || ''}
              alt={displayUser.displayName || displayUser.email || 'User'}
            />
            <AvatarFallback className="bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 text-white">
              {getInitials(displayUser.displayName || displayUser.email || 'U')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium leading-none">
                {displayUser.displayName || 'User'}
              </p>
              {displayProfile?.role && (
                <Badge variant={getRoleBadgeVariant(displayProfile.role)} className="text-xs">
                  {displayProfile.role}
                </Badge>
              )}
              {!hasFirebaseConfig && (
                <Badge variant="outline" className="border-orange-300 text-xs text-orange-600">
                  DEMO
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{displayUser.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push('/notifications')} className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>

        {displayProfile?.role === 'ADMIN' && (
          <DropdownMenuItem onClick={() => router.push('/admin')} className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Panel</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push('/help')} className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
