const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add Header import
if (!content.includes("import Header")) {
  content = content.replace(
    "import AdvancedFilters from './AdvancedFilters';",
    "import AdvancedFilters from './AdvancedFilters';\nimport Header from './Header';\nimport Footer from './Footer';"
  );
}

// Add Header component after opening div
content = content.replace(
  '<div style={{minHeight:\'100vh\',backgroundColor:\'#F9FAFB\'}}>',
  '<div style={{minHeight:\'100vh\',backgroundColor:\'#F9FAFB\'}}>\n      <Header/>'
);

// Add paddingTop to hero section
content = content.replace(
  '<div style={{background:\'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)\',color:\'white\',padding:\'120px 20px 80px\'',
  '<div style={{background:\'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)\',color:\'white\',padding:\'140px 20px 80px\''
);

// Add Footer before closing div (before last </div>)
const lines = content.split('\n');
const lastDivIndex = lines.lastIndexOf('    </div>');
if (lastDivIndex > 0) {
  lines.splice(lastDivIndex, 0, '      <Footer/>');
  content = lines.join('\n');
}

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Helperr.jsx updated with Header & Footer!');
