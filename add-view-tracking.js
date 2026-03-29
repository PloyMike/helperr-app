const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find the setSelected function call and add tracking
content = content.replace(
  /const handleMessageProvider = \(email\) => \{/,
  `const trackProfileView = async (profileId) => {
    try {
      // Get or create session ID
      let sessionId = localStorage.getItem('helperr_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('helperr_session_id', sessionId);
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('profile_views').insert({
        profile_id: profileId,
        viewer_email: user?.email || null,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleMessageProvider = (email) => {`
);

// Add tracking when profile is selected
content = content.replace(
  /onSelect=\{setSelected\}/g,
  `onSelect={(profile) => { setSelected(profile); trackProfileView(profile.id); }}`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ View tracking added to Homepage!');
