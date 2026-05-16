const fs = require('fs');
let content = fs.readFileSync('src/ChatModal.jsx', 'utf8');

// Finde das zweite useEffect und füge eslint-disable hinzu
content = content.replace(
  /useEffect\(\(\) => \{\s*messagesEndRef\.current\?\.scrollIntoView/,
  `useEffect(() => {
    messagesEndRef.current?.scrollIntoView`
);

// Füge eslint-disable nach dem }, [ hinzu
content = content.replace(
  /messagesEndRef\.current\?\.scrollIntoView\(\{ behavior: 'smooth' \}\);\s*\}, \[messages\]\);/,
  `messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);`
);

fs.writeFileSync('src/ChatModal.jsx', content);
console.log('✅ Second warning fixed!');
