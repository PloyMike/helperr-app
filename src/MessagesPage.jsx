import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import Header from './Header';

function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/';
      return;
    }
    setUserEmail(user.email);
  };

  const fetchConversations = useCallback(async () => {
    if (!userEmail) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_email.eq.${userEmail},receiver_email.eq.${userEmail}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const convMap = {};
      data?.forEach(msg => {
        const otherEmail = msg.sender_email === userEmail ? msg.receiver_email : msg.sender_email;
        if (!convMap[otherEmail]) {
          convMap[otherEmail] = {
            email: otherEmail,
            lastMessage: msg.message,
            timestamp: msg.created_at,
            unread: msg.receiver_email === userEmail && !msg.read
          };
        }
      });

      const convList = Object.values(convMap);
      
      // Fetch provider names
      const emails = convList.map(c => c.email);
      if (emails.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('email, name, image_url')
          .in('email', emails);

        convList.forEach(conv => {
          const profile = profiles?.find(p => p.email === conv.email);
          conv.name = profile?.name || conv.email;
          conv.image = profile?.image_url || '👤';
        });
      }

      setConversations(convList);
      
      // Check if there's a message_to in localStorage (from "Message Provider" button)
      const messageTo = localStorage.getItem('helperr_message_to');
      if (messageTo) {
        localStorage.removeItem('helperr_message_to');
        
        // Find or create conversation
        let conv = convList.find(c => c.email === messageTo);
        if (!conv) {
          // Fetch provider profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, name, image_url')
            .eq('email', messageTo)
            .single();
          
          if (profile) {
            conv = {
              email: profile.email,
              name: profile.name || profile.email,
              image: profile.image_url || '👤',
              lastMessage: 'Start a conversation...',
              timestamp: new Date().toISOString(),
              unread: false
            };
            setConversations([conv, ...convList]);
          }
        }
        
        if (conv) {
          setSelectedConversation(conv);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchMessages = useCallback(async (otherEmail) => {
    if (!userEmail) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_email.eq.${userEmail},receiver_email.eq.${otherEmail}),and(sender_email.eq.${otherEmail},receiver_email.eq.${userEmail})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_email', userEmail)
        .eq('sender_email', otherEmail);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [userEmail]);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [userEmail, fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.email);
      const interval = setInterval(() => fetchMessages(selectedConversation.email), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation, fetchMessages]);

  const contentFilter = (text) => {
    const forbidden = [
      /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/,
      /\d{10}/,
      /\+\d{1,3}[-.\s]?\d{1,14}/,
      /@/,
      /\.com|\.net|\.org/i,
      /whatsapp|line|telegram|facebook|instagram|wechat|viber|signal/i
    ];
    return forbidden.some(pattern => pattern.test(text));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    if (contentFilter(newMessage)) {
      alert('❌ Please keep communication on the platform. Contact details are not allowed.');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        sender_email: userEmail,
        receiver_email: selectedConversation.email,
        message: newMessage.trim(),
        read: false
      });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation.email);
      fetchConversations();
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diff < 604800000) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.loading}>Loading messages...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />
      
      <div style={styles.container}>
        {/* Conversations List */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Messages</h2>
          
          {conversations.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: 48 }}>💬</div>
              <p>No messages yet</p>
            </div>
          ) : (
            <div style={styles.conversationList}>
              {conversations.map(conv => (
                <div
                  key={conv.email}
                  onClick={() => setSelectedConversation(conv)}
                  style={{
                    ...styles.conversationItem,
                    ...(selectedConversation?.email === conv.email ? styles.conversationItemActive : {})
                  }}
                >
                  <div style={styles.avatar}>
                    {conv.image && conv.image.startsWith('http') ? (
                      <img src={conv.image} alt={conv.name} style={styles.avatarImage} />
                    ) : (
                      <span style={{ fontSize: 24 }}>{conv.image}</span>
                    )}
                  </div>
                  <div style={styles.conversationInfo}>
                    <div style={styles.conversationHeader}>
                      <h4 style={styles.conversationName}>{conv.name}</h4>
                      <span style={styles.timestamp}>{formatTime(conv.timestamp)}</span>
                    </div>
                    <p style={{
                      ...styles.lastMessage,
                      ...(conv.unread ? { fontWeight: 700, color: '#111827' } : {})
                    }}>
                      {conv.lastMessage.slice(0, 50)}...
                    </p>
                  </div>
                  {conv.unread && <div style={styles.unreadBadge}></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div style={styles.chatWindow}>
          {!selectedConversation ? (
            <div style={styles.emptyChat}>
              <div style={{ fontSize: 64 }}>💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a message from the left to start chatting</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <div style={styles.chatHeaderLeft}>
                  <div style={styles.avatarSmall}>
                    {selectedConversation.image && selectedConversation.image.startsWith('http') ? (
                      <img src={selectedConversation.image} alt={selectedConversation.name} style={styles.avatarImage} />
                    ) : (
                      <span style={{ fontSize: 20 }}>{selectedConversation.image}</span>
                    )}
                  </div>
                  <h3 style={styles.chatHeaderName}>{selectedConversation.name}</h3>
                </div>
              </div>

              {/* Messages */}
              <div style={styles.messagesContainer}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                    <p>No messages yet. Say hi! 👋</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.sender_email === userEmail;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          ...styles.messageWrapper,
                          justifyContent: isMine ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            ...styles.messageBubble,
                            ...(isMine ? styles.messageBubbleMine : styles.messageBubbleTheirs)
                          }}
                        >
                          <p style={styles.messageText}>{msg.message}</p>
                          <span style={styles.messageTime}>
                            {new Date(msg.created_at).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} style={styles.inputContainer}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={styles.input}
                  disabled={sending}
                />
                <button 
                  type="submit" 
                  disabled={sending || !newMessage.trim()}
                  style={{
                    ...styles.sendBtn,
                    ...((!newMessage.trim() || sending) ? styles.sendBtnDisabled : {})
                  }}
                >
                  {sending ? '...' : '→'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 70 },
  loading: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  container: { display: 'flex', height: 'calc(100vh - 70px)', maxWidth: 1400, margin: '0 auto' },
  
  // Sidebar
  sidebar: { width: 360, background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' },
  sidebarTitle: { padding: '24px 20px', margin: 0, fontSize: 24, fontWeight: 800, borderBottom: '1px solid #e5e7eb' },
  conversationList: { flex: 1, overflowY: 'auto' },
  conversationItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 12, 
    padding: '16px 20px', 
    cursor: 'pointer', 
    borderBottom: '1px solid #f3f4f6',
    position: 'relative',
    transition: 'background 0.2s'
  },
  conversationItemActive: { background: '#f9fafb' },
  avatar: { width: 52, height: 52, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  avatarSmall: { width: 40, height: 40, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%', objectFit: 'cover' },
  conversationInfo: { flex: 1, minWidth: 0 },
  conversationHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  conversationName: { margin: 0, fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  timestamp: { fontSize: 12, color: '#9ca3af' },
  lastMessage: { margin: 0, fontSize: 13, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  unreadBadge: { width: 10, height: 10, borderRadius: '50%', background: '#065f46', position: 'absolute', right: 20 },
  emptyState: { padding: '60px 20px', textAlign: 'center', color: '#6b7280' },
  
  // Chat Window
  chatWindow: { flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' },
  emptyChat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#6b7280' },
  chatHeader: { padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  chatHeaderLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  chatHeaderName: { margin: 0, fontSize: 18, fontWeight: 700 },
  
  // Messages
  messagesContainer: { flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f9fafb' },
  messageWrapper: { display: 'flex' },
  messageBubble: { maxWidth: '70%', padding: '12px 16px', borderRadius: 16, wordWrap: 'break-word' },
  messageBubbleMine: { background: '#065f46', color: '#fff', borderBottomRightRadius: 4 },
  messageBubbleTheirs: { background: '#fff', color: '#111827', border: '1px solid #e5e7eb', borderBottomLeftRadius: 4 },
  messageText: { margin: '0 0 4px', fontSize: 15, lineHeight: 1.5 },
  messageTime: { fontSize: 11, opacity: 0.7 },
  
  // Input
  inputContainer: { padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12, background: '#fff' },
  input: { flex: 1, padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: 24, fontSize: 15, outline: 'none', fontFamily: '"Outfit", sans-serif' },
  sendBtn: { width: 48, height: 48, borderRadius: '50%', background: '#065f46', color: '#fff', border: 'none', fontSize: 20, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
  sendBtnDisabled: { opacity: 0.4, cursor: 'not-allowed' }
};

export default MessagesPage;
