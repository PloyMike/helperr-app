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
                <div style={{ fontSize: 48 }}>💬</div>
                <p>No messages yet</p>
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
                    <div style={styles.avatar}>
                      {conv.image && conv.image.startsWith('http') ? (
                        <img src={conv.image} alt={conv.name} style={styles.avatarImage} />
                      ) : (
                        <span style={{ fontSize: 20 }}>{conv.image}</span>
                      )}
                    </div>
                    <div style={styles.conversationInfo}>
                      <div style={styles.conversationTop}>
                        <h4 style={styles.conversationName}>{conv.name}</h4>
                        <span style={styles.timestamp}>{formatTime(conv.timestamp)}</span>
                      </div>
                      <p style={{
                        ...styles.lastMessage,
                        ...(conv.unread ? { fontWeight: 700, color: '#111827' } : {})
                      }}>
                        {conv.lastMessage.slice(0, 45)}...
                      </p>
                    </div>
                    {conv.unread && <div style={styles.unreadBadge}></div>}
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
                <div style={{ fontSize: 64 }}>💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a message to start chatting</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div style={styles.chatHeader}>
                  {isMobile && (
                    <button onClick={handleBackToList} style={styles.backBtn}>
                      ←
                    </button>
                  )}
                  <div style={styles.avatarSmall}>
                    {selectedConversation.image && selectedConversation.image.startsWith('http') ? (
                      <img src={selectedConversation.image} alt={selectedConversation.name} style={styles.avatarImage} />
                    ) : (
                      <span style={{ fontSize: 18 }}>{selectedConversation.image}</span>
                    )}
                  </div>
                  <h3 style={styles.chatName}>{selectedConversation.name}</h3>
                </div>

                {/* Messages Area */}
                <div style={styles.messagesArea}>
                  {messages.length === 0 ? (
                    <div style={styles.emptyMessages}>
                      <p>👋 Say hello!</p>
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
    background: '#f9fafb', 
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
  
  // Sidebar
  sidebar: { 
    width: 340, 
    background: '#fff', 
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0
  },
  sidebarHeader: {
    padding: '16px 12px',
    borderBottom: '1px solid #e5e7eb',
    background: '#fff'
  },
  sidebarTitle: { 
    margin: 0, 
    fontSize: 20, 
    fontWeight: 800,
    color: '#111827'
  },
  conversationList: { 
    flex: 1, 
    overflowY: 'auto',
    padding: 0
  },
  conversationItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 12, 
    padding: '12px 16px'},
  conversationItemActive: { 
    background: '#f9fafb' 
  },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: '50%', 
    background: '#ecfdf5', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexShrink: 0, 
    overflow: 'hidden',
    border: '2px solid #e5e7eb'
  },
  avatarSmall: { 
    width: 36, 
    height: 36, 
    borderRadius: '50%', 
    background: '#ecfdf5', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden',
    border: '2px solid #e5e7eb'
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
    fontSize: 15, 
    fontWeight: 600, 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap',
    color: '#111827'
  },
  timestamp: { 
    fontSize: 12, 
    color: '#9ca3af',
    flexShrink: 0,
    marginLeft: 8
  },
  lastMessage: { 
    margin: 0, 
    fontSize: 13, 
    color: '#6b7280', 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap' 
  },
  unreadBadge: { 
    width: 8, 
    height: 8, 
    borderRadius: '50%', 
    background: '#065f46', 
    position: 'absolute', 
    right: 20,
    top: '50%',
    transform: 'translateY(-50%)'
  },
  emptyState: { 
    padding: '60px 20px', 
    textAlign: 'center', 
    color: '#6b7280' 
  },
  
  // Chat Area
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
    gap: 12, 
    color: '#6b7280' 
  },
  chatHeader: { 
    padding: '12px 20px', 
    borderBottom: '1px solid #e5e7eb', 
    display: 'flex',
    alignItems: 'center', 
    gap: 12,
    background: '#fff',
    flexShrink: 0
  },
  backBtn: { 
    background: 'none', 
    border: 'none', 
    fontSize: 24, 
    fontWeight: 700, 
    color: '#065f46', 
    cursor: 'pointer', 
    padding: 4
  },
  chatName: { 
    margin: 0, 
    fontSize: 16, 
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
    gap: 8, 
    background: '#f9fafb'
  },
  emptyMessages: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6b7280'
  },
  messageRow: { 
    display: 'flex' 
  },
  bubble: { 
    maxWidth: '75%', 
    padding: '10px 14px', 
    borderRadius: 16, 
    wordWrap: 'break-word' 
  },
  bubbleMine: { 
    background: '#065f46', 
    color: '#fff', 
    borderBottomRightRadius: 4 
  },
  bubbleTheirs: { 
    background: '#fff', 
    color: '#111827', 
    border: '1px solid #e5e7eb', 
    borderBottomLeftRadius: 4 
  },
  bubbleText: { 
    margin: '0 0 4px', 
    fontSize: 15, 
    lineHeight: 1.5 
  },
  bubbleTime: { 
    fontSize: 11, 
    opacity: 0.7 
  },
  
  // Input
  inputArea: { 
    padding: 12, 
    borderTop: '1px solid #e5e7eb', 
    background: '#fff',
    flexShrink: 0
  },
  inputForm: {
    display: 'flex',
    gap: 8
  },
  textInput: { 
    flex: 1, 
    padding: '10px 16px', 
    border: '1.5px solid #e5e7eb', 
    borderRadius: 24, 
    fontSize: 15, 
    outline: 'none', 
    fontFamily: '"Outfit", sans-serif',
    background: '#fff'
  },
  sendButton: { 
    width: 44, 
    height: 44, 
    borderRadius: '50%', 
    background: '#065f46', 
    color: '#fff', 
    border: 'none', 
    fontSize: 20, 
    fontWeight: 700, 
    cursor: 'pointer', 
    fontFamily: '"Outfit", sans-serif',
    flexShrink: 0
  },
  sendButtonDisabled: { 
    opacity: 0.4, 
    cursor: 'not-allowed' 
  }
};

export default MessagesPage;
