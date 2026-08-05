import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import PageHero from '@/components/shared/PageHero';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "When you register for INFOGRAM'26, we collect personal information such as your name, college details, email address, phone number, and payment information. We also automatically collect certain technical information when you visit our website, such as IP address and browser type."
    },
    {
      title: "2. How We Use Information",
      content: "We use the collected information to process your event registration, communicate important updates regarding the symposium, manage team formations, generate participation certificates, and ensure a secure and smooth experience during the event."
    },
    {
      title: "3. Data Security",
      content: "We implement robust security measures to protect your personal information. All payment processing is handled through secure, encrypted third-party gateways. We do not store your full credit card or banking details on our servers."
    },
    {
      title: "4. Cookies",
      content: "Our website uses cookies and similar tracking technologies to enhance user experience, analyze traffic patterns, and remember your preferences. You can configure your browser to refuse cookies, but this may limit certain functionalities."
    },
    {
      title: "5. Third Party Services",
      content: "We may share necessary information with trusted third-party service providers (like payment gateways and email services) solely for the purpose of facilitating our services. We do not sell your personal data to advertisers."
    },
    {
      title: "6. Your Rights",
      content: "You have the right to access, correct, or request deletion of your personal data stored with us. If you wish to exercise these rights, please contact our support team."
    },
    {
      title: "7. Changes to Policy",
      content: "We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date. Your continued use of the website constitutes acceptance of the modified policy."
    }
  ];

  return (
    <PublicLayout>
      <PageHero 
        title="Privacy Policy" 
        subtitle="Last updated: January 2026"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy', href: '/privacy-policy' }]}
      />

      <div className="section-padding container-xl mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10 mb-10">
            <p className="text-slate-300 leading-relaxed text-lg">
              Welcome to the official website of INFOGRAM'26. We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with our platform.
            </p>
          </div>

          {sections.map((section, idx) => (
            <div key={idx} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
              <p className="text-slate-400 leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="mt-12 glass-card p-8 rounded-2xl bg-primary/10 border border-primary/20 text-center">
            <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
            <p className="text-slate-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
            <a href="mailto:info@cahcet.edu.in" className="text-primary-400 hover:text-primary-300 font-medium">
              info@cahcet.edu.in
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
