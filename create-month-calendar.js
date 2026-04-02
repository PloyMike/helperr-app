const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Add currentMonth state
content = content.replace(
  /const \[selectedDate, setSelectedDate\] = useState\(''\);/,
  `const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());`
);

// Replace getAvailableDates with getMonthDates
content = content.replace(
  /const getAvailableDates = \(\) => \{[\s\S]*?return dates;[\s\S]*?\};/,
  `const getMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and how many days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get starting day of week (0=Sun, 1=Mon, etc)
    let startingDayOfWeek = firstDay.getDay();
    // Convert to Monday-based (0=Mon, 6=Sun)
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      dates.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push(date);
    }
    
    return dates;
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };`
);

// Update the calendar rendering to use new function
content = content.replace(
  /<h3 style=\{styles\.stepTitle\}>Select a Date<\/h3>\s+<div style=\{styles\.dateGrid\}>\s+\{getAvailableDates\(\)\.map\(date => \{/,
  `<h3 style={styles.stepTitle}>Select a Date</h3>
              
              <div style={styles.calendarHeader}>
                <button onClick={() => changeMonth(-1)} style={styles.monthBtn}>←</button>
                <div style={styles.monthTitle}>{getMonthName()}</div>
                <button onClick={() => changeMonth(1)} style={styles.monthBtn}>→</button>
              </div>

              <div style={styles.weekdaysHeader}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} style={styles.weekday}>{day}</div>
                ))}
              </div>

              <div style={styles.monthGrid}>
                {getMonthDates().map((date, index) => {
                  if (!date) {
                    return <div key={'empty-' + index} style={styles.emptyDay}></div>;
                  }
                  
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = date < today;`
);

// Update the button rendering
content = content.replace(
  /const dateISO = formatDateISO\(date\);\s+const isSelected = selectedDate === dateISO;\s+return \(\s+<button key=\{dateISO\} onClick=\{\(\) => setSelectedDate\(dateISO\)\} style=\{\{\.\.\.styles\.dateBtn, \.\.\.\(isSelected \? styles\.dateBtnActive : \{\}\)\}\}>/,
  `const dateISO = formatDateISO(date);
                  const isSelected = selectedDate === dateISO;
                  
                  return (
                    <button 
                      key={dateISO} 
                      onClick={() => !isPast && setSelectedDate(dateISO)} 
                      disabled={isPast}
                      style={{
                        ...styles.calendarDay,
                        ...(isSelected ? styles.calendarDaySelected : {}),
                        ...(isPast ? styles.calendarDayDisabled : {})
                      }}
                    >`
);

// Update what's inside the button
content = content.replace(
  /<div style=\{styles\.dateDay\}>\{formatDate\(date\)\.split\(','\)\[0\]\}<\/div>\s+<div style=\{styles\.dateNumber\}>\{date\.getDate\(\)\}<\/div>\s+<div style=\{styles\.dateMonth\}>\{formatDate\(date\)\.split\(' '\)\[1\]\}<\/div>/,
  `<div style={styles.calendarDayNumber}>{date.getDate()}</div>`
);

// Add new styles for month calendar
content = content.replace(
  /dateGrid: \{ display: 'grid', gridTemplateColumns: 'repeat\(auto-fill, minmax\(80px, 1fr\)\)', gap: 10, marginBottom: 20 \},/,
  `calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '12px 16px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', borderRadius: 12 },
  monthBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 700, fontFamily: '"Outfit", sans-serif' },
  monthTitle: { color: 'white', fontSize: 18, fontWeight: 700 },
  weekdaysHeader: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8, padding: '8px 0' },
  weekday: { textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' },
  monthGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 20 },
  emptyDay: { padding: '12px', opacity: 0 },
  calendarDay: { padding: '12px 8px', border: '2px solid #e5e7eb', borderRadius: 10, background: 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: '"Outfit", sans-serif', fontSize: 16, fontWeight: 600, color: '#111827' },
  calendarDaySelected: { borderColor: '#065f46', background: '#ecfdf5', color: '#065f46', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.2)' },
  calendarDayDisabled: { opacity: 0.3, cursor: 'not-allowed', background: '#f9fafb' },
  calendarDayNumber: { fontSize: 15, fontWeight: 600 },`
);

// Remove old dateGrid, dateBtn styles (they'll be replaced by the line above)
content = content.replace(
  /dateBtn: \{ padding: '12px 8px', border: '2px solid #e5e7eb', borderRadius: 12, background: 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0\.2s' \},\s+dateBtnActive: \{ borderColor: '#065f46', background: '#ecfdf5' \},\s+dateDay: \{ fontSize: 11, color: '#6b7280', fontWeight: 600 \},/,
  ''
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Month calendar created!');
