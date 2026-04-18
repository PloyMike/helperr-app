const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Fix the grid layout - give more space to price amount
const oldGrid = /gridTemplateColumns: '1fr 120px 120px'/;
const newGrid = `gridTemplateColumns: '2fr 1fr 1fr'`;

content = content.replace(oldGrid, newGrid);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Price amount box now wider!');
