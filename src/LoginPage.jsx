import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Header from './Header';

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
      alert('Login failed: ' + error.message);
    } else {
      window.navigateTo('home');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header transparent={true} />
      
      <div style={styles.hero}>
        <div style={styles.heroGlow1}></div>
        <div style={styles.heroGlow2}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome Back</h1>
          <p style={styles.heroSubtitle}>Sign in to continue to Helperr</p>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>📧</span>
                <input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  style={styles.input}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input 
                  required 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={styles.input}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <button 
                type="button"
                onClick={() => window.navigateTo('reset-password')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#065f46',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: '"Outfit", sans-serif'
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" 
              disabled={loading} 
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnLoading : {})
              }}
            >
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>

            <div style={styles.divider}>
              <span style={styles.dividerText}>or</span>
            </div>

            <p style={styles.signupText}>
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => window.navigateTo('signup')} 
                style={styles.signupLink}
              >
                Create account
              </button>
            </p>
          </form>
        </div>

        <p style={styles.footer}>
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: '"Outfit", sans-serif',
    background: '#f9fafb',
    minHeight: '100vh',
    paddingTop: 0
  },
  hero: {
    background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 70%, #14b8a6 100%)',
    padding: '140px 20px 80px',
    position: 'relative',
    overflow: 'hidden',
    clipPath: 'ellipse(120% 100% at 50% 0%)'
  },
  heroGlow1: {
    position: 'absolute',
    top: '-50%',
    right: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    pointerEvents: 'none'
  },
  heroGlow2: {
    position: 'absolute',
    bottom: '-30%',
    left: '-5%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(6, 95, 70, 0.4) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none'
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1
  },
  heroTitle: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 800,
    margin: '0 0 12px',
    letterSpacing: '-0.02em'
  },
  heroSubtitle: {
    color: '#d1fae5',
    fontSize: 18,
    margin: 0,
    fontWeight: 400
  },
  container: {
    maxWidth: 480,
    margin: '-40px auto 60px',
    padding: '0 20px',
    position: 'relative',
    zIndex: 10
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    padding: '48px 40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
    border: '1px solid #e5e7eb'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 4
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    fontSize: 18,
    pointerEvents: 'none',
    zIndex: 1
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    border: '2px solid #e5e7eb',
    borderRadius: 12,
    fontSize: 15,
    fontFamily: '"Outfit", sans-serif',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    background: '#f9fafb'
  },
  submitBtn: {
    padding: '16px',
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)',
    marginTop: 8
  },
  submitBtnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '8px 0'
  },
  dividerText: {
    background: '#fff',
    padding: '0 16px',
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: 500,
    position: 'relative',
    zIndex: 1
  },
  signupText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
    margin: 0
  },
  signupLink: {
    background: 'none',
    border: 'none',
    color: '#065f46',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    fontSize: 14,
    padding: 0,
    textDecoration: 'underline'
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 32,
    lineHeight: 1.6
  }
};

export default LoginPage;
