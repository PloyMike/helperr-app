const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Add Header & Footer imports
if (!content.includes("import Header")) {
  content = content.replace(
    "import ReviewSection from './ReviewSection';",
    "import ReviewSection from './ReviewSection';\nimport Header from './Header';\nimport Footer from './Footer';"
  );
}

// Add Header component after opening div
content = content.replace(
  '<div style={{minHeight:\'100vh\',backgroundColor:\'#F9FAFB\',paddingTop:70}}>',
  '<div style={{minHeight:\'100vh\',backgroundColor:\'#F9FAFB\'}}>\n      <Header/>'
);

// Add Footer before closing div and BookingCalendar
content = content.replace(
  '{showBooking&&<BookingCalendar',
  '<Footer/>\n\n      {showBooking&&<BookingCalendar'
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ ProfilDetail.jsx updated with Header & Footer!');
