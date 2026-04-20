const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Fix: Buttons should only be white when transparent AND not scrolled
// Change: ...(transparent ? styles.navBtnTransparent : {})
// To:     ...(transparent && !isScrolled ? styles.navBtnTransparent : {})

content = content.replace(
  /\.\.\.\(transparent \? styles\.navBtnTransparent : \{\}\)/g,
  '...(transparent && !isScrolled ? styles.navBtnTransparent : {})'
);

// Same for profile button
content = content.replace(
  /\.\.\.\(transparent \? styles\.profileBtnTransparent : \{\}\)/g,
  '...(transparent && !isScrolled ? styles.profileBtnTransparent : {})'
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Button colors fixed for scroll!');
