export type VisitorStatus = 'expected' | 'checked-in' | 'denied' | 'checked-out';

export type Visitor = {
  id: string;
  name: string;
  purpose: string;
  arrivalTime: string; // human-readable, e.g. "Today, 4:30 PM"
  status: VisitorStatus;
  vehicleNo?: string;
  phone?: string;
  avatarUrl?: string;
  hostFlat?: string;
};

export type Payment = {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  category: 'maintenance' | 'utility' | 'event' | 'other';
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  postedBy: string;
  postedAt: string;
  pinned?: boolean;
  category: 'general' | 'urgent' | 'event' | 'maintenance';
};

export type Resident = {
  id: string;
  name: string;
  flat: string;
  role: 'owner' | 'tenant' | 'family';
  avatarColor: string;
};

export const MOCK_VISITORS: Visitor[] = [
  { id: 'v1', name: 'Rohan Kapoor', purpose: 'Family visit', arrivalTime: 'Today, 4:30 PM', status: 'expected', phone: '+91 91234 56789', hostFlat: 'A-1204' },
  { id: 'v2', name: 'Swiggy Delivery', purpose: 'Food delivery', arrivalTime: 'Today, 1:12 PM', status: 'checked-in', vehicleNo: 'KA 05 HG 4521', hostFlat: 'A-1204' },
  { id: 'v3', name: 'Priya Mehta', purpose: 'Friend visit', arrivalTime: 'Today, 11:00 AM', status: 'checked-out', hostFlat: 'A-1204' },
  { id: 'v4', name: 'Amazon Courier', purpose: 'Package delivery', arrivalTime: 'Yesterday, 6:48 PM', status: 'checked-in', vehicleNo: 'KA 03 MJ 8821', hostFlat: 'A-1204' },
  { id: 'v5', name: 'Unverified Visitor', purpose: 'Unknown', arrivalTime: 'Yesterday, 9:30 PM', status: 'denied', hostFlat: 'A-1204' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', label: 'Maintenance — June 2026', amount: 4500, dueDate: '2026-06-30', status: 'pending', category: 'maintenance' },
  { id: 'p2', label: 'Water charges — May', amount: 820, dueDate: '2026-05-30', status: 'paid', category: 'utility' },
  { id: 'p3', label: 'Annual day contribution', amount: 1500, dueDate: '2026-07-15', status: 'pending', category: 'event' },
  { id: 'p4', label: 'Maintenance — May 2026', amount: 4500, dueDate: '2026-05-30', status: 'paid', category: 'maintenance' },
];

export const MOCK_NOTICES: Notice[] = [
  { id: 'n1', title: 'Water supply maintenance', body: 'Water supply will be interrupted on Wed 9 AM – 1 PM for tank cleaning. Please store water in advance.', postedBy: 'Management', postedAt: '2 hours ago', pinned: true, category: 'maintenance' },
  { id: 'n2', title: 'Society annual day — RSVP open', body: 'Annual day will be held on July 21st at the clubhouse lawn. Free entry for residents, RSVP by July 10.', postedBy: 'Events Committee', postedAt: '1 day ago', category: 'event' },
  { id: 'n3', title: 'Reminder: Visitor pass mandatory', body: 'Effective immediately, all visitors must arrive with a QR pass. Walk-ins will be turned away after 8 PM.', postedBy: 'Security', postedAt: '3 days ago', category: 'urgent' },
];

export const MOCK_RESIDENTS: Resident[] = [
  { id: 'r1', name: 'Anika Sharma', flat: 'A-1204', role: 'owner', avatarColor: '#1e40af' },
  { id: 'r2', name: 'Vikram Sharma', flat: 'A-1204', role: 'family', avatarColor: '#006a61' },
  { id: 'r3', name: 'Neha Iyer', flat: 'A-1106', role: 'owner', avatarColor: '#f59e0b' },
  { id: 'r4', name: 'Rahul Bose', flat: 'B-0809', role: 'tenant', avatarColor: '#9333ea' },
];

export const FLAT_OPTIONS = ['A-1204', 'A-1205', 'B-1106', 'B-0809', 'C-0402'];

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  route: string;
  tone: 'primary' | 'secondary' | 'tertiary' | 'neutral';
};

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa1', label: 'New visitor pass', icon: 'qr-code', route: '/(app)/qr-pass', tone: 'primary' },
  { id: 'qa2', label: 'Pre-approve guest', icon: 'user-plus', route: '/(app)/guest-pass', tone: 'secondary' },
  { id: 'qa3', label: 'Pay dues', icon: 'wallet', route: '/(app)/(tabs)/payments', tone: 'tertiary' },
  { id: 'qa4', label: 'Raise complaint', icon: 'megaphone', route: '/(app)/(tabs)/notices', tone: 'neutral' },
];
