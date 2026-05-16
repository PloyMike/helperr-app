const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Entferne Preis-Box aus Sidebar
content = content.replace(
  /<div className="price-box">[\s\S]*?<\/div>\s*{profile\.languages/,
  `{profile.languages`
);

// Füge Preis-Box nach About-Section ein (vor Chat-Section)
content = content.replace(
  /<div className="chat-section">/,
  `<div className="price-section">
          <div className="price-box">
            <div className="price-label">PREIS</div>
            <div className="price-amount">{profile.price||'Auf Anfrage'}</div>
            <button onClick={()=>setShowBooking(true)} className="booking-button">Jetzt buchen</button>
            <p className="price-note">Sichere Zahlung über die Plattform</p>
          </div>
        </div>

        <div className="chat-section">`
);

// Füge CSS für price-section hinzu
content = content.replace(
  /\.chat-section \{/,
  `.price-section {
          max-width: 1200px;
          margin: 0 auto 24px;
          padding: 0;
        }
        .chat-section {`
);

// Mobile styles für price-section
content = content.replace(
  /\.chat-section \{\s*padding: 0 !important;\s*margin-bottom: 24px !important;\s*\}/,
  `.price-section {
            padding: 0 !important;
            margin-bottom: 24px !important;
          }
          .chat-section {
            padding: 0 !important;
            margin-bottom: 24px !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Price box moved below stats!');
