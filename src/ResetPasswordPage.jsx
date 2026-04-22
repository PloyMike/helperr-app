import React, { useState } from 'react';
import { supabase } from './supabase';
import Header from './Header';

function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setSent(true);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />
      
      <div style={styles.page}>
        <div style={styles.container}>
          <button onClick={() => window.navigateTo('login')} style={styles.backBtn}>
            ← Back to Login
          </button>

          <div style={styles.card}>
            <h1 style={styles.title}>Reset Password</h1>
            
            {sent ? (
              <div style={styles.success}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
                <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>Check your email!</h2>
                <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6 }}>
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p style={styles.description}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <button type="submit" disabled={loading} style={styles.btnPrimary}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)',
    paddingTop: 70,
    fontFamily: '"Outfit", sans-serif'
  },
  container: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '40px 20px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#065f46',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  card: {
    background: 'white',
    borderRadius: 20,
    padding: 40,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#111827',
    margin: '0 0 8px',
    textAlign: 'center'
  },
  description: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 1.6,
    margin: '0 0 24px',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 8
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: 12,
    fontSize: 15,
    fontFamily: '"Outfit", sans-serif',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
  },
  btnPrimary: {
    width: '100%',
    padding: '14px 20px',
    background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: '"Outfit", sans-serif',
    marginTop: 8
  },
  success: {
    textAlign: 'center',
    padding: '20px 0'
  }
};

export default ResetPasswordPage;
