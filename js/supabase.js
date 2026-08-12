/* ------------------------------------------------------------------
   supabase.js – initialise the Supabase client and expose handy helpers
   ------------------------------------------------------------------ */

// Your Supabase credentials
const SUPABASE_URL = "https://ckvfvgtbgzycfnuyhppd.supabase.co";
const SUPABASE_ANON = "sb_publishable_Xi6dcjrMCsRTs6FIEXYjcQ_ZPBfI4Ny";

// Initialise client
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

/* -------------------------------------------------------------
   Helper: sign‑in (email + password + school name)
   ------------------------------------------------------------- */
export async function signIn(email, password, schoolName) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Incorrect Email or Password');
    }
    throw error;
  }

  // Verify that the logged-in user belongs to the requested school
  const { data: profile, error: profileErr } = await supabase
    .from('schools')
    .select('id')
    .eq('name', schoolName)
    .single();

  if (profileErr || !profile) {
    // Sign them out if the school name doesn't match
    await supabase.auth.signOut();
    throw new Error('Incorrect School Name');
  }

  // Store school info in the client for later queries and UI
  localStorage.setItem('currentSchoolId', profile.id);
  localStorage.setItem('currentSchoolName', schoolName);
  
  // Stash a tiny offline-account record (for offline switcher)
  cacheOfflineAccount(authData.user.id, schoolName, profile.id, email);

  return authData;
}

/* -------------------------------------------------------------
   Helper: sign‑up (first time a school creates an account)
   ------------------------------------------------------------- */
export async function signUp(email, password, schoolName) {
  // 1️⃣ Create a school row (if it does not already exist)
  const { data: school, error: schoolErr } = await supabase
    .from('schools')
    .upsert({ name: schoolName }, { onConflict: 'name' })
    .select('id')
    .single();

  if (schoolErr) throw schoolErr;

  // 2️⃣ Create the auth user, attaching the school name as metadata
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { school_name: schoolName }   // stored in auth.user_metadata
    }
  });

  if (error) throw error;

  // Store the school_id locally for later use
  localStorage.setItem('currentSchoolId', school.id);
  cacheOfflineAccount(authData.user.id, schoolName, school.id, email);
  return authData;
}

/* -------------------------------------------------------------
   Offline-account cache utilities
   ------------------------------------------------------------- */
function cacheOfflineAccount(userId, schoolName, schoolId, email) {
  const stored = JSON.parse(localStorage.getItem('offlineAccounts') || '{}');
  stored[userId] = { schoolName, schoolId, email };
  localStorage.setItem('offlineAccounts', JSON.stringify(stored));
}
