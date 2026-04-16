const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Find the dropdown section and add Messages at the top
const oldDropdown = /({showDropdown && \(\s*<div style=\{styles\.dropdown\}>\s*)<button/;

const newDropdown = `$1<button 
                          onClick={() => { setShowDropdown(false); window.navigateTo('messages'); }}
                          style={styles.dropdownItem}
                        >
                          Messages
                        </button>
                        <button`;

content = content.replace(oldDropdown, newDropdown);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 3: Messages added to profile dropdown!');
