const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

// Remove imports for deleted files
content = content.replace(/import RegisterPage from.*?;?\n/g, '');
content = content.replace(/import Favorites from.*?;?\n/g, '');
content = content.replace(/import AdminDashboard from.*?;?\n/g, '');

// Comment out routes for deleted pages
content = content.replace(
  /currentView === 'register'[\s\S]*?<RegisterPage/g,
  "/* currentView === 'register' ? <RegisterPage"
);

content = content.replace(
  /currentView === 'favorites'[\s\S]*?<Favorites/g,
  "/* currentView === 'favorites' ? <Favorites"
);

content = content.replace(
  /currentView === 'admin'[\s\S]*?<AdminDashboard/g,
  "/* currentView === 'admin' ? <AdminDashboard"
);

// Add closing comment before next condition
content = content.replace(
  /\/\* currentView === 'register'([\s\S]*?)\n\s*:/g,
  "/* currentView === 'register'$1 */ null :"
);

content = content.replace(
  /\/\* currentView === 'favorites'([\s\S]*?)\n\s*:/g,
  "/* currentView === 'favorites'$1 */ null :"
);

content = content.replace(
  /\/\* currentView === 'admin'([\s\S]*?)\n\s*:/g,
  "/* currentView === 'admin'$1 */ null :"
);

fs.writeFileSync('src/App.js', content);
console.log('✅ App.js updated - removed deleted routes!');
