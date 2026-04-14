const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Change the arrow in the JSX to be responsive
content = content.replace(
  /<div style=\{styles\.timeArrow\}>→<\/div>/,
  `<div style={styles.timeArrow}>
                <span style={styles.arrowDesktop}>→</span>
                <span style={styles.arrowMobile}>↓</span>
              </div>`
);

// Add responsive styles for arrows
content = content.replace(
  /timeArrow: \{ fontSize: 18, color: '#6b7280', fontWeight: 700, padding: '0 4px' \}/,
  `timeArrow: { fontSize: 18, color: '#6b7280', fontWeight: 700, padding: '4px', textAlign: 'center' },
  arrowDesktop: { display: 'inline' },
  arrowMobile: { display: 'none' }`
);

// Add media query styles for mobile arrow at the end of styles object
const stylesEnd = /btnSubmit: \{[^}]*\}\s*\};/;
content = content.replace(
  stylesEnd,
  `btnSubmit: { flex: 1, padding: '12px 16px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' }
};

// Media query for mobile
if (typeof window !== 'undefined' && window.innerWidth <= 640) {
  styles.arrowDesktop = { display: 'none' };
  styles.arrowMobile = { display: 'inline' };
}`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Arrow now shows ↓ on mobile, → on desktop!');
