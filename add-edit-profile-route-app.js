const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

// Import hinzufügen
if (!content.includes('EditProfilePage')) {
  content = content.replace(
    /(import MessagesPage from '\.\/MessagesPage';)/,
    `$1\nimport EditProfilePage from './EditProfilePage';`
  );
}

// Route hinzufügen - nach messages, vor impressum
if (!content.includes("currentView === 'edit-profile'")) {
  content = content.replace(
    /(currentView === 'messages' \? \(\s*<MessagesPage \/>\s*\))/,
    `$1 : currentView === 'edit-profile' ? (\n          <EditProfilePage />\n        )`
  );
}

fs.writeFileSync('src/App.js', content);
console.log('✅ Route added to App.js!');
