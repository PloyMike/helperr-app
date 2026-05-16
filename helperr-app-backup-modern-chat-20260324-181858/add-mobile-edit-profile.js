const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Mobile CSS vor dem letzten </div> einfügen
const mobileCSS = `
      <style>{\`
        @media (max-width: 768px) {
          h1 { font-size: 28px !important; }
          p { font-size: 15px !important; }
          form { padding: 28px 20px !important; }
          input, textarea { font-size: 14px !important; padding: 12px 16px !important; }
          label { font-size: 14px !important; }
          button[type="submit"] { padding: 16px !important; font-size: 16px !important; }
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      \`}</style>`;

// Vor dem letzten schließenden </div> einfügen
content = content.replace(
  /([\s]*<\/div>[\s]*\);[\s]*\}[\s]*export default EditProfilePage;)/,
  `${mobileCSS}\n$1`
);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Mobile CSS added to EditProfilePage!');
