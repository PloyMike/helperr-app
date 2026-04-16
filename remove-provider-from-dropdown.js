const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Remove "Become a Provider" from dropdown
const removeProviderButton = /\{!hasProviderProfile && \(\s*<button\s*onClick=\{\(\) => \{ setShowDropdown\(false\); window\.navigateTo\('register'\); \}\}\s*style=\{styles\.dropdownItem\}\s*>\s*Become a Provider\s*<\/button>\s*\)\}/s;

content = content.replace(removeProviderButton, '');

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 4: Become a Provider removed from dropdown!');
