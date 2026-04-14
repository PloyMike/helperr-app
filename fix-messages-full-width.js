const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Reduce padding on conversation items for full width on mobile
content = content.replace(
  /conversationItem: \{ [^}]*padding: '12px 20px'/,
  `conversationItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 12, 
    padding: '12px 12px'`
);

// Also reduce sidebar padding
content = content.replace(
  /sidebarHeader: \{\s*padding: '16px 20px',/,
  `sidebarHeader: {
    padding: '16px 12px',`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Messages now full-width on mobile!');
