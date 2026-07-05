import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabase';
import Header from './Header';

function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll on this page so only internal containers scroll
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  // Auto-scroll to latest message
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const emails = convList.map(c => c.email);
      // Build lookup: latest sender_name pro chat-partner (from loaded data)
      const senderNameMap = {};
      data?.forEach(msg => {
        if (msg.sender_email !== userEmail && msg.sender_name && !senderNameMap[msg.sender_email]) {
          senderNameMap[msg.sender_email] = msg.sender_name;
        }
      });
      console.log('DEBUG userEmail:', userEmail);
      console.log('DEBUG data sample:', data?.slice(0, 3));
      console.log('DEBUG senderNameMap:', senderNameMap);
      console.log('DEBUG convList emails:', emails);
      if (emails.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('email, name, image_url')
          .in('email', emails);
        convList.forEach(conv => {
          const profile = profiles?.find(p => p.email === conv.email);
          conv.name = profile?.name || senderNameMap[conv.email] || conv.email;
          conv.image = profile?.image_url || '👤';
        });
      }
      setConversations(convList);

      const messageTo = localStorage.getItem('helperr_message_to');
      if (messageTo) {
        localStorage.removeItem('helperr_message_to');
        let conv = convList.find(c => c.email === messageTo);
        if (!conv) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, name, image_url')
            .eq('email', messageTo)
            .single();
          if (profile) {
            conv = {
              email: profile.email,
              name: profile.name || senderNameMap[profile.email] || profile.email,
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
          if (isMobile) setShowChat(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [userEmail, isMobile]);

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
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_email', userEmail)
        .eq('sender_email', otherEmail);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [userEmail]);

  useEffect(() => { checkUser(); }, []);

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

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);
    try {
      console.log('DEBUG send message - user:', user);
      console.log('DEBUG send message - user_metadata:', user?.user_metadata);
      console.log('DEBUG send message - name:', user?.user_metadata?.name);
      const { error } = await supabase.from('messages').insert([{
        sender_email: userEmail,
        sender_name: user?.user_metadata?.name || null,
        receiver_email: selectedConversation.email,
        message: newMessage.trim(),
        read: false
      }]);
      if (error) throw error;
      setNewMessage('');
      fetchMessages(selectedConversation.email);
      fetchConversations();
    } catch (error) {
      alert('Error sending message: ' + error.message);
    }
    setSending(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diff < 604800000) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    if (isMobile) setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return conv.name?.toLowerCase().includes(q) || conv.email?.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.loading}><h2>Loading messages...</h2></div>
      </div>
    );
  }

  const showSidebar = !isMobile || !showChat;
  const showChatArea = !isMobile || showChat;

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />

      <div style={styles.wrapper}>
        {showSidebar && (
          <aside style={{ ...styles.sidebar, ...(isMobile ? styles.sidebarMobile : {}) }}>
            <div style={styles.searchBar}>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#ecfdf5'}
              />
            </div>
            <div style={styles.conversationList}>
              {filteredConversations.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: 15 }}>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <div
                    key={conv.email}
                    onClick={() => handleSelectConversation(conv)}
                    style={{
                      ...styles.conversationItem,
                      ...(selectedConversation?.email === conv.email && !isMobile ? styles.conversationItemActive : {})
                    }}
                  >
                    <div style={styles.avatar}>
                      {conv.image && conv.image.startsWith('http') ? (
                        <img src={conv.image} alt={conv.name} style={styles.avatarImage} />
                      ) : (
                        <span>{(conv.name || '?').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div style={styles.conversationInfo}>
                      <div style={styles.conversationTop}>
                        <h4 style={styles.conversationName}>{conv.name}</h4>
                        <span style={styles.timestamp}>{formatTime(conv.timestamp)}</span>
                      </div>
                      <p style={styles.lastMessage}>{conv.lastMessage}</p>
                    </div>
                    {conv.unread && <div style={styles.unreadDot} />}
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        {showChatArea && (
          <main style={styles.chatArea}>
            {!selectedConversation ? (
              <div style={styles.emptyChat}>
                <div style={styles.emptyChatIcon}>💬</div>
                <h3 style={styles.emptyChatTitle}>Your Messages</h3>
                <p style={styles.emptyChatText}>Select a conversation to start chatting</p>
              </div>
            ) : (
              <>
                <header style={styles.chatHeader}>
                  {isMobile && (
                    <button onClick={handleBackToList} style={styles.backBtn} aria-label="Back">←</button>
                  )}
                  <div style={styles.chatHeaderAvatar}>
                    {selectedConversation.image && selectedConversation.image.startsWith('http') ? (
                      <img src={selectedConversation.image} alt={selectedConversation.name} style={styles.avatarImage} />
                    ) : (
                      <span>{(selectedConversation.name || '?').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <h3 style={styles.chatName}>{selectedConversation.name}</h3>
                </header>

                <div style={styles.messagesArea}>
                  {messages.length === 0 ? (
                    <div style={styles.emptyMessages}>
                      <p style={{ margin: 0, fontSize: 15, color: '#9ca3af' }}>👋 Say hello!</p>
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMine = msg.sender_email === userEmail;
                      return (
                        <div
                          key={msg.id}
                          style={{ ...styles.messageRow, justifyContent: isMine ? 'flex-end' : 'flex-start' }}
                        >
                          <div style={{ ...styles.bubble, ...(isMine ? styles.bubbleMine : styles.bubbleTheirs) }}>
                            <p style={styles.bubbleText}>{msg.message}</p>
                            <span style={{ ...styles.bubbleTime, color: isMine ? 'rgba(255,255,255,0.85)' : '#9ca3af' }}>
                              {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} style={styles.inputArea}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={styles.textInput}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    style={{ ...styles.sendButton, ...(sending || !newMessage.trim() ? styles.sendButtonDisabled : {}) }}
                  >
                    ➤
                  </button>
                </form>
              </>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: '"Outfit", sans-serif',
    background: '#fff',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 70,
    display: 'flex',
    flexDirection: 'column'
  },
  loading: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280'
  },
  wrapper: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    maxWidth: 1400,
    width: '100%',
    margin: '0 auto',
    background: '#fff'
  },

  // Sidebar
  sidebar: {
    width: 360,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRight: '1px solid #ecfdf5',
    boxShadow: '4px 0 16px rgba(6, 95, 70, 0.04)',
    minHeight: 0
  },
  sidebarMobile: {
    width: '100%',
    borderRight: 'none',
    boxShadow: 'none'
  },
  searchBar: {
    padding: 16,
    borderBottom: '1px solid #ecfdf5',
    background: '#fff',
    flexShrink: 0
  },
  searchInput: {
    width: '100%',
    padding: '11px 14px',
    border: '2px solid #ecfdf5',
    borderRadius: 12,
    fontSize: 14,
    fontFamily: '"Outfit", sans-serif',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    background: '#f9fafb',
    fontWeight: 500
  },
  conversationList: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '8px 0',
    minHeight: 0
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 18px',
    cursor: 'pointer',
    borderBottom: '1px solid #f9fafb',
    position: 'relative',
    transition: 'all 0.2s ease',
    background: '#fff'
  },
  conversationItemActive: {
    background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdfa 50%, transparent 100%)',
    borderLeft: '4px solid #14b8a6'
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '2.5px solid #fff',
    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
    color: '#fff',
    fontSize: 22,
    fontWeight: 700,
    flexShrink: 0
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  conversationInfo: {
    flex: 1,
    minWidth: 0
  },
  conversationTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  conversationName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '#111827'
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: 500,
    flexShrink: 0,
    marginLeft: 8
  },
  lastMessage: {
    margin: 0,
    fontSize: 14,
    color: '#6b7280',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#14b8a6',
    flexShrink: 0
  },
  emptyState: {
    padding: '80px 20px',
    textAlign: 'center'
  },

  // Chat
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    minHeight: 0
  },
  emptyChat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 50%, #f9fafb 100%)'
  },
  emptyChatIcon: {
    fontSize: 80,
    opacity: 0.4
  },
  emptyChatTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #065f46 0%, #14b8a6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  emptyChatText: {
    margin: 0,
    fontSize: 15,
    color: '#6b7280'
  },
  chatHeader: {
    padding: '14px 20px',
    borderBottom: '1px solid #ecfdf5',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 2px 8px rgba(6, 95, 70, 0.04)'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: 24,
    fontWeight: 700,
    color: '#065f46',
    cursor: 'pointer',
    padding: '4px 10px',
    borderRadius: 8
  },
  chatHeaderAvatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '2px solid #fff',
    boxShadow: '0 3px 8px rgba(20, 184, 166, 0.25)',
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0
  },
  chatName: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: '#111827',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    background: 'linear-gradient(180deg, #f0fdfa 0%, #ecfdf5 50%, #ffffff 100%)',
    minHeight: 0
  },
  emptyMessages: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  messageRow: {
    display: 'flex'
  },
  bubble: {
    maxWidth: '75%',
    padding: '11px 16px',
    borderRadius: 20,
    wordWrap: 'break-word',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
  },
  bubbleMine: {
    background: 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)',
    color: '#fff',
    borderBottomRightRadius: 6,
    boxShadow: '0 3px 12px rgba(20, 184, 166, 0.3)'
  },
  bubbleTheirs: {
    background: '#fff',
    color: '#111827',
    border: '1px solid #ecfdf5',
    borderBottomLeftRadius: 6,
    boxShadow: '0 2px 8px rgba(6, 95, 70, 0.05)'
  },
  bubbleText: {
    margin: '0 0 4px',
    fontSize: 15,
    lineHeight: 1.5
  },
  bubbleTime: {
    fontSize: 11,
    fontWeight: 500
  },
  inputArea: {
    padding: '12px 16px calc(12px + env(safe-area-inset-bottom)) 16px',
    borderTop: '1px solid #ecfdf5',
    background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)',
    flexShrink: 0,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    boxShadow: '0 -2px 8px rgba(6, 95, 70, 0.04)'
  },
  textInput: {
    flex: 1,
    padding: '13px 20px',
    border: '2px solid #ecfdf5',
    borderRadius: 24,
    fontSize: 16,
    outline: 'none',
    fontFamily: '"Outfit", sans-serif',
    background: '#fff',
    fontWeight: 500
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)',
    color: '#fff',
    border: 'none',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    flexShrink: 0,
    boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    boxShadow: 'none'
  }
};

export default MessagesPage;
