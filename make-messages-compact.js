const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Make sidebar title more compact
content = content.replace(
  /sidebarTitle: \{ padding: '24px 20px', margin: 0, fontSize: 24, fontWeight: 800, borderBottom: '1px solid #e5e7eb' \}/,
  `sidebarTitle: { padding: '16px 20px', margin: 0, fontSize: 20, fontWeight: 800, borderBottom: '1px solid #e5e7eb' }`
);

// Make conversation items more compact
content = content.replace(
  /conversationItem: \{ [^}]*padding: '16px 20px'/,
  `conversationItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 12, 
    padding: '12px 16px'`
);

// Make avatar smaller
content = content.replace(
  /avatar: \{ width: 52, height: 52,/,
  `avatar: { width: 48, height: 48,`
);

// Make chat header more compact
content = content.replace(
  /chatHeader: \{ padding: '20px 24px',/,
  `chatHeader: { padding: '14px 20px',`
);

// Make chat header name smaller
content = content.replace(
  /chatHeaderName: \{ margin: 0, fontSize: 18, fontWeight: 700 \}/,
  `chatHeaderName: { margin: 0, fontSize: 16, fontWeight: 700 }`
);

// Make messages container padding smaller
content = content.replace(
  /messagesContainer: \{ flex: 1, overflowY: 'auto', padding: '24px',/,
  `messagesContainer: { flex: 1, overflowY: 'auto', padding: '16px',`
);

// Make message bubbles more compact
content = content.replace(
  /messageBubble: \{ maxWidth: '70%', padding: '12px 16px',/,
  `messageBubble: { maxWidth: '70%', padding: '10px 14px',`
);

// Make input container more compact
content = content.replace(
  /inputContainer: \{ padding: '16px 24px',/,
  `inputContainer: { padding: '12px 16px',`
);

// Make input padding smaller
content = content.replace(
  /input: \{ flex: 1, padding: '12px 16px',/,
  `input: { flex: 1, padding: '10px 14px',`
);

// Make send button smaller
content = content.replace(
  /sendBtn: \{ width: 48, height: 48,/,
  `sendBtn: { width: 44, height: 44,`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Messages page now compact - no scrolling!');
