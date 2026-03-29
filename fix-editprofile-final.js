const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Add isScrolled state
content = content.replace(
  /const \[formData, setFormData\] = useState\(\{/,
  `const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({`
);

// Add scroll listener before the first useEffect
const lines = content.split('\n');
let insertIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('useEffect(() => {')) {
    insertIndex = i;
    break;
  }
}

if (insertIndex !== -1) {
  const scrollListener = `  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

`;
  lines.splice(insertIndex, 0, scrollListener);
  content = lines.join('\n');
}

// Update Header props
content = content.replace(
  /<Header transparent=\{true\} \/>/g,
  '<Header transparent={true} isScrolled={isScrolled} />'
);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Edit Profile scroll effect properly added!');
