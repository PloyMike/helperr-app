const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Add mobile-specific compact styles to the CSS
const styleTag = /@media \(max-width: 640px\) \{[\s\S]*?\}/;
content = content.replace(
  styleTag,
  `@media (max-width: 640px) {
          .desktop-time-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .time-divider-desktop { display: none !important; }
          .time-section { 
            max-width: none !important; 
            padding: 8px !important;
            margin-bottom: 6px !important;
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
        }`
);

// Add classNames to elements
content = content.replace(
  /<div style=\{styles\.scrollPickerWrapper\}>/g,
  `<div style={styles.scrollPickerWrapper} className="scroll-picker-wrapper">`
);

content = content.replace(
  /<div style=\{styles\.scrollSpacer\}><\/div>/g,
  `<div style={styles.scrollSpacer} className="scroll-spacer"></div>`
);

content = content.replace(
  /<div style=\{styles\.timeSectionLabel\}>/g,
  `<div style={styles.timeSectionLabel} className="time-section-label">`
);

content = content.replace(
  /<div style=\{styles\.timePreview\}>/,
  `<div style={styles.timePreview} className="time-preview">`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Mobile-only compact mode activated!');
