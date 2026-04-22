import React, { useState } from 'react';
import { supabase } from './supabase';
import Header from './Header';

function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setUpdated(true);
      
      setTimeout(() => {
        window.navigateTo('login');
      }, 2000);
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
          <div style={styles.card}>
            <h1 style={styles.title}>Update Password</h1>
            
            {updated ? (
              <div style={styles.success}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>Password Updated!</h2>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  Redirecting to login...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p style={styles.description}>
                  Enter your new password below.
                </p>

                <div style={styles.formGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button type="submit" disabled={loading} style={styles.btnPrimary}>
                  {loading ? 'Updating...' : 'Update Password'}
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

export default UpdatePasswordPage;
