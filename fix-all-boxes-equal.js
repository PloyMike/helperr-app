const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Make all three boxes equal size
const oldGrid = /gridTemplateColumns: '2fr 1fr 1fr'/;
const newGrid = `gridTemplateColumns: '1fr 1fr 1fr'`;

content = content.replace(oldGrid, newGrid);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ All three boxes now equal size!');
