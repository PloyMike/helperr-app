import React from 'react';
import LegalPage from './LegalPage';

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p><strong>Last Updated:</strong> May 19, 2026</p>
      <p>Helperr Co., Ltd. ("we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our platform.</p>
      
      <h2 style={{ marginTop: 40, fontSize: 24, fontWeight: 700, color: '#111827' }}>1. Information We Collect</h2>
      <p><strong>Account Information:</strong> Name, email address, phone number, profile photo, and payment information.</p>
      <p><strong>Usage Data:</strong> Browsing activity, search queries, booking history, messages, and device information.</p>
      <p><strong>Location Data:</strong> With your consent, we collect location data to show nearby Experts.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
        <li>Provide and improve our services</li>
        <li>Process bookings and payments</li>
        <li>Facilitate communication between customers and Experts</li>
        <li>Send booking confirmations, updates, and notifications</li>
        <li>Detect and prevent fraud or abuse</li>
        <li>Comply with legal obligations</li>
      </ul>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>3. Information Sharing</h2>
      <p>We do not sell your personal information. We may share data with:</p>
      <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
        <li><strong>Experts:</strong> To facilitate bookings (name, contact info, booking details)</li>
        <li><strong>Service Providers:</strong> Payment processors, email services, hosting providers</li>
        <li><strong>Legal Authorities:</strong> When required by Thai law or to protect our rights</li>
      </ul>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>4. Data Security</h2>
      <p>We implement industry-standard security measures including encryption, secure servers, and access controls. However, no system is 100% secure, and we cannot guarantee absolute security.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>5. Your Rights</h2>
      <p>Under Thai Personal Data Protection Act (PDPA), you have the right to:</p>
      <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
        <li>Access your personal data</li>
        <li>Request correction or deletion</li>
        <li>Withdraw consent for data processing</li>
        <li>Object to certain processing activities</li>
        <li>Request data portability</li>
      </ul>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>6. Cookies</h2>
      <p>We use cookies and similar technologies to enhance user experience. See our Cookie Policy for details.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>7. Data Retention</h2>
      <p>We retain your data for as long as necessary to provide services or as required by law. Deleted accounts are anonymized within 90 days.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>8. International Transfers</h2>
      <p>Your data may be transferred to and processed in countries outside Thailand. We ensure appropriate safeguards are in place.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>9. Children's Privacy</h2>
      <p>Helperr is not intended for users under 18. We do not knowingly collect data from minors.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>10. Contact</h2>
      <p>For privacy inquiries or to exercise your rights, contact us at: support@helperr.co</p>
      
      <p style={{ marginTop: 40, fontSize: 14, color: '#6b7280' }}>
        Helperr Co., Ltd.<br />
        Bangkok, Thailand<br />
        ©️ 2026 All Rights Reserved
      </p>
    </LegalPage>
  );
}

export default PrivacyPage;
