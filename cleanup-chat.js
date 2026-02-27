const fs = require('fs');
let content = fs.readFileSync('src/ChatModal.jsx', 'utf8');

// Entferne alle Console Logs
content = content.replace(/console\.log\('✅.*?\);/g, '');
content = content.replace(/console\.log\('❌.*?\);/g, '');
content = content.replace(/console\.log\('🔍.*?\);/g, '');
content = content.replace(/console\.log\(`🔍.*?\);/g, '');
content = content.replace(/console\.error\('Query error:',.*?\);/g, '');

// Entferne Debug-Text im Chat
content = content.replace(
  /<p style=\{\{fontSize:12,color:'#9CA3AF',textAlign:'center'\}\}>🔍 DEBUG:.*?<\/p>/,
  ''
);

// Entferne <>...</> Wrapper wenn nicht mehr gebraucht
content = content.replace(
  /\):\(\s*<>\s*\{messages\.map/,
  '):messages.map'
);

content = content.replace(
  /\}\}\s*<\/>\s*\)\}/,
  '}}'
);

fs.writeFileSync('src/ChatModal.jsx', content);
console.log('✅ Debug logs removed!');
