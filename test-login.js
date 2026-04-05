import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfuzxclwoosqlxcxmuod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdXp4Y2x3b29zcWx4Y3htdW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjM3MTIsImV4cCI6MjA5MDkzOTcxMn0.nPVUi8HTUCj6bN_8eP8yqpMmDGMjoMuWTySEOS-UoyA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Attempting login...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'superadmin@gmail.com',
    password: 'Raunak@12583'
  });

  if (authError) {
    console.error("AUTH ERROR:", JSON.stringify(authError, null, 2));
    return;
  }
  
  console.log("Login success! User ID:", authData.user.id);
  
  console.log("Fetching profile...");
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .maybeSingle();
    
  if (profileError) {
    console.error("PROFILE ERROR:", profileError.message);
  } else if (!profile) {
    console.log("PROFILE NOT FOUND in the profiles table!");
  } else {
    console.log("Profile successfully found:", profile);
  }
}

test();
