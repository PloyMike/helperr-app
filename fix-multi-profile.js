const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Change maybeSingle to .limit(1).single() - takes first match
content = content.replace(
  /\.eq\('user_id', user\.id\)\s*\.maybeSingle\(\);/,
  `.eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Query now takes newest profile!');
