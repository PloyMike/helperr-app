const fs = require('fs');

// Read current ProfilDetail
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Add Outfit font import at the top of the component
if (!content.includes('Outfit')) {
  content = content.replace(
    'return (',
    `return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div>`
  );
  // Close the wrapper div at the end
  content = content.replace(/}\s*export default/, `    </div>
    </>
  );
}

export default`);
}

// Update colors - Teal gradient
content = content.replace(
  /background: 'linear-gradient\(135deg, #667eea 0%, #764ba2 100%\)'/g,
  "background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)'"
);

// Update button colors to teal
content = content.replace(
  /backgroundColor: '#667eea'/g,
  "backgroundColor: '#14B8A6'"
);

content = content.replace(
  /background: '#667eea'/g,
  "background: '#14B8A6'"
);

// Orange accents for CTA buttons
content = content.replace(
  /background: 'linear-gradient\(135deg, #667eea 0%, #764ba2 100%\)'/g,
  "background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'"
);

// Update "Jetzt buchen" button to orange
const jetzBuchenPattern = /<button[\s\S]*?Jetzt buchen[\s\S]*?<\/button>/g;
content = content.replace(jetzBuchenPattern, (match) => {
  return match.replace(
    /background: 'linear-gradient\(135deg, #14B8A6 0%, #0D9488 100%\)'/g,
    "background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'"
  );
});

// Update font families to Outfit
content = content.replace(
  /fontFamily: '.*?'/g,
  "fontFamily: '\"Outfit\", sans-serif'"
);

// Update rounded corners
content = content.replace(
  /borderRadius: 12/g,
  'borderRadius: 16'
);

content = content.replace(
  /borderRadius: 8/g,
  'borderRadius: 12'
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ ProfilDetail updated to Fresh & Confident!');
