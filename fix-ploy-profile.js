const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jyuatojpkluyidpefzub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dWF0b2pwa2x1eWlkcGVmenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTI1MzcsImV4cCI6MjA4Njk2ODUzN30.l9IOEIzM3Z6abB87ZOERYBcYNgFWIIRju0bUxyWrNgY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPloyProfile() {
  console.log('🔧 Fixing ploy.tibor@gmail.com profile...\n');
  
  // First, get all profiles with this email to see what we have
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'ploy.tibor@gmail.com');
  
  console.log('Found profiles:', profiles);
  
  if (!profiles || profiles.length === 0) {
    console.log('❌ No profile found with this email!');
    return;
  }
  
  // Get the newest profile (last created)
  const newestProfile = profiles.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  )[0];
  
  console.log('\nNewest profile:', newestProfile.name);
  
  // Get all auth users to find the right user_id
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.log('Cannot list users, trying another approach...');
    console.log('Please provide the user_id from browser console when logged in');
    return;
  }
  
  const user = users.find(u => u.email === 'ploy.tibor@gmail.com');
  
  if (!user) {
    console.log('❌ No auth user found with this email!');
    return;
  }
  
  console.log('\nFound user_id:', user.id);
  
  // Update the newest profile
  const { data, error } = await supabase
    .from('profiles')
    .update({ user_id: user.id })
    .eq('id', newestProfile.id)
    .select();
  
  if (error) {
    console.log('❌ Error:', error);
    return;
  }
  
  console.log('\n✅ Profile updated!');
  console.log('Name:', newestProfile.name);
  console.log('Email:', newestProfile.email);
  console.log('User ID:', user.id);
}

fixPloyProfile();
