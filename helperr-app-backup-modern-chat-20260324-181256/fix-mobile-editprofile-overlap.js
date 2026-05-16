const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Entferne altes Mobile CSS falls vorhanden
content = content.replace(/<style>\{`[\s\S]*?@media \(max-width: 768px\)[\s\S]*?\`\}<\/style>/g, '');

// Neues verbessertes Mobile CSS
const newMobileCSS = `
      <style>{\`
        @media (max-width: 768px) {
          /* Hero Section kleiner */
          div[style*="padding: 60px 20px"] {
            padding: 40px 16px !important;
          }
          h1 {
            font-size: 28px !important;
            margin-bottom: 8px !important;
          }
          div[style*="fontSize:18"] {
            font-size: 15px !important;
          }
          
          /* Form Container - KEIN negatives Margin auf Mobile */
          div[style*="margin: -40px auto"] {
            margin: 20px auto 60px !important;
            padding: 0 16px !important;
          }
          
          /* Form selbst */
          form {
            padding: 28px 20px !important;
          }
          
          /* Inputs & Labels */
          input, textarea {
            font-size: 14px !important;
            padding: 12px 16px !important;
          }
          label {
            font-size: 14px !important;
          }
          
          /* Submit Button */
          button[type="submit"] {
            padding: 16px !important;
            font-size: 16px !important;
          }
          
          /* Grid zu Single Column */
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      \`}</style>`;

// Vor dem letzten </div> einfügen
content = content.replace(
  /([\s]*<\/div>[\s]*\);[\s]*\}[\s]*export default EditProfilePage;)/,
  `${newMobileCSS}\n$1`
);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Mobile overlap fixed!');
