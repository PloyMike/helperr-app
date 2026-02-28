import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      alert('Login fehlgeschlagen: ' + error.message);
    } else {
      window.navigateTo('home');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div className="login-wrapper">
        <div className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-gradient"></div>
          <div className="hero-content">
            <h1 className="hero-title">Login</h1>
            <p className="hero-subtitle">Willkommen zurück!</p>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="login-form">
            
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input"/>
            </div>

            <div className="form-group">
              <label className="form-label">Passwort *</label>
              <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input"/>
            </div>

            <button type="submit" disabled={loading} className={`submit-btn ${loading?'loading':''}`}>
              {loading ? 'Lädt...' : 'Einloggen'}
            </button>

            <p className="signup-link">
              Noch kein Account? <button type="button" onClick={()=>window.navigateTo('signup')} className="link-btn">Registrieren</button>
            </p>
          </form>
        </div>
      </div>

      <Footer/>

      <style>{`
        .login-container {
          min-height: 100vh;
          background-color: #F9FAFB;
        }
        .login-wrapper {
          padding-top: 70px;
        }
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 60px 20px;
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=80);
          background-size: cover;
          background-position: center;
          opacity: 0.7;
          z-index: 0;
        }
        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(250,250,250,0.9) 100%);
          z-index: 1;
        }
        .hero-content {
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
          color: #1F2937;
        }
        .hero-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
          font-family: "Outfit", sans-serif;
          letter-spacing: -1px;
        }
        .hero-subtitle {
          font-size: 18px;
          font-family: "Outfit", sans-serif;
          font-weight: 400;
        }
        .form-container {
          max-width: 500px;
          margin: -10px auto 80px;
          padding: 0 20px;
        }
        .login-form {
          background-color: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-group:last-of-type {
          margin-bottom: 32px;
        }
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 15px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .form-input {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          font-family: "Outfit", sans-serif;
          box-sizing: border-box;
          transition: all 0.3s;
        }
        .form-input:focus {
          border-color: #14B8A6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .submit-btn {
          width: 100%;
          padding: 18px;
          background: #1F2937;
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          margin-bottom: 16px;
          transition: all 0.3s;
        }
        .submit-btn:hover:not(.loading) {
          background: #14B8A6;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.3);
        }
        .submit-btn.loading {
          background: #CBD5E0;
          cursor: not-allowed;
        }
        .signup-link {
          text-align: center;
          font-size: 14px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }
        .link-btn {
          background: none;
          border: none;
          color: #14B8A6;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          font-family: "Outfit", sans-serif;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 16px !important;
          }
          .hero-title {
            font-size: 32px !important;
            margin-bottom: 8px !important;
          }
          .hero-subtitle {
            font-size: 16px !important;
          }
          .form-container {
            margin: 0 auto 60px !important;
            padding: 0 16px !important;
          }
          .login-form {
            padding: 28px !important;
          }
          .form-group {
            margin-bottom: 20px !important;
          }
          .form-group:last-of-type {
            margin-bottom: 28px !important;
          }
          .form-label {
            font-size: 14px !important;
            margin-bottom: 6px !important;
          }
          .form-input {
            padding: 12px 16px !important;
            font-size: 14px !important;
          }
          .submit-btn {
            padding: 16px !important;
            font-size: 16px !important;
          }
          .signup-link {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
