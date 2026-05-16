const fs = require('fs');
let content = fs.readFileSync('src/AdminDashboard.jsx', 'utf8');

// Remove broken wrapper
content = content.replace(/<><link href=.*?>/gs, '');
content = content.replace(/<\/>\);\s*}\s*export default/gs, ');\n}\n\nexport default');

// Add font link after first return statement
content = content.replace(
  /return \(/,
  `return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />`
);

// Add closing div
content = content.replace(
  /(\s+)\);\s*}\s*export default AdminDashboard/,
  `$1  </div>
  );
}

export default AdminDashboard`
);

fs.writeFileSync('src/AdminDashboard.jsx', content);
console.log('✅ AdminDashboard fixed!');
