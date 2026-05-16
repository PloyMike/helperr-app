const fs = require('fs');
let content = fs.readFileSync('src/ChatModal.jsx', 'utf8');

// Update chat-input-container mobile styles - box-sizing fix
content = content.replace(
  /\.chat-input-container \{\s*padding: 12px 16px !important;\s*gap: 8px !important;\s*\}/,
  `.chat-input-container {
            padding: 12px !important;
            gap: 8px !important;
            box-sizing: border-box !important;
            width: 100% !important;
          }
          .chat-input {
            flex: 1 !important;
            box-sizing: border-box !important;
          }`
);

// Send button noch schmaler
content = content.replace(
  /\.send-button \{\s*padding: 10px 12px !important;\s*font-size: 14px !important;\s*min-width: 60px !important;\s*max-width: 80px !important;\s*white-space: nowrap !important;\s*\}/,
  `.send-button {
            padding: 10px !important;
            font-size: 13px !important;
            min-width: 55px !important;
            max-width: 70px !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }`
);

fs.writeFileSync('src/ChatModal.jsx', content);
console.log('✅ Chat input fixed - no overflow!');
