import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function MessagesPage() {
  const { user, signIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [sending, setSending] = useState({});

  const fetchMessages = useCallback(async () => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_email', user.email)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMessages();
    if (user) {
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchMessages, user]);

  const markAsRead = async (messageId) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
      fetchMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReply = async (message) => {
    const text = replyText[message.id];
    if (!text || !text.trim()) return;

    setSending({ ...sending, [message.id]: true });
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_email: user.email,
          receiver_email: message.sender_email,
          message: text,
          read: false
        }]);
      
      if (error) throw error;
      
      setReplyText({ ...replyText, [message.id]: '' });
      alert('✅ Reply sent!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSending({ ...sending, [message.id]: false });
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      fetchMessages();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) throw error;
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.app}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header transparent={true} />
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>💬</div>
            <h2 style={styles.loginTitle}>Login Required</h2>
            <p style={styles.loginSub}>Please login to view your messages</p>
            <form onSubmit={handleLogin} style={styles.loginForm}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" disabled={loginLoading} style={styles.btnPrimary}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />
        <div style={styles.loading}>
          <div style={{ fontSize: 48 }}>💬</div>
          <h2>Loading messages...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header transparent={true} />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Messages</h1>
          <p style={styles.heroSub}>Stay connected with your customers</p>
        </div>
      </div>

      <div style={styles.container}>
        {messages.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>📭</div>
            <h3>No messages yet</h3>
            <p>When customers contact you, their messages will appear here</p>
          </div>
        ) : (
          <div style={styles.messagesList}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageCard,
                  ...(msg.read ? {} : styles.messageCardUnread)
                }}
                onClick={() => !msg.read && markAsRead(msg.id)}
              >
                <div style={styles.messageHeader}>
                  <div>
                    <div style={styles.messageSender}>
                      {msg.sender_email}
                      {!msg.read && <span style={styles.unreadBadge}>New</span>}
                    </div>
                    <div style={styles.messageDate}>
                      {new Date(msg.created_at).toLocaleDateString()} at{' '}
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                    style={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                </div>

                <div style={styles.messageContent}>
                  {msg.message}
                </div>

                <div style={styles.replySection}>
                  <input
                    type="text"
                    placeholder="Type your reply..."
                    value={replyText[msg.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                    style={styles.replyInput}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReply(msg); }}
                    disabled={sending[msg.id] || !replyText[msg.id]?.trim()}
                    style={styles.replyBtn}
                  >
                    {sending[msg.id] ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 0 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 100%)', padding: '120px 20px 40px', marginBottom: 40 },
  heroInner: { maxWidth: 900, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  container: { maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' },
  messagesList: { display: 'flex', flexDirection: 'column', gap: 16 },
  messageCard: { background: 'white', borderRadius: 16, padding: 20, border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 0.2s' },
  messageCardUnread: { borderColor: '#14B8A6', boxShadow: '0 2px 8px rgba(20,184,166,0.1)' },
  messageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  messageSender: { fontSize: 16, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 10 },
  unreadBadge: { background: '#14B8A6', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 },
  messageDate: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  messageContent: { fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 16, padding: 16, background: '#f9fafb', borderRadius: 12 },
  replySection: { display: 'flex', gap: 10 },
  replyInput: { flex: 1, padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif' },
  replyBtn: { padding: '12px 20px', background: '#14B8A6', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', whiteSpace: 'nowrap' },
  deleteBtn: { background: '#fee2e2', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 16, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb' },
  loginContainer: { minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  loginCard: { background: 'white', borderRadius: 24, padding: '40px 32px', maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' },
  loginTitle: { fontSize: 28, fontWeight: 800, color: '#1F2937', margin: '0 0 8px' },
  loginSub: { color: '#6B7280', marginBottom: 24, fontSize: 15 },
  loginForm: { display: 'flex', flexDirection: 'column', gap: 16 },
  input: { width: '100%', padding: '14px 16px', border: '2px solid #E5E7EB', borderRadius: 12, fontSize: 15, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box' },
  btnPrimary: { padding: '14px 24px', background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(20,184,166,0.3)' }
};

export default MessagesPage;
