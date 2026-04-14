const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Remove iOS Picker component and replace with Spinner
const oldIOSPicker = /const IOSPicker = \(\{ items, value, onChange, pickerRef, type = 'number' \}\) => \{[\s\S]*?\};/;

const newSpinner = `const TimeSpinner = ({ value, onChange, max }) => {
    const increment = () => {
      if (value < max) onChange(value + (max === 23 ? 1 : 15));
    };
    
    const decrement = () => {
      if (value > 0) onChange(value - (max === 23 ? 1 : 15));
    };
    
    return (
      <div style={styles.spinner}>
        <button onClick={increment} style={styles.spinnerBtn} disabled={value >= max}>▲</button>
        <div style={styles.spinnerValue}>{value.toString().padStart(2, '0')}</div>
        <button onClick={decrement} style={styles.spinnerBtn} disabled={value <= 0}>▼</button>
      </div>
    );
  };`;

content = content.replace(oldIOSPicker, newSpinner);

// Replace IOSPicker usage with TimeSpinner
content = content.replace(
  /<IOSPicker items=\{hours\} value=\{startHour\} onChange=\{setStartHour\} pickerRef=\{startHourRef\} \/>/g,
  '<TimeSpinner value={startHour} onChange={setStartHour} max={23} />'
);

content = content.replace(
  /<IOSPicker items=\{minutes\} value=\{startMinute\} onChange=\{setStartMinute\} pickerRef=\{startMinuteRef\} \/>/g,
  '<TimeSpinner value={startMinute} onChange={setStartMinute} max={45} />'
);

content = content.replace(
  /<IOSPicker items=\{hours\} value=\{endHour\} onChange=\{setEndHour\} pickerRef=\{endHourRef\} \/>/g,
  '<TimeSpinner value={endHour} onChange={setEndHour} max={23} />'
);

content = content.replace(
  /<IOSPicker items=\{minutes\} value=\{endMinute\} onChange=\{setEndMinute\} pickerRef=\{endMinuteRef\} \/>/g,
  '<TimeSpinner value={endMinute} onChange={setEndMinute} max={45} />'
);

// Remove old iOS picker styles and add spinner styles
const oldIOSStyles = /iosPickerWrapper: \{[^}]*\},[\s\S]*?iosPickerItemSelected: \{[^}]*\},/;

const newSpinnerStyles = `spinner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'white', borderRadius: 10, border: '2px solid #065f46', padding: '4px 12px' },
  spinnerBtn: { background: 'transparent', border: 'none', color: '#065f46', fontSize: 16, fontWeight: 700, cursor: 'pointer', padding: '4px', lineHeight: 1 },
  spinnerValue: { fontSize: 24, fontWeight: 700, color: '#065f46', minWidth: 45, textAlign: 'center', padding: '4px 0' },`;

content = content.replace(oldIOSStyles, newSpinnerStyles);

// Remove refs that are no longer needed
content = content.replace(/const startHourRef = useRef\(null\);\s*/g, '');
content = content.replace(/const startMinuteRef = useRef\(null\);\s*/g, '');
content = content.replace(/const endHourRef = useRef\(null\);\s*/g, '');
content = content.replace(/const endMinuteRef = useRef\(null\);\s*/g, '');

// Remove the useEffect that initializes scroll positions
content = content.replace(/\/\/ Initialize scroll positions[\s\S]*?}, \[step, startHour, startMinute, endHour, endMinute\]\);/, '');

// Remove handlePickerScroll function
content = content.replace(/\/\/ iOS Picker scroll handler[\s\S]*?ref\.current\.scrollTop = clampedIndex \* itemHeight;\s+\};/, '');

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Created compact time spinners!');
