const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Avatar Box noch kompakter - minimales Padding
content = content.replace(
  /\.avatar-box \{\s*width: 100% !important;\s*min-width: auto !important;\s*padding: 12px !important;\s*text-align: center !important;\s*\}/,
  `.avatar-box {
            width: 100% !important;
            min-width: auto !important;
            padding: 8px !important;
            text-align: center !important;
          }`
);

// Avatar noch kleiner
content = content.replace(
  /\.avatar-image, \.avatar-placeholder \{\s*width: 80px !important;\s*height: 80px !important;\s*margin: 0 auto !important;\s*font-size: 36px !important;\s*border-width: 2px !important;\s*\}/,
  `.avatar-image, .avatar-placeholder {
            width: 70px !important;
            height: 70px !important;
            margin: 0 auto !important;
            font-size: 32px !important;
            border-width: 2px !important;
          }`
);

// Info Box - explizit alles zentrieren
content = content.replace(
  /\.info-box \{\s*padding: 20px !important;\s*text-align: center !important;\s*\}\s*\.badges \{\s*justify-content: center !important;\s*\}/,
  `.info-box {
            padding: 16px !important;
            text-align: center !important;
          }
          .profile-name {
            text-align: center !important;
          }
          .profile-job {
            text-align: center !important;
          }
          .profile-location {
            text-align: center !important;
          }
          .badges {
            justify-content: center !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Profile boxes optimized!');
