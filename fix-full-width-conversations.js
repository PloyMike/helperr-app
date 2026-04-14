const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Make conversation items full width - no padding left/right
content = content.replace(
  /conversationItem: \{ [^}]*padding: '12px 12px'[^}]*/,
  `conversationItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 12, 
    padding: '12px 16px'`
);

// Remove sidebar padding completely
content = content.replace(
  /sidebar: \{ [^}]*\}/,
  `sidebar: { 
    width: 340, 
    background: '#fff', 
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0
  }`
);

// Also fix conversationList to have no padding
content = content.replace(
  /conversationList: \{ [^}]*\}/,
  `conversationList: { 
    flex: 1, 
    overflowY: 'auto',
    padding: 0
  }`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Conversations now completely full-width!');
