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
  { id: 'v6', name: 'Dr. Ananya Roy', purpose: 'Medical visit', arrivalTime: 'Today, 5:15 PM', status: 'expected', phone: '+91 98220 11334', hostFlat: 'A-1106' },
  { id: 'v7', name: 'Zomato Delivery', purpose: 'Food delivery', arrivalTime: 'Today, 8:45 PM', status: 'expected', vehicleNo: 'KA 01 AB 9912', hostFlat: 'B-0809' },
  { id: 'v8', name: 'Urban Company', purpose: 'AC service', arrivalTime: 'Today, 10:00 AM', status: 'checked-out', vehicleNo: 'KA 02 CD 3344', hostFlat: 'B-1106' },
  { id: 'v9', name: 'Karthik Rao Jr.', purpose: 'Resident family', arrivalTime: 'Today, 7:30 AM', status: 'checked-in', hostFlat: 'B-1106' },
  { id: 'v10', name: 'Flipkart Wholesale', purpose: 'Bulk delivery', arrivalTime: 'Today, 2:00 PM', status: 'checked-out', vehicleNo: 'KA 09 LM 7788', hostFlat: 'C-0402' },
  { id: 'v11', name: 'Maids2Match', purpose: 'Housekeeping', arrivalTime: 'Today, 9:00 AM', status: 'checked-in', hostFlat: 'A-1106' },
  { id: 'v12', name: 'BluSmart Cab', purpose: 'Pickup', arrivalTime: 'Today, 6:00 PM', status: 'expected', vehicleNo: 'KA 51 KN 1010', hostFlat: 'A-1204' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', label: 'Maintenance — June 2026', amount: 4500, dueDate: '2026-06-30', status: 'pending', category: 'maintenance' },
  { id: 'p2', label: 'Water charges — May', amount: 820, dueDate: '2026-05-30', status: 'paid', category: 'utility' },
  { id: 'p3', label: 'Annual day contribution', amount: 1500, dueDate: '2026-07-15', status: 'pending', category: 'event' },
  { id: 'p4', label: 'Maintenance — May 2026', amount: 4500, dueDate: '2026-05-30', status: 'paid', category: 'maintenance' },
  { id: 'p5', label: 'Clubhouse booking fee', amount: 600, dueDate: '2026-06-10', status: 'paid', category: 'event' },
  { id: 'p6', label: 'Electricity — common area', amount: 380, dueDate: '2026-06-20', status: 'pending', category: 'utility' },
  { id: 'p7', label: 'Maintenance — April 2026', amount: 4500, dueDate: '2026-04-30', status: 'paid', category: 'maintenance' },
  { id: 'p8', label: 'Diwali fund (voluntary)', amount: 1000, dueDate: '2026-10-15', status: 'pending', category: 'event' },
  { id: 'p9', label: 'Lift AMC quarterly share', amount: 250, dueDate: '2026-06-15', status: 'paid', category: 'other' },
];

