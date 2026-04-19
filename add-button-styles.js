const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the btnSubmit style and add new styles after it
const oldBtnSubmit = /btnSubmit: \{[^}]+\}/;

const newStyles = `btnSubmit: { flex: 1, padding: '10px 14px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' },
  btnSecondary: { padding: '14px 24px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s' },
  btnPrimary: { flex: 1, padding: '14px 24px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)', transition: 'all 0.2s' },
  footer: { display: 'flex', gap: 12, marginTop: 20 }`;

content = content.replace(oldBtnSubmit, newStyles);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Button styles added - bigger and green!');
