const fs = require('fs');
let content = fs.readFileSync('src/AdminDashboard.jsx', 'utf8');

// Entferne loading State (wird nicht verwendet)
content = content.replace(
  /const \[loading, setLoading\] = useState\(false\);/,
  '// const [loading, setLoading] = useState(false);'
);

content = content.replace(
  /setLoading\(true\);/g,
  '// setLoading(true);'
);

content = content.replace(
  /setLoading\(false\);/g,
  '// setLoading(false);'
);

fs.writeFileSync('src/AdminDashboard.jsx', content);
console.log('✅ Warning fixed!');
