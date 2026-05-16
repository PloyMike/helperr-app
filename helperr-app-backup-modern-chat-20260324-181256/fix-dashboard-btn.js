const fs = require('fs');
let content = fs.readFileSync('src/ProviderDashboard.jsx', 'utf8');

// Ändere Button Background von türkis zu grün
content = content.replace(
  /background: 'linear-gradient\(135deg, #14B8A6 0%, #0D9488 100%\)'/g,
  "background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)'"
);

// Ändere Button Shadow von türkis zu grün
content = content.replace(
  /boxShadow: '0 4px 12px rgba\(20,184,166,0\.3\)'/g,
  "boxShadow: '0 4px 12px rgba(6,95,70,0.3)'"
);

fs.writeFileSync('src/ProviderDashboard.jsx', content);
console.log('✅ Dashboard Create Profile button updated to hero green!');
