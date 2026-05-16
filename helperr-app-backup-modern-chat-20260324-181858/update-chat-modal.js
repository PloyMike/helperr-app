const fs = require('fs');
let content = fs.readFileSync('src/ChatModal.jsx', 'utf8');

// Import hinzufügen
if (!content.includes('emailService')) {
  content = content.replace(
    /import { supabase } from '\.\/supabase';/,
    `import { supabase } from './supabase';\nimport { sendMessageNotification } from './emailService';`
  );
}

// Email senden nach erfolgreicher Nachricht
content = content.replace(
  /setMessage\(''\);/,
  `setMessage('');
        
        // Email an Empfänger senden
        await sendMessageNotification(newMessage, profile.name);`
);

fs.writeFileSync('src/ChatModal.jsx', content);
console.log('✅ Message email integration added!');
