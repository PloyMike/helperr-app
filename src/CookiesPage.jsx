import React from 'react';
import LegalPage from './LegalPage';

function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy">
      <p><strong>Last Updated:</strong> May 19, 2026</p>
      <p>This Cookie Policy explains how Helperr Co., Ltd. uses cookies and similar technologies on our platform.</p>
      
      <h2 style={{ marginTop: 40, fontSize: 24, fontWeight: 700, color: '#111827' }}>1. What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit our website. They help us recognize you, remember your preferences, and improve your experience.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>2. Types of Cookies We Use</h2>
      <p><strong>Essential Cookies:</strong> Required for basic platform functionality (login, booking, navigation).</p>
      <p><strong>Performance Cookies:</strong> Help us understand how you use Helperr to improve performance.</p>
      <p><strong>Functional Cookies:</strong> Remember your preferences (language, location, favorites).</p>
      <p><strong>Analytics Cookies:</strong> Track usage patterns to enhance our services.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>3. Third-Party Cookies</h2>
      <p>We use third-party services (Google Analytics, payment processors) that may set their own cookies. These are governed by their respective privacy policies.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>4. Managing Cookies</h2>
      <p>You can control cookies through your browser settings. Note that blocking essential cookies may limit platform functionality.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>5. Contact</h2>
      <p>For questions about cookies, contact us at: support@helperr.co</p>
      
      <p style={{ marginTop: 40, fontSize: 14, color: '#6b7280' }}>
        Helperr Co., Ltd.<br />
        Bangkok, Thailand<br />
        ©️ 2026 All Rights Reserved
      </p>
    </LegalPage>
  );
}

export default CookiesPage;
