const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Update the CSS to hide arrow on mobile completely
const styleTag = /@media \(max-width: 640px\) \{[\s\S]*?\.time-divider-mobile \{ display: block !important; \}/;
content = content.replace(
  styleTag,
  `@media (max-width: 640px) {
          .desktop-time-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .time-divider-desktop { display: none !important; }
          .time-section { max-width: none !important; }
        }`
);

// Remove the mobile divider completely from JSX
content = content.replace(
  /<div style=\{styles\.timeDivider\} className="time-divider-desktop">→<\/div>\s*<div style=\{styles\.timeDividerMobile\} className="time-divider-mobile">↓<\/div>/,
  `<div style={styles.timeDivider} className="time-divider-desktop">→</div>`
);

// Remove timeDividerMobile style
content = content.replace(
  /timeDividerMobile: \{[^}]*\},\s*/,
  ''
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Mobile arrow removed - symmetrical boxes!');
