import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

function ChatModal({ profile, onClose, currentUserEmail, currentUserName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_email.eq.${currentUserEmail},receiver_profile_id.eq.${profile.id}),and(receiver_profile_id.eq.${profile.id},sender_email.eq.${currentUserEmail})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('messages').insert([{
        sender_name: currentUserName,
        sender_email: currentUserEmail,
        receiver_profile_id: profile.id,
        receiver_name: profile.name,
        message: newMessage,
        read: false
      }]);

      if (error) throw error;
      
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Fehler beim Senden der Nachricht');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:20}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={{backgroundColor:'white',borderRadius:20,maxWidth:600,width:'100%',maxHeight:'80vh',display:'flex',flexDirection:'column',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        
        <div style={{padding:24,borderBottom:'1px solid #E5E7EB',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            {profile.image_url?<img src={profile.image_url} alt={profile.name} style={{width:50,height:50,borderRadius:'50%',objectFit:'cover',border:'3px solid #14B8A6'}}/>:<div style={{width:50,height:50,borderRadius:'50%',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:700,color:'white',fontFamily:'"Outfit",sans-serif'}}>{profile.name?.charAt(0)}</div>}
            <div>
              <h3 style={{fontSize:18,fontWeight:700,marginBottom:4,fontFamily:'"Outfit",sans-serif',color:'#1F2937'}}>{profile.name}</h3>
              <p style={{fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>{profile.job}</p>
            </div>
          </div>
          <button onClick={onClose} style={{width:40,height:40,borderRadius:'50%',border:'none',backgroundColor:'#F3F4F6',cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s'}} onMouseOver={(e)=>e.target.style.backgroundColor='#E5E7EB'} onMouseOut={(e)=>e.target.style.backgroundColor='#F3F4F6'}>×</button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:24,display:'flex',flexDirection:'column',gap:16}}>
          {messages.length===0?(
            <div style={{textAlign:'center',padding:60,color:'#9CA3AF'}}>
              <div style={{fontSize:48,marginBottom:12}}>💬</div>
              <p style={{fontFamily:'"Outfit",sans-serif',fontSize:16}}>Noch keine Nachrichten</p>
              <p style={{fontFamily:'"Outfit",sans-serif',fontSize:14}}>Schreibe die erste Nachricht!</p>
            </div>
          ):messages.map(msg=>{
            const isMe = msg.sender_email === currentUserEmail;
            return(
              <div key={msg.id} style={{display:'flex',justifyContent:isMe?'flex-end':'flex-start'}}>
                <div style={{maxWidth:'70%',padding:'12px 16px',borderRadius:16,backgroundColor:isMe?'#14B8A6':'#F3F4F6',color:isMe?'white':'#1F2937',fontFamily:'"Outfit",sans-serif',fontSize:15}}>
                  {!isMe&&<div style={{fontSize:12,fontWeight:600,marginBottom:4,opacity:0.8}}>{msg.sender_name}</div>}
                  <div>{msg.message}</div>
                  <div style={{fontSize:11,marginTop:6,opacity:0.7}}>{new Date(msg.created_at).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={sendMessage} style={{padding:24,borderTop:'1px solid #E5E7EB'}}>
          <div style={{display:'flex',gap:12}}>
            <input
              type="text"
              value={newMessage}
              onChange={(e)=>setNewMessage(e.target.value)}
              placeholder="Nachricht schreiben..."
              style={{flex:1,padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}
              disabled={loading}
            />
            <button type="submit" disabled={loading||!newMessage.trim()} style={{padding:'14px 24px',background:loading||!newMessage.trim()?'#CBD5E0':'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:loading||!newMessage.trim()?'not-allowed':'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}>
              {loading?'...':'Senden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatModal;
