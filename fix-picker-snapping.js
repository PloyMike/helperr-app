const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Replace the handlePickerScroll function with better snapping
const oldScrollHandler = /const handlePickerScroll = \(ref, setValue, items\) => \{[\s\S]*?\};/;

const newScrollHandler = `const handlePickerScroll = (ref, setValue, items) => {
    if (!ref.current) return;
    
    const itemHeight = 40;
    const scrollTop = ref.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    
    setValue(items[clampedIndex]);
  };

  const snapPicker = (ref, value, items) => {
    if (!ref.current) return;
    
    const itemHeight = 40;
    const index = items.indexOf(value);
    if (index !== -1) {
      ref.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }
  };`;

content = content.replace(oldScrollHandler, newScrollHandler);

// Update IOSPicker to add onScrollEnd
const oldIOSPicker = /<div[\s\S]*?ref=\{pickerRef\}[\s\S]*?style=\{styles\.iosPicker\}[\s\S]*?onScroll=\{\(\) => handlePickerScroll\(pickerRef, onChange, items\)\}[\s\S]*?>/;

const newIOSPicker = `<div 
          ref={pickerRef}
          style={styles.iosPicker}
          onScroll={() => handlePickerScroll(pickerRef, onChange, items)}
          onScrollEnd={() => snapPicker(pickerRef, value, items)}
          onTouchEnd={() => setTimeout(() => snapPicker(pickerRef, value, items), 100)}
        >`;

content = content.replace(oldIOSPicker, newIOSPicker);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Improved picker snapping!');
