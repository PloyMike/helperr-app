const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Find and replace the large avatar
const oldAvatar = `<div style={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 64,
                fontWeight: 700,
                color: '#667eea',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
              }}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>`;

const newAvatar = `{profile.image_url ? (
                <img
                  src={profile.image_url}
                  alt={profile.name}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '5px solid white',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                  }}
                />
              ) : (
                <div style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 64,
                  fontWeight: 700,
                  color: '#667eea',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                }}>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                </div>
              )}`;

if (content.includes(oldAvatar)) {
  content = content.replace(oldAvatar, newAvatar);
  fs.writeFileSync('src/ProfilDetail.jsx', content);
  console.log('✅ ProfilDetail.jsx updated with images!');
} else {
  console.log('❌ Could not find avatar pattern');
}
