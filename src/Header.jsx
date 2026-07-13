import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { supabase } from './supabase';

function Header({ transparent, isScrolled }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hasProviderProfile, setHasProviderProfile] = useState(false);
  const [myBookingsBadge, setMyBookingsBadge] = useState(0);
  const [providerBookingsBadge, setProviderBookingsBadge] = useState(0);
  const [messagesBadge, setMessagesBadge] = useState(0);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMobileLanguageDropdown, setShowMobileLanguageDropdown] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Always default to English
    const saved = localStorage.getItem('selectedLanguage');
    // Only use saved language if user explicitly selected it
    return saved || 'en';
  });
  
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    checkUser();
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Listen for auth changes (login/logout in other tabs)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setProfile(null);
        setHasProviderProfile(false);
      }
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    
    if (user) {
      // Search by EMAIL instead of user_id - much simpler!
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
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchBookingCounts = async () => {
    if (!user) return;

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

      // Fetch unread messages count
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_email', user.email)
        .or('read.is.null,read.eq.false');
      
      setMessagesBadge(unreadCount || 0);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookingCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, hasProviderProfile]);

  // Realtime: refresh badges when messages or bookings change
  useEffect(() => {
    if (!user) return;

    // Messages: new message received or read status changed
    const messagesChannel = supabase
      .channel('header-messages-' + user.id)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `receiver_email=eq.${user.email}`
      }, () => {
        fetchBookingCounts();
      })
      .subscribe();

    // Bookings: any change affects badges
    const bookingsChannel = supabase
      .channel('header-bookings-' + user.id)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, () => {
        fetchBookingCounts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(bookingsChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Protect Helperr logo from translation
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const logo = document.querySelector('h1[className*="notranslate"]');
      if (logo && logo.textContent !== 'Helperr') {
        logo.textContent = 'Helperr';
      }
    });

    const logo = document.querySelector('h1[className*="notranslate"]');
    if (logo) {
      observer.observe(logo, { 
        childList: true, 
        characterData: true, 
        subtree: true 
      });
    }

    return () => observer.disconnect();
  }, []);


  // Protect Helperr logo from translation
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const logo = document.querySelector('h1[className*="notranslate"]');
      if (logo && logo.textContent !== 'Helperr') {
        logo.textContent = 'Helperr';
      }
    });

    const logo = document.querySelector('h1[className*="notranslate"]');
    if (logo) {
      observer.observe(logo, { 
        childList: true, 
        characterData: true, 
        subtree: true 
      });
    }

    return () => observer.disconnect();
  }, []);


  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' }
  ];

    
  const getFlag = (langCode) => {
    const flagMap = {
      'en': '🇬🇧', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
      'pt': '🇵🇹', 'nl': '🇳🇱', 'ru': '🇷🇺', 'zh': '🇨🇳', 'ja': '🇯🇵',
      'ko': '🇰🇷', 'ar': '🇸🇦', 'hi': '🇮🇳', 'th': '🇹🇭', 'vi': '🇻🇳',
      'id': '🇮🇩', 'ms': '🇲🇾', 'tl': '🇵🇭', 'tr': '🇹🇷', 'pl': '🇵🇱',
      'uk': '🇺🇦', 'cs': '🇨🇿', 'hu': '🇭🇺', 'ro': '🇷🇴', 'el': '🇬🇷',
      'sv': '🇸🇪', 'no': '🇳🇴', 'da': '🇩🇰', 'fi': '🇫🇮', 'he': '🇮🇱', 'fa': '🇮🇷'
    };
    return flagMap[langCode] || '🇬🇧';
  };

  const translatePage = (langCode) => {
    // localStorage already saved in onClick
    // Load Google Translate script if not already loaded
    if (!window.googleTranslateElementInit) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
      
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google_translate_element'
        );
      };
    }
    
    // Trigger translation with retry logic
    const attemptTranslation = (attempts = 0) => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
        
        // Restore Helperr text
        setTimeout(() => {
          const helperrElement = document.querySelector('h1[className*="notranslate"]');
          if (helperrElement && helperrElement.textContent !== 'Helperr') {
            helperrElement.textContent = 'Helperr';
          }
          }, 1500);
      } else if (attempts < 5) {
        // Retry if not loaded yet
        setTimeout(() => attemptTranslation(attempts + 1), 500);
      } else {
        console.error('Google Translate failed to load');
        }
    };
    
    setTimeout(() => attemptTranslation(), 1000);
  };

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

  // Native App: KEIN Header (BottomNav ersetzt ihn)
  if (isNativeApp) return null;

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
            className="notranslate"
            translate="no"
            style={{
              ...styles.logo,
             ...(transparent ? styles.logoTransparent : {})
            }}
          >
            Helperr
          </h1>

          {!isMobile && (
            <nav style={styles.nav}>
              {authLoading ? null : user ? (
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
                    {messagesBadge > 0 && (
                      <span style={{
                        marginLeft: 6,
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: 999,
                        minWidth: 18,
                        height: 18,
                        padding: '0 5px',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.2px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Outfit", sans-serif'
                      }}>
                        {messagesBadge > 9 ? "9+" : messagesBadge}
                      </span>
                    )}
                  </button>
                  <button onClick={() => window.navigateTo('bookings')} style={{
                    ...styles.navBtn,
                   ...(transparent ? styles.navBtnTransparent : {})
                  }}>
                    My Bookings
                    {myBookingsBadge > 0 && (
                      <span style={{
                        marginLeft: 6,
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: 999,
                        minWidth: 18,
                        height: 18,
                        padding: '0 5px',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.2px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Outfit", sans-serif'
                      }}>
                        {myBookingsBadge > 9 ? "9+" : myBookingsBadge}
                      </span>
                    )}
                  </button>
                  {hasProviderProfile && (
                    <button onClick={() => window.navigateTo('provider-bookings')} style={{
                      ...styles.navBtn,
                     ...(transparent ? styles.navBtnTransparent : {})
                    }}>
                      Expert Bookings
                      {providerBookingsBadge > 0 && (
                        <span style={{
                          marginLeft: 6,
                          background: '#ef4444',
                          color: 'white',
                          borderRadius: 999,
                          minWidth: 18,
                          height: 18,
                          padding: '0 5px',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.2px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Outfit", sans-serif'
                        }}>
                          {providerBookingsBadge > 9 ? "9+" : providerBookingsBadge}
                        </span>
                      )}
                    </button>
                  )}
                  
                  {/* Language Selector */}
                  <div style={{ position: 'relative' }}>
                    <button 
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      style={{
                        ...styles.navBtn,
                        ...(transparent ? styles.navBtnTransparent : {}),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {getFlag(currentLanguage)} {currentLanguage.toUpperCase()}
                    </button>

                    {showLanguageDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: 8,
                        background: 'white',
                        borderRadius: 12,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        minWidth: 200,
                        maxHeight: 400,
                        overflowY: 'auto',
                        zIndex: 1000
                      }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>
                          Select Language
                        </div>
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              // CRITICAL: Save to localStorage FIRST before translation
                              localStorage.setItem('selectedLanguage', lang.code);
                              setCurrentLanguage(lang.code);
                              setShowLanguageDropdown(false);
                              
                              // Give time for localStorage to save, then translate
                              setTimeout(() => translatePage(lang.code), 200);
                            }}
                            style={{
                              width: '100%',
                              padding: '10px 16px',
                              border: 'none',
                              background: currentLanguage === lang.code ? '#f0fdf4' : 'transparent',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              fontSize: 14,
                              color: currentLanguage === lang.code ? '#065f46' : '#374151',
                              fontWeight: currentLanguage === lang.code ? 600 : 400
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                            onMouseLeave={(e) => e.target.style.background = currentLanguage === lang.code ? '#f0fdf4' : 'transparent'}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

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
                        {hasProviderProfile ? (
                          <>
                            <button 
                              onClick={() => { setShowDropdown(false); window.navigateTo('edit-profile'); }}
                              style={styles.dropdownItem}
                            >
                              Edit Profile
                            </button>
                            <button 
                              onClick={() => { setShowDropdown(false); window.navigateTo('my-payments'); }}
                              style={styles.dropdownItem}
                            >
                              Payment
                            </button>
                            <button 
                              onClick={() => { setShowDropdown(false); window.navigateTo('dashboard'); }}
                              style={styles.dropdownItem}
                            >
                              Dashboard
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => { setShowDropdown(false); window.navigateTo('edit-profile'); }}
                            style={styles.dropdownItem}
                          >
                            Become an Expert
                          </button>
                        )}
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
                  <button onClick={() => window.navigateTo('signup')} style={styles.btnPrimary}>
                    Sign Up
                  </button>
                  
                  {/* Language Selector */}
                  <div style={{ position: 'relative' }}>
                    <button 
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      style={{
                        ...styles.navBtn,
                        ...(transparent ? styles.navBtnTransparent : {}),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {getFlag(currentLanguage)} {currentLanguage.toUpperCase()}
                    </button>

                    {showLanguageDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: 8,
                        background: 'white',
                        borderRadius: 12,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        minWidth: 200,
                        maxHeight: 400,
                        overflowY: 'auto',
                        zIndex: 1000,
                        padding: 8
                      }}>
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              localStorage.setItem('selectedLanguage', lang.code);
                              setCurrentLanguage(lang.code);
                              setShowLanguageDropdown(false);
                              setTimeout(() => translatePage(lang.code), 200);
                            }}
                            style={{
                              width: '100%',
                              padding: '10px 16px',
                              border: 'none',
                              background: currentLanguage === lang.code ? '#f0fdf4' : 'transparent',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              fontSize: 14,
                              color: currentLanguage === lang.code ? '#065f46' : '#374151',
                              fontWeight: currentLanguage === lang.code ? 600 : 400
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                            onMouseLeave={(e) => e.target.style.background = currentLanguage === lang.code ? '#f0fdf4' : 'transparent'}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </nav>
          )}
        </div>
            {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      </header>

      {isMobile && showMobileMenu && (
        <div style={styles.mobileMenuOverlay} onClick={closeMobileMenu}>
          <div style={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div style={styles.mobileMenuHeader}>
              <h2 style={styles.mobileMenuTitle}>Menu</h2>
              <button onClick={closeMobileMenu} style={styles.mobileMenuClose}>×</button>
            </div>
            
            <div style={styles.mobileMenuItems}>
              {authLoading ? null : user ? (
                <>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('home'); }} style={styles.mobileMenuItem}>
                Home
              </button>
              <button onClick={() => { closeMobileMenu(); window.navigateTo('messages'); }} style={styles.mobileMenuItem}>
                Messages
                {messagesBadge > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: 999,
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.2px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Outfit", sans-serif'
                  }}>
                    {messagesBadge > 9 ? "9+" : messagesBadge}
                  </span>
                )}
              </button>
              <button onClick={() => { closeMobileMenu(); window.navigateTo('bookings'); }} style={styles.mobileMenuItem}>
              My Bookings
              {myBookingsBadge > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  marginRight: 16,
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: 999,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Outfit", sans-serif'
                }}>
                  {myBookingsBadge > 9 ? "9+" : myBookingsBadge}
                </span>
              )}
            </button>
              {hasProviderProfile && (
                <button onClick={() => { closeMobileMenu(); window.navigateTo('provider-bookings'); }} style={styles.mobileMenuItem}>
                Expert Bookings
                {providerBookingsBadge > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    marginRight: 16,
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: 999,
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.2px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Outfit", sans-serif'
                  }}>
                    {providerBookingsBadge > 9 ? "9+" : providerBookingsBadge}
                  </span>
                )}
              </button>
              )}
              {hasProviderProfile ? (
                <>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('edit-profile'); }} style={styles.mobileMenuItem}>
                    Edit Profile
                  </button>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('my-payments'); }} style={styles.mobileMenuItem}>
                    Payment
                  </button>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('dashboard'); }} style={styles.mobileMenuItem}>
                    Dashboard
                  </button>
                </>
              ) : (
                <button onClick={() => { closeMobileMenu(); window.navigateTo('edit-profile'); }} style={styles.mobileMenuItem}>
                  Become an Expert
                </button>
              )}
              <button 
                onClick={() => setShowMobileLanguageDropdown(!showMobileLanguageDropdown)} 
                style={{
                  ...styles.mobileMenuItem,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {getFlag(currentLanguage)} {currentLanguage.toUpperCase()}
              </button>

              {showMobileLanguageDropdown && (
                <div style={{
                  maxHeight: 300,
                  overflowY: 'auto',
                  background: '#f9fafb',
                  borderRadius: 8,
                  margin: '8px 0'
                }}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        localStorage.setItem('selectedLanguage', lang.code);
                        setCurrentLanguage(lang.code);
                        setShowMobileLanguageDropdown(false);
                        setShowMobileMenu(false);
                        setTimeout(() => translatePage(lang.code), 200);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: currentLanguage === lang.code ? '#e0f2fe' : 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        color: currentLanguage === lang.code ? '#0369a1' : '#374151',
                        fontWeight: currentLanguage === lang.code ? 600 : 400
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <button onClick={handleLogout} style={styles.mobileMenuLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('login'); }} style={styles.mobileMenuItem}>
                    Login
                  </button>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('signup'); }} style={styles.mobileMenuItem}>
                    Sign Up
                  </button>
                  
                  
                  <button 
                    onClick={() => setShowMobileLanguageDropdown(!showMobileLanguageDropdown)} 
                    style={{
                      ...styles.mobileMenuItem,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {getFlag(currentLanguage)} {currentLanguage.toUpperCase()}
                  </button>

                  {showMobileLanguageDropdown && (
                    <div style={{
                      maxHeight: 300,
                      overflowY: 'auto',
                      background: '#f9fafb',
                      borderRadius: 8,
                      margin: '8px 0'
                    }}>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            localStorage.setItem('selectedLanguage', lang.code);
                            setCurrentLanguage(lang.code);
                            setShowMobileLanguageDropdown(false);
                            setShowMobileMenu(false);
                            setTimeout(() => translatePage(lang.code), 200);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            background: currentLanguage === lang.code ? '#e0f2fe' : 'transparent',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 14,
                            color: currentLanguage === lang.code ? '#0369a1' : '#374151',
                            fontWeight: currentLanguage === lang.code ? 600 : 400
                          }}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Hide Google Translate toolbar
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-balloon-frame { display: none !important; }
      body { top: 0 !important; }
      .skiptranslate { display: none !important; }
    `;
    if (!document.querySelector('style[data-translate-hide]')) {
      style.setAttribute('data-translate-hide', 'true');
      document.head.appendChild(style);
    }
  }

  const isNativeApp = Capacitor.isNativePlatform();

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
    fontFamily: '"Outfit", sans-serif',
    ...(isNativeApp ? { paddingTop: 'calc(env(safe-area-inset-top) - 6px)' } : {})
  },
  headerTransparentTop: {
    background: 'transparent',
    borderBottom: 'none',
    boxShadow: 'none'
  },
  headerTransparentScrolled: {
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
    height: isNativeApp ? 32 : 70,
    marginTop: 0,
    marginBottom: isNativeApp ? 12 : 0,
    gap: 12
  },
  hamburgerBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
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
  },
  mobileMenuOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    display: 'flex',
    ...(isNativeApp ? { paddingTop: 'env(safe-area-inset-top)' } : {})
  },
  mobileMenu: {
    background: 'white',
    width: '80%',
    maxWidth: 320,
    height: '100%',
    boxShadow: '2px 0 12px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column'
  },
  mobileMenuHeader: {
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mobileMenuTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: 'white'
  },
  mobileMenuClose: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: 32,
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    width: 32,
    height: 32,
    lineHeight: 1
  },
  mobileMenuItems: {
    padding: '12px 0',
    flex: 1,
    overflowY: 'auto'
  },
  mobileMenuItem: {
    display: 'block',
    width: '100%',
    padding: '16px 24px',
    fontSize: 14,
    fontWeight: 400,
    color: '#374151',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #f3f4f6',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    transition: 'background 0.2s'
  },
  menuDivider: {
    height: 8,
    background: '#f9fafb',
    margin: '8px 0'
  },
  mobileMenuLogout: {
    display: 'block',
    width: '100%',
    padding: '16px 24px',
    fontSize: 16,
    fontWeight: 600,
    color: '#dc2626',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif'
  }
};

export default Header;
