import React, { useState } from 'react';
import { supabase } from './supabase';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (signUpError) throw signUpError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: email,
          name: name,
          created_at: new Date().toISOString()
        }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();

        await fetch("https://jyuatojpkluyidpefzub.supabase.co/functions/v1/send-booking-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            template: "welcome-email",
            to: email,
            variables: {
              user_name: name,
            },
          }),
        });
      } catch (emailError) {
        console.error("Welcome email error:", emailError);
      }

      alert('✅ Account created! Please check your email to verify your account.');
      window.navigateTo('login');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Join Helperr</h1>
          <p style={styles.heroSubtitle}>Create your account and start connecting</p>
        </div>
      </div>

      <div style={styles.formCard}>
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Create a strong password"
                required
                minLength={6}
              />
            </div>
            <p style={styles.hint}>Must be at least 6 characters</p>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerText}>Already have an account?</span>
          </div>

          <button
            type="button"
            onClick={() => window.navigateTo('login')}
            style={styles.secondaryBtn}
          >
            Sign In Instead
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f9fafb',
    fontFamily: '"Outfit", sans-serif',
    paddingBottom: 60
  },
  heroSection: {
    background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 70%, #14b8a6 100%)',
    padding: '80px 20px 120px',
    position: 'relative',
    overflow: 'hidden',
    clipPath: 'ellipse(120% 100% at 50% 0%)'
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: 'clamp(32px, 8vw, 48px)',
    fontWeight: 800,
    color: 'white',
    margin: 0,
    marginBottom: 12,
    letterSpacing: '-0.02em'
  },
  heroSubtitle: {
    fontSize: 'clamp(16px, 4vw, 18px)',
    color: '#d1fae5',
    margin: 0
  },
  formCard: {
    maxWidth: 480,
    margin: '-60px auto 0',
    padding: '0 20px'
  },
  form: {
    background: 'white',
    borderRadius: 20,
    padding: 'clamp(24px, 6vw, 40px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb'
  },
  formGroup: {
    marginBottom: 24
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 8
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
    boxSizing: 'border-box'
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    margin: '6px 0 0',
    fontStyle: 'italic'
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    boxShadow: '0 8px 20px rgba(6, 95, 70, 0.3)',
    transition: 'all 0.2s',
    marginTop: 8
  },
  divider: {
    margin: '24px 0',
    textAlign: 'center',
    position: 'relative'
  },
  dividerText: {
    fontSize: 13,
    color: '#6b7280',
    background: 'white',
    padding: '0 12px',
    position: 'relative',
    zIndex: 1
  },
  secondaryBtn: {
    width: '100%',
    padding: '14px',
    background: '#f3f4f6',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    transition: 'all 0.2s'
  }
};

export default RegisterPage;
