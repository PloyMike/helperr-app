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
          <div style={{ fontSize: 48 }}>💬</div>
          <p>Loading messages...</p>
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
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <h2 style={styles.sidebarTitle}>Messages</h2>
            </div>
            
            {conversations.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: 15 }}>No messages yet</p>
              </div>
            ) : (
              <div style={styles.conversationList}>
                {conversations.map(conv => (
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
                <div style={styles.emptyChatIcon}>💬</div>
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
    background: 'linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)', 
    minHeight: '100vh', 
    paddingTop: 70,
    display: 'flex',
    flexDirection: 'column'
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
    height: 'calc(100vh - 70px)', 
    maxWidth: 1400, 
    margin: '0 auto',
    width: '100%'
  },
  
  // Sidebar - Modern
  sidebar: { 
    width: 340, 
    background: '#fff', 
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    boxShadow: '2px 0 8px rgba(0,0,0,0.03)'
  },
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid #e5e7eb',
    background: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)'
  },
  sidebarTitle: { 
    margin: 0, 
    fontSize: 22, 
    fontWeight: 800,
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  conversationList: { 
    flex: 1, 
    overflowY: 'auto',
    padding: 0
  },
  conversationItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 14, 
    padding: '16px 20px', 
    cursor: 'pointer', 
    borderBottom: '1px solid #f3f4f6',
    position: 'relative',
    transition: 'all 0.2s ease',
    background: '#fff'
  },
  conversationItemActive: { 
    background: 'linear-gradient(90deg, rgba(6, 95, 70, 0.08) 0%, rgba(236, 253, 245, 0.5) 100%)',
    borderLeft: '3px solid #065f46'
  },
  avatarContainer: {
    position: 'relative',
    flexShrink: 0
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: '50%', 
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden',
    border: '2px solid #fff',
    boxShadow: '0 2px 8px rgba(6, 95, 70, 0.15)'
  },
  onlineDot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#10b981',
    border: '2px solid #fff',
    position: 'absolute',
    bottom: 2,
    right: 2,
    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
  },
  chatHeaderAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: '50%', 
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden',
    border: '2px solid #fff',
    boxShadow: '0 2px 6px rgba(6, 95, 70, 0.15)'
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
    fontWeight: 800, 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap',
    color: '#111827'
  },
  timestamp: { 
    fontSize: 12.5, 
    color: '#9ca3af',
    fontWeight: 500,
    flexShrink: 0,
    marginLeft: 8
  },
  lastMessage: { 
    margin: 0, 
    fontSize: 14.5, 
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
  
  // Chat Area - Modern
  chatArea: { 
    flex: 1,
    display: 'flex', 
    flexDirection: 'column', 
    background: '#fff',
    position: 'relative'
  },
  emptyChat: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 16,
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
  },
  emptyChatIcon: {
    fontSize: 72,
    opacity: 0.5
  },
  emptyChatTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: '#111827'
  },
  emptyChatText: {
    margin: 0,
    fontSize: 15,
    color: '#9ca3af'
  },
  chatHeader: { 
    padding: '16px 20px', 
    borderBottom: '1px solid #e5e7eb', 
    background: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)',
    flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
    padding: '4px 8px',
    borderRadius: 8,
    transition: 'background 0.2s'
  },
  chatName: { 
    margin: 0, 
    fontSize: 17, 
    fontWeight: 700,
    color: '#111827'
  },
  
  // Messages
  messagesArea: { 
    flex: 1,
    overflowY: 'auto', 
    padding: 16, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 10, 
    background: 'linear-gradient(to bottom, #f9fafb 0%, #fff 100%)'
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
    padding: '10px 14px', 
    borderRadius: 18, 
    wordWrap: 'break-word',
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
  },
  bubbleMine: { 
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', 
    color: '#fff', 
    borderBottomRightRadius: 6
  },
  bubbleTheirs: { 
    background: '#fff', 
    color: '#111827', 
    border: '1px solid #e5e7eb', 
    borderBottomLeftRadius: 6
  },
  bubbleText: { 
    margin: '0 0 4px', 
    fontSize: 15, 
    lineHeight: 1.5 
  },
  bubbleTime: { 
    fontSize: 11, 
    opacity: 0.7,
    fontWeight: 500
  },
  
  // Input - Modern
  inputArea: { 
    padding: 16, 
    borderTop: '1px solid #e5e7eb', 
    background: '#fff',
    flexShrink: 0,
    boxShadow: '0 -1px 3px rgba(0,0,0,0.05)'
  },
  inputForm: {
    display: 'flex',
    gap: 10
  },
  textInput: { 
    flex: 1, 
    padding: '12px 18px', 
    border: '2px solid #e5e7eb', 
    borderRadius: 24, 
    fontSize: 15, 
    outline: 'none', 
    fontFamily: '"Outfit", sans-serif',
    background: '#f9fafb',
    transition: 'all 0.2s',
    fontWeight: 500
  },
  sendButton: { 
    width: 48, 
    height: 48, 
    borderRadius: '50%', 
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', 
    color: '#fff', 
    border: 'none', 
    fontSize: 20, 
    fontWeight: 700, 
    cursor: 'pointer', 
    fontFamily: '"Outfit", sans-serif',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(6, 95, 70, 0.3)',
    transition: 'all 0.2s'
  },
  sendButtonDisabled: { 
    opacity: 0.4, 
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  
  // Mobile-specific modern styles
  '@media (maxWidth: 768px)': {
    sidebar: {
      width: '100%',
      borderRight: 'none'
    },
    conversationItem: {
      padding: '16px 20px',
      borderBottom: '1px solid #f3f4f6',
      borderRadius: 0
    },
    avatar: {
      width: 56,
      height: 56,
      boxShadow: '0 3px 10px rgba(6, 95, 70, 0.2)'
    },
    conversationName: {
      fontSize: 16,
      fontWeight: 700
    },
    lastMessage: {
      fontSize: 14
    },
    timestamp: {
      fontSize: 13
    }
  }
};

export default MessagesPage;
