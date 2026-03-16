const fs = require('fs');
let content = fs.readFileSync('src/AGB.jsx', 'utf8');

// Ersetze "(Ploy TIBOR)" mit "Helperr Platform"
content = content.replace(/\(Ploy TIBOR\)/g, '(Helperr Platform)');

// Ersetze Kontaktbereich
content = content.replace(
  /<strong>Kontakt:<\/strong><br \/>[\s\S]*?Ploy TIBOR<br \/>[\s\S]*?E-Mail:/,
  '<strong>Kontakt:</strong><br />\n            Helperr Platform<br />\n            E-Mail:'
);

fs.writeFileSync('src/AGB.jsx', content);
console.log('✅ AGB anonymisiert - Name entfernt!');
