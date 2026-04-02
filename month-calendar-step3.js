const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the step 1 section and update it
const step1Section = content.match(/{step === 1 && \([\s\S]*?{step === 2 &&/);

if (step1Section) {
  const oldStep1 = step1Section[0];
  
  // Build the new step 1 with month calendar
  const newStep1 = `{step === 1 && (
            <div>
              <h3 style={styles.stepTitle}>Select a Date</h3>
              
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
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setStep(2)} disabled={!selectedDate} style={{...styles.btnNext, opacity: !selectedDate ? 0.5 : 1, cursor: !selectedDate ? 'not-allowed' : 'pointer'}}>
                Continue to Time Selection →
              </button>
            </div>
          )}
          {step === 2 &&`;
  
  content = content.replace(oldStep1, newStep1);
  console.log('✅ Updated step 1 rendering with month calendar');
} else {
  console.log('❌ Could not find step 1 section');
}

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('Done!');
