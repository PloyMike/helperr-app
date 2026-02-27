const fs = require('fs');
let content = fs.readFileSync('src/Footer.jsx', 'utf8');

// Find copyright text and add admin link before it
const copyrightPattern = /(© 2026 Helperr\. Alle Rechte vorbehalten\.)/;

const adminLink = `<div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
            <span 
              onClick={() => window.navigateTo('admin')}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Admin
            </span>
          </div>
          $1`;

if (content.match(copyrightPattern)) {
  content = content.replace(copyrightPattern, adminLink);
  fs.writeFileSync('src/Footer.jsx', content);
  console.log('✅ Admin link added to Footer!');
} else {
  console.log('❌ Could not find copyright text');
}
