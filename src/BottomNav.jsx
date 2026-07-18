import React from 'react';
import { Home, MessageCircle, Calendar, Briefcase, Menu } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useBadges } from './useBadges';

const BottomNav = ({ currentView, hasProviderProfile }) => {
  const isNativeApp = Capacitor.isNativePlatform();
  const { messagesBadge, myBookingsBadge, providerBookingsBadge } = useBadges();
  
  // Nur in native App anzeigen, nie im Web
  if (!isNativeApp) return null;

  const navItems = [
    { view: 'home', icon: Home, label: 'Home', badge: 0 },
    { view: 'messages', icon: MessageCircle, label: 'Messages', badge: messagesBadge },
    { view: 'bookings', icon: Calendar, label: 'Bookings', badge: myBookingsBadge },
    ...(hasProviderProfile ? [{ view: 'provider-bookings', icon: Briefcase, label: 'Experts', badge: providerBookingsBadge }] : []),
    { view: 'app-menu', icon: Menu, label: 'Menu', badge: 0 }
  ];

  const handleClick = (view) => {
    if (window.navigateTo) {
      window.navigateTo(view);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.nav}>
        {navItems.map(({ view, icon: Icon, label, badge }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              onClick={() => handleClick(view)}
              className="notranslate"
              translate="no"
              lang="en"
              style={{
                ...styles.navBtn,
                color: isActive ? '#065f46' : '#9ca3af'
              }}
            >
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                {badge > 0 && (
                  <span style={styles.badge}>
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span 
                className="notranslate"
                translate="no"
                lang="en"
                style={{
                  ...styles.navLabel,
                  fontWeight: isActive ? 700 : 500,
                  unicodeBidi: 'isolate'
                }}
              >
                <bdi translate="no">{label}</bdi>
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
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    background: '#ef4444',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    padding: '0 5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    border: '2px solid #fff',
    boxSizing: 'content-box'
  },
  navLabel: {
    fontSize: 10,
    letterSpacing: '0.2px'
  }
};

export default BottomNav;
