const fs = require('fs');
let content = fs.readFileSync('src/ProviderDashboard.jsx', 'utf8');

// Change editBtn style to be responsive
content = content.replace(
  /editBtn: \{ \s*padding: '12px 24px',/,
  `editBtn: { 
    padding: '12px 16px',`
);

// Also update the button to use window width check
content = content.replace(
  /<button\s*onClick=\{\(\) => window\.navigateTo\('edit-profile'\)\}\s*style=\{styles\.editBtn\}\s*>/,
  `<button 
            onClick={() => window.navigateTo('edit-profile')} 
            style={{
              ...styles.editBtn,
              padding: window.innerWidth <= 768 ? '10px 12px' : '12px 24px',
              fontSize: window.innerWidth <= 768 ? 14 : 15
            }}
          >`
);

fs.writeFileSync('src/ProviderDashboard.jsx', content);
console.log('✅ Edit Profile button now narrower on mobile!');
