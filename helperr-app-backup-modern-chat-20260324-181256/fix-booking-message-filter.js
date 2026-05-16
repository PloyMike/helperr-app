const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Füge die Filter-Funktion nach den imports ein
content = content.replace(
  /function BookingCalendar\(\{ profile, onClose \}\) \{/,
  `function BookingCalendar({ profile, onClose }) {
  
  const containsForbiddenContent = (text) => {
    const forbiddenPatterns = [
      /\\b\\d{10,}\\b/,
      /\\+?\\d[\\d\\s\\-()]{8,}/,
      /\\b0\\d{9}\\b/,
      /@/,
      /\\[at\\]/i,
      /\\.com\\b/i,
      /\\.net\\b/i,
      /\\.org\\b/i,
      /\\.de\\b/i,
      /\\.co\\b/i,
      /whatsapp/i,
      /line\\s*id/i,
      /telegram/i,
      /facebook/i,
      /instagram/i,
      /wechat/i,
      /viber/i,
      /signal/i
    ];

    return forbiddenPatterns.some(pattern => pattern.test(text));
  };
`
);

// Füge Check vor dem Submit hinzu
content = content.replace(
  /const handleSubmit = async \(e\) => \{[\s\S]*?e\.preventDefault\(\);/,
  `const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check message for forbidden content
    if (message && containsForbiddenContent(message)) {
      alert('⚠️ Your message contains phone numbers, emails, or external contact methods which are not allowed. Please use our platform messaging for all communication.');
      return;
    }`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Booking message filter added!');
