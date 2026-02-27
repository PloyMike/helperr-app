const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Entferne alle Emojis aus Mobile Menu Buttons
content = content.replace(
  /🏠 Startseite/g,
  'Startseite'
);
content = content.replace(
  /➕ Anbieter werden/g,
  'Anbieter werden'
);
content = content.replace(
  /📅 Buchungen/g,
  'Buchungen'
);
content = content.replace(
  /💬 Nachrichten/g,
  'Nachrichten'
);
content = content.replace(
  /🗺️ Karte/g,
  'Karte'
);
content = content.replace(
  /❤️ Favoriten/g,
  'Favoriten'
);
content = content.replace(
  /🔐 Login/g,
  'Login'
);
content = content.replace(
  /🚪 Logout/g,
  'Logout'
);
content = content.replace(
  /👋 /g,
  ''
);

// Verschiebe "Anbieter werden" nach oben (nach Startseite)
// Finde das Mobile Menu
const mobileMenuRegex = /<div style=\{\{position:'absolute',top:70,left:0,right:0,backgroundColor:'#0D9488',padding:20,boxShadow:'0 8px 20px rgba\(0,0,0,0\.2\)'\}\} className="mobile-menu">([\s\S]*?)<\/div>/;

const match = content.match(mobileMenuRegex);
if (match) {
  let mobileMenu = match[1];
  
  // Extrahiere Startseite Button
  const startseiteBtnRegex = /<button onClick=\{\(\)=>\{window\.navigateTo\('home'\);setMobileMenuOpen\(false\);\}\}[\s\S]*?>[\s\S]*?Startseite[\s\S]*?<\/button>/;
  const startseiteBtn = mobileMenu.match(startseiteBtnRegex)?.[0];
  
  // Extrahiere Anbieter werden Button
  const anbieterBtnRegex = /<button onClick=\{\(\)=>\{window\.navigateTo\('register'\);setMobileMenuOpen\(false\);\}\}[\s\S]*?>[\s\S]*?Anbieter werden[\s\S]*?<\/button>/;
  const anbieterBtn = mobileMenu.match(anbieterBtnRegex)?.[0];
  
  // Entferne Anbieter werden von alter Position
  mobileMenu = mobileMenu.replace(anbieterBtnRegex, '');
  
  // Füge Anbieter werden direkt nach Startseite ein
  mobileMenu = mobileMenu.replace(startseiteBtnRegex, startseiteBtn + '\n          ' + anbieterBtn);
  
  // Ersetze im Content
  content = content.replace(mobileMenuRegex, `<div style={{position:'absolute',top:70,left:0,right:0,backgroundColor:'#0D9488',padding:20,boxShadow:'0 8px 20px rgba(0,0,0,0.2)'}} className="mobile-menu">${mobileMenu}</div>`);
}

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Mobile menu updated!');
