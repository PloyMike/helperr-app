const fs = require('fs');
let content = fs.readFileSync('src/ChatModal.jsx', 'utf8');

// Füge receiver_email zum Insert hinzu
content = content.replace(
  `const { error } = await supabase.from('messages').insert([{
        sender_name: currentUserName,
        sender_email: currentUserEmail,
        receiver_profile_id: profile.id,
        receiver_name: profile.name,
        message: newMessage,
        read: false
      }]);`,
  `const { error } = await supabase.from('messages').insert([{
        sender_name: currentUserName,
        sender_email: currentUserEmail,
        receiver_profile_id: profile.id,
        receiver_name: profile.name,
        receiver_email: profile.email || null,
        message: newMessage,
        read: false
      }]);`
);

fs.writeFileSync('src/ChatModal.jsx', content);
console.log('✅ ChatModal updated!');