export const MOCK_NOTICES: Notice[] = [
  { id: 'n1', title: 'Water supply maintenance', body: 'Water supply will be interrupted on Wed 9 AM – 1 PM for tank cleaning. Please store water in advance.', postedBy: 'Management', postedAt: '2 hours ago', pinned: true, category: 'maintenance' },
  { id: 'n2', title: 'Society annual day — RSVP open', body: 'Annual day will be held on July 21st at the clubhouse lawn. Free entry for residents, RSVP by July 10.', postedBy: 'Events Committee', postedAt: '1 day ago', category: 'event' },
  { id: 'n3', title: 'Reminder: Visitor pass mandatory', body: 'Effective immediately, all visitors must arrive with a QR pass. Walk-ins will be turned away after 8 PM.', postedBy: 'Security', postedAt: '3 days ago', category: 'urgent' },
  { id: 'n4', title: 'Lift A1 servicing — Saturday', body: 'Lift A1 will be unavailable from 11 AM – 4 PM on Saturday for routine maintenance. Please plan accordingly.', postedBy: 'Facilities', postedAt: '5 hours ago', category: 'maintenance' },
  { id: 'n5', title: 'Yoga sessions on the terrace', body: 'Free yoga sessions every Sun & Thu morning at 6 AM on the terrace. Open to all residents.', postedBy: 'Wellness Committee', postedAt: '2 days ago', category: 'event' },
  { id: 'n6', title: 'Diwali decorations — volunteers', body: 'We need 8 volunteers for clubhouse decorations on Nov 10. Sign up at the management office.', postedBy: 'Events Committee', postedAt: '4 days ago', category: 'general' },
  { id: 'n7', title: 'Carpet area survey — Tower B', body: 'Government carpet area verification on Sat for Tower B flats. Owners should be present 10 AM – 2 PM.', postedBy: 'Management', postedAt: '1 week ago', category: 'urgent' },
  { id: 'n8', title: 'New gym equipment installed', body: '3 new treadmills + 2 ellipticals are now in the gym. Members can use them from 6 AM tomorrow.', postedBy: 'Facilities', postedAt: '1 week ago', category: 'general' },
];

export const MOCK_RESIDENTS: Resident[] = [
  { id: 'r1', name: 'Anika Sharma', flat: 'A-1204', role: 'owner', avatarColor: '#1e40af' },
  { id: 'r2', name: 'Vikram Sharma', flat: 'A-1204', role: 'family', avatarColor: '#006a61' },
  { id: 'r3', name: 'Neha Iyer', flat: 'A-1106', role: 'owner', avatarColor: '#f59e0b' },
  { id: 'r4', name: 'Rahul Bose', flat: 'B-0809', role: 'tenant', avatarColor: '#9333ea' },
  { id: 'r5', name: 'Karthik Rao', flat: 'B-1106', role: 'owner', avatarColor: '#dc2626' },
  { id: 'r6', name: 'Sneha Pillai', flat: 'C-0402', role: 'owner', avatarColor: '#0891b2' },
  { id: 'r7', name: 'Devika Rao', flat: 'B-1106', role: 'family', avatarColor: '#7c3aed' },
  { id: 'r8', name: 'Aman Khanna', flat: 'A-0903', role: 'owner', avatarColor: '#059669' },
  { id: 'r9', name: 'Tanvi Joshi', flat: 'A-0903', role: 'family', avatarColor: '#ea580c' },
  { id: 'r10', name: 'Suresh Menon', flat: 'C-0301', role: 'owner', avatarColor: '#0ea5e9' },
  { id: 'r11', name: 'Reena Menon', flat: 'C-0301', role: 'family', avatarColor: '#d946ef' },
  { id: 'r12', name: 'Priyanka Das', flat: 'B-0505', role: 'tenant', avatarColor: '#facc15' },
  { id: 'r13', name: 'Mahesh Patel', flat: 'A-0701', role: 'owner', avatarColor: '#84cc16' },
  { id: 'r14', name: 'Geetha Nair', flat: 'C-0608', role: 'owner', avatarColor: '#f97316' },
];

export const FLAT_OPTIONS = ['A-0701', 'A-0903', 'A-1106', 'A-1204', 'A-1205', 'B-0505', 'B-0809', 'B-1106', 'C-0301', 'C-0402', 'C-0608'];

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  route: string;
  tone: 'primary' | 'secondary' | 'tertiary' | 'neutral';
};

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa1', label: 'New pass', icon: 'qr-code', route: '/(app)/qr-pass', tone: 'primary' },
  { id: 'qa2', label: 'Pre-approve', icon: 'user-plus', route: '/(app)/guest-pass', tone: 'secondary' },
  { id: 'qa3', label: 'Pay dues', icon: 'wallet', route: '/(app)/(tabs)/payments', tone: 'tertiary' },
  { id: 'qa4', label: 'Complaint', icon: 'megaphone', route: '/(app)/(tabs)/notices', tone: 'neutral' },
];

