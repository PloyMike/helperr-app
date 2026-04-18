const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Change grid to 4fr for all boxes - extra wide!
const oldGrid = /gridTemplateColumns: '2\.5fr 2\.5fr 2\.5fr'/;
const newGrid = `gridTemplateColumns: '4fr 4fr 4fr'`;

content = content.replace(oldGrid, newGrid);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ All boxes set to 4fr - extra wide!');
