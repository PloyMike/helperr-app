const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Fix chatWindow height calculation
content = content.replace(
  /chatWindow: \{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', maxHeight: '100%', overflow: 'hidden' \}/,
  `chatWindow: { flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', height: '100%', overflow: 'hidden' }`
);

// Remove sticky and use flexbox properly
content = content.replace(
  /inputContainer: \{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12, background: '#fff', flexShrink: 0, position: 'sticky', bottom: 0, zIndex: 10 \}/,
  `inputContainer: { padding: '12px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12, background: '#fff', flexShrink: 0 }`
);

// Fix messagesContainer to use available space
content = content.replace(
  /messagesContainer: \{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f9fafb', minHeight: 0 \}/,
  `messagesContainer: { flex: '1 1 0', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f9fafb', minHeight: 0 }`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Input box now always visible!');
