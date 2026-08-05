// ============================================================
// INFOGRAM'26 — TypeScript Types & Interfaces
// ============================================================

// ─── User / Auth ────────────────────────────────────────────
export type UserRole = 'super_admin' | 'organizer';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  assignedEventId?: string; // only for organizers
  phone?: string;
  createdAt: Date;
  isActive: boolean;
}

// ─── Event ──────────────────────────────────────────────────
export type EventCategory = 'technical' | 'non-technical';
export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  slug: string;
  name: string;
  category: EventCategory;
  description: string;
  rules: string[];
  venue: string;
  date: string; // ISO date string
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  registrationDeadline: string; // ISO date string
  registrationFee: number; // in INR
  maxParticipants: number;
  registeredCount: number;
  coordinatorName: string;
  organizerName: string;
  contactNumber: string;
  bannerUrl?: string;
  posterUrl?: string;
  galleryImages?: string[];
  status: EventStatus;
  organizerUid?: string;
  winners?: Winner[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Winner {
  position: number;
  teamName: string;
  members: string[];
  college: string;
}

// ─── Registration ────────────────────────────────────────────
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Registration {
  id: string;
  applicantId: string; // INFOGRAM26-XXXXX
  fullName: string;
  college: string;
  department: string;
  year: string;
  registerNumber: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  collegeIdUrl?: string;
  selectedEvents: string[]; // event IDs
  totalFee: number;
  status: RegistrationStatus;
  paymentId?: string;
  ticketId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Payment ─────────────────────────────────────────────────
export type PaymentMethod = 'razorpay' | 'upi';
export type PaymentStatus = 'pending' | 'paid' | 'verified' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  registrationId: string;
  applicantId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  // Razorpay fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  // UPI fields
  upiTransactionId?: string;
  screenshotUrl?: string;
  // Admin
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Ticket ───────────────────────────────────────────────────
export interface Ticket {
  id: string;
  ticketNumber: string; // IGR26-XXXXXX
  registrationId: string;
  applicantId: string;
  studentName: string;
  college: string;
  department: string;
  registeredEvents: string[];
  paymentStatus: PaymentStatus;
  qrData: string; // JSON string encoded in QR
  issuedAt: Date;
}

// ─── Sponsor ─────────────────────────────────────────────────
export type SponsorTier = 'gold' | 'silver' | 'bronze' | 'partner';

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
  tier: SponsorTier;
  order: number;
  isActive: boolean;
}

// ─── Announcement ────────────────────────────────────────────
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// ─── Gallery ─────────────────────────────────────────────────
export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  eventId?: string;
  uploadedBy: string;
  uploadedAt: Date;
  isActive: boolean;
}

// ─── Settings ────────────────────────────────────────────────
export interface Settings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpaySecret: string; // stored encrypted
  upiId: string;
  merchantName: string;
  upiQrCodeUrl: string;
  symposiumDate: string; // ISO date
  symposiumVenue: string;
  contactEmail: string;
  contactPhone: string;
  collegeAddress: string;
  mapEmbedUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  isRegistrationOpen: boolean;
}

// ─── Notification ────────────────────────────────────────────
export type NotificationType =
  | 'registration_success'
  | 'payment_success'
  | 'ticket_generated'
  | 'event_starting'
  | 'event_live'
  | 'prize_distribution'
  | 'certificates_available'
  | 'custom';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  targetEmail?: string; // null = broadcast
  isRead: boolean;
  createdAt: Date;
}

// ─── Attendance ──────────────────────────────────────────────
export interface AttendanceRecord {
  id: string;
  eventId: string;
  registrationId: string;
  applicantId: string;
  studentName: string;
  isPresent: boolean;
  markedAt?: Date;
  markedBy?: string;
}

// ─── Certificate ─────────────────────────────────────────────
export interface Certificate {
  id: string;
  eventId: string;
  registrationId: string;
  studentName: string;
  eventName: string;
  participationType: 'participant' | 'winner';
  position?: number;
  issuedAt: Date;
  downloadUrl?: string;
}

// ─── Form Types ──────────────────────────────────────────────
export interface RegistrationFormData {
  fullName: string;
  college: string;
  department: string;
  year: string;
  registerNumber: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  collegeId?: FileList;
  selectedEvents: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ─── API Response Types ──────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}
