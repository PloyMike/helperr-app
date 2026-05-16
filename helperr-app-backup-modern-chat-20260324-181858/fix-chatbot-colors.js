const fs = require('fs');

const files = ['src/ChatbotWidget.jsx', 'src/ChatModal.jsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Ändere Gradient von türkis zu grün
  content = content.replace(
    /linear-gradient\(135deg, #14B8A6 0%, #0D9488 100%\)/g,
    'linear-gradient(135deg, #065f46 0%, #047857 100%)'
  );
  
  // Ändere einzelne türkise Farben zu grün
  content = content.replace(/#14B8A6/g, '#065f46');
  content = content.replace(/#0D9488/g, '#047857');
  
  fs.writeFileSync(file, content);
  console.log(`✅ Updated ${file}`);
});

console.log('✅ All chatbot colors updated to hero green!');
