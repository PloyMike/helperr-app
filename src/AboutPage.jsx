import React from 'react';
import LegalPage from './LegalPage';

function AboutPage() {
  return (
    <LegalPage title="About Helperr">
      <p>Helperr is a marketplace platform connecting customers with verified local service experts across Thailand and beyond.</p>
      
      <h2 style={{ marginTop: 40, fontSize: 24, fontWeight: 700, color: '#111827' }}>Our Mission</h2>
      <p>We believe everyone deserves access to trusted, professional services in their local community. Helperr makes it easy to discover, book, and connect with skilled experts—from tour guides and instructors to consultants and coaches.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>How It Works</h2>
      <p><strong>For Customers:</strong> Browse expert profiles, read reviews, view availability, and book services directly through our platform. All communication stays secure and transparent.</p>
      <p><strong>For Experts:</strong> Create a profile, set your rates, manage bookings, and grow your business with our tools and support.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>Why Helperr?</h2>
      <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
        <li><strong>Verified Experts:</strong> All service providers are screened and verified</li>
        <li><strong>Secure Platform:</strong> Safe payments and on-platform communication</li>
        <li><strong>Transparent Reviews:</strong> Real feedback from real customers</li>
        <li><strong>Local Focus:</strong> Discover experts in your area</li>
      </ul>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>Based in Thailand</h2>
      <p>Helperr Co., Ltd. is registered and headquartered in Bangkok, Thailand. We're proud to serve communities throughout Thailand while expanding to new regions.</p>
      
      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>Join Our Community</h2>
      <p>Whether you're looking for an expert or want to become one, Helperr is here to connect you. Get started today!</p>
      
      <p style={{ marginTop: 40, fontSize: 14, color: '#6b7280' }}>
        Helperr Co., Ltd.<br />
        Bangkok, Thailand<br />
        ©️ 2026 All Rights Reserved
      </p>
    </LegalPage>
  );
}

export default AboutPage;
