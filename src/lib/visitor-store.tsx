import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    MOCK_ENTRY_LOG,
    MOCK_VISITORS,
    type EntryLog,
    type Visitor,
} from "@/data/mockData";

type SpotApproval = {
  id: string;
  name: string;
  purpose: string;
  flat: string;
  phone: string;
};

type RecurringInviteInput = {
  name: string;
  phone: string;
  purpose: string;
  flat: string;
  days: string[];
  startTime: string;
  endTime: string;
};

export type RecurringInvite = RecurringInviteInput & {
  id: string;
  todayOtp: string;
  otpDate: string;
  active: boolean;
  createdAt: string;
};

export type VisitorPassDetails = {
  visitorId: string;
  passId: string;
  issuedAt: string;
  validUntil: string;
  validityMinutes: number;
  lastExtendedAt?: string;
  lastExtendedMinutes?: number;
};

export type VisitorNotification = {
  id: string;
  visitorId: string;
  title: string;
  body: string;
  postedAt: string;
  tone: "warning" | "success";
};

type VisitorStore = {
  visitors: Visitor[];
  entryLog: EntryLog[];
  recurringInvites: RecurringInvite[];
  passDetails: Record<string, VisitorPassDetails>;
  notifications: VisitorNotification[];
  hasPendingSpotApproval: boolean;
  getVisitorPass: (visitorId: string) => VisitorPassDetails;
  approveSpotVisitor: (approval: SpotApproval) => void;
  dismissSpotApproval: () => void;
  extendVisitorValidity: (visitorId: string, minutes: number) => void;
  createRecurringInvite: (invite: RecurringInviteInput) => RecurringInvite;
};

const VisitorStoreContext = createContext<VisitorStore | null>(null);

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [visitors, setVisitors] = useState(MOCK_VISITORS);
  const [entryLog, setEntryLog] = useState(MOCK_ENTRY_LOG);
  const [recurringInvites, setRecurringInvites] = useState<RecurringInvite[]>([]);
  const [passDetails, setPassDetails] = useState<Record<string, VisitorPassDetails>>(
    () => buildInitialPassDetails(MOCK_VISITORS, MOCK_ENTRY_LOG),
  );
  const [notifications, setNotifications] = useState<VisitorNotification[]>(() => [
    buildExpiryNotification("v2", "Swiggy Delivery", "A-1204", relativeTime(10)),
  ]);
  const [hasPendingSpotApproval, setHasPendingSpotApproval] = useState(true);

  const getVisitorPass = (visitorId: string) =>
    passDetails[visitorId] ?? buildPassDetails(visitorId, "Today, 10:00 AM", "Today, 6:00 PM", 480);

  const approveSpotVisitor = (approval: SpotApproval) => {
    const validUntil = relativeTime(10);
    const visitor: Visitor = {
      id: approval.id,
      name: approval.name,
      purpose: approval.purpose,
      arrivalTime: "Today, now",
      status: "checked-in",
      phone: approval.phone,
      hostFlat: approval.flat,
    };
    const entry: EntryLog = {
      id: `spot-${approval.id}`,
      visitorName: approval.name,
      flat: approval.flat,
      inAt: "Today, now",
      status: "inside",
      purpose: approval.purpose,
      verifiedBy: "Resident approval",
    };

    setVisitors((current) => [
      visitor,
      ...current.filter((item) => item.id !== visitor.id),
    ]);
    setEntryLog((current) => [
      entry,
      ...current.filter((item) => item.id !== entry.id),
    ]);
    setPassDetails((current) => ({
      ...current,
      [approval.id]: buildPassDetails(approval.id, "Today, now", validUntil, 30),
    }));
    setNotifications((current) => [
      buildExpiryNotification(approval.id, approval.name, approval.flat, validUntil),
      ...current.filter((item) => item.id !== `expiry-${approval.id}`),
    ]);
    setHasPendingSpotApproval(false);
  };

  const dismissSpotApproval = () => {
    setHasPendingSpotApproval(false);
  };

  const extendVisitorValidity = (visitorId: string, minutes: number) => {
    const visitor = visitors.find((item) => item.id === visitorId);
    if (!visitor) return;

    const validUntil = relativeTime(minutes);
    setPassDetails((current) => {
      const existing = current[visitorId] ?? getVisitorPass(visitorId);
      return {
        ...current,
        [visitorId]: {
          ...existing,
          validUntil,
          validityMinutes: existing.validityMinutes + minutes,
          lastExtendedAt: "Today, now",
          lastExtendedMinutes: minutes,
        },
      };
    });
    setNotifications((current) => [
      {
        id: `extended-${visitorId}-${Date.now()}`,
        visitorId,
        title: `${visitor.name} validity extended`,
        body: `Flat ${visitor.hostFlat ?? "-"} extended the pass until ${validUntil}. Resident, guard, and admin have been notified.`,
        postedAt: "Just now",
        tone: "success",
      },
      ...current.filter((item) => item.id !== `expiry-${visitorId}`),
    ]);
  };

  const createRecurringInvite = (invite: RecurringInviteInput) => {
    const id = `recurring-${Date.now()}`;
    const today = todayKey();
    const recurringInvite: RecurringInvite = {
      ...invite,
      id,
      todayOtp: dailyOtp(id, today),
      otpDate: today,
      active: true,
      createdAt: "Today, now",
    };
    const visitor: Visitor = {
      id,
      name: invite.name,
      purpose: `${invite.purpose} · recurring`,
      arrivalTime: `${invite.days.join(", ")} · ${invite.startTime}`,
      status: "expected",
      phone: invite.phone,
      hostFlat: invite.flat,
    };

    setRecurringInvites((current) => [recurringInvite, ...current.filter((item) => item.id !== id)]);
    setVisitors((current) => [visitor, ...current.filter((item) => item.id !== id)]);
    setPassDetails((current) => ({
      ...current,
      [id]: buildPassDetails(id, "Renews daily", `Today, ${invite.endTime}`, 24 * 60),
    }));
    setNotifications((current) => [
      {
        id: `recurring-${id}`,
        visitorId: id,
        title: `${invite.name} recurring invite active`,
        body: `A fresh OTP is generated each day for ${invite.startTime}-${invite.endTime}. Today's OTP is ${recurringInvite.todayOtp}.`,
        postedAt: "Just now",
        tone: "success",
      },
      ...current,
    ]);

    return recurringInvite;
  };

  const value = useMemo(
    () => ({
      visitors,
      entryLog,
      recurringInvites,
      passDetails,
      notifications,
      hasPendingSpotApproval,
      getVisitorPass,
      approveSpotVisitor,
      dismissSpotApproval,
      extendVisitorValidity,
      createRecurringInvite,
    }),
    [visitors, entryLog, recurringInvites, passDetails, notifications, hasPendingSpotApproval],
  );

  return (
    <VisitorStoreContext.Provider value={value}>
      {children}
    </VisitorStoreContext.Provider>
  );
}

