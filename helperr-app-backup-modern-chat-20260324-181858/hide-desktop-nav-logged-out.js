const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Desktop Navigation - Buchungen nur für eingeloggte
content = content.replace(
  /(<button onClick=\{\(\)=>window\.navigateTo\('bookings'\)\} style=\{\{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0\.2s'\}\}[^>]*>[\s\S]*?Buchungen[\s\S]*?<\/button>)/,
  '{user&&$1}'
);

// Desktop Navigation - Nachrichten nur für eingeloggte
content = content.replace(
  /(<button onClick=\{\(\)=>window\.navigateTo\('messages'\)\} style=\{\{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0\.2s'\}\}[^>]*>[\s\S]*?Nachrichten[\s\S]*?<\/button>)/,
  '{user&&$1}'
);

// Desktop Navigation - Favoriten nur für eingeloggte (hat schon user&&, aber sicherstellen)
// Favoriten sollte schon {user&& haben, aber wir checken trotzdem

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Desktop nav hidden for logged out users!');
