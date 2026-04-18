const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Change grid to 2.5fr for all boxes
const oldGrid = /gridTemplateColumns: '2fr 1\.5fr 1\.5fr'/;
const newGrid = `gridTemplateColumns: '2.5fr 2.5fr 2.5fr'`;

content = content.replace(oldGrid, newGrid);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ All boxes set to 2.5fr!');
