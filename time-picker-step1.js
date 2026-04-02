const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Add time picker states after selectedTimeSlot
const stateMatch = content.match(/const \[selectedTimeSlot, setSelectedTimeSlot\] = useState\(''\);/);

if (stateMatch) {
  content = content.replace(
    /const \[selectedTimeSlot, setSelectedTimeSlot\] = useState\(''\);/,
    `const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [startHour, setStartHour] = useState('10');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('11');
  const [endMinute, setEndMinute] = useState('00');`
  );
  console.log('✅ Added time picker states');
} else {
  console.log('❌ Could not find selectedTimeSlot state');
}

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('Done!');
