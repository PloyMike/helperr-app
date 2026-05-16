const fs = require('fs');
let content = fs.readFileSync('src/index.js', 'utf8');

// Import hinzufügen WENN nicht vorhanden
if (!content.includes('EditProfilePage')) {
  // Nach AdminDashboard import
  content = content.replace(
    /(import AdminDashboard from '\.\/AdminDashboard';)/,
    `$1\nimport EditProfilePage from './EditProfilePage';`
  );
}

// Route hinzufügen WENN nicht vorhanden
if (!content.includes("case 'edit-profile'")) {
  // Nach admin case
  content = content.replace(
    /(case 'admin':\s*return <AdminDashboard \/>;)/,
    `$1\n    case 'edit-profile':\n      return <EditProfilePage />;`
  );
}

fs.writeFileSync('src/index.js', content);
console.log('✅ Route added!');
