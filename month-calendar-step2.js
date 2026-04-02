const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find getAvailableDates function and replace it
const getAvailableDatesMatch = content.match(/const getAvailableDates = \(\) => \{[\s\S]*?return dates;\s*\};/);

if (getAvailableDatesMatch) {
  const newFunctions = `const getMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let startingDayOfWeek = firstDay.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      dates.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push(date);
    }
    
    return dates;
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };`;

  content = content.replace(getAvailableDatesMatch[0], newFunctions);
  console.log('✅ Replaced getAvailableDates with month calendar functions');
} else {
  console.log('❌ Could not find getAvailableDates function');
}

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('Done!');
