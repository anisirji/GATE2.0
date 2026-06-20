import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Role = 'resident' | 'guard' | 'admin';

export type CurrentUser = {
  id: string;
  name: string;
  phone: string;
  flat?: string;
  block?: string;
  society: string;
  role: Role;
  avatarColor: string;
  designation?: string;
};

type AuthState = {
  user: CurrentUser | null;
  pendingPhone: string | null;
  setPendingPhone: (phone: string) => void;
  verifyOtp: (otp: string) => boolean;
  /** Sign in using whatever role the pending phone resolves to. */
  signInWithPendingPhone: () => Role;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const DEMO_USERS: Record<Role, CurrentUser> = {
  resident: {
    id: 'u_res_001',
    name: 'Anika Sharma',
    phone: '+91 98765 43210',
    flat: 'A-1204',
    block: 'Tower A',
    society: 'Lakeview Heights',
    role: 'resident',
    avatarColor: '#3D4EFF',
  },
  guard: {
    id: 'u_grd_001',
    name: 'Vinod Kumar',
    phone: '+91 91234 56789',
    society: 'Lakeview Heights',
    role: 'guard',
    avatarColor: '#0A8F82',
    designation: 'Gate 1 · Day shift',
  },
  admin: {
    id: 'u_adm_001',
    name: 'Meera Iyer',
    phone: '+91 90000 11122',
    society: 'Lakeview Heights',
    role: 'admin',
    avatarColor: '#B8740A',
    designation: 'Society Secretary',
  },
};

/**
 * Phone → role registry. Each registered phone resolves to a specific role.
 * In production this is a backend lookup. For the demo we ship three test numbers.
 * Anything else falls back to resident.
 */
const PHONE_ROLES: Record<string, Role> = {
  '9876543210': 'resident',
  '9123456789': 'guard',
  '9000011122': 'admin',
};

function normalizePhone(input: string): string {
  return input.replace(/\D/g, '').slice(-10);
}

export function phoneToRole(input: string | null | undefined): Role {
  if (!input) return 'resident';
  return PHONE_ROLES[normalizePhone(input)] ?? 'resident';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  const verifyOtp = useCallback((otp: string) => /^\d{4,6}$/.test(otp), []);

  const signInWithPendingPhone = useCallback((): Role => {
    const role = phoneToRole(pendingPhone);
    const u = DEMO_USERS[role];
    setUser({ ...u, phone: pendingPhone ?? u.phone });
    return role;
  }, [pendingPhone]);

  const signOut = useCallback(() => {
    setUser(null);
    setPendingPhone(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      pendingPhone,
      setPendingPhone,
      verifyOtp,
      signInWithPendingPhone,
      signOut,
    }),
    [user, pendingPhone, verifyOtp, signInWithPendingPhone, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function homeRouteForRole(role: Role): '/(app)/(tabs)' | '/(guard)/(tabs)' | '/(admin)/(tabs)' {
  switch (role) {
    case 'guard':
      return '/(guard)/(tabs)';
    case 'admin':
      return '/(admin)/(tabs)';
    default:
      return '/(app)/(tabs)';
  }
}