export function useVisitors() {
  const context = useContext(VisitorStoreContext);
  if (!context)
    throw new Error("useVisitors must be used inside VisitorProvider");
  return context;
}

function buildInitialPassDetails(visitors: Visitor[], entryLog: EntryLog[]) {
  return visitors.reduce<Record<string, VisitorPassDetails>>((details, visitor, index) => {
    const entry = entryLog.find(
      (item) =>
        item.visitorName === visitor.name &&
        item.flat === visitor.hostFlat &&
        (!item.vehicleNo || item.vehicleNo === visitor.vehicleNo),
    );
    const issuedAt = entry?.inAt ?? (visitor.status === "expected" ? "Pending check-in" : visitor.arrivalTime);
    const validUntil =
      visitor.id === "v2"
        ? relativeTime(10)
        : entry?.status === "inside" || visitor.status === "checked-in"
          ? "Today, 6:00 PM"
          : entry?.status === "denied" || visitor.status === "denied"
            ? "Not valid"
            : visitor.status === "expected" && !entry
            ? "After gate check-in"
            : "Expired";

    details[visitor.id] = buildPassDetails(visitor.id, issuedAt, validUntil, visitor.status === "expected" ? 120 : 480 + index * 10);
    return details;
  }, {});
}

function buildPassDetails(
  visitorId: string,
  issuedAt: string,
  validUntil: string,
  validityMinutes: number,
): VisitorPassDetails {
  return {
    visitorId,
    passId: `MSP-${visitorId.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-6).padStart(6, "0")}`,
    issuedAt,
    validUntil,
    validityMinutes,
  };
}

function buildExpiryNotification(
  visitorId: string,
  visitorName: string,
  flat: string,
  validUntil: string,
): VisitorNotification {
  return {
    id: `expiry-${visitorId}`,
    visitorId,
    title: `${visitorName} pass expires in 10 min`,
    body: `Flat ${flat} visitor validity ends at ${validUntil}. Resident can extend it now.`,
    postedAt: "Just now",
    tone: "warning",
  };
}

function relativeTime(minutesFromNow: number) {
  const date = new Date(Date.now() + minutesFromNow * 60 * 1000);
  return `Today, ${date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function dailyOtp(inviteId: string, dateKey: string) {
  const seed = `${inviteId}-${dateKey}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000000;
  }
  return String(hash).padStart(6, "0");
}
