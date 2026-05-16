const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Add import
if (!content.includes("import ShareButton")) {
  content = content.replace(
    "import ProfileStats from './ProfileStats';",
    "import ProfileStats from './ProfileStats';\nimport ShareButton from './ShareButton';"
  );
}

// Add ShareButton after the booking button and before the info box
const infoBoxPattern = /(<div style=\{\{[\s\S]*?padding: 16,[\s\S]*?backgroundColor: '#edf2f7')/;

const shareButtonCode = `                {/* Share Button */}
                <ShareButton profile={profile} />

                $1`;

if (content.match(infoBoxPattern)) {
  content = content.replace(infoBoxPattern, shareButtonCode);
  fs.writeFileSync('src/ProfilDetail.jsx', content);
  console.log('✅ ShareButton added to ProfilDetail!');
} else {
  console.log('❌ Could not find info box pattern');
}
