const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Ändere Grid Layout für Zeitslots - schmaler wie Datum
content = content.replace(
  /gridTemplateColumns: 'repeat\(auto-fill, minmax\(100px, 1fr\)\)',/,
  "gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',"
);

// Reduziere Padding der Zeit-Buttons
content = content.replace(
  /padding: '20px 16px',[\s\S]*?background: isSelected \? 'linear-gradient\(135deg, #14B8A6 0%, #0D9488 100%\)' : 'white',/,
  `padding: '14px 12px',
                            background: isSelected ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' : 'white',`
);

// Reduziere Font-Size des h3 in Zeit-Buttons
content = content.replace(
  /fontSize: 20,[\s\S]*?fontWeight: 700,[\s\S]*?color: isSelected \? 'white' : '#1F2937'[\s\S]*?\}\}>[\s\S]*?\{slot\.label\}/,
  `fontSize: 14,
                            fontWeight: 600,
                            color: isSelected ? 'white' : '#1F2937'
                          }}>
                            {slot.label}`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Zeitslots kompakter & professioneller gemacht!');
