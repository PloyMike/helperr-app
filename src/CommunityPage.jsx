import React from 'react';
import LegalPage from './LegalPage';

function CommunityPage() {
  return (
    <LegalPage title="Community Guidelines">
      <p><strong>Last Updated:</strong> May 19, 2026</p>
      <p>Helperr is a community built on trust, respect, and safety. These guidelines help maintain a positive environment for everyone.</p>
      
      <h2 style={{ marginTop: 40, fontSize: 24, fontWeight: 700, color: '#111827' }}>1. Be Respectful</h2>
      <p>Treat all users with kindness and respect. Discrimination, harassment, hate speech, or abusive behavior will not be tolerated.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>2. Be Honest</h2>
      <p>Provide accurate information in your profile and communications. Misrepresentation or fraud undermines trust in our community.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>3. Communicate Clearly</h2>
      <p>Use clear, professional language. Respond to messages promptly and keep all communication on-platform for safety and accountability.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>4. Honor Commitments</h2>
      <p>If you book a service or accept a booking, honor it. If you must cancel, provide reasonable notice and explanation.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>5. Prioritize Safety</h2>
      <p>For Experts: Follow safety protocols, obtain necessary permits, and maintain insurance where required.</p>
      <p>For Customers: Meet in public places when appropriate, verify Expert credentials, and trust your instincts.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>6. Respect Privacy</h2>
      <p>Do not share others' personal information without consent. Respect boundaries and professional relationships.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>7. Give Constructive Feedback</h2>
      <p>Reviews should be honest, fair, and helpful. Avoid personal attacks or discriminatory comments.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>8. Report Concerns</h2>
      <p>If you witness violations or have safety concerns, report them to us immediately at: support@helperr.co</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>9. Prohibited Activities</h2>
      <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
        <li>Illegal activities or services</li>
        <li>Scams, fraud, or deceptive practices</li>
        <li>Spam, solicitation, or unauthorized advertising</li>
        <li>Circumventing platform fees or payments</li>
        <li>Creating fake accounts or reviews</li>
        <li>Sharing inappropriate or offensive content</li>
      </ul>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>10. Consequences</h2>
      <p>Violations may result in warnings, account suspension, or permanent bans. Serious violations may be reported to authorities.</p>
      
      <p style={{ marginTop: 40, fontSize: 14, color: '#6b7280' }}>
        Helperr Co., Ltd.<br />
        Bangkok, Thailand<br />
        ©️ 2026 All Rights Reserved
      </p>
    </LegalPage>
  );
}

export default CommunityPage;
