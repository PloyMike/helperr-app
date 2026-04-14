const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Change the time picker container structure for desktop
// Find the time section rendering and wrap both in a container

// Add a new style for desktop time container
const overlayStyle = /overlay: \{ position: 'fixed'/;
content = content.replace(
  overlayStyle,
  `desktopTimeContainer: { display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' },
  overlay: { position: 'fixed'`
);

// Make timeSection narrower for desktop
content = content.replace(
  /timeSection: \{ background: '#f9fafb', borderRadius: 10, padding: 8, marginBottom: 6, border: '2px solid #e5e7eb' \}/,
  `timeSection: { background: '#f9fafb', borderRadius: 10, padding: 8, marginBottom: 6, border: '2px solid #e5e7eb', flex: '1 1 auto', maxWidth: 200, minWidth: 160 }`
);

// Make timeDivider work for both mobile and desktop
content = content.replace(
  /timeDivider: \{ fontSize: 16, color: '#6b7280', fontWeight: 700, textAlign: 'center', padding: '2px 0' \}/,
  `timeDivider: { fontSize: 16, color: '#6b7280', fontWeight: 700, textAlign: 'center', padding: '2px 0', display: 'flex', alignItems: 'center' }`
);

// Update the JSX to wrap time sections in desktop container
const timeSectionPattern = /<div style=\{styles\.timeSection\}>[\s\S]*?<\/div>\s*<div style=\{styles\.timeDivider\}>↓<\/div>\s*<div style=\{styles\.timeSection\}>[\s\S]*?<\/div>/;

content = content.replace(
  timeSectionPattern,
  `<div style={styles.desktopTimeContainer}>
                <div style={styles.timeSection}>
                  <div style={styles.timeSectionLabel}>Start Time</div>
                  <div style={styles.pickerRow}>
                    <AppleScrollPicker items={hours} value={startHour} onChange={setStartHour} pickerRef={startHourRef} />
                    <span style={styles.colon}>:</span>
                    <AppleScrollPicker items={minutes} value={startMinute} onChange={setStartMinute} pickerRef={startMinuteRef} />
                  </div>
                </div>

                <div style={styles.timeDivider}>→</div>

                <div style={styles.timeSection}>
                  <div style={styles.timeSectionLabel}>End Time</div>
                  <div style={styles.pickerRow}>
                    <AppleScrollPicker items={hours} value={endHour} onChange={setEndHour} pickerRef={endHourRef} />
                    <span style={styles.colon}>:</span>
                    <AppleScrollPicker items={minutes} value={endMinute} onChange={setEndMinute} pickerRef={endMinuteRef} />
                  </div>
                </div>
              </div>`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Desktop layout optimized - side by side!');
