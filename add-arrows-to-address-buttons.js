const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Add arrow to Back button on address page (step 3)
content = content.replace(
  /(<button onClick=\{\(\) => setStep\(2\)\} style=\{styles\.btnSecondary\}>)\s*Back\s*(<\/button>)/,
  `$1
                  ← Back
                $2`
);

// Add arrow to Continue button on address page (step 3)
content = content.replace(
  /(<button[\s\S]*?setStep\(4\);[\s\S]*?style=\{styles\.btnPrimary\}>)\s*Continue\s*(<\/button>)/,
  `$1
                  Continue →
                $2`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Arrows added to address page buttons!');
