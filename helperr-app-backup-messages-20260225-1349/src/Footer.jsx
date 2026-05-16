import React from 'react';

function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
      color: 'white',
      padding: '60px 20px 30px',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 40,
          marginBottom: 50
        }}>
          <div>
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ fontSize: 28 }}>🤝</span>
              Helperr
            </div>
            <p style={{
              fontSize: 15,
              lineHeight: 1.7,
              opacity: 0.9,
              fontWeight: 400
            }}>
              Die Plattform für lokale Services. Vertrauenswürdig, einfach, persönlich.
            </p>
          </div>

          <div>
            <h3 style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Rechtliches
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.navigateTo('impressum');
                }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  opacity: 0.9,
                  fontSize: 14,
                  fontWeight: 400,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.paddingLeft = '8px';
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.paddingLeft = '0';
                }}
              >
                Impressum
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.navigateTo('datenschutz');
                }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  opacity: 0.9,
                  fontSize: 14,
                  fontWeight: 400,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.paddingLeft = '8px';
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.paddingLeft = '0';
                }}
              >
                Datenschutz
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.navigateTo('agb');
                }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  opacity: 0.9,
                  fontSize: 14,
                  fontWeight: 400,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.paddingLeft = '8px';
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.paddingLeft = '0';
                }}
              >
                AGB
              </a>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Platform
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.navigateTo('register');
                }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  opacity: 0.9,
                  fontSize: 14,
                  fontWeight: 400,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.paddingLeft = '8px';
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.paddingLeft = '0';
                }}
              >
                Anbieter werden
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.navigateTo('admin');
                }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  opacity: 0.7,
                  fontSize: 12,
                  fontWeight: 400,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = '0.7';
                }}
              >
                Admin
              </a>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: 30,
          textAlign: 'center',
          fontSize: 14,
          opacity: 0.8,
          fontWeight: 400
        }}>
          © 2026 Helperr. Made with 🤝 for better connections.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
