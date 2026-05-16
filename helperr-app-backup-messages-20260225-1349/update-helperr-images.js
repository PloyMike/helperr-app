const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find and replace the avatar div
const oldAvatar = `<div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
              color: 'white',
              marginBottom: 16
            }}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>`;

const newAvatar = `{profile.image_url ? (
              <img
                src={profile.image_url}
                alt={profile.name}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: 16,
                  border: '3px solid #667eea'
                }}
              />
            ) : (
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                fontWeight: 700,
                color: 'white',
                marginBottom: 16
              }}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}`;

if (content.includes(oldAvatar)) {
  content = content.replace(oldAvatar, newAvatar);
  fs.writeFileSync('src/Helperr.jsx', content);
  console.log('✅ Helperr.jsx updated with images!');
} else {
  console.log('❌ Could not find avatar pattern');
}
