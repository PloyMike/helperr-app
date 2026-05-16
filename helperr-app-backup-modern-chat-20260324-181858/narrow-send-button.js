const fs = require('fs');
let content = fs.readFileSync('src/ChatModal.jsx', 'utf8');

// Update send-button mobile styles
content = content.replace(
  /\.send-button \{\s*padding: 10px 16px !important;\s*font-size: 14px !important;\s*min-width: auto !important;\s*white-space: nowrap !important;\s*\}/,
  `.send-button {
            padding: 10px 12px !important;
            font-size: 14px !important;
            min-width: 60px !important;
            max-width: 80px !important;
            white-space: nowrap !important;
          }`
);

fs.writeFileSync('src/ChatModal.jsx', content);
console.log('✅ Send button narrowed!');
