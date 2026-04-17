const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Fix handleLogout to clear user state immediately
const oldLogout = /const handleLogout = async \(\) => \{[^}]+\};/s;

const newLogout = `const handleLogout = async () => {
    setShowMobileMenu(false);
    setUser(null);
    setProfile(null);
    setHasProviderProfile(false);
    await supabase.auth.signOut();
    window.location.href = '/';
  };`;

content = content.replace(oldLogout, newLogout);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Logout now clears user state immediately!');
