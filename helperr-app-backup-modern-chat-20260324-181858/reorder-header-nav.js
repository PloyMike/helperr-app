const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Finde und merke "Anbieter werden" Button
const anbieterButton = content.match(/<button onClick=\{\(\)=>window\.navigateTo\('register'\)\} style=\{\{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0\.2s'\}\}[^>]*>[\s\S]*?\+ Anbieter werden[\s\S]*?<\/button>/);

if (anbieterButton) {
  // Entferne "Anbieter werden" von aktueller Position
  content = content.replace(anbieterButton[0], '');
  
  // Füge "Anbieter werden" VOR Buchungen ein
  content = content.replace(
    /(\{user&&<button onClick=\{\(\)=>window\.navigateTo\('bookings'\)\})/,
    `${anbieterButton[0]}\n\n          $1`
  );
}

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Anbieter werden moved between Startseite and Buchungen!');
