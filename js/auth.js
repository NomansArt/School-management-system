/* ------------------------------------------------------------------
   auth.js – logout & offline-account management
   ------------------------------------------------------------------ */
import { supabase } from "./supabase.js";

/**
 * LOG OUT -----------------------------------------------------------
 *  • Sign out from Supabase (clears the JWT)
 *  • Remove the cached entry for the current user
 *  • Delete all rows that belong to that school from IndexedDB
 *  • Show the login screen again
 */
export async function logout() {
  // 1️⃣ Revoke Supabase session
  await supabase.auth.signOut();

  // 2️⃣ Remove the offline-accounts entry
  const { data: { user } } = await supabase.auth.getUser();
  const current = user?.id;
  
  const all = JSON.parse(localStorage.getItem('offlineAccounts') || '{}');
  if (current && all[current]) {
    const schoolId = all[current].schoolId;
    delete all[current];
    localStorage.setItem('offlineAccounts', JSON.stringify(all));

    // 3️⃣ Wipe the school’s data from IndexedDB
    await clearSchoolDataFromIndexedDB(schoolId);
  }

  // 4️⃣ Remove the remembered school_id
  localStorage.removeItem('currentSchoolId');

  // 5️⃣ Redirect to login
  location.href = "login.html";
}

/**
 * Clears every record that belongs to a given school_id.
 */
async function clearSchoolDataFromIndexedDB(schoolId) {
  if (!window.db || !window.db.db) return; // Ensure DB is loaded
  
  const tx = window.db.db.transaction(
    ["students", "teachers", "parents", "fees"],
    "readwrite"
  );

  for (const storeName of tx.objectStoreNames) {
    const store = tx.objectStore(storeName);
    const idx = store.index("school_id");
    const range = IDBKeyRange.only(schoolId);
    
    // We use a promise wrapper to handle cursor
    await new Promise((resolve, reject) => {
      const request = idx.openCursor(range);
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }
}

/**
 * SWITCH ACCOUNT ----------------------------------------------------
 * Shows a small modal with all cached accounts and lets the user pick one.
 */
export function showAccountSwitcher() {
  const accounts = JSON.parse(localStorage.getItem('offlineAccounts') || '{}');
  if (Object.keys(accounts).length === 0) {
    if (window.showToast) {
        window.showToast('No cached accounts on this device.', 'warning');
    } else {
        alert('No cached accounts on this device.');
    }
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Switch Account</h2>
      <p style="margin-bottom: 15px; font-size: 0.9rem; opacity: 0.8;">Select a locally cached account</p>
      <ul id="account-list" style="list-style: none; padding: 0; margin: 0; margin-bottom: 20px;"></ul>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn secondary" id="close-switcher">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const list = modal.querySelector('#account-list');
  for (const [uid, info] of Object.entries(accounts)) {
    const li = document.createElement('li');
    li.style.padding = '12px';
    li.style.background = 'var(--bg-secondary)';
    li.style.borderRadius = 'var(--radius-md)';
    li.style.marginBottom = '8px';
    li.style.cursor = 'pointer';
    li.style.display = 'flex';
    li.style.flexDirection = 'column';
    li.innerHTML = `
        <strong style="color: var(--accent-primary);">${info.schoolName || 'School'}</strong>
        <span style="font-size: 0.85rem; opacity: 0.8;">${info.email || uid}</span>
    `;
    
    li.onclick = async () => {
      // Set the current school id
      localStorage.setItem('currentSchoolId', info.schoolId);
      // We must also mock the JWT or somehow let the app know which user is active. 
      // Supabase's offline switch doesn't change the remote token, so if they are offline,
      // it works purely from localStorage.
      
      modal.remove();
      
      // Reload page to reflect new data
      location.reload();
    };
    list.appendChild(li);
  }

  modal.querySelector('#close-switcher').onclick = () => modal.remove();
}
