const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Fix the query to use maybeSingle instead of single (won't error if no profile exists)
content = content.replace(
  /\.eq\('user_id', user\.id\)\s*\.single\(\);/,
  `.eq('user_id', user.id)
        .maybeSingle();`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Query fixed - now uses maybeSingle()!');
