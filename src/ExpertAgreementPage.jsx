import React from 'react';
import LegalPage from './LegalPage';

function ExpertAgreementPage() {
  return (
    <LegalPage title="Expert Agreement">
      <p><strong>Last Updated:</strong> May 19, 2026</p>
      <p>This Expert Agreement ("Agreement") governs your use of the Helperr platform as a service provider ("Expert"). By registering as an Expert, you agree to these terms.</p>
      
      <h2 style={{ marginTop: 40, fontSize: 24, fontWeight: 700, color: '#111827' }}>1. Independent Contractor Status</h2>
      <p>You are an independent contractor, not an employee of Helperr. You are solely responsible for your services, taxes, insurance, and compliance with local laws.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>2. Expert Obligations</h2>
      <p>As an Expert, you agree to:</p>
      <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
        <li>Provide accurate information in your profile</li>
        <li>Maintain valid credentials, licenses, and insurance where required</li>
        <li>Deliver services professionally and safely</li>
        <li>Honor confirmed bookings or provide reasonable notice of cancellation</li>
        <li>Respond to customer inquiries promptly</li>
        <li>Comply with Thai laws and regulations</li>
      </ul>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>3. Platform Fees</h2>
      <p>Helperr charges a service fee for facilitating bookings. Fee structure will be communicated separately and may change with notice.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>4. Payment Terms</h2>
      <p>You set your own prices. Payments are processed through our platform. Payouts are made according to our payment schedule, minus applicable fees and taxes.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>5. Reviews and Ratings</h2>
      <p>Customers may leave reviews. You may not solicit fake reviews or retaliate against customers for negative feedback.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>6. Liability and Insurance</h2>
      <p>You are solely liable for your services. We strongly recommend maintaining appropriate liability insurance. Helperr is not responsible for injuries, damages, or losses arising from your services.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>7. Intellectual Property</h2>
      <p>You retain ownership of content you create. By uploading content, you grant Helperr a license to display it on our platform.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>8. Account Suspension</h2>
      <p>We may suspend or terminate your account for violations of this Agreement, fraudulent activity, safety concerns, or legal requirements.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>9. Dispute Resolution</h2>
      <p>Disputes between you and customers should be resolved directly. Helperr may assist but is not obligated to mediate. Legal disputes are governed by Thai law.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>10. Contact</h2>
      <p>For questions about this Agreement, contact us at: experts@helperr.co</p>
      
      <p style={{ marginTop: 40, fontSize: 14, color: '#6b7280' }}>
        Helperr Co., Ltd.<br />
        Bangkok, Thailand<br />
        ©️ 2026 All Rights Reserved
      </p>
    </LegalPage>
  );
}

export default ExpertAgreementPage;