/* ---------- Guard data ---------- */

export type EntryLog = {
  id: string;
  visitorName: string;
  flat: string;
  inAt: string;
  outAt?: string;
  status: 'inside' | 'departed' | 'denied';
  purpose: string;
  vehicleNo?: string;
  verifiedBy: string;
};

export const MOCK_ENTRY_LOG: EntryLog[] = [
  { id: 'e1', visitorName: 'Rohan Kapoor', flat: 'A-1204', inAt: 'Today, 4:32 PM', status: 'inside', purpose: 'Family', verifiedBy: 'QR scan' },
  { id: 'e2', visitorName: 'Swiggy Delivery', flat: 'A-1204', inAt: 'Today, 1:12 PM', outAt: 'Today, 1:24 PM', status: 'departed', purpose: 'Food delivery', vehicleNo: 'KA 05 HG 4521', verifiedBy: 'Pre-approval' },
  { id: 'e3', visitorName: 'Priya Mehta', flat: 'A-1204', inAt: 'Today, 11:00 AM', outAt: 'Today, 12:48 PM', status: 'departed', purpose: 'Friend visit', verifiedBy: 'QR scan' },
  { id: 'e4', visitorName: 'Amazon Courier', flat: 'B-0809', inAt: 'Today, 10:14 AM', outAt: 'Today, 10:21 AM', status: 'departed', purpose: 'Delivery', vehicleNo: 'KA 03 MJ 8821', verifiedBy: 'Manual entry' },
  { id: 'e5', visitorName: 'Unverified Visitor', flat: '—', inAt: 'Yesterday, 9:30 PM', status: 'denied', purpose: 'Walk-in', verifiedBy: 'Denied' },
  { id: 'e6', visitorName: 'Maintenance Crew', flat: 'B-1106', inAt: 'Yesterday, 8:00 AM', outAt: 'Yesterday, 11:30 AM', status: 'departed', purpose: 'Plumbing', verifiedBy: 'Admin approval' },
  { id: 'e7', visitorName: 'Dr. Ananya Roy', flat: 'A-1106', inAt: 'Today, 5:18 PM', status: 'inside', purpose: 'Medical visit', verifiedBy: 'Pre-approval' },
  { id: 'e8', visitorName: 'Urban Company', flat: 'B-1106', inAt: 'Today, 10:02 AM', outAt: 'Today, 11:45 AM', status: 'departed', purpose: 'AC service', vehicleNo: 'KA 02 CD 3344', verifiedBy: 'Pre-approval' },
  { id: 'e9', visitorName: 'Karthik Rao Jr.', flat: 'B-1106', inAt: 'Today, 7:31 AM', status: 'inside', purpose: 'Family', verifiedBy: 'Resident vouch' },
  { id: 'e10', visitorName: 'Flipkart Wholesale', flat: 'C-0402', inAt: 'Today, 2:04 PM', outAt: 'Today, 2:31 PM', status: 'departed', purpose: 'Bulk delivery', vehicleNo: 'KA 09 LM 7788', verifiedBy: 'Manual entry' },
  { id: 'e11', visitorName: 'Maids2Match', flat: 'A-1106', inAt: 'Today, 9:02 AM', status: 'inside', purpose: 'Housekeeping', verifiedBy: 'Pre-approval' },
  { id: 'e12', visitorName: 'Suspicious salesman', flat: '—', inAt: 'Today, 12:14 PM', status: 'denied', purpose: 'Unsolicited sales', verifiedBy: 'Denied' },
  { id: 'e13', visitorName: 'Plumber on call', flat: 'C-0301', inAt: 'Yesterday, 4:00 PM', outAt: 'Yesterday, 5:30 PM', status: 'departed', purpose: 'Emergency plumbing', verifiedBy: 'Admin approval' },
  { id: 'e14', visitorName: 'Tanvi Joshi guest', flat: 'A-0903', inAt: 'Yesterday, 7:00 PM', outAt: 'Yesterday, 10:15 PM', status: 'departed', purpose: 'Friend visit', verifiedBy: 'QR scan' },
];

