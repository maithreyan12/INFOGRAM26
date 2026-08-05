import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/shared/PageHero';

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and registering on the INFOGRAM'26 website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services or register for the symposium."
    },
    {
      title: "2. Event Registration",
      content: "Registration is open to valid college students. You must provide accurate and complete information during registration. College ID verification is mandatory on the day of the event. We reserve the right to decline or cancel any registration."
    },
    {
      title: "3. Payment Policy",
      content: "All fees must be paid in full at the time of registration. Payments are processed through a secure third-party gateway. Prices are quoted in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise."
    },
    {
      title: "4. Refund Policy",
      content: "Registration fees are strictly non-refundable and non-transferable under any circumstances, including failure to attend the event, disqualification, or technical issues on the participant's end."
    },
    {
      title: "5. Code of Conduct",
      content: "Participants must maintain professional decorum throughout the symposium. Harassment, cheating, plagiarism, or any form of disruptive behavior will result in immediate disqualification and eviction from the premises without refund."
    },
    {
      title: "6. Intellectual Property",
      content: "All content provided on this website, including logos, graphics, and text, is the property of C. Abdul Hakeem College of Engineering & Technology. Submissions made during events (e.g., code, presentations) remain the intellectual property of the creators, but the organizers reserve the right to use them for promotional purposes."
    },
    {
      title: "7. Limitation of Liability",
      content: "The organizers of INFOGRAM'26 are not liable for any direct, indirect, incidental, or consequential damages resulting from your participation in the event or use of this website. We are not responsible for lost or damaged personal property during the physical event."
    },
    {
      title: "8. Governing Law",
      content: "These terms are governed by the laws of India. Any disputes arising from these terms or the event shall be subject to the exclusive jurisdiction of the courts in Vellore, Tamil Nadu."
    }
  ];

  return (
    <PublicLayout>
      <PageHero 
        title="Terms & Conditions" 
        subtitle="Please read carefully before registering"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Terms', href: '/terms' }]}
      />

      <div className="section-padding container-xl mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10 mb-10">
            <p className="text-slate-300 leading-relaxed text-lg">
              Welcome to INFOGRAM'26. These Terms and Conditions govern your use of our website and your registration and participation in the national level technical symposium organized by the Department of Information Technology.
            </p>
          </div>

          {sections.map((section, idx) => (
            <div key={idx} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
              <p className="text-slate-400 leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="mt-12 glass-card p-8 rounded-2xl bg-primary/10 border border-primary/20 text-center">
            <h2 className="text-xl font-semibold text-white mb-3">Questions?</h2>
            <p className="text-slate-300 mb-4">
              If you have any queries regarding these terms, please reach out to the organizing committee.
            </p>
            <a href="/contact" className="btn-primary px-6 py-2 rounded-full inline-block">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
