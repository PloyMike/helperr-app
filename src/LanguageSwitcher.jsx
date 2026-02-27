import React, { useState } from 'react';

function LanguageSwitcher() {
  const [language, setLanguage] = useState('de');
  const [showMenu, setShowMenu] = useState(false);

  const languages = {
    de: { flag: '🇩🇪', name: 'Deutsch' },
    en: { flag: '🇬🇧', name: 'English' },
    th: { flag: '🇹🇭', name: 'ไทย' },
    fr: { flag: '🇫🇷', name: 'Français' },
    es: { flag: '🇪🇸', name: 'Español' }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: 20
        }}
      >
        {languages[language].flag}
      </button>

      {showMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          marginTop: 8,
          padding: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          {Object.entries(languages).map(([code, { flag, name }]) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code);
                setShowMenu(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 16px',
                border: 'none',
                background: language === code ? '#eff6ff' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 16,
                borderRadius: 4
              }}
            >
              {flag} {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;

