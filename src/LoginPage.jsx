import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Header from './Header';

function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      
      window.navigateTo('home');
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header transparent={true} />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Welcome Back</h1>
          <p style={styles.heroSub}>Login to manage your bookings and profile</p>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ fontSize: 64, marginBottom: 20, textAlign: 'center' }}>👋</div>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{...styles.btnPrimary, opacity: loading ? 0.6 : 1}}
            >
              {loading ? 'Logging in...' : '🔓 Login'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>

          <p style={styles.footer}>
            Don't have an account?{' '}
            <span onClick={() => window.navigateTo('register')} style={styles.link}>
              Become a Provider
            </span>
          </p>

          <p style={styles.footerSmall}>
            Just browsing?{' '}
            <span onClick={() => window.navigateTo('home')} style={styles.link}>
              Explore Services
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 0 },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 100%)', padding: '120px 20px 40px', marginBottom: 40 },
  heroInner: { maxWidth: 600, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  container: { maxWidth: 450, margin: '0 auto', padding: '0 20px 60px' },
  card: { background: 'white', borderRadius: 24, padding: '40px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1.5px solid #e5e7eb' },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 },
  input: { width: '100%', padding: '14px 16px', border: '2px solid #E5E7EB', borderRadius: 12, fontSize: 15, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box', transition: 'border 0.2s' },
  btnPrimary: { padding: '16px 24px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6,95,70,0.3)', marginTop: 8 },
  divider: { position: 'relative', textAlign: 'center', margin: '24px 0', borderTop: '1px solid #e5e7eb' },
  dividerText: { position: 'relative', top: '-12px', background: 'white', padding: '0 12px', fontSize: 13, color: '#6b7280', fontWeight: 500 },
  footer: { textAlign: 'center', color: '#6B7280', fontSize: 15, marginTop: 8, marginBottom: 8 },
  footerSmall: { textAlign: 'center', color: '#9CA3AF', fontSize: 13, marginTop: 0 },
  link: { color: '#065f46', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }
};

export default LoginPage;
