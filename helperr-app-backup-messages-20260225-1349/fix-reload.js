const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find the first useEffect and add our listener after it
const useEffectPattern = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/;
const match = content.match(useEffectPattern);

if (match) {
  const insertion = `

  // Reload profiles when coming back from registration
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '' || window.location.hash === '#') {
        // Coming back to home - reload profiles
        fetchProfiles();
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);`;
  
  content = content.replace(match[0], match[0] + insertion);
  fs.writeFileSync('src/Helperr.jsx', content);
  console.log('✅ Reload listener added!');
} else {
  console.log('❌ Could not find useEffect - trying alternative...');
}
