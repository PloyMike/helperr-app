const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Füge Stern-Emoji zurück zu Rating Badge
content = content.replace(
  /{profile\.rating>0&&<span className="badge badge-rating">{profile\.rating}<\/span>}/g,
  `{profile.rating>0&&<span className="badge badge-rating">⭐ {profile.rating}</span>}`
);

// Verschiebe About-Box nach unten (vor Chat-Section)
// Zuerst: Entferne About-Box aus content-grid
content = content.replace(
  /<div className="about-box">[\s\S]*?<\/div>\s*<\/div>/,
  '</div>'
);

// Dann: Füge About-Box vor Chat-Section ein
content = content.replace(
  /<div className="chat-section">/,
  `<div className="about-section">
            <div className="about-box">
              <h2 className="section-title">Über mich</h2>
              <p className="about-text">{profile.bio||'Keine Beschreibung.'}</p>
              
              <div className="stats">
                <h3 className="stats-title">Statistiken</h3>
                <p className="stat-item">👁️ {viewCount} Profilaufrufe</p>
                {profile.review_count>0&&<p className="stat-item">💬 {profile.review_count} Bewertungen</p>}
              </div>
            </div>
          </div>

          <div className="chat-section">`
);

// Füge CSS für About-Section hinzu
content = content.replace(
  /\.chat-section \{/,
  `.about-section {
          max-width: 1200px;
          margin: 0 auto 24px;
          padding: 0 20px;
        }
        .chat-section {`
);

// Mobile styles für About-Section
content = content.replace(
  /\.chat-section \{\s*padding: 0 16px !important;\s*margin-bottom: 24px !important;\s*\}/,
  `.about-section {
            padding: 0 16px !important;
            margin-bottom: 20px !important;
          }
          .chat-section {
            padding: 0 16px !important;
            margin-bottom: 24px !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Profile restructured!');
