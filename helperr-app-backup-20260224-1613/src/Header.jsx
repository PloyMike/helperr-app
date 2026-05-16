import React, { useState, useEffect } from 'react';

function Header() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    updateFavCount();
    window.addEventListener('storage', updateFavCount);
    const interval = setInterval(updateFavCount, 1000);
    
    return () => {
      window.removeEventListener('storage', updateFavCount);
      clearInterval(interval);
    };
  }, []);

  const updateFavCount = () => {
    const saved = localStorage.getItem('helperr_favorites');
    if (saved) {
      const favorites = JSON.parse(saved);
      setFavCount(favorites.length);
    } else {
      setFavCount(0);
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 70,
      background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      boxShadow: '0 4px 20px rgba(20, 184, 166, 0.2)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div 
        onClick={() => window.navigateTo('home')}
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: 'white',
          cursor: 'pointer',
          userSelect: 'none',
          letterSpacing: '-0.5px',
          fontFamily: '"Outfit", sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}
      >
        <span style={{ fontSize: 32 }}>🤝</span>
        Helperr
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button
          onClick={() => window.navigateTo('bookings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: '"Outfit", sans-serif',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: 18 }}>📋</span>
          <span>Buchungen</span>
        </button>

        <button
          onClick={() => window.navigateTo('favorites')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: '"Outfit", sans-serif',
            position: 'relative',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: 18 }}>🤍</span>
          <span>Favoriten</span>
          {favCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -5,
              right: -5,
              backgroundColor: '#F97316',
              color: 'white',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.4)'
            }}>
              {favCount}
            </span>
          )}
        </button>

        <button
          onClick={() => window.navigateTo('register')}
          style={{
            padding: '12px 28px',
            backgroundColor: '#F97316',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: '"Outfit", sans-serif',
            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)';
            e.target.style.backgroundColor = '#EA580C';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.3)';
            e.target.style.backgroundColor = '#F97316';
          }}
        >
          + Anbieter werden
        </button>
      </div>
    </header>
  );
}

export default Header;
