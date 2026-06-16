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
  signInAs: (role: Role) => void;
  switchRole: (role: Role) => void;
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
    avatarColor: '#1e40af',
  },
  guard: {
    id: 'u_grd_001',
    name: 'Vinod Kumar',
    phone: '+91 91234 56789',
    society: 'Lakeview Heights',
    role: 'guard',
    avatarColor: '#006a61',
    designation: 'Gate 1 · Day shift',
  },
  admin: {
    id: 'u_adm_001',
    name: 'Meera Iyer',
    phone: '+91 90000 11122',
    society: 'Lakeview Heights',
    role: 'admin',
    avatarColor: '#f59e0b',
    designation: 'Society Secretary',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  const verifyOtp = useCallback((otp: string) => /^\d{4,6}$/.test(otp), []);

  const signInAs = useCallback(
    (role: Role) => {
      const u = DEMO_USERS[role];
      setUser({ ...u, phone: pendingPhone ?? u.phone });
    },
    [pendingPhone]
  );

  const switchRole = useCallback((role: Role) => {
    const u = DEMO_USERS[role];
    setUser((prev) => ({ ...u, phone: prev?.phone ?? u.phone }));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setPendingPhone(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, pendingPhone, setPendingPhone, verifyOtp, signInAs, switchRole, signOut }),
    [user, pendingPhone, verifyOtp, signInAs, switchRole, signOut]
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
