const fs = require('fs');
let content = fs.readFileSync('src/ProviderBookingsPage.jsx', 'utf8');

// Replace email display with Messages link
const oldContact = /<span style=\{styles\.infoValue\}>\{booking\.customer_email\}<\/span>/g;

const newContact = `<button 
                        onClick={() => window.navigateTo('messages')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#065f46',
                          fontSize: 15,
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0
                        }}
                      >
                        Contact via Helperr Messages
                      </button>`;

content = content.replace(oldContact, newContact);

fs.writeFileSync('src/ProviderBookingsPage.jsx', content);
console.log('✅ Email replaced with Messages link!');
