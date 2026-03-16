const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Ersetze timeSlots Definition
content = content.replace(
  /const timeSlots = \[[\s\S]*?\];/,
  `const timeSlots = [
    { value: '08:00', label: '08:00', icon: '🌅' },
    { value: '09:00', label: '09:00', icon: '🌅' },
    { value: '10:00', label: '10:00', icon: '☀️' },
    { value: '11:00', label: '11:00', icon: '☀️' },
    { value: '12:00', label: '12:00', icon: '🌞' },
    { value: '13:00', label: '13:00', icon: '🌞' },
    { value: '14:00', label: '14:00', icon: '☀️' },
    { value: '15:00', label: '15:00', icon: '☀️' },
    { value: '16:00', label: '16:00', icon: '🌆' },
    { value: '17:00', label: '17:00', icon: '🌆' },
    { value: '18:00', label: '18:00', icon: '🌃' },
    { value: '19:00', label: '19:00', icon: '🌃' },
    { value: '20:00', label: '20:00', icon: '🌙' }
  ];`
);

// Ersetze das TIME SLOT SELECTION Grid Layout
content = content.replace(
  /<div style=\{\{ display: 'grid', gap: 16 \}\}>/,
  `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>`
);

// Vereinfache die Time Slot Buttons
content = content.replace(
  /style=\{\{[\s\S]*?padding: 24,[\s\S]*?background: isSelected[\s\S]*?display: 'flex',[\s\S]*?alignItems: 'center',[\s\S]*?gap: 16,/,
  `style={{
                            padding: '20px 16px',
                            background: isSelected ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' : 'white',
                            border: isSelected ? 'none' : '2px solid #E5E7EB',
                            borderRadius: 16,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 8,`
);

// Ersetze das Icon Styling
content = content.replace(
  /<div style=\{\{[\s\S]*?fontSize: 40,[\s\S]*?width: 60,[\s\S]*?height: 60,[\s\S]*?display: 'flex',[\s\S]*?alignItems: 'center',[\s\S]*?justifyContent: 'center',[\s\S]*?background: isSelected[\s\S]*?borderRadius: 12[\s\S]*?\}\}>[\s\S]*?\{slot\.icon\}[\s\S]*?<\/div>/,
  `<div style={{
                            fontSize: 32
                          }}>
                            {slot.icon}
                          </div>`
);

// Ersetze die Zeit-Text-Struktur
content = content.replace(
  /<div style=\{\{ flex: 1, textAlign: 'left' \}\}>[\s\S]*?<h3 style=\{\{[\s\S]*?\}\}>[\s\S]*?\{slot\.label\}[\s\S]*?<\/h3>[\s\S]*?<p style=\{\{[\s\S]*?\}\}>[\s\S]*?\{slot\.time\}[\s\S]*?<\/p>[\s\S]*?<\/div>/,
  `<div style={{ textAlign: 'center' }}>
                            <h3 style={{
                              margin: 0,
                              fontSize: 18,
                              fontWeight: 700,
                              color: isSelected ? 'white' : '#1F2937'
                            }}>
                              {slot.label}
                            </h3>
                          </div>`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ 24-Stunden-Modus aktiviert!');
