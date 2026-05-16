const fs = require('fs');
let content = fs.readFileSync('src/Footer.jsx', 'utf8');

// Füge extra Styling für die erste Spalte hinzu (Unternehmen)
content = content.replace(
  /\.footer-columns \{\s*display: grid !important;\s*grid-template-columns: 1fr 1fr !important;\s*gap: 16px !important;\s*\}/,
  `.footer-columns {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
          /* Unternehmen Spalte - Links nach rechts */
          .footer-columns .footer-section:first-child .footer-link {
            padding-left: 20px !important;
          }`
);

fs.writeFileSync('src/Footer.jsx', content);
console.log('✅ Footer links shifted right!');
