const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Ändere useEffect um auch localStorage zu checken
content = content.replace(
  /\/\/ Check URL for "to" parameter\s*useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/,
  `// Check URL and localStorage for "to" parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toEmail = params.get('to') || localStorage.getItem('helperr_message_to');
    if (toEmail) {
      setNewMessage({ to: toEmail, text: '' });
      setShowNewMessage(true);
      localStorage.removeItem('helperr_message_to'); // Clean up
    }
  }, []);`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ MessagesPage updated to check localStorage!');
