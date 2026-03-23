import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [sending, setSending] = useState({});
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({ to: '', toName: '', text: '' });

  // Check localStorage for provider to message
  useEffect(() => {
    const loadProvider = async () => {
      const providerEmail = localStorage.getItem('helperr_message_to');
      if (providerEmail) {
        // Get provider name from profiles
        const { data } = await supabase
          .from('profiles')
          .select('name')
          .eq('email', providerEmail)
          .single();
        
        setNewMessage({ 
          to: providerEmail, 
          toName: data?.name || 'Provider',
          text: '' 
        });
        setShowNewMessage(true);
        localStorage.removeItem('helperr_message_to');
      }
    };
    loadProvider();
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_email.eq.${user.email},receiver_email.eq.${user.email}`)
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
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const containsForbiddenContent = (text) => {
    const forbiddenPatterns = [
      /\b\d{10,}\b/,
      /\+?\d[\d\s\-()]{8,}/,
      /\b0\d{9}\b/,
      /@/,
      /\[at\]/i,
      /\.com\b/i,
      /\.net\b/i,
      /\.org\b/i,
      /\.de\b/i,
      /\.co\b/i,
      /whatsapp/i,
      /line\s*id/i,
      /telegram/i,
      /facebook/i,
      /instagram/i,
      /wechat/i,
      /viber/i,
      /signal/i
    ];

    return forbiddenPatterns.some(pattern => pattern.test(text));
  };

  const handleSendNewMessage = async () => {
    if (!newMessage.text.trim() || !newMessage.to.trim()) return;

    if (containsForbiddenContent(newMessage.text)) {
      alert('⚠️ Your message contains phone numbers, emails, or external contact methods which are not allowed. Please use our platform for all communication.');
      return;
    }

    setSending({ ...sending, new: true });

    try {
      const { error } = await supabase.from('messages').insert([{
        sender_email: user.email,
        receiver_email: newMessage.to,
        message: newMessage.text,
        read: false
      }]);

      if (error) throw error;

      alert('✅ Message sent successfully!');
      setNewMessage({ to: '', toName: '', text: '' });
      setShowNewMessage(false);
      fetchMessages();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSending({ ...sending, new: false });
    }
  };

  const handleReply = async (msgId, receiverEmail) => {
    const text = replyText[msgId] || '';
    
    if (!text.trim()) return;

    if (containsForbiddenContent(text)) {
      alert('⚠️ Your message contains phone numbers, emails, or external contact methods which are not allowed. Please use our platform for all communication.');
      return;
    }

    setSending({ ...sending, [msgId]: true });

    try {
      const { error } = await supabase.from('messages').insert([{
        sender_email: user.email,
        receiver_email: receiverEmail,
        message: text,
        read: false
      }]);

      if (error) throw error;

      setReplyText({ ...replyText, [msgId]: '' });
      fetchMessages();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSending({ ...sending, [msgId]: false });
    }
  };

  const handleMarkAsRead = async (msgId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', msgId);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', msgId);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (!user) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />
        <div style={styles.loginRequired}>
          <div style={{ fontSize: 64 }}>🔐</div>
          <h2>Login Required</h2>
          <p>Please login to view your messages</p>
          <button onClick={() => window.navigateTo('login')} style={styles.btnPrimary}>
            Login
          </button>
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

  const receivedMessages = messages.filter(m => m.receiver_email === user.email);
  const sentMessages = messages.filter(m => m.sender_email === user.email);

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header transparent={true} />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Messages</h1>
          <p style={styles.heroSub}>Communicate safely through our platform</p>
        </div>
      </div>

      <div style={styles.container}>
        
        {/* NEW MESSAGE FORM */}
        {showNewMessage && (
          <div style={styles.newMessageCard}>
            <div style={styles.newMessageHeader}>
              <h3 style={styles.newMessageTitle}>Message to {newMessage.toName}</h3>
              <button onClick={() => setShowNewMessage(false)} style={styles.btnCloseNew}>✕</button>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Message *</label>
              <textarea
                value={newMessage.text}
                onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
                style={styles.textarea}
                placeholder="Type your message... (No phone numbers or emails allowed)"
                rows={4}
              />
            </div>

            <button
              onClick={handleSendNewMessage}
              disabled={!newMessage.text.trim() || sending.new}
              style={{
                ...styles.btnSend,
                opacity: (!newMessage.text.trim() || sending.new) ? 0.5 : 1
              }}
            >
              {sending.new ? 'Sending...' : '📤 Send Message'}
            </button>
          </div>
        )}

        <div style={styles.tabs}>
          <div style={styles.tab}>
            📥 Received ({receivedMessages.length})
          </div>
        </div>

        {receivedMessages.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>📭</div>
            <h3>No messages yet</h3>
            <p>When providers or customers message you, they'll appear here</p>
          </div>
        ) : (
          <div style={styles.messagesList}>
            {receivedMessages.map(msg => (
              <div key={msg.id} style={styles.messageCard}>
                <div style={styles.messageHeader}>
                  <div>
                    <div style={styles.messageFrom}>From: {msg.sender_email.split('@')[0]}</div>
                    <div style={styles.messageDate}>
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                  {!msg.read && <span style={styles.unreadBadge}>New</span>}
                </div>

                <p style={styles.messageText}>{msg.message}</p>

                <div style={styles.messageActions}>
                  {!msg.read && (
                    <button onClick={() => handleMarkAsRead(msg.id)} style={styles.btnMark}>
                      ✓ Mark as Read
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} style={styles.btnDelete}>
                    🗑️ Delete
                  </button>
                </div>

                <div style={styles.replyBox}>
                  <textarea
                    value={replyText[msg.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                    style={styles.replyInput}
                    placeholder="Type your reply... (No phone numbers or emails allowed)"
                    rows={2}
                  />
                  <button
                    onClick={() => handleReply(msg.id, msg.sender_email)}
                    disabled={!replyText[msg.id]?.trim() || sending[msg.id]}
                    style={{
                      ...styles.btnReply,
                      opacity: (!replyText[msg.id]?.trim() || sending[msg.id]) ? 0.5 : 1
                    }}
                  >
                    {sending[msg.id] ? 'Sending...' : '📤 Send Reply'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {sentMessages.length > 0 && (
          <>
            <div style={styles.tabs}>
              <div style={styles.tab}>
                📤 Sent ({sentMessages.length})
              </div>
            </div>

            <div style={styles.messagesList}>
              {sentMessages.map(msg => (
                <div key={msg.id} style={styles.messageCard}>
                  <div style={styles.messageHeader}>
                    <div>
                      <div style={styles.messageFrom}>To: {msg.receiver_email.split('@')[0]}</div>
                      <div style={styles.messageDate}>
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p style={styles.messageText}>{msg.message}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 0 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 100%)', padding: '120px 20px 40px', marginBottom: 40 },
  heroInner: { maxWidth: 800, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  container: { maxWidth: 800, margin: '0 auto', padding: '0 20px 60px' },
  newMessageCard: { background: 'white', padding: 24, borderRadius: 16, border: '1.5px solid #e5e7eb', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  newMessageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  newMessageTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' },
  btnCloseNew: { background: '#fee2e2', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, color: '#dc2626', fontWeight: 700 },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  textarea: { width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', resize: 'vertical', boxSizing: 'border-box' },
  btnSend: { padding: '14px 24px', background: '#065f46', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', width: '100%' },
  tabs: { marginBottom: 20 },
  tab: { fontSize: 18, fontWeight: 700, color: '#111827', padding: '12px 0', borderBottom: '3px solid #065f46' },
  messagesList: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 },
  messageCard: { background: 'white', padding: 20, borderRadius: 16, border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  messageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  messageFrom: { fontSize: 15, fontWeight: 700, color: '#111827' },
  messageDate: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  unreadBadge: { background: '#14B8A6', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 },
  messageText: { fontSize: 14, color: '#374151', lineHeight: 1.6, margin: '0 0 16px' },
  messageActions: { display: 'flex', gap: 8, marginBottom: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6' },
  btnMark: { padding: '8px 16px', background: '#ecfdf5', color: '#065f46', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnDelete: { padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  replyBox: { background: '#f9fafb', padding: 16, borderRadius: 12 },
  replyInput: { width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', resize: 'vertical', marginBottom: 12, boxSizing: 'border-box' },
  btnReply: { padding: '12px 20px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', width: '100%' },
  empty: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb' },
  loginRequired: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
  btnPrimary: { padding: '14px 28px', background: '#065f46', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }
};

export default MessagesPage;
