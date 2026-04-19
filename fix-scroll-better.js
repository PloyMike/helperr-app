const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Just add a simple debounce to reduce re-renders
const oldOnScroll = /onScroll=\{\(\) => handleScroll\(pickerRef, items, onChange\)\}/g;

const newOnScroll = `onScroll={(e) => {
                clearTimeout(pickerRef.current?._timeout);
                pickerRef.current._timeout = setTimeout(() => {
                  handleScroll(pickerRef, items, onChange);
                }, 50);
              }}`;

content = content.replace(oldOnScroll, newOnScroll);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Light throttling added - should reduce flicker!');
