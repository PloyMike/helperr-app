const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Add import
if (!content.includes("import BookingCalendar")) {
  content = content.replace(
    "import ShareButton from './ShareButton';",
    "import ShareButton from './ShareButton';\nimport BookingCalendar from './BookingCalendar';"
  );
}

// Add state for showing calendar
if (!content.includes('const [showBooking, setShowBooking]')) {
  content = content.replace(
    'useEffect(() => {',
    `const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {`
  );
}

// Replace handleBooking function
const oldBookingFunction = /const handleBooking = \(\) => \{[\s\S]*?\};/;
const newBookingFunction = `const handleBooking = () => {
    setShowBooking(true);
  };`;

content = content.replace(oldBookingFunction, newBookingFunction);

// Add BookingCalendar component before closing Footer
const footerPattern = /(<Footer \/>[\s\S]*?<\/div>[\s\S]*?$)/;
const calendarCode = `      {showBooking && (
        <BookingCalendar 
          profile={profile} 
          onClose={() => setShowBooking(false)} 
        />
      )}
      $1`;

content = content.replace(footerPattern, calendarCode);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ BookingCalendar integrated into ProfilDetail!');
