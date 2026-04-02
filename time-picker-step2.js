const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Add time picker functions after getMonthName
const getMonthNameMatch = content.match(/const getMonthName = \(\) => \{[\s\S]*?\};/);

if (getMonthNameMatch) {
  const timeFunctions = `

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const getTimeString = () => {
    return \`\${startHour}:\${startMinute} - \${endHour}:\${endMinute}\`;
  };

  const isValidTimeRange = () => {
    const start = parseInt(startHour) * 60 + parseInt(startMinute);
    const end = parseInt(endHour) * 60 + parseInt(endMinute);
    return end > start;
  };`;

  content = content.replace(getMonthNameMatch[0], getMonthNameMatch[0] + timeFunctions);
  console.log('✅ Added time picker functions');
} else {
  console.log('❌ Could not find getMonthName function');
}

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('Done!');
