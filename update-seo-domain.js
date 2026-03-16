const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Replace all old Vercel URLs with new domain
content = content.replace(/https:\/\/helperr-app-indol\.vercel\.app/g, 'https://helperr.co');

fs.writeFileSync('public/index.html', content);
console.log('✅ SEO URLs updated to helperr.co!');
