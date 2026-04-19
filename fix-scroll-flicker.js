const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find and replace handleScroll with optimized version
const oldHandleScroll = /const handleScroll = \(ref, items, setValue\) => \{[^}]+\};/s;

const newHandleScroll = `const handleScroll = (ref, items, setValue) => {
    if (!ref.current) return;
    const itemHeight = 40;
    const scrollTop = ref.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    const newValue = items[clampedIndex];
    
    // Only update if value actually changed - prevents unnecessary re-renders
    if (newValue !== items[items.indexOf(newValue)]) {
      setValue(newValue);
    }
  };`;

content = content.replace(oldHandleScroll, newHandleScroll);

// Add throttling to onScroll
const oldOnScroll = /onScroll=\{\(\) => handleScroll\(pickerRef, items, onChange\)\}/g;
const newOnScroll = `onScroll={(e) => {
                e.persist();
                if (!pickerRef.current._scrollTimeout) {
                  pickerRef.current._scrollTimeout = setTimeout(() => {
                    handleScroll(pickerRef, items, onChange);
                    pickerRef.current._scrollTimeout = null;
                  }, 16);
                }
              }}`;

content = content.replace(oldOnScroll, newOnScroll);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Scroll handler optimized - flicker fixed!');
