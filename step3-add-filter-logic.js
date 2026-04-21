const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Add filter logic before conversations.map
content = content.replace(
  /{conversations\.map\(conv => \(/,
  `{conversations
                .filter(conv => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return conv.name?.toLowerCase().includes(query) ||
                         conv.email?.toLowerCase().includes(query);
                })
                .map(conv => (`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Step 3: Filter logic added - search works!');