export type GuardShiftStat = { label: string; value: string; icon: string; tone: 'primary' | 'success' | 'warning' | 'neutral' };

export const GUARD_SHIFT_STATS: GuardShiftStat[] = [
  { label: 'Currently inside', value: '14', icon: 'users', tone: 'success' },
  { label: 'Expected today', value: '7', icon: 'clock', tone: 'warning' },
  { label: 'Scanned today', value: '32', icon: 'maximize', tone: 'primary' },
  { label: 'Denied entry', value: '1', icon: 'shield-off', tone: 'neutral' },
];

/* ---------- Admin data ---------- */

export type Staff = {
  id: string;
  name: string;
  role: 'Guard' | 'Housekeeping' | 'Plumber' | 'Electrician' | 'Gardener' | 'Manager';
  shift: 'Day' | 'Night' | 'Split';
  status: 'on-duty' | 'off-duty' | 'on-leave';
  phone: string;
  avatarColor: string;
};

export const MOCK_STAFF: Staff[] = [
  { id: 's1', name: 'Vinod Kumar', role: 'Guard', shift: 'Day', status: 'on-duty', phone: '+91 91234 56789', avatarColor: '#006a61' },
  { id: 's2', name: 'Ravi Singh', role: 'Guard', shift: 'Night', status: 'off-duty', phone: '+91 91234 76211', avatarColor: '#1e40af' },
  { id: 's3', name: 'Lakshmi Devi', role: 'Housekeeping', shift: 'Day', status: 'on-duty', phone: '+91 90087 12345', avatarColor: '#9333ea' },
  { id: 's4', name: 'Mohan Yadav', role: 'Plumber', shift: 'Day', status: 'on-leave', phone: '+91 90011 22334', avatarColor: '#f59e0b' },
  { id: 's5', name: 'Anil Reddy', role: 'Electrician', shift: 'Day', status: 'on-duty', phone: '+91 90123 45678', avatarColor: '#ef4444' },
  { id: 's6', name: 'Suresh Patil', role: 'Gardener', shift: 'Day', status: 'on-duty', phone: '+91 99000 11122', avatarColor: '#16a34a' },
  { id: 's7', name: 'Pooja Sharma', role: 'Manager', shift: 'Day', status: 'on-duty', phone: '+91 90100 22334', avatarColor: '#0ea5e9' },
  { id: 's8', name: 'Babulal Yadav', role: 'Guard', shift: 'Split', status: 'on-duty', phone: '+91 90123 99887', avatarColor: '#7c3aed' },
  { id: 's9', name: 'Ramesh Naik', role: 'Housekeeping', shift: 'Night', status: 'on-duty', phone: '+91 91110 23344', avatarColor: '#dc2626' },
  { id: 's10', name: 'Geeta Patil', role: 'Housekeeping', shift: 'Day', status: 'off-duty', phone: '+91 90089 22222', avatarColor: '#d946ef' },
  { id: 's11', name: 'Vikram Naidu', role: 'Plumber', shift: 'Day', status: 'on-duty', phone: '+91 90033 11221', avatarColor: '#65a30d' },
];

export type SocietyStat = { label: string; value: string; delta?: string; tone: 'primary' | 'success' | 'warning' | 'neutral' };

export const SOCIETY_STATS: SocietyStat[] = [
  { label: 'Active residents', value: '486', delta: '+12 this month', tone: 'primary' },
  { label: 'Visitors today', value: '47', delta: '14 inside', tone: 'success' },
  { label: 'Collection this month', value: '₹14.6L', delta: '83% of dues', tone: 'success' },
  { label: 'Open complaints', value: '6', delta: '2 overdue', tone: 'warning' },
];

