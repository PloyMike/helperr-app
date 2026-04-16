const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Replace .single() with .maybeSingle() to handle no profiles or multiple profiles
content = content.replace(
  /\.limit\(1\)\s*\.single\(\);/,
  `.limit(1)
        .maybeSingle();`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Query now handles multiple profiles correctly!');
