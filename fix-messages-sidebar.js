const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Remove "Messages" title from sidebar (line 230)
content = content.replace(
  /<h2 style=\{styles\.sidebarTitle\}>Messages<\/h2>/,
  ''
);

// Remove emoji from "No messages yet" in sidebar (line 235)
content = content.replace(
  /<div style=\{\{ fontSize: 48, marginBottom: 12 \}\}>💬<\/div>/,
  ''
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Messages title and emoji removed from sidebar!');
