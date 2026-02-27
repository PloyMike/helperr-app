const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Entferne Zur Karte Button aus Hero
content = content.replace(
  /<button onClick=\{\(\)=>document\.getElementById\('map-section'\)\?\.scrollIntoView\(\{behavior:'smooth'\}\)\} className="map-button">Zur Karte<\/button>/,
  ''
);

// Entferne map-button CSS
content = content.replace(
  /\.map-button \{[\s\S]*?\}/,
  ''
);

// Update mobile styles - noch kompakter
content = content.replace(
  /\.profile-card \{\s*padding: 16px !important;\s*\}/,
  `.profile-card {
            padding: 12px !important;
          }`
);

content = content.replace(
  /\.profile-image, \.profile-avatar \{\s*width: 60px !important;\s*height: 60px !important;\s*margin-bottom: 12px !important;\s*font-size: 28px !important;\s*\}/,
  `.profile-image, .profile-avatar {
            width: 50px !important;
            height: 50px !important;
            margin-bottom: 10px !important;
            font-size: 24px !important;
            border-width: 2px !important;
          }`
);

content = content.replace(
  /\.profile-name \{\s*font-size: 18px !important;\s*margin-bottom: 6px !important;\s*\}/,
  `.profile-name {
            font-size: 16px !important;
            margin-bottom: 4px !important;
          }`
);

content = content.replace(
  /\.profile-job \{\s*font-size: 14px !important;\s*margin-bottom: 8px !important;\s*\}/,
  `.profile-job {
            font-size: 13px !important;
            margin-bottom: 6px !important;
          }`
);

content = content.replace(
  /\.profile-location \{\s*font-size: 13px !important;\s*margin-bottom: 10px !important;\s*\}/,
  `.profile-location {
            font-size: 12px !important;
            margin-bottom: 8px !important;
          }`
);

content = content.replace(
  /\.profile-price \{\s*font-size: 18px !important;\s*margin-bottom: 10px !important;\s*\}/,
  `.profile-price {
            font-size: 16px !important;
            margin-bottom: 8px !important;
          }`
);

content = content.replace(
  /\.profile-bio \{\s*font-size: 13px !important;\s*margin-bottom: 12px !important;\s*-webkit-line-clamp: 2 !important;\s*\}/,
  `.profile-bio {
            font-size: 12px !important;
            margin-bottom: 10px !important;
            line-height: 1.5 !important;
            -webkit-line-clamp: 2 !important;
          }`
);

content = content.replace(
  /\.profile-badges \{\s*gap: 6px !important;\s*margin-bottom: 12px !important;\s*\}/,
  `.profile-badges {
            gap: 4px !important;
            margin-bottom: 10px !important;
          }`
);

content = content.replace(
  /\.badge \{\s*padding: 5px 10px !important;\s*font-size: 11px !important;\s*\}/,
  `.badge {
            padding: 4px 8px !important;
            font-size: 10px !important;
          }`
);

content = content.replace(
  /\.profile-view-button \{\s*padding: 12px !important;\s*font-size: 14px !important;\s*\}/,
  `.profile-view-button {
            padding: 10px !important;
            font-size: 13px !important;
          }`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Cards minimized & button removed!');
