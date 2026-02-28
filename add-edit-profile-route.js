const fs = require('fs');
let content = fs.readFileSync('src/index.js', 'utf8');

// Import hinzufügen
if (!content.includes('EditProfilePage')) {
  content = content.replace(
    /import AdminDashboard from '\.\/AdminDashboard';/,
    `import AdminDashboard from './AdminDashboard';\nimport EditProfilePage from './EditProfilePage';`
  );
}

// Route hinzufügen
if (!content.includes("case 'edit-profile'")) {
  content = content.replace(
    /case 'admin':\s*return <AdminDashboard \/>;/,
    `case 'admin':\n      return <AdminDashboard />;\n    case 'edit-profile':\n      return <EditProfilePage />;`
  );
}

fs.writeFileSync('src/index.js', content);
console.log('✅ Edit profile route added!');
