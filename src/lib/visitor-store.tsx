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

export type VisitorPassDetails = {
  visitorId: string;
  passId: string;
  issuedAt: string;
  validUntil: string;
  validityMinutes: number;
  lastExtendedAt?: string;
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
  passDetails: Record<string, VisitorPassDetails>;
  notifications: VisitorNotification[];
  hasPendingSpotApproval: boolean;
  getVisitorPass: (visitorId: string) => VisitorPassDetails;
  approveSpotVisitor: (approval: SpotApproval) => void;
  dismissSpotApproval: () => void;
  extendVisitorValidity: (visitorId: string, minutes: number) => void;
};

const VisitorStoreContext = createContext<VisitorStore | null>(null);

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [visitors, setVisitors] = useState(MOCK_VISITORS);
  const [entryLog, setEntryLog] = useState(MOCK_ENTRY_LOG);
  const [passDetails, setPassDetails] = useState<Record<string, VisitorPassDetails>>(
    () => buildInitialPassDetails(MOCK_VISITORS),
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

  const value = useMemo(
    () => ({
      visitors,
      entryLog,
      passDetails,
      notifications,
      hasPendingSpotApproval,
      getVisitorPass,
      approveSpotVisitor,
      dismissSpotApproval,
      extendVisitorValidity,
    }),
    [visitors, entryLog, passDetails, notifications, hasPendingSpotApproval],
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

function buildInitialPassDetails(visitors: Visitor[]) {
  return visitors.reduce<Record<string, VisitorPassDetails>>((details, visitor, index) => {
    const issuedAt = visitor.status === "expected" ? "Pending check-in" : visitor.arrivalTime;
    const validUntil =
      visitor.id === "v2"
        ? relativeTime(10)
        : visitor.status === "checked-in"
          ? "Today, 6:00 PM"
          : visitor.status === "expected"
            ? "After gate check-in"
            : visitor.status === "denied"
              ? "Not valid"
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
