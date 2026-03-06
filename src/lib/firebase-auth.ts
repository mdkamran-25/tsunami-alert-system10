// Firebase auth has been removed.
// All authentication is handled via our GraphQL backend with JWT tokens.
// This file is kept as a stub so any lingering imports don't break the build.

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
  isActive: boolean;
  preferences: {
    alertTypes: string[];
    regions: string[];
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    language?: string;
    theme?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

export async function logoutUser(): Promise<void> {
  // No-op: JWT logout is handled by clearing localStorage
}

export function getAuthErrorMessage(error: any): string {
  return error?.message || 'An error occurred during authentication.';
}
