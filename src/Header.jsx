import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

function Header({ transparent }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasProviderProfile, setHasProviderProfile] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('name, image_url, id')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
        setHasProviderProfile(!!data.id);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const getInitial = () => {
    if (profile?.name) return profile.name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  return (
    <header style={{
      ...styles.header,
      ...(transparent ? styles.headerTransparent : {})
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={styles.container}>
        <h1 
          onClick={() => window.navigateTo('home')} 
          style={{
            ...styles.logo,
            ...(transparent ? styles.logoTransparent : {})
          }}
        >
          Helperr
        </h1>

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
              </button>
              {hasProviderProfile && (
                <button onClick={() => window.navigateTo('provider-bookings')} style={{
                  ...styles.navBtn,
                  ...(transparent ? styles.navBtnTransparent : {})
                }}>
                  Provider Bookings
                </button>
              )}
              
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={styles.profileBtn}
                >
                  {profile?.image_url && profile.image_url.startsWith('http') ? (
                    <img 
                      src={profile.image_url} 
                      alt="Profile" 
                      style={styles.profileImage}
                    />
                  ) : profile?.image_url && !profile.image_url.startsWith('http') ? (
                    <span style={{ fontSize: 20 }}>{profile.image_url}</span>
                  ) : (
                    <div style={styles.profileInitial}>{getInitial()}</div>
                  )}
                </button>

                {showDropdown && (
                  <div style={styles.dropdown}>
                    <button 
                      onClick={() => { setShowDropdown(false); window.navigateTo('edit-profile'); }}
                      style={styles.dropdownItem}
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => { setShowDropdown(false); window.navigateTo('dashboard'); }}
                      style={styles.dropdownItem}
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={handleLogout}
                      style={{ ...styles.dropdownItem, color: '#dc2626' }}
                    >
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
              <button onClick={() => window.navigateTo('register')} style={styles.btnPrimary}>
                Sign Up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    fontFamily: '"Outfit", sans-serif'
  },
  headerTransparent: {
    background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.3) 0%, rgba(4, 120, 87, 0.3) 100%)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderBottom: 'none',
    boxShadow: 'none'
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70
  },
  logo: {
    fontSize: 28,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer',
    margin: 0
  },
  logoTransparent: {
    color: '#fff',
    background: 'none',
    WebkitTextFillColor: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  navBtn: {
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
    color: '#fff',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif'
  },
  profileBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    borderRadius: '50%',
    overflow: 'hidden',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  profileInitial: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#065f46',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: 180,
    overflow: 'hidden',
    border: '1px solid #e5e7eb'
  },
  dropdownItem: {
    width: '100%',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    transition: 'background 0.2s'
  }
};

export default Header;
