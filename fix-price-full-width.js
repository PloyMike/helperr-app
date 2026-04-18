const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Find the price div and make it span full width
const oldPriceDiv = /<div>\s*<label style=\{styles\.label\}>Pricing \*<\/label>/;
const newPriceDiv = `<div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Pricing *</label>`;

content = content.replace(oldPriceDiv, newPriceDiv);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Price section now spans full width!');
