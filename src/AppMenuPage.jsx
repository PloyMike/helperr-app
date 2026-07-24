import React, { useState, useEffect } from 'react';
import { User, CreditCard, LayoutDashboard, Briefcase, Globe, LogOut, LogIn, UserPlus, Info, Mail, FileText, Shield, Cookie, HandshakeIcon, Users, RefreshCw } from 'lucide-react';
import { useAuth } from './AuthContext';
import { supabase } from './supabase';

const AppMenuPage = () => {
  const { user, signOut } = useAuth();
  const [hasProviderProfile, setHasProviderProfile] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const check = async () => {
      if (!user) { setHasProviderProfile(false); return; }
      const { data } = await supabase
        .from('profiles')
        .select('id, job, name')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setHasProviderProfile(!!(data && data.job));
      setUserName(data?.name || user?.user_metadata?.name || user?.email || '');
    };
    check();
  }, [user]);

  const nav = (view) => window.navigateTo && window.navigateTo(view);

  const handleLogout = async () => {
    await signOut();
    nav('home');
  };

  const changeLanguage = (langCode) => {
    // Google Translate Widget triggern (schon in Header.jsx implementiert)
    const scriptExists = document.querySelector('script[src*="translate.google.com"]');
    if (!scriptExists) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google_translate_element'
        );
        setTimeout(() => triggerLang(langCode), 1000);
      };
    } else {
      triggerLang(langCode);
    }
    localStorage.setItem('helperr_lang', langCode);
  };

  const triggerLang = (langCode) => {
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    }
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <div style={styles.header}>
        <h1 style={styles.title}>Menu</h1>
        {user && <p style={styles.subtitle}>{userName}</p>}
      </div>

      <div style={styles.container}>
        {user ? (
          <>
            {/* Account Section */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>ACCOUNT</div>
              <MenuItem icon={User} label="Edit Profile" onClick={() => nav('edit-profile')} />
              <MenuItem icon={CreditCard} label="My Payments" onClick={() => nav('my-payments')} />
              <MenuItem icon={LayoutDashboard} label="Dashboard" onClick={() => nav('dashboard')} />
            </div>

            {/* Language Section */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>LANGUAGE</div>
              <div style={styles.langGrid}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    style={styles.langBtn}
                  >
                    <span style={{ fontSize: 20 }}>{lang.flag}</span>
                    <span style={styles.langLabel}>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>COMPANY</div>
              <MenuItem icon={Info} label="About Us" onClick={() => nav('about')} />
              <MenuItem icon={Mail} label="Contact Us" onClick={() => nav('contact')} />
            </div>

            {/* Legal */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>LEGAL</div>
              <MenuItem icon={FileText} label="Terms & Conditions" onClick={() => nav('terms')} />
              <MenuItem icon={RefreshCw} label="Refund & Cancellation" onClick={() => nav('refund')} />
              <MenuItem icon={Shield} label="Privacy Policy" onClick={() => nav('privacy')} />
              <MenuItem icon={Cookie} label="Cookie Policy" onClick={() => nav('cookies')} />
            </div>

            {/* For Experts */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>FOR EXPERTS</div>
              <MenuItem icon={Briefcase} label="Expert Agreement" onClick={() => nav('expert-agreement')} />
              <MenuItem icon={Users} label="Community Guidelines" onClick={() => nav('community')} />
            </div>

            {/* Logout */}
            <div style={styles.section}>
              <MenuItem icon={LogOut} label="Log Out" onClick={handleLogout} destructive />
            </div>
          </>
        ) : (
          <>
            {/* Not logged in */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>ACCOUNT</div>
              <MenuItem icon={LogIn} label="Log In" onClick={() => nav('login')} />
              <MenuItem icon={UserPlus} label="Sign Up" onClick={() => nav('signup')} />
            </div>

            {/* Language even without login */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>LANGUAGE</div>
              <div style={styles.langGrid}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    style={styles.langBtn}
                  >
                    <span style={{ fontSize: 20 }}>{lang.flag}</span>
                    <span style={styles.langLabel}>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Company */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>COMPANY</div>
              <MenuItem icon={Info} label="About Us" onClick={() => nav('about')} />
              <MenuItem icon={Mail} label="Contact Us" onClick={() => nav('contact')} />
            </div>

            {/* Legal */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>LEGAL</div>
              <MenuItem icon={FileText} label="Terms & Conditions" onClick={() => nav('terms')} />
              <MenuItem icon={RefreshCw} label="Refund & Cancellation" onClick={() => nav('refund')} />
              <MenuItem icon={Shield} label="Privacy Policy" onClick={() => nav('privacy')} />
              <MenuItem icon={Cookie} label="Cookie Policy" onClick={() => nav('cookies')} />
            </div>

            {/* For Experts */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>FOR EXPERTS</div>
              <MenuItem icon={Briefcase} label="Expert Agreement" onClick={() => nav('expert-agreement')} />
              <MenuItem icon={Users} label="Community Guidelines" onClick={() => nav('community')} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MenuItem = ({ icon: Icon, label, onClick, destructive }) => (
  <button onClick={onClick} style={{
    ...styles.menuItem,
    color: destructive ? '#dc2626' : '#111827'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon size={22} strokeWidth={2} color={destructive ? '#dc2626' : '#065f46'} />
      <span style={styles.menuItemLabel}>{label}</span>
    </div>
    <span style={styles.chevron}>›</span>
  </button>
);

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fff',
    fontFamily: '"Outfit", sans-serif',
    paddingTop: 'calc(env(safe-area-inset-top) - 20px)',
    paddingBottom: 100
  },
  header: {
    padding: '8px 20px 12px',
    background: '#fff',
    borderBottom: '1px solid #e5e7eb'
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: '#065f46'
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: 14,
    color: '#6b7280'
  },
  container: {
    padding: 16
  },
  section: {
    marginBottom: 20,
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    letterSpacing: '0.6px',
    padding: '12px 16px 8px',
    borderBottom: '1px solid #f3f4f6'
  },
  menuItem: {
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: 'inherit',
    borderBottom: '1px solid #f3f4f6'
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: 500
  },
  chevron: {
    fontSize: 20,
    color: '#9ca3af'
  },
  langGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
    padding: 12
  },
  langBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  langLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#111827'
  }
};

export default AppMenuPage;
