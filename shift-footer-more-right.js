const fs = require('fs');
let content = fs.readFileSync('src/Footer.jsx', 'utf8');

// Erhöhe padding auf 45px
content = content.replace(
  /\/\* Unternehmen Spalte - Links nach rechts \*\/\s*\.footer-columns \.footer-section:first-child \.footer-link \{\s*padding-left: 20px !important;\s*\}/,
  `/* Unternehmen Spalte - Links nach rechts */
          .footer-columns .footer-section:first-child .footer-link {
            padding-left: 45px !important;
          }`
);

fs.writeFileSync('src/Footer.jsx', content);
console.log('✅ Footer links shifted more right!');
