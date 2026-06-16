import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Role = 'resident' | 'guard' | 'admin';

export type CurrentUser = {
  id: string;
  name: string;
  phone: string;
  flat: string;
  block: string;
  society: string;
  role: Role;
  avatarColor: string;
};

type AuthState = {
  user: CurrentUser | null;
  pendingPhone: string | null;
  setPendingPhone: (phone: string) => void;
  verifyOtp: (otp: string) => boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const DEMO_USER: CurrentUser = {
  id: 'u_001',
  name: 'Anika Sharma',
  phone: '+91 98765 43210',
  flat: 'A-1204',
  block: 'Tower A',
  society: 'Lakeview Heights',
  role: 'resident',
  avatarColor: '#1e40af',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  const verifyOtp = useCallback((otp: string) => {
    // Demo: any 4-6 digit OTP signs in as the demo user.
    if (otp.length >= 4 && /^\d+$/.test(otp)) {
      setUser({ ...DEMO_USER, phone: pendingPhone ?? DEMO_USER.phone });
      return true;
    }
    return false;
  }, [pendingPhone]);

  const signOut = useCallback(() => {
    setUser(null);
    setPendingPhone(null);
  }, []);

  const value = useMemo(
    () => ({ user, pendingPhone, setPendingPhone, verifyOtp, signOut }),
    [user, pendingPhone, verifyOtp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
