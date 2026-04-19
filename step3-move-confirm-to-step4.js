const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Change "step === 3" to "step === 4" for the confirm page
content = content.replace(/\{step === 3 && \(/g, '{step === 4 && (');

// Update the back button in confirm step to go back to step 3
content = content.replace(
  /(step === 4 &&[\s\S]*?onClick=\{\(\) => setStep\()2(\)\})/,
  '$13$2'
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Step 3: Confirm page moved to step 4!');
