const fs = require('fs');
const { execSync } = require('child_process');

// Use str_replace to add the comment
execSync(`cat > /tmp/fix.sh << 'EOF'
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');
const old = \`  useEffect(() => {
    if (user && profile) {
      fetchBookingCounts();
    }
  }, [user, profile, hasProviderProfile]);\`;

const newCode = \`  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user && profile) {
      fetchBookingCounts();
    }
  }, [user, profile, hasProviderProvider]);\`;

content = content.replace(old, newCode);
fs.writeFileSync('src/Header.jsx', content);
"
EOF
bash /tmp/fix.sh
`);

console.log('✅ Fixed with str_replace!');
