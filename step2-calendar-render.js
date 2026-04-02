const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find and replace the calendar rendering section
const oldCalendarRender = /(<h3 style=\{styles\.stepTitle\}>Select a Date<\/h3>\s+<div style=\{styles\.dateGrid\}>[\s\S]*?<\/div>)/;

const newCalendarRender = `<h3 style={styles.stepTitle}>Select a Date</h3>
              
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
                  const isPast = date < today;
                  const dateISO = formatDateISO(date);
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
                    >
                      <div style={styles.calendarDayNumber}>{date.getDate()}</div>
                    </button>
                  );
                })}
              </div>`;

content = content.replace(oldCalendarRender, newCalendarRender);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Step 2: Calendar rendering updated!');
