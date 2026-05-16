const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add useState for favorites at the top
if (!content.includes('const [favorites, setFavorites]')) {
  content = content.replace(
    'const [userLocation, setUserLocation] = useState(null);',
    `const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('helperr_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (profile, e) => {
    e.stopPropagation();
    const isFav = favorites.some(f => f.id === profile.id);
    let updated;
    if (isFav) {
      updated = favorites.filter(f => f.id !== profile.id);
    } else {
      updated = [...favorites, profile];
    }
    localStorage.setItem('helperr_favorites', JSON.stringify(updated));
    setFavorites(updated);
  };`
  );
}

// Add favorite button to profile cards - find the avatar div and add button before it
const avatarPattern = /(onClick=\{\(\) => window\.navigateTo\('profile', profile\)\}[\s\S]*?style=\{\{[\s\S]*?cursor: 'pointer'[\s\S]*?\}\}[\s\S]*?onMouseOver[\s\S]*?\}\}[\s\S]*?onMouseOut[\s\S]*?\}\}[\s\S]*?>[\s\S]*?)<div style=\{\{[\s\S]*?width: 80,[\s\S]*?height: 80,[\s\S]*?borderRadius: '50%'/;

const match = content.match(avatarPattern);
if (match) {
  const favoriteButton = `
            {/* Favorite Button */}
            <button
              onClick={(e) => toggleFavorite(profile, e)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 10,
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => {
                e.stopPropagation();
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.stopPropagation();
                e.target.style.transform = 'scale(1)';
              }}
            >
              {favorites.some(f => f.id === profile.id) ? '❤️' : '🤍'}
            </button>

            `;
  
  content = content.replace(match[1], match[1] + favoriteButton);
  
  // Also need to add position: relative to the card
  content = content.replace(
    "cursor: 'pointer',",
    "cursor: 'pointer',\n              position: 'relative',"
  );
  
  fs.writeFileSync('src/Helperr.jsx', content);
  console.log('✅ Favorite button added to profile cards!');
} else {
  console.log('❌ Could not find profile card pattern');
}
