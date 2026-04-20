cat > src/Header.jsx << 'ENDOFFILE'
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

function Header({ transparent, isScrolled }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hasProviderProfile, setHasProviderProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [myBookingsBadge, setMyBookingsBadge] = useState(0);
  const [providerBookingsBadge, setProviderBookingsBadge] = useState(0);

  useEffect(() => {
    checkUser();
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('name, image_url, id, job, email')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setProfile(data);
        setHasProviderProfile(!!data.job);
      }
    }
  };

  const fetchBookingCounts = async () => {
    if (!user || !profile) return;

    try {
      const { count: myCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('customer_email', user.email)
        .eq('status', 'pending');
      
      setMyBookingsBadge(myCount || 0);

      if (hasProviderProfile && profile.id) {
        const { count: providerCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', profile.id)
          .eq('status', 'pending');
        
        setProviderBookingsBadge(providerCount || 0);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    if (user && profile) {
      fetchBookingCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, hasProviderProfile]);

  const handleLogout = async () => {
    setShowMobileMenu(false);
    setUser(null);
    setProfile(null);
    setHasProviderProfile(false);
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const getInitial = () => {
    if (profile?.name) return profile.name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

  const renderBadge = (count) => {
    if (count === 0) return null;
    return (
      <span style={{
        marginLeft: 6,
        background: '#ef4444',
        color: 'white',
        borderRadius: '50%',
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        fontSize: 11,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {count}
      </span>
    );
  };

  return (
    <>
      <header style={{
        ...styles.header,
        ...(transparent ? (isScrolled ? styles.headerTransparentScrolled : styles.headerTransparentTop) : {})
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        <div style={styles.container}>
          {isMobile && (
            <button onClick={() => setShowMobileMenu(true)} style={styles.hamburgerBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke={transparent && !isScrolled ? "white" : "#065f46"} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          <h1 
            onClick={() => window.navigateTo('home')} 
            style={{
              ...styles.logo,
             ...(transparent ? styles.logoTransparent : {})
            }}
          >
            Helperr
          </h1>

          {!isMobile && (
            <nav style={styles.nav}>
              {user ? (
                <>
                  <button onClick={() => window.navigateTo('home')} style={{
                    ...styles.navBtn,
                   ...(transparent ? styles.navBtnTransparent : {})
                  }}>
                    Home
                  </button>
                  <button onClick={() => window.navigateTo('messages')} style={{
                    ...styles.navBtn,
                   ...(transparent ? styles.navBtnTransparent : {})
                  }}>
                    Messages
                  </button>
                  <button onClick={() => window.navigateTo('bookings')} style={{
                    ...styles.navBtn,
                   ...(transparent ? styles.navBtnTransparent : {})
                  }}>
                    My Bookings
                    {renderBadge(myBookingsBadge)}
                  </button>
                  {hasProviderProfile && (
                    <button onClick={() => window.navigateTo('provider-bookings')} style={{
                      ...styles.navBtn,
                     ...(transparent ? styles.navBtnTransparent : {})
                    }}>
                      Provider Bookings
                      {renderBadge(providerBookingsBadge)}
                    </button>
                  )}
                  <div style={styles.profileDropdown}>
                    <button onClick={() => setShowDropdown(!showDropdown)} style={styles.profileBtn}>
                      {profile?.image_url ? (
                        <img src={profile.image_url} alt="Profile" style={styles.profileImage} />
                      ) : (
                        <div style={styles.profileInitial}>{getInitial()}</div>
                      )}
                    </button>
                    {showDropdown && (
                      <div style={styles.dropdownMenu}>
                        {hasProviderProfile && (
                          <button onClick={() => { setShowDropdown(false); window.navigateTo('dashboard'); }} style={styles.dropdownItem}>
                            Dashboard
                          </button>
                        )}
                        {hasProviderProfile ? (
                          <button onClick={() => { setShowDropdown(false); window.navigateTo('edit-profile'); }} style={styles.dropdownItem}>
                            Edit Profile
                          </button>
                        ) : (
                          <button onClick={() => { setShowDropdown(false); window.navigateTo('register'); }} style={styles.dropdownItem}>
                            Become a Provider
                          </button>
                        )}
                        <button onClick={handleLogout} style={styles.dropdownItem}>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => window.navigateTo('login')} style={{
                    ...styles.navBtn,
                   ...(transparent ? styles.navBtnTransparent : {})
                  }}>
                    Login
                  </button>
                  <button onClick={() => window.navigateTo('register')} style={{
                    ...styles.navBtn,
                   ...(transparent ? styles.navBtnTransparent : {})
                  }}>
                    Become a Provider
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {isMobile && showMobileMenu && (
        <>
          <div style={styles.mobileOverlay} onClick={closeMobileMenu}></div>
          <div style={styles.mobileMenu}>
            <div style={styles.mobileHeader}>
              <h2 style={styles.mobileTitle}>Menu</h2>
              <button onClick={closeMobileMenu} style={styles.closeBtn}>×</button>
            </div>
            {user && (
              <div style={styles.userInfo}>
                {profile?.image_url ? (
                  <img src={profile.image_url} alt="Profile" style={styles.mobileProfileImage} />
                ) : (
                  <div style={styles.mobileProfileInitial}>{getInitial()}</div>
                )}
                <p style={styles.userName}>{profile?.name || user.email}</p>
              </div>
            )}
            {user ? (
              <>
              <button onClick={() => { closeMobileMenu(); window.navigateTo('home'); }} style={styles.mobileMenuItem}>
                Home
              </button>
              <button onClick={() => { closeMobileMenu(); window.navigateTo('messages'); }} style={styles.mobileMenuItem}>
                Messages
              </button>
              <button onClick={() => { closeMobileMenu(); window.navigateTo('bookings'); }} style={styles.mobileMenuItem}>
                My Bookings
                {renderBadge(myBookingsBadge)}
              </button>
              {hasProviderProfile && (
                <button onClick={() => { closeMobileMenu(); window.navigateTo('provider-bookings'); }} style={styles.mobileMenuItem}>
                  Provider Bookings
                  {renderBadge(providerBookingsBadge)}
                </button>
              )}
              {hasProviderProfile && (
                <button onClick={() => { closeMobileMenu(); window.navigateTo('dashboard'); }} style={styles.mobileMenuItem}>
                  Dashboard
                </button>
              )}
              {hasProviderProfile ? (
                <button onClick={() => { closeMobileMenu(); window.navigateTo('edit-profile'); }} style={styles.mobileMenuItem}>
                  Edit Profile
                </button>
              ) : (
                <button onClick={() => { closeMobileMenu(); window.navigateTo('register'); }} style={styles.mobileMenuItem}>
                  Become a Provider
                </button>
              )}
              <button onClick={handleLogout} style={{...styles.mobileMenuItem, color: '#ef4444'}}>
                Logout
              </button>
              </>
            ) : (
              <>
              <button onClick={() => { closeMobileMenu(); window.navigateTo('login'); }} style={styles.mobileMenuItem}>
                Login
              </button>
              <button onClick={() => { closeMobileMenu(); window.navigateTo('register'); }} style={styles.mobileMenuItem}>
                Become a Provider
              </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    fontFamily: '"Outfit", sans-serif'
  },
  headerTransparentTop: {
    background: 'transparent',
    backdropFilter: 'none',
    boxShadow: 'none'
  },
  headerTransparentScrolled: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '0 24px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  hamburgerBtn: {
    background: 'none',
    border: 'none',
    padding: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    fontSize: 28,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  logoTransparent: {
    background: 'white',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  navBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#374151',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: 8,
    transition: 'all 0.2s',
    fontFamily: '"Outfit", sans-serif'
  },
  navBtnTransparent: {
    color: 'white'
  },
  profileDropdown: {
    position: 'relative'
  },
  profileBtn: {
    background: 'transparent',
    border: '2px solid #e5e7eb',
    borderRadius: '50%',
    width: 40,
    height: 40,
    padding: 0,
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.2s'
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  profileInitial: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    color: 'white',
    fontSize: 16,
    fontWeight: 700
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    minWidth: 200,
    overflow: 'hidden',
    zIndex: 1001
  },
  dropdownItem: {
    width: '100%',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 600,
    color: '#111827',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: '"Outfit", sans-serif',
    display: 'block'
  },
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1100
  },
  mobileMenu: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 350,
    background: 'white',
    zIndex: 1101,
    overflowY: 'auto',
    padding: 20
  },
  mobileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  mobileTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#111827',
    margin: 0
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: 32,
    color: '#6b7280',
    cursor: 'pointer',
    padding: 0,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInfo: {
    textAlign: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottom: '1px solid #e5e7eb'
  },
  mobileProfileImage: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 12px'
  },
  mobileProfileInitial: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 700,
    margin: '0 auto 12px'
  },
  userName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#111827',
    margin: 0
  },
  mobileMenuItem: {
    width: '100%',
    padding: '14px 16px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
    cursor: 'pointer',
    borderRadius: 10,
    transition: 'all 0.2s',
    fontFamily: '"Outfit", sans-serif',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8
  }
};

export default Header;
ENDOFFILE
