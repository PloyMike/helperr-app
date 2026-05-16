import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';
import ChatModal from './ChatModal';

function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_email.eq.${user.email},receiver_profile_id.in.(select id from profiles)`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const chatMap = {};
      
      for (const msg of messages || []) {
        let partnerId, partnerName;
        
        if (msg.sender_email === user.email) {
          partnerId = msg.receiver_profile_id;
          partnerName = msg.receiver_name;
        } else {
          partnerId = msg.receiver_profile_id;
          partnerName = msg.sender_name;
        }

        if (!chatMap[partnerId]) {
          chatMap[partnerId] = {
            profileId: partnerId,
            partnerName: partnerName,
            lastMessage: msg.message,
            lastMessageTime: msg.created_at,
            unread: !msg.read && msg.sender_email !== user.email
          };
        } else if (new Date(msg.created_at) > new Date(chatMap[partnerId].lastMessageTime)) {
          chatMap[partnerId].lastMessage = msg.message;
          chatMap[partnerId].lastMessageTime = msg.created_at;
          if (!msg.read && msg.sender_email !== user.email) {
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
        .eq('receiver_profile_id', conversation.profileId)
        .eq('read', false);
      
      fetchConversations();
    }
  };

  if (!user) {
    return (
      <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
        <Header/>
        <div style={{paddingTop:140,textAlign:'center'}}>
          <h2 style={{fontSize:32,fontWeight:700,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Bitte logge dich ein</h2>
          <button onClick={()=>window.navigateTo('login')} style={{marginTop:20,padding:'16px 32px',background:'#14B8A6',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:600,cursor:'pointer'}}>Zum Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{paddingTop:70}}>
        <div style={{position:'relative',overflow:'hidden',padding:'60px 20px'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,zIndex:0}}></div>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)',zIndex:1}}></div>
          <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2,color:'#1F2937'}}>
            <h1 style={{fontSize:48,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>💬 Nachrichten</h1>
            <p style={{fontSize:18,fontFamily:'"Outfit",sans-serif',fontWeight:400}}>Alle deine Konversationen</p>
          </div>
        </div>

        <div style={{maxWidth:900,margin:'40px auto',padding:'0 20px'}}>
          {loading ? (
            <div style={{textAlign:'center',padding:60}}>
              <p style={{fontSize:18,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>Lädt Nachrichten...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div style={{textAlign:'center',padding:100,backgroundColor:'white',borderRadius:20,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{fontSize:64,marginBottom:20}}>💬</div>
              <h2 style={{fontSize:24,fontWeight:700,marginBottom:12,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Noch keine Nachrichten</h2>
              <p style={{fontSize:16,color:'#6B7280',marginBottom:32,fontFamily:'"Outfit",sans-serif'}}>Starte eine Konversation mit einem Anbieter!</p>
              <button onClick={()=>window.navigateTo('home')} style={{padding:'16px 32px',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:16,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>
                Profile durchsuchen
              </button>
            </div>
          ) : (
            <div style={{backgroundColor:'white',borderRadius:20,padding:32,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              {conversations.map((conv, i) => (
                <div key={i} onClick={()=>openChat(conv)} style={{display:'flex',alignItems:'center',gap:16,padding:20,backgroundColor:conv.unread?'#ECFDF5':'#F9FAFB',borderRadius:12,marginBottom:16,cursor:'pointer',transition:'all 0.3s',border:conv.unread?'2px solid #14B8A6':'2px solid transparent'}} onMouseOver={(e)=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)';}} onMouseOut={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
                  
                  {conv.profile.image_url?<img src={conv.profile.image_url} alt={conv.profile.name} style={{width:60,height:60,borderRadius:'50%',objectFit:'cover',border:'3px solid #14B8A6'}}/>:<div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:700,color:'white',fontFamily:'"Outfit",sans-serif'}}>{conv.profile.name?.charAt(0)}</div>}
                  
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
                      <h3 style={{fontSize:18,fontWeight:700,color:'#1F2937',fontFamily:'"Outfit",sans-serif',margin:0}}>{conv.profile.name}</h3>
                      {conv.unread&&<span style={{padding:'4px 10px',backgroundColor:'#F97316',color:'white',borderRadius:12,fontSize:11,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>NEU</span>}
                    </div>
                    <p style={{fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif',margin:0}}>{conv.profile.job}</p>
                    <p style={{fontSize:14,color:'#4B5563',fontFamily:'"Outfit",sans-serif',marginTop:8,fontWeight:conv.unread?600:400}}>{conv.lastMessage.length>80?conv.lastMessage.substring(0,80)+'...':conv.lastMessage}</p>
                  </div>

                  <div style={{textAlign:'right'}}>
                    <p style={{fontSize:12,color:'#9CA3AF',fontFamily:'"Outfit",sans-serif'}}>{new Date(conv.lastMessageTime).toLocaleDateString('de-DE',{day:'2-digit',month:'short'})}</p>
                    <p style={{fontSize:11,color:'#9CA3AF',fontFamily:'"Outfit",sans-serif'}}>{new Date(conv.lastMessageTime).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer/>

      {showChat&&selectedProfile&&<ChatModal profile={selectedProfile} onClose={()=>{setShowChat(false);fetchConversations();}} currentUserEmail={user.email} currentUserName={user.user_metadata?.name || user.email}/>}
    </div>
  );
}

export default MessagesPage;
