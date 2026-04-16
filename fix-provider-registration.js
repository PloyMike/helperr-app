const fs = require('fs');
let content = fs.readFileSync('src/ProviderRegistration.jsx', 'utf8');

// Find the insert statement and add user_id
const oldInsert = /const \{ error \} = await supabase\.from\('profiles'\)\.insert\(\[\{ \.\.\.formData, available: true/;

const newInsert = `// Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');
      
      const { error } = await supabase.from('profiles').insert([{ 
        ...formData, 
        user_id: user.id,
        available: true`;

content = content.replace(oldInsert, newInsert);

fs.writeFileSync('src/ProviderRegistration.jsx', content);
console.log('✅ Provider registration now saves user_id!');
