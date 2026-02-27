const fs = require('fs');
let content = fs.readFileSync('src/ChatModal.jsx', 'utf8');

// Füge Mobile Styles für Chat-Input hinzu
const mobileStyles = `
        /* MOBILE */
        @media (max-width: 768px) {
          .chat-modal {
            width: 100% !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
          .chat-header {
            padding: 16px !important;
          }
          .chat-header h2 {
            font-size: 18px !important;
          }
          .close-button {
            width: 32px !important;
            height: 32px !important;
            font-size: 20px !important;
          }
          .chat-messages {
            padding: 16px !important;
          }
          .message {
            max-width: 85% !important;
            padding: 10px 12px !important;
            font-size: 14px !important;
          }
          .chat-input-container {
            padding: 12px 16px !important;
            gap: 8px !important;
          }
          .chat-input {
            padding: 10px 12px !important;
            font-size: 14px !important;
          }
          .send-button {
            padding: 10px 16px !important;
            font-size: 14px !important;
            min-width: auto !important;
            white-space: nowrap !important;
          }
        }`;

// Füge Mobile Styles vor dem schließenden </style> Tag hinzu
if (!content.includes('/* MOBILE */')) {
  content = content.replace('</style>', mobileStyles + '\n      </style>');
}

fs.writeFileSync('src/ChatModal.jsx', content);
console.log('✅ ChatModal mobile styles added!');
