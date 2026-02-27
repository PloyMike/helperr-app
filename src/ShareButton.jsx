import React, { useState } from 'react';

function ShareButton({ profile }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://helperr-app-indol.vercel.app/#profile`;
  
  const shareText = `Schau dir ${profile.name} auf Helperr an! ${profile.job} in ${profile.city}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + profileUrl)}`, '_blank');
    setShowMenu(false);
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank');
    setShowMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowMenu(false);
    }, 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'white',
          color: '#667eea',
          border: '2px solid #667eea',
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 12,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#f7fafc';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'white';
        }}
      >
        📱 Profil teilen
      </button>

      {showMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 100,
          marginTop: 4,
          overflow: 'hidden'
        }}>
          <button
            onClick={handleWhatsApp}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'white',
              border: 'none',
              borderBottom: '1px solid #e2e8f0',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: '#2d3748',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f7fafc'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
          >
            <span style={{ fontSize: 20 }}>💬</span>
            WhatsApp
          </button>

          <button
            onClick={handleFacebook}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'white',
              border: 'none',
              borderBottom: '1px solid #e2e8f0',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: '#2d3748',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f7fafc'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
          >
            <span style={{ fontSize: 20 }}>👍</span>
            Facebook
          </button>

          <button
            onClick={handleCopyLink}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: copied ? '#48bb78' : 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: copied ? 'white' : '#2d3748',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: 20 }}>{copied ? '✓' : '🔗'}</span>
            {copied ? 'Link kopiert!' : 'Link kopieren'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ShareButton;
