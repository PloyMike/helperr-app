const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the styles object and add new calendar styles
const stylesMatch = content.match(/const styles = \{/);

if (stylesMatch) {
  // Add new styles after "const styles = {"
  const newStyles = `const styles = {
  calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '12px 16px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', borderRadius: 12 },
  monthBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 700, fontFamily: '"Outfit", sans-serif' },
  monthTitle: { color: 'white', fontSize: 18, fontWeight: 700 },
  weekdaysHeader: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8, padding: '8px 0' },
  weekday: { textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' },
  monthGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 20 },
  emptyDay: { padding: '12px', opacity: 0 },
  calendarDay: { padding: '10px 8px', border: '2px solid #e5e7eb', borderRadius: 10, background: 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: '"Outfit", sans-serif', fontSize: 16, fontWeight: 600, color: '#111827' },
  calendarDaySelected: { borderColor: '#065f46', background: '#ecfdf5', color: '#065f46', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.2)' },
  calendarDayDisabled: { opacity: 0.3, cursor: 'not-allowed', background: '#f9fafb' },`;
  
  content = content.replace('const styles = {', newStyles);
  console.log('✅ Added calendar styles');
} else {
  console.log('❌ Could not find styles object');
}

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('Done!');
