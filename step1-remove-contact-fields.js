const fs = require('fs');
let content = fs.readFileSync('src/ProviderRegistration.jsx', 'utf8');

// 1. Remove from formData state
content = content.replace(
  /name: '', job: '', city: '', country: '', price: '', bio: '', phone: '', email: '', whatsapp: ''/,
  `name: '', job: '', city: '', country: '', price: '', bio: '', languages: ''`
);

// 2. Remove the three contact input fields
const contactFields = /<div style=\{\{marginBottom:28,textAlign:'left'\}\}>\s*<label style=\{labelStyle\}>Telefon<\/label>[\s\S]*?<\/div>\s*<div style=\{\{marginBottom:28,textAlign:'left'\}\}>\s*<label style=\{labelStyle\}>E-Mail<\/label>[\s\S]*?<\/div>\s*<div style=\{\{marginBottom:28,textAlign:'left'\}\}>\s*<label style=\{labelStyle\}>WhatsApp<\/label>[\s\S]*?<\/div>/;

content = content.replace(contactFields, '');

fs.writeFileSync('src/ProviderRegistration.jsx', content);
console.log('✅ Step 1: Contact fields removed (Telefon, Email, WhatsApp)!');
