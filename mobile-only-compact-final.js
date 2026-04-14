const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find and update the existing @media CSS to include ALL compact styles
const mediaQuery = /@media \(max-width: 640px\) \{[\s\S]*?\n        \}/;

const newMediaQuery = `@media (max-width: 640px) {
          .desktop-time-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .time-divider-desktop { display: none !important; }
          .time-section { 
            max-width: none !important;
            padding: 8px !important;
            margin-bottom: 6px !important;
            border-radius: 10px !important;
          }
          .scroll-picker-wrapper {
            height: 120px !important;
          }
          .scroll-spacer {
            height: 40px !important;
          }
          .time-section-label {
            margin-bottom: 6px !important;
          }
          .time-preview {
            padding: 8px !important;
            margin-bottom: 10px !important;
          }
        }`;

content = content.replace(mediaQuery, newMediaQuery);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Mobile ONLY compact - Desktop stays the same!');