export type Complaint = {
  id: string;
  title: string;
  raisedBy: string;
  flat: string;
  raisedAt: string;
  status: 'open' | 'in-progress' | 'resolved';
  category: 'plumbing' | 'electrical' | 'security' | 'parking' | 'cleaning' | 'other';
};

export const MOCK_COMPLAINTS: Complaint[] = [
  { id: 'c1', title: 'Lift A1 making noise on floor 12', raisedBy: 'Anika Sharma', flat: 'A-1204', raisedAt: '2h ago', status: 'in-progress', category: 'other' },
  { id: 'c2', title: 'Common area lights flickering', raisedBy: 'Neha Iyer', flat: 'A-1106', raisedAt: '1d ago', status: 'open', category: 'electrical' },
  { id: 'c3', title: 'Tap leak in clubhouse washroom', raisedBy: 'Rahul Bose', flat: 'B-0809', raisedAt: '3d ago', status: 'resolved', category: 'plumbing' },
  { id: 'c4', title: 'Stray dogs near Tower C entry', raisedBy: 'Sneha Pillai', flat: 'C-0402', raisedAt: '6h ago', status: 'open', category: 'security' },
  { id: 'c5', title: 'Visitor parking taken by residents', raisedBy: 'Karthik Rao', flat: 'B-1106', raisedAt: '4h ago', status: 'in-progress', category: 'parking' },
  { id: 'c6', title: 'Mosquito spraying overdue', raisedBy: 'Aman Khanna', flat: 'A-0903', raisedAt: '2d ago', status: 'open', category: 'cleaning' },
  { id: 'c7', title: 'Power flicker in B-tower', raisedBy: 'Priyanka Das', flat: 'B-0505', raisedAt: '5d ago', status: 'resolved', category: 'electrical' },
  { id: 'c8', title: 'Garbage chute jam on 8th floor', raisedBy: 'Mahesh Patel', flat: 'A-0701', raisedAt: '3d ago', status: 'in-progress', category: 'cleaning' },
];

export type DuesSummary = { flat: string; resident: string; amount: number; status: 'paid' | 'pending' | 'overdue' };

export const MOCK_DUES: DuesSummary[] = [
  { flat: 'A-1204', resident: 'Anika Sharma', amount: 4500, status: 'pending' },
  { flat: 'A-1106', resident: 'Neha Iyer', amount: 4500, status: 'paid' },
  { flat: 'B-0809', resident: 'Rahul Bose', amount: 9000, status: 'overdue' },
  { flat: 'B-1106', resident: 'Karthik Rao', amount: 4500, status: 'paid' },
  { flat: 'C-0402', resident: 'Sneha Pillai', amount: 4500, status: 'pending' },
  { flat: 'A-0903', resident: 'Aman Khanna', amount: 4500, status: 'paid' },
  { flat: 'A-0701', resident: 'Mahesh Patel', amount: 4500, status: 'paid' },
  { flat: 'C-0301', resident: 'Suresh Menon', amount: 9000, status: 'overdue' },
  { flat: 'C-0608', resident: 'Geetha Nair', amount: 4500, status: 'pending' },
  { flat: 'B-0505', resident: 'Priyanka Das', amount: 4500, status: 'paid' },
];

export type ScannedPassResult = {
  valid: boolean;
  passId: string;
  visitorName?: string;
  flat?: string;
  hostName?: string;
  purpose?: string;
  validUntil?: string;
  issue?: string;
};

export const DEMO_SCANNED_PASS: ScannedPassResult = {
  valid: true,
  passId: 'MSP-7XK4QW',
  visitorName: 'Rohan Kapoor',
  flat: 'A-1204',
  hostName: 'Anika Sharma',
  purpose: 'Family visit',
  validUntil: 'Today, 6:00 PM',
};
