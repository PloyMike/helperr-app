const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Change .single() to take first profile (newest)
content = content.replace(
  /\.eq\('user_id', user\.id\)\s*\.single\(\);/,
  `.eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Query now handles multiple profiles!');
