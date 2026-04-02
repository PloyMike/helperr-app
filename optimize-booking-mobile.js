const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Make modal more compact on mobile
content = content.replace(
  /modal: \{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' \}/,
  `modal: { background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '95vh', overflowY: 'auto', margin: '0 12px' }`
);

// Make header more compact on mobile
content = content.replace(
  /header: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: 24,/,
  `header: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: '20px 16px',`
);

// Make title responsive
content = content.replace(
  /title: \{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' \}/,
  `title: { margin: 0, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 800, color: 'white' }`
);

// Make progress section more compact
content = content.replace(
  /progress: \{ display: 'flex', alignItems: 'center', padding: '24px',/,
  `progress: { display: 'flex', alignItems: 'center', padding: '16px',`
);

// Make body padding smaller
content = content.replace(
  /body: \{ padding: 24 \}/,
  `body: { padding: '20px 16px' }`
);

// Make calendar grid more compact
content = content.replace(
  /calendarGrid: \{ display: 'grid', gridTemplateColumns: 'repeat\(7, 1fr\)', gap: 8, marginTop: 16 \}/,
  `calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 12 }`
);

// Make day buttons smaller and more touch-friendly
content = content.replace(
  /dayBtn: \{ padding: '12px', border: '1\.5px solid #e5e7eb',/,
  `dayBtn: { padding: '10px 8px', border: '1.5px solid #e5e7eb',`
);

// Make time slot grid responsive
content = content.replace(
  /timeSlotsGrid: \{ display: 'grid', gridTemplateColumns: 'repeat\(3, 1fr\)', gap: 12, marginTop: 16 \}/,
  `timeSlotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginTop: 12 }`
);

// Make time slot buttons more compact
content = content.replace(
  /timeSlotBtn: \{ padding: '14px', border: '1\.5px solid #e5e7eb',/,
  `timeSlotBtn: { padding: '12px 10px', border: '1.5px solid #e5e7eb',`
);

// Make input fields more compact
content = content.replace(
  /input: \{ width: '100%', padding: '14px 16px',/,
  `input: { width: '100%', padding: '12px 14px',`
);

// Make textarea more compact
content = content.replace(
  /textarea: \{ width: '100%', padding: '14px 16px',/,
  `textarea: { width: '100%', padding: '12px 14px',`
);

// Make buttons more compact
content = content.replace(
  /btn: \{ padding: '16px 24px',/,
  `btn: { padding: '14px 20px',`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Booking Calendar optimized for mobile!');
