import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabase';

function Header({ transparent = false }) {
  const { user, signOut } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (transparent) {
      const handleScroll = () => {
        // Hero Höhe ist etwa 180px (120px padding-top + 60px content)
        setScrolled(window.scrollY > 180);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [transparent]);

  useEffect(() => {
    const saved = localStorage.getItem('helperr_favorites');
    if (saved) setFavorites(JSON.parse(saved));

    const handleStorageChange = () => {
      const updated = localStorage.getItem('helperr_favorites');
      if (updated) setFavorites(JSON.parse(updated));
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    const fetchUnreadCount = async () => {
      if (user) {
        const { data } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('receiver_email', user.email)
          .eq('read', false);
        setUnreadCount(data?.length || 0);
      } else {
        setUnreadCount(0);
      }
    };
    fetchUnreadCount();
    const msgInterval = setInterval(fetchUnreadCount, 5000);

    const fetchPendingBookings = async () => {
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();

        if (profileData) {
          const { data: bookingsData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .eq('profile_id', profileData.id)
            .eq('status', 'pending');
          
          setPendingBookings(bookingsData?.length || 0);
        } else {
          setPendingBookings(0);
        }
      } else {
        setPendingBookings(0);
      }
    };
    fetchPendingBookings();
    const bookingsInterval = setInterval(fetchPendingBookings, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
      clearInterval(msgInterval);
      clearInterval(bookingsInterval);
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    window.navigateTo('home');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isTransparent = transparent && !scrolled;
  const headerStyle = isTransparent ? styles.headerTransparent : styles.header;
  const textColor = isTransparent ? '#ffffff' : '#374151';
  const logoColor = isTransparent ? '#ffffff' : '#065f46';

  return (
    <header style={headerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={styles.container}>
        
        {/* LOGO */}
        <div onClick={() => window.navigateTo('home')} style={styles.logo}>
          <div style={{...styles.logoText, color: logoColor, textShadow: isTransparent ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'}}>Helperr</div>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav style={styles.desktopNav} className="desktop-nav">
          <button onClick={() => window.navigateTo('home')} style={{...styles.navBtn, color: textColor, textShadow: isTransparent ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'}} onMouseOver={(e) => e.target.style.opacity = '0.8'} onMouseOut={(e) => e.target.style.opacity = '1'}>
            Home
          </button>

          {user && (
            <>
              <button onClick={() => window.navigateTo('bookings')} style={{...styles.navBtnWithBadge, color: textColor, textShadow: isTransparent ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'}} onMouseOver={(e) => e.target.style.opacity = '0.8'} onMouseOut={(e) => e.target.style.opacity = '1'}>
                Bookings
                {pendingBookings > 0 && <span style={styles.badge}>{pendingBookings}</span>}
              </button>

              <button onClick={() => window.navigateTo('messages')} style={{...styles.navBtnWithBadge, color: textColor, textShadow: isTransparent ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'}} onMouseOver={(e) => e.target.style.opacity = '0.8'} onMouseOut={(e) => e.target.style.opacity = '1'}>
                Messages
                {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
              </button>

              <button onClick={() => window.navigateTo('favorites')} style={{...styles.navBtnWithBadge, color: textColor, textShadow: isTransparent ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'}} onMouseOver={(e) => e.target.style.opacity = '0.8'} onMouseOut={(e) => e.target.style.opacity = '1'}>
                Favorites
                {favorites.length > 0 && <span style={styles.badge}>{favorites.length}</span>}
              </button>
            </>
          )}

          {!user && (
            <button onClick={() => window.navigateTo('register')} style={{...styles.navBtn, color: textColor, textShadow: isTransparent ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'}} onMouseOver={(e) => e.target.style.opacity = '0.8'} onMouseOut={(e) => e.target.style.opacity = '1'}>
              Become a Provider
            </button>
          )}

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{...styles.settingsBtn, background: isTransparent ? 'rgba(255,255,255,0.2)' : '#F3F4F6', backdropFilter: isTransparent ? 'blur(10px)' : 'none'}}>
                ⚙️
              </button>
              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <button onClick={() => { window.navigateTo('edit-profile'); setDropdownOpen(false); }} style={styles.dropdownItem}>
                    Edit Profile
                  </button>
                  <button onClick={() => { window.navigateTo('provider-dashboard'); setDropdownOpen(false); }} style={styles.dropdownItem}>
                    Dashboard
                  </button>
                  <div style={styles.divider} />
                  <button onClick={handleLogout} style={{...styles.dropdownItem, color: '#DC2626'}}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => window.navigateTo('login')} style={{...styles.loginBtn, background: isTransparent ? 'rgba(255,255,255,0.2)' : '#065f46', backdropFilter: isTransparent ? 'blur(10px)' : 'none', border: isTransparent ? '1px solid rgba(255,255,255,0.3)' : 'none'}}>
              Login
            </button>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{...styles.mobileMenuBtn, background: isTransparent ? 'rgba(255,255,255,0.2)' : '#F3F4F6', color: isTransparent ? '#fff' : '#374151', backdropFilter: isTransparent ? 'blur(10px)' : 'none'}} className="mobile-menu-btn">
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu} className="mobile-menu">
          <button onClick={() => { window.navigateTo('home'); setMobileMenuOpen(false); }} style={styles.mobileMenuItem}>
            Home
          </button>
          {user && (
            <>
              <button onClick={() => { window.navigateTo('bookings'); setMobileMenuOpen(false); }} style={styles.mobileMenuItem}>
                Bookings {pendingBookings > 0 && `(${pendingBookings})`}
              </button>
              <button onClick={() => { window.navigateTo('messages'); setMobileMenuOpen(false); }} style={styles.mobileMenuItem}>
                Messages {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button onClick={() => { window.navigateTo('favorites'); setMobileMenuOpen(false); }} style={styles.mobileMenuItem}>
                Favorites {favorites.length > 0 && `(${favorites.length})`}
              </button>
              <div style={styles.mobileDivider} />
              <button onClick={() => { window.navigateTo('edit-profile'); setMobileMenuOpen(false); }} style={styles.mobileMenuItem}>
                Edit Profile
              </button>
              <button onClick={() => { window.navigateTo('provider-dashboard'); setMobileMenuOpen(false); }} style={styles.mobileMenuItem}>
                Dashboard
              </button>
              <button onClick={handleLogout} style={{...styles.mobileMenuItem, color: '#DC2626'}}>
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <button onClick={() => { window.navigateTo('register'); setMobileMenuOpen(false); }} style={styles.mobileMenuItem}>
                Become a Provider
              </button>
              <button onClick={() => { window.navigateTo('login'); setMobileMenuOpen(false); }} style={styles.mobileMenuItem}>
                Login
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}

const styles = {
  header: { position: 'fixed', top: 0, left: 0, right: 0, background: 'white', padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', zIndex: 1000, fontFamily: '"Outfit", sans-serif', transition: 'all 0.3s ease' },
  headerTransparent: { position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '16px 20px', boxShadow: 'none', zIndex: 1000, fontFamily: '"Outfit", sans-serif', borderBottom: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' },
  container: { maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
  logoText: { fontSize: 32, fontWeight: 800, letterSpacing: '-1px', transition: 'all 0.3s ease' },
  desktopNav: { display: 'flex', alignItems: 'center', gap: 32 },
  navBtn: { background: 'none', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s' },
  navBtnWithBadge: { position: 'relative', background: 'none', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s' },
  badge: { position: 'absolute', top: -8, right: -12, background: '#F97316', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 10, minWidth: 18, textAlign: 'center' },
  settingsBtn: { border: 'none', width: 40, height: 40, borderRadius: '50%', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' },
  loginBtn: { color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.3s' },
  dropdown: { position: 'absolute', top: 50, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', minWidth: 180, overflow: 'hidden', zIndex: 1001 },
  dropdownItem: { width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'background 0.2s' },
  divider: { height: 1, background: '#F3F4F6', margin: '4px 0' },
  mobileMenuBtn: { border: 'none', width: 40, height: 40, borderRadius: 8, fontSize: 20, cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' },
  mobileMenu: { background: 'white', borderTop: '1px solid #F3F4F6', padding: '12px 0' },
  mobileMenuItem: { width: '100%', padding: '14px 20px', background: 'none', border: 'none', textAlign: 'left', fontSize: 15, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', display: 'block' },
  mobileDivider: { height: 1, background: '#F3F4F6', margin: '8px 20px' }
};

export default Header;
