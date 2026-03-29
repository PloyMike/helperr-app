const fs = require('fs');
let content = fs.readFileSync('src/ProviderBookingsPage.jsx', 'utf8');

// Add scroll state
content = content.replace(
  /const \[userProfile, setUserProfile\] = useState\(null\);/,
  `const [userProfile, setUserProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);`
);

// Add scroll listener at the beginning of useEffect
content = content.replace(
  /useEffect\(\(\) => \{[\s\S]*?const checkProfile = async/,
  `useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkProfile = async`
);

// Update Header prop
content = content.replace(
  /<Header \/>/g,
  '<Header transparent={true} isScrolled={isScrolled} />'
);

fs.writeFileSync('src/ProviderBookingsPage.jsx', content);
console.log('✅ Scroll effect added to Provider Bookings!');
