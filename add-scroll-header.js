const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add scroll state
content = content.replace(
  /const \[selected, setSelected\] = useState\(null\);/,
  `const [selected, setSelected] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);`
);

// Add scroll listener
content = content.replace(
  /useEffect\(\(\) => \{[\s\S]*?fetchProfiles\(\);/,
  `useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchProfiles();`
);

// Update Header prop
content = content.replace(
  /<Header transparent=\{true\} \/>/,
  '<Header transparent={true} isScrolled={isScrolled} />'
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Scroll detection added to Homepage!');
