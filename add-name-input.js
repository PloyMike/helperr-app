const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Add customerName state
content = content.replace(
  /const \[message, setMessage\] = useState\(''\);/,
  `const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');`
);

// Initialize customerName from user data
content = content.replace(
  /const fetchUserProfile = async \(\) => \{[\s\S]*?if \(user\) \{/,
  `const fetchUserProfile = async () => {
      if (user) {
        // Set customer name from auth or profile
        const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || '';
        setCustomerName(userName);
        
`
);

// Update customer_name to use state
content = content.replace(
  /customer_name: user\?\.user_metadata\?\.name \|\| user\?\.email\?\.split\('@'\)\[0\] \|\| 'Customer',/,
  `customer_name: customerName || 'Customer',`
);

// Add name input field before message field
content = content.replace(
  /<div style=\{styles\.formGroup\}>[\s\S]*?<label style=\{styles\.label\}>Message \(Optional\)<\/label>/,
  `<div style={styles.formGroup}>
                <label style={styles.label}>Your Name *</label>
                <input 
                  type="text"
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  style={styles.input}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message (Optional)</label>`
);

// Update summary to show customerName
content = content.replace(
  /<span style=\{styles\.summaryValue\}>\{user\?\.user_metadata\?\.name \|\| user\?\.email\?\.split\('@'\)\[0\] \|\| 'Not set'\}<\/span>/,
  `<span style={styles.summaryValue}>{customerName || 'Not set'}</span>`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Name input added to booking form!');
