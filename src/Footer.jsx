import React from 'react';
import { Capacitor } from '@capacitor/core';

function Footer() {
  // Native App: Footer weg (Links sind im Menu)
  if (Capacitor.isNativePlatform()) return null;
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.linksGrid}>
          <div style={styles.linkColumn}>
            <h3 style={styles.columnTitle}>Company</h3>
            <button onClick={() => window.navigateTo('about')} style={styles.link}>About Us</button>
            <button onClick={() => window.navigateTo('contact')} style={styles.link}>Contact Us</button>
          </div>

          <div style={styles.linkColumn}>
            <h3 style={styles.columnTitle}>Legal</h3>
            <button onClick={() => window.navigateTo('terms')} style={styles.link}>Terms & Conditions</button>
            <button onClick={() => window.navigateTo('refund')} style={styles.link}>Refund Policy</button>
            <button onClick={() => window.navigateTo('privacy')} style={styles.link}>Privacy Policy</button>
            <button onClick={() => window.navigateTo('cookies')} style={styles.link}>Cookie Policy</button>
          </div>

          <div style={styles.linkColumn}>
            <h3 style={styles.columnTitle}>For Experts</h3>
            <button onClick={() => window.navigateTo('expert-agreement')} style={styles.link}>Expert Agreement</button>
            <button onClick={() => window.navigateTo('community')} style={styles.link}>Community Guidelines</button>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p style={styles.copyright}>© {currentYear} Helperr Co., Ltd. All rights reserved.</p>
          <p style={styles.location}>Registered in Thailand</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: '#111827', color: '#fff', padding: '60px 20px 30px', fontFamily: '"Outfit", sans-serif' },
  container: { maxWidth: 1200, margin: '0 auto' },
  linksGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 50 },
  linkColumn: { display: 'flex', flexDirection: 'column', gap: 12 },
  columnTitle: { fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#fff' },
  link: { background: 'none', border: 'none', color: '#9ca3af', fontSize: 14, textAlign: 'left', cursor: 'pointer', padding: '4px 0', fontFamily: '"Outfit", sans-serif' },
  bottomBar: { borderTop: '1px solid #374151', paddingTop: 30, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 },
  copyright: { margin: 0, fontSize: 14, color: '#9ca3af' },
  location: { margin: 0, fontSize: 13, color: '#6b7280' }
};

export default Footer;
