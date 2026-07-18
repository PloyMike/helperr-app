import { Capacitor } from '@capacitor/core';
import React from 'react';
import Header from './Header';
import Footer from './Footer';

function LegalPage({ title, children }) {
  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>{title}</h1>
        <div style={styles.content}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  container: { maxWidth: 900, margin: Capacitor.isNativePlatform() ? '20px auto 0' : '120px auto 60px', padding: Capacitor.isNativePlatform() ? '0 20px calc(120px + env(safe-area-inset-bottom)) 20px' : '0 20px', flex: 1 },
  title: { fontSize: 48, fontWeight: 800, color: '#111827', marginBottom: 40, letterSpacing: '-0.02em' },
  content: { fontSize: 16, lineHeight: 1.8, color: '#374151' }
};

export default LegalPage;
