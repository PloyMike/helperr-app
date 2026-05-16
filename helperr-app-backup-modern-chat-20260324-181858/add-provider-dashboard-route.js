const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

// Import hinzufügen
if (!content.includes('ProviderDashboard')) {
  content = content.replace(
    /(import EditProfilePage from '\.\/EditProfilePage';)/,
    `$1\nimport ProviderDashboard from './ProviderDashboard';`
  );
}

// Route hinzufügen
if (!content.includes("'provider-dashboard'")) {
  content = content.replace(
    /(currentView === 'edit-profile' \? \(\s*<EditProfilePage \/>\s*\))/,
    `$1 : currentView === 'provider-dashboard' ? (\n          <ProviderDashboard />\n        )`
  );
}

fs.writeFileSync('src/App.js', content);
console.log('✅ Provider dashboard route added!');
