const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add getBadge function after the state declarations
const getBadgeFunction = `
  const getBadge = (profile) => {
    const days = profile.created_at 
      ? Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24))
      : 0;
    const rating = profile.rating || 0;
    const views = profile.view_count || 0;

    if (rating >= 4.5 && profile.review_count >= 5) {
      return { text: 'Top-Bewertet', color: '#f6ad55', icon: '🏆' };
    }
    if (views > 100) {
      return { text: 'Beliebt', color: '#667eea', icon: '🔥' };
    }
    if (days < 7) {
      return { text: 'Neu', color: '#48bb78', icon: '✨' };
    }
    if (days < 30) {
      return { text: 'Aktiv', color: '#4299e1', icon: '⚡' };
    }
    return null;
  };
`;

// Insert after toggleFavorite function
if (!content.includes('const getBadge = (profile)')) {
  content = content.replace(
    'const toggleFavorite = (profile, e) => {',
    getBadgeFunction + '\n  const toggleFavorite = (profile, e) => {'
  );
}

// Add badge display in the badges section
const badgesPattern = /(profile\.rating > 0 && \([\s\S]*?<\/span>[\s\S]*?\)\)[\s\S]*?<\/div>)/;

const match = content.match(badgesPattern);
if (match) {
  const badgeCode = `
              {(() => {
                const badge = getBadge(profile);
                return badge ? (
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: badge.color,
                    color: 'white',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    {badge.icon} {badge.text}
                  </span>
                ) : null;
              })()}`;
  
  content = content.replace(match[1], match[1] + badgeCode);
  fs.writeFileSync('src/Helperr.jsx', content);
  console.log('✅ Badges added to profile cards!');
} else {
  console.log('❌ Could not find badges section');
}
