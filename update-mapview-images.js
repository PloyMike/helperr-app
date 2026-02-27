const fs = require('fs');
let content = fs.readFileSync('src/MapView.jsx', 'utf8');

// Add avatar/image before the h3 in Popup
const popupPattern = /(<Popup>[\s\S]*?<div style=\{\{ padding: 8, minWidth: 200 \}\}>[\s\S]*?)(<h3 style=)/;

const match = content.match(popupPattern);
if (match) {
  const imageCode = `
                  {profile.image_url ? (
                    <img
                      src={profile.image_url}
                      alt={profile.name}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginBottom: 12,
                        border: '2px solid #667eea',
                        display: 'block',
                        margin: '0 auto 12px'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      fontWeight: 700,
                      color: 'white',
                      margin: '0 auto 12px'
                    }}>
                      {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  `;
  
  content = content.replace(popupPattern, `$1${imageCode}$2`);
  fs.writeFileSync('src/MapView.jsx', content);
  console.log('✅ MapView.jsx updated with images!');
} else {
  console.log('❌ Could not find popup pattern');
}
