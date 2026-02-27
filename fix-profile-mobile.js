const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Entferne alle Emojis
content = content.replace(/📍 /g, '');
content = content.replace(/👁️ /g, '');
content = content.replace(/💬 /g, '');
content = content.replace(/✓ /g, '');
content = content.replace(/⭐ /g, '');
content = content.replace(/🏆 /g, '');
content = content.replace(/🔥 /g, '');
content = content.replace(/✨ /g, '');

// Verschiebe Chat-Box nach unten (vor Reviews)
content = content.replace(
  /<div className="chat-box">[\s\S]*?<\/div>/,
  ''
);

content = content.replace(
  /<div className="reviews">/,
  `<div className="chat-section">
            <div className="chat-box-bottom">
              <button onClick={()=>{
                if(!user){
                  alert('Bitte logge dich ein um Nachrichten zu senden!');
                  window.navigateTo('login');
                }else{
                  setShowChat(true);
                }
              }} className="chat-button-bottom">Nachricht senden</button>
            </div>
          </div>

          <div className="reviews">`
);

// Update mobile styles - Avatar kleiner & zentriert
content = content.replace(
  /\.avatar-image, \.avatar-placeholder \{[\s\S]*?\}/,
  `.avatar-image, .avatar-placeholder {
            width: 80px !important;
            height: 80px !important;
            margin: 0 auto !important;
            font-size: 36px !important;
            border-width: 2px !important;
          }`
);

// Info Box zentriert
content = content.replace(
  /\.info-box \{\s*padding: 20px !important;\s*\}/,
  `.info-box {
            padding: 20px !important;
            text-align: center !important;
          }
          .badges {
            justify-content: center !important;
          }`
);

// Chat Section Styles hinzufügen
content = content.replace(
  /\.reviews \{[\s\S]*?\}/,
  `.chat-section {
          max-width: 1200px;
          margin: 0 auto 40px;
          padding: 0 20px;
        }
        .chat-box-bottom {
          background-color: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          border: 1px solid #E5E7EB;
        }
        .chat-button-bottom {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .chat-button-bottom:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.3);
        }
        .reviews {
          margin-top: 0;
        }`
);

// Mobile styles für Chat Section
content = content.replace(
  /\.detail-title \{\s*font-size: 18px !important;\s*\}/,
  `.detail-title {
            font-size: 18px !important;
          }
          .chat-section {
            padding: 0 16px !important;
            margin-bottom: 24px !important;
          }
          .chat-box-bottom {
            padding: 16px !important;
          }
          .chat-button-bottom {
            padding: 14px !important;
            font-size: 14px !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Profile mobile optimized!');
