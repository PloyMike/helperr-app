const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

// Hide chatbot only on messages page
content = content.replace(
  /\{\/\* AI CHATBOT - IMMER SICHTBAR \*\/\}\s*<ChatbotWidget \/>/,
  `{/* AI CHATBOT - Versteckt auf Messages Page */}
        {currentView !== 'messages' && <ChatbotWidget />}`
);

fs.writeFileSync('src/App.js', content);
console.log('✅ Chatbot now hidden on Messages page!');
