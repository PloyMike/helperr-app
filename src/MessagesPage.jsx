import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';
import ChatModal from './ChatModal';

function MessagesPage() {
  const { user, signIn } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_email.eq.${user.email},receiver_email.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const chatMap = {};
      
      for (const msg of messages || []) {
        let partnerId, partnerName, isMe;
        
        if (msg.sender_email === user.email) {
          partnerId = msg.receiver_profile_id;
          partnerName = msg.receiver_name;
          isMe = true;
        } else {
          partnerId = msg.receiver_profile_id;
          partnerName = msg.sender_name;
          isMe = false;
        }

        if (!chatMap[partnerId]) {
          chatMap[partnerId] = {
            profileId: partnerId,
            partnerName: partnerName,
            lastMessage: msg.message,
            lastMessageTime: msg.created_at,
            unread: !msg.read && !isMe
          };
        } else if (new Date(msg.created_at) > new Date(chatMap[partnerId].lastMessageTime)) {
          chatMap[partnerId].lastMessage = msg.message;
          chatMap[partnerId].lastMessageTime = msg.created_at;
          if (!msg.read && !isMe) {
            chatMap[partnerId].unread = true;
          }
        }
      }

      const profileIds = Object.keys(chatMap);
      if (profileIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', profileIds);

        const conversationsArray = profileIds.map(id => ({
          ...chatMap[id],
          profile: profiles?.find(p => p.id === id)
        })).filter(c => c.profile);

        setConversations(conversationsArray);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const openChat = async (conversation) => {
    setSelectedProfile(conversation.profile);
    setShowChat(true);
    
    if (conversation.unread) {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_email', user.email)
        .eq('receiver_profile_id', conversation.profileId)
        .eq('read', false);
      
      fetchConversations();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      alert('Login fehlgeschlagen: ' + error.message);
    }
    setLoginLoading(false);
  };

  if (!user) {
    return (
      <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header/>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'90px 20px 40px'}}>
          <div style={{background:'white',padding:40,borderRadius:20,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',maxWidth:400,width:'100%',fontFamily:'"Outfit",sans-serif'}}>
            <h2 style={{fontSize:28,fontWeight:700,marginBottom:30,color:'#1F2937',textAlign:'center'}}>Login für Nachrichten</h2>
            <form onSubmit={handleLogin}>
              <div style={{marginBottom:20}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#1F2937'}}>Email</label>
                <input type="email" required value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder="deine@email.com" style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#1F2937'}}>Passwort</label>
                <input type="password" required value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} placeholder="Passwort" style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <button type="submit" disabled={loginLoading} style={{width:'100%',padding:16,background:loginLoading?'#CBD5E0':'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:loginLoading?'not-allowed':'pointer'}}>
                {loginLoading ? 'Lädt...' : 'Einloggen'}
              </button>
              <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'#6B7280'}}>Noch kein Account? <span onClick={()=>window.navigateTo('signup')} style={{color:'#14B8A6',fontWeight:600,cursor:'pointer',textDecoration:'underline'}}>Registrieren</span></p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div className="messages-wrapper">
        <div className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-gradient"></div>
          <div className="hero-content">
            <h1 className="hero-title">💬 Nachrichten</h1>
            <p className="hero-subtitle">Alle deine Konversationen</p>
          </div>
        </div>

        <div className="conversations-container">
          {loading ? (
            <div className="loading-state">
              <p>Lädt Nachrichten...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>Noch keine Nachrichten</h2>
              <p>Starte eine Konversation mit einem Anbieter!</p>
              <button onClick={()=>window.navigateTo('home')} className="browse-button">
                Profile durchsuchen
              </button>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conv, i) => (
                <div key={i} onClick={()=>openChat(conv)} className={`conversation-item ${conv.unread ? 'unread' : ''}`}>
                  
                  {conv.profile.image_url?
                    <img src={conv.profile.image_url} alt={conv.profile.name} className="conversation-avatar"/>
                    :
                    <div className="conversation-avatar-placeholder">{conv.profile.name?.charAt(0)}</div>
                  }
                  
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <h3 className="conversation-name">{conv.profile.name}</h3>
                      {conv.unread&&<span className="unread-badge">NEU</span>}
                    </div>
                    <p className="conversation-job">{conv.profile.job}</p>
                    <p className="conversation-message">{conv.lastMessage.length>80?conv.lastMessage.substring(0,80)+'...':conv.lastMessage}</p>
                  </div>

                  <div className="conversation-time">
                    <p className="time-date">{new Date(conv.lastMessageTime).toLocaleDateString('de-DE',{day:'2-digit',month:'short'})}</p>
                    <p className="time-hour">{new Date(conv.lastMessageTime).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer/>

      {showChat&&selectedProfile&&<ChatModal profile={selectedProfile} onClose={()=>{setShowChat(false);fetchConversations();}} currentUserEmail={user.email} currentUserName={user.user_metadata?.name || user.email}/>}

      <style>{`
        .messages-container {
          min-height: 100vh;
          background-color: #F9FAFB;
        }
        .messages-wrapper {
          padding-top: 70px;
        }
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 60px 20px;
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1600&q=80);
          background-size: cover;
          background-position: center;
          opacity: 0.7;
          z-index: 0;
        }
        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(250,250,250,0.9) 100%);
          z-index: 1;
        }
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          color: #1F2937;
        }
        .hero-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
          font-family: "Outfit", sans-serif;
          letter-spacing: -1px;
        }
        .hero-subtitle {
          font-size: 18px;
          font-family: "Outfit", sans-serif;
          font-weight: 400;
        }
        .conversations-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 0 20px;
        }
        .loading-state {
          text-align: center;
          padding: 60px;
        }
        .loading-state p {
          font-size: 18px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
        }
        .empty-state {
          text-align: center;
          padding: 100px;
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .empty-state h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .empty-state p {
          font-size: 16px;
          color: #6B7280;
          margin-bottom: 32px;
          font-family: "Outfit", sans-serif;
        }
        .browse-button {
          padding: 16px 32px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .browse-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.3);
        }
        .conversations-list {
          background-color: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .conversation-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background-color: #F9FAFB;
          border-radius: 12px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: all 0.3s;
          border: 2px solid transparent;
        }
        .conversation-item.unread {
          background-color: #ECFDF5;
          border: 2px solid #14B8A6;
        }
        .conversation-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        .conversation-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #14B8A6;
          flex-shrink: 0;
        }
        .conversation-avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: white;
          font-family: "Outfit", sans-serif;
          flex-shrink: 0;
        }
        .conversation-content {
          flex: 1;
          min-width: 0;
        }
        .conversation-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        .conversation-name {
          font-size: 18px;
          font-weight: 700;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }
        .unread-badge {
          padding: 4px 10px;
          background-color: #F97316;
          color: white;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          font-family: "Outfit", sans-serif;
        }
        .conversation-job {
          font-size: 14px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }
        .conversation-message {
          font-size: 14px;
          color: #4B5563;
          font-family: "Outfit", sans-serif;
          margin-top: 8px;
          margin-bottom: 0;
        }
        .conversation-item.unread .conversation-message {
          font-weight: 600;
        }
        .conversation-time {
          text-align: right;
          flex-shrink: 0;
        }
        .time-date {
          font-size: 12px;
          color: #9CA3AF;
          font-family: "Outfit", sans-serif;
          margin: 0 0 4px 0;
        }
        .time-hour {
          font-size: 11px;
          color: #9CA3AF;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 16px !important;
          }
          .hero-title {
            font-size: 28px !important;
            margin-bottom: 8px !important;
          }
          .hero-subtitle {
            font-size: 15px !important;
          }
          .conversations-container {
            margin: 24px auto !important;
            padding: 0 16px !important;
          }
          .empty-state {
            padding: 60px 20px !important;
          }
          .empty-icon {
            font-size: 48px !important;
          }
          .empty-state h2 {
            font-size: 20px !important;
          }
          .empty-state p {
            font-size: 14px !important;
            margin-bottom: 24px !important;
          }
          .browse-button {
            padding: 14px 24px !important;
            font-size: 14px !important;
          }
          .conversations-list {
            padding: 16px !important;
          }
          .conversation-item {
            padding: 12px !important;
            gap: 12px !important;
            margin-bottom: 12px !important;
          }
          .conversation-avatar, .conversation-avatar-placeholder {
            width: 50px !important;
            height: 50px !important;
            font-size: 20px !important;
            border-width: 2px !important;
          }
          .conversation-name {
            font-size: 16px !important;
          }
          .conversation-job {
            font-size: 13px !important;
          }
          .conversation-message {
            font-size: 13px !important;
            margin-top: 6px !important;
          }
          .unread-badge {
            padding: 3px 8px !important;
            font-size: 10px !important;
          }
          .conversation-time {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
          }
          .time-date {
            font-size: 11px !important;
          }
          .time-hour {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default MessagesPage;
