import { db } from '@/lib/firebase/config';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export interface Registration {
  id?: string;
  applicantId: string;
  personalInfo: {
    fullName: string;
    college: string;
    department: string;
    year: string;
    registerNumber: string;
    email: string;
    phone: string;
    gender: string;
  };
  events: string[];
  [key: string]: any;
}

export interface Payment {
  id: string;
  transactionId: string;
  status: string;
  [key: string]: any;
}

export interface Ticket {
  ticketNumber: string;
  registrationId: string;
  applicantId: string;
  studentName: string;
  college: string;
  department: string;
  events: string[];
  qrData: string;
  paymentId: string;
  status: string;
  issueDate: any;
}

export function generateTicket(registration: Registration, payment: Payment): Ticket {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 8; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const ticketNumber = `IGR26-${randomStr}`;

  const qrData = JSON.stringify({
    ticketNumber,
    applicantId: registration.applicantId,
    studentName: registration.personalInfo.fullName,
    events: registration.events
  });

  return {
    ticketNumber,
    registrationId: registration.id || '',
    applicantId: registration.applicantId,
    studentName: registration.personalInfo.fullName,
    college: registration.personalInfo.college,
    department: registration.personalInfo.department,
    events: registration.events,
    qrData,
    paymentId: payment.id,
    status: 'valid',
    issueDate: serverTimestamp()
  };
}

export async function saveTicket(ticket: Ticket): Promise<string> {
  const docRef = await addDoc(collection(db, 'tickets'), ticket);
  
  if (ticket.registrationId) {
    await updateDoc(doc(db, 'registrations', ticket.registrationId), {
      ticketId: docRef.id
    });
  }
  
  return docRef.id;
}
