const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Replace absolute positioned badge with inline badge for My Bookings
content = content.replace(
  /My Bookings\s*\{myBookingsBadge > 0 && \(\s*<span style=\{\{\s*position: 'absolute',\s*top: '50%',\s*right: -10,\s*transform: 'translateY\(-50%\)',\s*background: '#ef4444',\s*color: 'white',\s*borderRadius: '50%',\s*width: 18,\s*height: 18,\s*fontSize: 11,\s*fontWeight: 700,\s*display: 'flex',\s*alignItems: 'center',\s*justifyContent: 'center'\s*\}\}>\s*\{myBookingsBadge\}\s*<\/span>\s*\)\}/,
  `My Bookings
                    {myBookingsBadge > 0 && (
                      <span style={{
                        marginLeft: 6,
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {myBookingsBadge}
                      </span>
                    )}`
);

// Same for Provider Bookings
content = content.replace(
  /Provider Bookings\s*\{providerBookingsBadge > 0 && \(\s*<span style=\{\{\s*position: 'absolute',\s*top: '50%',\s*right: -10,\s*transform: 'translateY\(-50%\)',\s*background: '#ef4444',\s*color: 'white',\s*borderRadius: '50%',\s*width: 18,\s*height: 18,\s*fontSize: 11,\s*fontWeight: 700,\s*display: 'flex',\s*alignItems: 'center',\s*justifyContent: 'center'\s*\}\}>\s*\{providerBookingsBadge\}\s*<\/span>\s*\)\}/,
  `Provider Bookings
                      {providerBookingsBadge > 0 && (
                        <span style={{
                          marginLeft: 6,
                          background: '#ef4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {providerBookingsBadge}
                        </span>
                      )}`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Badges now inline - right next to text!');
