import React from 'react';
import { Home, MessageCircle, Calendar, Briefcase, Menu } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

const BottomNav = ({ currentView, hasProviderProfile }) => {
  const isNativeApp = Capacitor.isNativePlatform();
  
  // Nur in native App anzeigen, nie im Web
  if (!isNativeApp) return null;

  const navItems = [
    { view: 'home', icon: Home, label: 'Home' },
    { view: 'messages', icon: MessageCircle, label: 'Messages' },
    { view: 'bookings', icon: Calendar, label: 'Bookings' },
    ...(hasProviderProfile ? [{ view: 'provider-bookings', icon: Briefcase, label: 'Experts' }] : []),
    { view: 'app-menu', icon: Menu, label: 'Menu' }
  ];

  const handleClick = (view) => {
    if (window.navigateTo) {
      window.navigateTo(view);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.nav}>
        {navItems.map(({ view, icon: Icon, label }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              onClick={() => handleClick(view)}
              style={{
                ...styles.navBtn,
                color: isActive ? '#065f46' : '#9ca3af'
              }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              <span style={{
                ...styles.navLabel,
                fontWeight: isActive ? 700 : 500
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    borderTop: '1px solid #e5e7eb',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
    zIndex: 1000,
    paddingBottom: 'env(safe-area-inset-bottom)',
    fontFamily: '"Outfit", sans-serif'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '8px 4px',
    maxWidth: 600,
    margin: '0 auto'
  },
  navBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    padding: '6px 8px',
    minWidth: 56,
    transition: 'color 0.2s'
  },
  navLabel: {
    fontSize: 10,
    letterSpacing: '0.2px'
  }
};

export default BottomNav;
