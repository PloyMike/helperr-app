const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Add search state after showChat state
content = content.replace(
  "const [showChat, setShowChat] = useState(false);",
  `const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Step 1: Search state added');
