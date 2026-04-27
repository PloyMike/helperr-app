const fs = require('fs');

let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Replace formatDateFull to parse ISO date in local timezone
content = content.replace(
  /const formatDateFull = \(date\) => \{\s*return date\.toLocaleDateString\('en-US', \{ weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' \}\);\s*\};/,
  `const formatDateFull = (date) => {
    // If date is a string (ISO format), parse it in local timezone
    if (typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      date = new Date(year, month - 1, day); // month is 0-indexed
    }
    return date.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Timezone bug fixed!');
console.log('   - ISO dates now parsed in local timezone');
console.log('   - April 28 will show as April 28 (not April 27)');
