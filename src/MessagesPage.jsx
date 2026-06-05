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
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert([{
        sender_email: userEmail,
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
    
    if (diff < 86400000) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diff < 604800000) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedConversation(null);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.loading}>
          <h2>Loading messages...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />
      
      <div style={styles.wrapper}>
        {/* Conversations List */}
        {(!isMobile || !showChat) && (
          <div style={{...styles.sidebar, ...(isMobile ? { width: '100%', borderRight: 'none' } : {})}}>
            <div style={styles.searchContainer}>
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
            
            
            {conversations.length === 0 ? (
              <div style={styles.emptyState}>
                
                <p style={{ margin: 0, color: '#9ca3af', fontSize: 15 }}>No messages yet</p>
              </div>
            ) : (
              <div style={styles.conversationList}>
                {conversations
                .filter(conv => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return conv.name?.toLowerCase().includes(query) ||
                         conv.email?.toLowerCase().includes(query);
                })
                .map(conv => (
                  <div
                    key={conv.email}
                    onClick={() => handleSelectConversation(conv)}
                    style={{
                      ...styles.conversationItem,
                      ...(selectedConversation?.email === conv.email && !isMobile ? styles.conversationItemActive : {})
                    }}
                  >
                    <div style={styles.avatarContainer}>
                      <div style={styles.avatar}>
                        {conv.image && conv.image.startsWith('http') ? (
                          <img src={conv.image} alt={conv.name} style={styles.avatarImage} />
                        ) : (
                          <span style={{ fontSize: 22 }}>{conv.image}</span>
                        )}
                      </div>
                      {conv.unread && <div style={styles.onlineDot}></div>}
                    </div>
                    <div style={styles.conversationInfo}>
                      <div style={styles.conversationTop}>
                        <h4 style={styles.conversationName}>{conv.name}</h4>
                        <span style={styles.timestamp}>{formatTime(conv.timestamp)}</span>
                      </div>
                      <p style={{
                        ...styles.lastMessage,
                        ...(conv.unread ? { fontWeight: 600, color: '#374151' } : {})
                      }}>
                        {conv.lastMessage.slice(0, 45)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Window */}
        {(!isMobile || showChat) && (
          <div style={styles.chatArea}>
            {!selectedConversation ? (
              <div style={styles.emptyChat}>
                <h3 style={styles.emptyChatTitle}>Your Messages</h3>
                <p style={styles.emptyChatText}>Select a conversation to start chatting</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div style={styles.chatHeader}>
                  <div style={styles.chatHeaderContent}>
                    {isMobile && (
                      <button onClick={handleBackToList} style={styles.backBtn}>
                        ←
                      </button>
                    )}
                    <div style={styles.chatHeaderAvatar}>
                      {selectedConversation.image && selectedConversation.image.startsWith('http') ? (
                        <img src={selectedConversation.image} alt={selectedConversation.name} style={styles.avatarImage} />
                      ) : (
                        <span style={{ fontSize: 18 }}>{selectedConversation.image}</span>
                      )}
                    </div>
                    <h3 style={styles.chatName}>{selectedConversation.name}</h3>
                  </div>
                </div>

                {/* Messages Area */}
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
                          style={{
                            ...styles.messageRow,
                            justifyContent: isMine ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div
                            style={{
                              ...styles.bubble,
                              ...(isMine ? styles.bubbleMine : styles.bubbleTheirs)
                            }}
                          >
                            <p style={styles.bubbleText}>{msg.message}</p>
                            <span style={styles.bubbleTime}>
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

                {/* Input Area */}
                <div style={styles.inputArea}>
                  <form onSubmit={sendMessage} style={styles.inputForm}>
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
                      style={{
                        ...styles.sendButton,
                        ...((!newMessage.trim() || sending) ? styles.sendButtonDisabled : {})
                      }}
                    >
                      →
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { 
    fontFamily: '"Outfit", sans-serif', 
    background: '#fff', 
    minHeight: '100vh',
    height: '100vh',
    paddingTop: 70,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  loading: { 
    minHeight: '60vh', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12,
    color: '#6b7280'
  },
  wrapper: { 
    display: 'flex', 
    flex: 1,
    maxWidth: 1400, 
    margin: '0 auto',
    width: '100%',
    background: '#fff',
    overflow: 'hidden',
    minHeight: 0,
    height: '100%'
  },
  
  // Sidebar — fresher, kraftiger
  sidebar: { 
    width: 360, 
    background: '#fff', 
    borderRight: '1px solid #ecfdf5',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    boxShadow: '4px 0 16px rgba(6, 95, 70, 0.04)',
    height: '100%',
    overflow: 'hidden'
  },
  searchContainer: {
    padding: 16,
    borderBottom: '1px solid #ecfdf5',
    background: '#fff',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 5
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
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid #ecfdf5',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)'
  },
  sidebarTitle: { 
    margin: 0, 
    fontSize: 24, 
    fontWeight: 800,
    background: 'linear-gradient(135deg, #065f46 0%, #14b8a6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
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
  avatarContainer: {
    position: 'relative',
    flexShrink: 0
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
    fontWeight: 700
  },
  onlineDot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#10b981',
    border: '2.5px solid #fff',
    position: 'absolute',
    bottom: 0,
    right: 0,
    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.15)'
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
    fontWeight: 700
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
    whiteSpace: 'nowrap',
    fontWeight: 400
  },
  emptyState: { 
    padding: '80px 20px', 
    textAlign: 'center'
  },
  
  // Chat Area — frischer, mehr Leben
  chatArea: { 
    flex: 1,
    display: 'flex', 
    flexDirection: 'column', 
    background: '#fff',
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
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
    boxShadow: '0 2px 8px rgba(6, 95, 70, 0.04)',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  chatHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  backBtn: { 
    background: 'none', 
    border: 'none', 
    fontSize: 24, 
    fontWeight: 700, 
    color: '#065f46', 
    cursor: 'pointer', 
    padding: '4px 10px',
    borderRadius: 8,
    transition: 'all 0.2s'
  },
  chatName: { 
    margin: 0, 
    fontSize: 17, 
    fontWeight: 700,
    color: '#111827'
  },
  
  // Messages — fresher Hintergrund
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
    padding: '40px 20px',
    color: '#9ca3af',
    fontSize: 14
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
    opacity: 0.75,
    fontWeight: 500
  },
  
  // Input — frischer, einladender
  inputArea: { 
    padding: '16px 16px calc(16px + env(safe-area-inset-bottom)) 16px', 
    borderTop: '1px solid #ecfdf5', 
    background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)',
    flexShrink: 0,
    boxShadow: '0 -2px 8px rgba(6, 95, 70, 0.04)',
    position: 'sticky',
    bottom: 0,
    zIndex: 10
  },
  inputForm: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  textInput: { 
    flex: 1, 
    padding: '13px 20px', 
    border: '2px solid #ecfdf5', 
    borderRadius: 24, 
    fontSize: 15, 
    outline: 'none', 
    fontFamily: '"Outfit", sans-serif',
    background: '#fff',
    transition: 'all 0.2s',
    fontWeight: 500,
    boxShadow: '0 1px 4px rgba(6, 95, 70, 0.04)'
  },
  sendButton: { 
    width: 50, 
    height: 50, 
    borderRadius: '50%', 
    background: 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)', 
    color: '#fff', 
    border: 'none', 
    fontSize: 22, 
    fontWeight: 700, 
    cursor: 'pointer', 
    fontFamily: '"Outfit", sans-serif',
    flexShrink: 0,
    boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)',
    transition: 'all 0.2s',
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
