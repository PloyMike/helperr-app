const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find the profile card div - look for the specific div with all the profile rendering
const pattern = /(filteredProfiles\.map\(\(profile\) => \([\s\S]*?)<div[\s\S]*?key=\{profile\.id\}[\s\S]*?style=\{\{[\s\S]*?cursor: 'pointer'[\s\S]*?\}\}/;

const match = content.match(pattern);

if (match) {
  const replacement = match[0].replace(
    'style={{',
    'onClick={() => window.navigateTo(\'profile\', profile)}\n            style={{'
  );
  content = content.replace(match[0], replacement);
  fs.writeFileSync('src/Helperr.jsx', content);
  console.log('✅ onClick added correctly!');
} else {
  console.log('❌ Could not find pattern');
}
