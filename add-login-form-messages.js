const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Füge useState für Login hinzu
content = content.replace(
  /const \{ user \} = useAuth\(\);/,
  `const { user, signIn } = useAuth();`
);

// Füge Login-State hinzu
content = content.replace(
  /const \[showChat, setShowChat\] = useState\(false\);/,
  `const [showChat, setShowChat] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);`
);

// Füge handleLogin Funktion hinzu nach openChat
content = content.replace(
  /fetchConversations\(\);\s*\}\s*\};/,
  `fetchConversations();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      alert('Login fehlgeschlagen: ' + error.message);
    }
    setLoginLoading(false);
  };`
);

// Ersetze Login-Prompt mit Formular
content = content.replace(
  /<div className="login-prompt">\s*<div className="login-content">\s*<h2>Bitte logge dich ein<\/h2>\s*<button onClick=\{\(\)=>window\.navigateTo\('login'\)\} className="login-button">Zum Login<\/button>\s*<\/div>\s*<\/div>/,
  `<div className="login-prompt">
          <div className="login-form-container">
            <h2>Login für Nachrichten</h2>
            <form onSubmit={handleLogin} className="inline-login-form">
              <div className="login-field">
                <label>Email</label>
                <input type="email" required value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder="deine@email.com"/>
              </div>
              <div className="login-field">
                <label>Passwort</label>
                <input type="password" required value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} placeholder="Passwort"/>
              </div>
              <button type="submit" disabled={loginLoading} className="login-submit-btn">
                {loginLoading ? 'Lädt...' : 'Einloggen'}
              </button>
              <p className="signup-text">Noch kein Account? <span onClick={()=>window.navigateTo('signup')} className="signup-link">Registrieren</span></p>
            </form>
          </div>
        </div>`
);

// Update CSS für Login-Form
content = content.replace(
  /\.login-content \{\s*text-align: center;\s*\}\s*\.login-prompt h2 \{/,
  `.login-form-container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
        }
        .login-form-container h2 {`
);

content = content.replace(
  /\.login-button \{\s*padding: 16px 32px;\s*background: #14B8A6;\s*color: white;\s*border: none;\s*border-radius: 12px;\s*font-size: 16px;\s*font-weight: 600;\s*cursor: pointer;\s*font-family: "Outfit", sans-serif;\s*\}/,
  `.inline-login-form {
          margin-top: 30px;
        }
        .login-field {
          margin-bottom: 20px;
          text-align: left;
        }
        .login-field label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .login-field input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          font-family: "Outfit", sans-serif;
          box-sizing: border-box;
        }
        .login-field input:focus {
          border-color: #14B8A6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .login-submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.3);
        }
        .login-submit-btn:disabled {
          background: #CBD5E0;
          cursor: not-allowed;
        }
        .signup-text {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
        }
        .signup-link {
          color: #14B8A6;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }`
);

// Mobile CSS anpassen
content = content.replace(
  /\.login-prompt h2 \{\s*font-size: 24px !important;\s*\}\s*\.login-button \{/,
  `.login-form-container h2 {
            font-size: 24px !important;
          }
          .login-form-container {
            padding: 28px !important;
          }
          .inline-login-form {
            margin-top: 24px !important;
          }
          .login-field {
            margin-bottom: 16px !important;
          }
          .login-field label {
            font-size: 13px !important;
          }
          .login-field input {
            padding: 12px 14px !important;
            font-size: 14px !important;
          }
          .login-submit-btn {`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Login form added to messages page!');
