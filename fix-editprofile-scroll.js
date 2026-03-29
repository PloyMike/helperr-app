const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Find the first useEffect and add scroll listener before it
content = content.replace(
  /useEffect\(\(\) => \{[\s]*if \(user\) \{/,
  `useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {`
);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Scroll listener added to Edit Profile!');
