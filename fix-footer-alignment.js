const fs = require('fs');
let content = fs.readFileSync('src/Footer.jsx', 'utf8');

// Update footer-link styling für perfekte Ausrichtung
content = content.replace(
  /\.footer-link \{\s*background: none;\s*border: none;\s*padding: 0;\s*color: #9CA3AF;\s*text-decoration: none;\s*font-size: 14px;\s*font-family: "Outfit", sans-serif;\s*cursor: pointer;\s*transition: color 0\.2s;\s*text-align: left;\s*\}/,
  `.footer-link {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          color: #9CA3AF;
          text-decoration: none;
          font-size: 14px;
          font-family: "Outfit", sans-serif;
          cursor: pointer;
          transition: color 0.2s;
          text-align: left;
          display: block;
          width: 100%;
        }`
);

// Mobile footer-link auch updaten
content = content.replace(
  /\.footer-link \{\s*font-size: 13px !important;\s*margin-bottom: 4px !important;\s*\}/,
  `.footer-link {
            font-size: 13px !important;
            margin-bottom: 4px !important;
            padding: 0 !important;
            text-align: left !important;
            display: block !important;
          }`
);

fs.writeFileSync('src/Footer.jsx', content);
console.log('✅ Footer links aligned!');
