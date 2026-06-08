import React from 'react';
import LegalPage from './LegalPage';

function ContactPage() {
  return (
    <LegalPage title="Contact Us">
      <p>We're here to help! Reach out to us for any questions, concerns, or feedback.</p>
      
      <h2 style={{ marginTop: 40, fontSize: 24, fontWeight: 700, color: '#111827' }}>General Inquiries</h2>
      <p><strong>Email:</strong> support@helperr.co</p>
      <p><strong>Response Time:</strong> We typically respond within 24-48 hours</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>For Experts</h2>
      <p><strong>Email:</strong> support@helperr.co</p>
      <p>Questions about becoming an Expert, managing your profile, or platform features</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>Privacy & Legal</h2>
      <p><strong>Privacy Requests:</strong> support@helperr.co</p>
      <p><strong>Legal Matters:</strong> support@helperr.co</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>Safety & Trust</h2>
      <p>If you have safety concerns or need to report a violation:</p>
      <p><strong>Email:</strong> support@helperr.co</p>
      <p><strong>Urgent Safety Issues:</strong> Contact local authorities first, then notify us</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>Business Address</h2>
      <p>
        Helperr Co., Ltd.<br />
        Bangkok, Thailand<br />
        Registered Company in Thailand
      </p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>Social Media</h2>
      <p>Follow us for updates, tips, and community stories (coming soon!)</p>
      
      <p style={{ marginTop: 40, fontSize: 14, color: '#6b7280' }}>
        We look forward to hearing from you!<br />
        ©️ 2026 Helperr Co., Ltd. All Rights Reserved
      </p>
    </LegalPage>
  );
}

export default ContactPage;
