const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Remove ', error' from the destructuring
content = content.replace(
  /const \{ data, error \} = await supabase\s*\.from\('profiles'\)/,
  `const { data } = await supabase
        .from('profiles')`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Error variable removed!');
