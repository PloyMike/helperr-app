const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Entferne Stats aus about-box
content = content.replace(
  /<div className="stats">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div className="price-section">/,
  `</div>
        </div>

        <div className="price-section">`
);

// Füge Stats nach Reviews ein
content = content.replace(
  /<div className="reviews">\s*<ReviewSection profileId=\{profile\.id\} profileName=\{profile\.name\}\/>\s*<\/div>/,
  `<div className="reviews">
          <ReviewSection profileId={profile.id} profileName={profile.name}/>
        </div>

        <div className="stats-section">
          <h2 className="stats-title">Statistiken</h2>
          <p className="stat-item">👁️ {viewCount} Profilaufrufe</p>
          {profile.review_count>0&&<p className="stat-item">💬 {profile.review_count} Bewertungen</p>}
        </div>`
);

// Füge CSS für stats-section hinzu
content = content.replace(
  /\.reviews \{/,
  `.stats-section {
          max-width: 1200px;
          margin: 0 auto 60px;
          padding: 32px 0;
          border-top: 1px solid #E5E7EB;
        }
        .reviews {`
);

// Update mobile styles für stats-section
content = content.replace(
  /\.chat-box-bottom \{\s*padding: 0 !important;\s*\}/,
  `.chat-box-bottom {
            padding: 0 !important;
          }
          .stats-section {
            padding: 24px 0 !important;
            text-align: center !important;
            margin-bottom: 40px !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Stats moved below reviews!');
