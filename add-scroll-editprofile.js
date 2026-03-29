const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Find the last useState and add isScrolled after it
content = content.replace(
  /const \[showCategoryList, setShowCategoryList\] = useState\(false\);/,
  `const [showCategoryList, setShowCategoryList] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);`
);

// Add scroll listener
content = content.replace(
  /useEffect\(\(\) => \{\s+if \(user\) \{/,
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

// Update Header prop
content = content.replace(
  /<Header transparent=\{true\} \/>/g,
  '<Header transparent={true} isScrolled={isScrolled} />'
);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Scroll effect added to Edit Profile!');
