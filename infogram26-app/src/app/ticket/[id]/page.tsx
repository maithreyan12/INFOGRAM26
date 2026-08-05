'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import PublicLayout from '@/components/layout/PublicLayout';
import html2canvas from 'html2canvas';

export default function TicketPage() {
  const params = useParams();
  const id = params.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketDoc = await getDoc(doc(db, 'tickets', id));
        if (ticketDoc.exists()) {
          setTicket({ id: ticketDoc.id, ...ticketDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    try {
      toast.info('Generating PDF...');
      const canvas = await html2canvas(ticketRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`INFOGRAM26_Ticket_${ticket.ticketNumber}.pdf`);
      toast.success('Ticket downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error', err);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) return <PublicLayout><div className="flex justify-center items-center min-h-screen"><div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div></div></PublicLayout>;
  
  if (!ticket) return (
    <PublicLayout>
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Ticket Not Found</h1>
        <p className="text-gray-600 mb-8">The ticket you are looking for does not exist or has been removed.</p>
        <a href="/" className="btn-primary px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Return to Home</a>
      </div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="container-xl py-12 flex flex-col items-center min-h-screen bg-gray-50">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">Your Entry Pass</h1>
          <p className="text-gray-600">Present this ticket at the registration desk on the day of the event.</p>
        </div>

        <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden mb-8 ticket-border relative" ref={ticketRef}>
          {/* Ticket Header */}
          <div className="bg-[#02042B] text-white p-6 text-center border-b-4 border-blue-500 relative">
            <h2 className="text-3xl font-bold tracking-widest mb-1">INFOGRAM'26</h2>
            <p className="text-blue-200 text-sm tracking-widest uppercase">National Level Tech Symposium</p>
            <div className="absolute right-6 top-6 bg-blue-600 px-3 py-1 rounded text-xs font-bold tracking-wider">
              {ticket.status === 'valid' ? 'VALID' : ticket.status.toUpperCase()}
            </div>
          </div>

          <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
            {/* Ticket Details */}
            <div className="flex-1 w-full space-y-6">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Applicant ID</p>
                <p className="font-mono text-2xl font-bold text-gray-800">{ticket.applicantId}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Participant Name</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{ticket.studentName}</p>
                <p className="text-gray-600 mt-1">{ticket.department}, {ticket.college}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Registered Events</p>
                <ul className="space-y-2">
                  {ticket.events.map((event: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 font-medium bg-gray-50 p-2 rounded">
                      <span className="text-green-500">✓</span> {event}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-end pt-4 border-t border-dashed border-gray-300">
                <div>
                  <p className="text-gray-400 text-xs uppercase mb-1">Ticket No</p>
                  <p className="font-mono font-medium text-gray-700">{ticket.ticketNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs uppercase mb-1">Date Issued</p>
                  <p className="font-medium text-gray-700">
                    {ticket.issueDate?.seconds ? new Date(ticket.issueDate.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                <QRCode 
                  value={ticket.qrData} 
                  size={150}
                  level="H"
                />
              </div>
              <p className="text-xs text-gray-500 text-center max-w-[150px]">
                Scan to verify participant identity & events
              </p>
            </div>
          </div>
          
          {/* Decorative circles for ticket stub look */}
          <div className="absolute left-[-15px] top-[40%] w-8 h-8 bg-gray-50 rounded-full"></div>
          <div className="absolute right-[-15px] top-[40%] w-8 h-8 bg-gray-50 rounded-full"></div>
        </div>

        <button 
          onClick={handleDownloadPDF}
          className="btn-primary px-8 py-3 bg-[#02042B] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download PDF Ticket
        </button>
      </div>
    </PublicLayout>
  );
}
