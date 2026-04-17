const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the customerName onChange handler and add validation
const oldOnChange = /onChange=\{\(e\) => setCustomerName\(e\.target\.value\)\}/;

const newOnChange = `onChange={(e) => {
                    const value = e.target.value;
                    // Block emails, phone numbers, URLs
                    if (value.includes('@') || 
                        value.includes('http') || 
                        value.includes('www.') ||
                        value.match(/[\+\d]{8,}/) || // 8+ digits/numbers in a row
                        value.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d/) // phone patterns
                    ) {
                      alert('⚠️ Please enter only your name. No emails, phone numbers or links allowed. All communication happens through Helperr Messages.');
                      return;
                    }
                    setCustomerName(value);
                  }}`;

content = content.replace(oldOnChange, newOnChange);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Booking validation added - blocks emails, phones, URLs!');
