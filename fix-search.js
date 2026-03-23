const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Erweitere die Search-Logik
content = content.replace(
  /const matchesSearch = !search \|\| \s+profile\.name\?\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\) \|\| \s+profile\.job\?\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\) \|\| \s+profile\.city\?\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\);/,
  `const matchesSearch = !search || 
      profile.name?.toLowerCase().includes(search.toLowerCase()) || 
      profile.job?.toLowerCase().includes(search.toLowerCase()) || 
      profile.city?.toLowerCase().includes(search.toLowerCase()) ||
      profile.category?.toLowerCase().includes(search.toLowerCase()) ||
      profile.subcategory?.toLowerCase().includes(search.toLowerCase()) ||
      profile.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
      profile.bio?.toLowerCase().includes(search.toLowerCase());`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Search expanded!');
