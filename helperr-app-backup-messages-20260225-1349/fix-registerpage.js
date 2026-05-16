const fs = require('fs');
let content = fs.readFileSync('src/RegisterPage.jsx', 'utf8');

// Remove broken wrapper
content = content.replace(/<><link href=.*?><div>/gs, '');
content = content.replace(/<\/>\s*\);\s*}\s*export default/gs, ');\n}\n\nexport default');

// Add font link
content = content.replace(
  /return \(/,
  `return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />`
);

// Add closing div
content = content.replace(
  /(\s+)\);\s*}\s*export default RegisterPage/,
  `$1  </div>
  );
}

export default RegisterPage`
);

fs.writeFileSync('src/RegisterPage.jsx', content);
console.log('✅ RegisterPage fixed!');
