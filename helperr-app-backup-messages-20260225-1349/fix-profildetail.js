const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Remove broken wrapper
content = content.replace(/<><link href=.*?><div>/gs, '');
content = content.replace(/<\/div>\s*<\/>\s*\);\s*}\s*export default/gs, ');\n}\n\nexport default');

// Now add font link properly
content = content.replace(
  /return \(/,
  `return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />`
);

// Add closing div before the last closing paren of return
content = content.replace(
  /(\s+)\);\s*}\s*export default ProfilDetail/,
  `$1  </div>
  );
}

export default ProfilDetail`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ ProfilDetail fixed!');
