const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add debug logging after fetching profile
const debugCode = `
      if (data) {
        console.log('🔍 DEBUG - Profile data:', data);
        console.log('🔍 DEBUG - Has job?', !!data.job);
        console.log('🔍 DEBUG - job value:', data.job);
        setProfile(data);
        setHasProviderProfile(!!data.job);
      } else {
        console.log('🔍 DEBUG - No profile data found!');
      }`;

content = content.replace(
  /if \(data\) \{\s*setProfile\(data\);\s*setHasProviderProfile\(!!data\.job\);\s*\}/,
  debugCode
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Debug logging added!');
