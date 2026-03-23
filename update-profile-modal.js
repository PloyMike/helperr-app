const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Entferne das Contact Info Div komplett
content = content.replace(
  /<div style=\{\{ marginTop: 20, padding: 16, background: '#f9fafb', borderRadius: 12 \}\}>[\s\S]*?<\/div>/,
  ''
);

// Füge stattdessen einen "Contact Provider" Button hinzu
content = content.replace(
  /{\/\* BOOK NOW BUTTON \*\/}\s*<button/,
  `{/* CONTACT & BOOK BUTTONS */}
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button 
                  onClick={() => window.navigateTo('messages')} 
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'white',
                    color: '#065f46',
                    border: '2px solid #065f46',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: '"Outfit", sans-serif'
                  }}
                >
                  💬 Message Provider
                </button>
                <button`
);

// Ändere Book Now Button style zu flex: 1
content = content.replace(
  /style=\{styles\.bookBtn\}/,
  `style={{
                    flex: 1,
                    padding: '16px',
                    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: '"Outfit", sans-serif',
                    boxShadow: '0 4px 12px rgba(6,95,70,0.3)'
                  }}`
);

// Schließe das div
content = content.replace(
  /📅 Book Now\s*<\/button>/,
  `📅 Book Now
                </button>
              </div>`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Profile modal updated - Contact info removed, Message button added!');
