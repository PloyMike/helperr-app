const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find the hero section and replace
const heroPattern = /<div style=\{\{ \n\s+background: 'linear-gradient\(135deg, #667eea 0%, #764ba2 100%\)',[\s\S]*?<\/div>\s+<\/div>/;

const newHero = `<div style={{ 
        background: 'linear-gradient(135deg, #8B9B6B 0%, #6B8E23 50%, #556B2F 100%)',
        color: '#FFF8DC',
        padding: '100px 20px 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,248,220,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,122,95,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Main Heading */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🤝</div>
            <h1 style={{ 
              fontSize: 56, 
              fontWeight: 800, 
              marginBottom: 20, 
              fontFamily: '"Quicksand", sans-serif',
              letterSpacing: '-1px',
              textShadow: '0 4px 12px rgba(0,0,0,0.1)',
              color: '#FFF8DC'
            }}>
              Helperr
            </h1>
            <p style={{ 
              fontSize: 24, 
              marginBottom: 50, 
              opacity: 0.95,
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 500,
              maxWidth: 600,
              margin: '0 auto 50px',
              lineHeight: 1.6
            }}>
              Verbinde dich mit vertrauenswürdigen Helfern in deiner Nähe
            </p>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <button 
              onClick={() => window.navigateTo('register')}
              style={{
                padding: '18px 45px',
                fontSize: 18,
                fontWeight: 700,
                backgroundColor: '#E07A5F',
                color: 'white',
                border: 'none',
                borderRadius: 30,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(224, 122, 95, 0.4)',
                transition: 'all 0.3s ease',
                fontFamily: '"Quicksand", sans-serif'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 12px 35px rgba(224, 122, 95, 0.5)';
                e.target.style.backgroundColor = '#D4A373';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(224, 122, 95, 0.4)';
                e.target.style.backgroundColor = '#E07A5F';
              }}
            >
              🌱 Starte als Anbieter
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ maxWidth: 650, margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="Suche nach Service, Name oder Stadt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 60px 18px 24px',
                fontSize: 16,
                border: '2px solid rgba(255, 248, 220, 0.3)',
                borderRadius: 30,
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                outline: 'none',
                backgroundColor: 'rgba(255, 248, 220, 0.95)',
                color: '#556B2F',
                fontFamily: '"Quicksand", sans-serif',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#FFF8DC';
                e.target.style.borderColor = '#E07A5F';
                e.target.style.boxShadow = '0 8px 35px rgba(224, 122, 95, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 248, 220, 0.95)';
                e.target.style.borderColor = 'rgba(255, 248, 220, 0.3)';
                e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
            />
            <div style={{
              position: 'absolute',
              right: 24,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 22
            }}>
              🔍
            </div>
          </div>

          {userLocation && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: 24, 
              fontSize: 15, 
              opacity: 0.9,
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 500
            }}>
              📍 Dein Standort wurde erkannt
            </div>
          )}

          {/* Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </div>
      </div>`;

// Try to find and replace
if (content.match(heroPattern)) {
  content = content.replace(heroPattern, newHero);
  fs.writeFileSync('src/Helperr.jsx', content);
  console.log('✅ Hero section updated!');
} else {
  console.log('❌ Pattern not found - will need manual update');
}
