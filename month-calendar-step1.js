const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Add currentMonth state after selectedDate
const stateMatch = content.match(/const \[selectedDate, setSelectedDate\] = useState\(''\);/);
if (stateMatch) {
  content = content.replace(
    /const \[selectedDate, setSelectedDate\] = useState\(''\);/,
    `const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());`
  );
  console.log('✅ Added currentMonth state');
} else {
  console.log('❌ Could not find selectedDate state');
}

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('Done!');
