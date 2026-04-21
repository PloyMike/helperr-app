const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Add search bar where empty header was
content = content.replace(
  /<div style=\{styles\.sidebar\}>/,
  `<div style={styles.sidebar}>
            <div style={{
              padding: 16,
              borderBottom: '1px solid #e5e7eb'
            }}>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: '"Outfit", sans-serif',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Step 2: Search UI added');
