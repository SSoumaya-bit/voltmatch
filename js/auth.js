// ═══════════════════════════════════════════════════
//  VOLTMATCH — Firebase Auth Module (js/auth.js)
//  Works with Firebase CDN modular SDK v10
// ═══════════════════════════════════════════════════

// Firebase config
const _fbConfig = {
  apiKey: "AIzaSyCm4NoGszw1vn5kCBeNDX2_UFmj76uH-Lw",
  authDomain: "voltrust.firebaseapp.com",
  projectId: "voltrust",
  storageBucket: "voltrust.firebasestorage.app",
  messagingSenderId: "990721122566",
  appId: "1:990721122566:web:fc2ac64c8561c032033e87"
};

// We load Firebase dynamically as ES modules then expose helpers on window
(function() {
  // Inject a <script type="module"> that sets up Firebase and bridges to window
  const mod = document.createElement('script');
  mod.type = 'module';
  mod.textContent = `
import { initializeApp }                   from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
         signOut, onAuthStateChanged }     from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const app  = initializeApp(${JSON.stringify(_fbConfig)});
const auth = getAuth(app);

// Bridge to non-module scripts
window._vmAuth = { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
window.dispatchEvent(new Event('vmAuthReady'));
`;
  document.head.appendChild(mod);
})();

// ── Wait for Firebase then wire up auth state ───────
window.addEventListener('vmAuthReady', function() {
  const { auth, onAuthStateChanged } = window._vmAuth;

  onAuthStateChanged(auth, function(user) {
    _updateAuthUI(user);
  });
});

// ── UI Update: swap "Connexion" button / show user email ──
function _updateAuthUI(user) {
  const loginBtnArea = document.getElementById('authNavArea');
  if (!loginBtnArea) return;

  const lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'fr';
  const isEn = lang === 'en';

  if (user) {
    // Show avatar + email + sign-out
    const short = user.email.split('@')[0].slice(0, 1).toUpperCase();
    loginBtnArea.innerHTML = `
      <div class="auth-user-pill">
        <div class="auth-avatar">${short}</div>
        <span class="auth-email">${user.email}</span>
        <button class="auth-signout-btn" onclick="vmSignOut()" title="${isEn ? 'Sign out' : 'Se déconnecter'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    `;
  } else {
    loginBtnArea.innerHTML = `
      <button onclick="document.getElementById('loginModal').classList.remove('hidden')"
              class="btn btn-ghost btn-sm" data-i18n="nav_login">
        ${isEn ? 'Sign in' : 'Connexion'}
      </button>
    `;
  }
}

// ── Public helpers ──────────────────────────────────
function vmSignOut() {
  if (!window._vmAuth) return;
  const { auth, signOut } = window._vmAuth;
  signOut(auth).catch(console.error);
}

function vmAuthSubmit(mode) {
  if (!window._vmAuth) {
    _showAuthError('Firebase not loaded yet — please wait a moment and try again.');
    return;
  }
  const { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = window._vmAuth;

  const emailEl = document.getElementById('authEmail');
  const passEl  = document.getElementById('authPassword');
  if (!emailEl || !passEl) return;

  const email    = emailEl.value.trim();
  const password = passEl.value;
  const lang     = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'fr';
  const isEn     = lang === 'en';

  _clearAuthError();
  _setAuthLoading(true);

  const op = mode === 'signup'
    ? createUserWithEmailAndPassword(auth, email, password)
    : signInWithEmailAndPassword(auth, email, password);

  op.then(function() {
    document.getElementById('loginModal').classList.add('hidden');
    _setAuthLoading(false);
    _resetAuthForm();
  }).catch(function(err) {
    _setAuthLoading(false);
    _showAuthError(_friendlyError(err.code, isEn));
  });
}

function _friendlyError(code, isEn) {
  const msgs = {
    'auth/user-not-found':       isEn ? 'No account with this email.' : 'Aucun compte avec cet email.',
    'auth/wrong-password':       isEn ? 'Incorrect password.' : 'Mot de passe incorrect.',
    'auth/invalid-email':        isEn ? 'Invalid email address.' : 'Adresse email invalide.',
    'auth/email-already-in-use': isEn ? 'This email is already registered.' : 'Cet email est déjà utilisé.',
    'auth/weak-password':        isEn ? 'Password must be at least 6 characters.' : 'Mot de passe trop court (min. 6 caractères).',
    'auth/invalid-credential':   isEn ? 'Incorrect email or password.' : 'Email ou mot de passe incorrect.',
    'auth/too-many-requests':    isEn ? 'Too many attempts — please wait a moment.' : 'Trop de tentatives — réessayez dans un moment.',
    'auth/network-request-failed': isEn ? 'Network error — check your connection.' : 'Erreur réseau — vérifiez votre connexion.',
  };
  return msgs[code] || (isEn ? `Error: ${code}` : `Erreur : ${code}`);
}

function _showAuthError(msg) {
  const el = document.getElementById('authError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function _clearAuthError() {
  const el = document.getElementById('authError');
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}
function _setAuthLoading(on) {
  const btn = document.getElementById('authSubmitBtn');
  if (btn) btn.disabled = on;
}
function _resetAuthForm() {
  const e = document.getElementById('authEmail');
  const p = document.getElementById('authPassword');
  if (e) e.value = '';
  if (p) p.value = '';
}

// ── Tab switching (Login / Sign-up) ─────────────────
function switchAuthTab(tab) {
  const loginTab  = document.getElementById('tabLogin');
  const signupTab = document.getElementById('tabSignup');
  const submitBtn = document.getElementById('authSubmitBtn');
  const lang      = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'fr';
  const isEn      = lang === 'en';

  _clearAuthError();

  if (tab === 'signup') {
    loginTab.classList.remove('auth-tab-active');
    signupTab.classList.add('auth-tab-active');
    submitBtn.textContent  = isEn ? 'Create account' : 'Créer un compte';
    submitBtn.onclick      = function() { vmAuthSubmit('signup'); };
  } else {
    signupTab.classList.remove('auth-tab-active');
    loginTab.classList.add('auth-tab-active');
    submitBtn.textContent  = isEn ? 'Sign in' : 'Se connecter';
    submitBtn.onclick      = function() { vmAuthSubmit('login'); };
  }
}
