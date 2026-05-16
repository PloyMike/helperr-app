const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Import useCallback hinzufügen
content = content.replace(
  /import React, \{ useState, useEffect \} from 'react';/,
  "import React, { useState, useEffect, useCallback } from 'react';"
);

// fetchBookedSlots mit useCallback wrappen
content = content.replace(
  /const fetchBookedSlots = async \(date\) => \{/,
  `const fetchBookedSlots = useCallback(async (date) => {`
);

// Schließende Klammer und Dependencies hinzufügen
content = content.replace(
  /setLoadingSlots\(false\);\s*\}\s*\};/,
  `setLoadingSlots(false);
    }
  }, [profile.id]);`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ useCallback warning fixed!');
