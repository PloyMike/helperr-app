const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Ersetze select('*') mit spezifischen Spalten
content = content.replace(
  /\.from\('profiles'\)\.select\('\*'\)/,
  `.from('profiles').select(\`
    id, created_at, name, email, phone, bio,
    country, city, latitude, longitude,
    category, subcategory, job, price, tags,
    line_id, languages,
    available, verified,
    rating, review_count, total_bookings, view_count,
    image_url, photos, video_url,
    facebook, instagram, whatsapp, telegram, tiktok,
    flag
  \`)`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Helperr.jsx fixed - only loading existing columns!');
