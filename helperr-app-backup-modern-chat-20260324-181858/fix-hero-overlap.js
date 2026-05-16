const fs = require('fs');

const files = [
  'src/MyBookings.jsx',
  'src/MessagesPage.jsx', 
  'src/Favorites.jsx',
  'src/EditProfilePage.jsx',
  'src/ProviderDashboard.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Ändere paddingTop von 80 auf 0
  content = content.replace(
    /paddingTop: 80/g,
    'paddingTop: 0'
  );
  
  // Ändere hero padding von '40px 20px' auf '120px 20px 40px' (mehr oben für Header)
  content = content.replace(
    /padding: '40px 20px'/g,
    "padding: '120px 20px 40px'"
  );
  
  fs.writeFileSync(file, content);
  console.log(`✅ Fixed ${file}`);
});

console.log('All files updated!');
