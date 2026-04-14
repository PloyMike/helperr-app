const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Make input container sticky on mobile
content = content.replace(
  /inputContainer: \{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12, background: '#fff', flexShrink: 0 \}/,
  `inputContainer: { padding: '12px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12, background: '#fff', flexShrink: 0, position: 'sticky', bottom: 0, zIndex: 10 }`
);

// Add padding to messagesContainer to prevent overlap
content = content.replace(
  /messagesContainer: \{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f9fafb', minHeight: 0 \}/,
  `messagesContainer: { flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f9fafb', minHeight: 0 }`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Input box now sticky at bottom!');
