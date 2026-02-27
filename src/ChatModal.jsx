import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';

function ChatModal({ profile, onClose, currentUserEmail, currentUserName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_email.eq.${currentUserEmail},receiver_profile_id.eq.${profile.id}),and(sender_email.eq.${profile.email},receiver_email.eq.${currentUserEmail})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMessages(data || []);

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_email', currentUserEmail)
        .eq('receiver_profile_id', profile.id)
        .eq('read', false);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel(`messages:${profile.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchMessages)
      .subscribe();
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from('messages').insert([{
        sender_email: currentUserEmail,
        sender_name: currentUserName,
        receiver_email: profile.email,
        receiver_name: profile.name,
        receiver_profile_id: profile.id,
        message: newMessage.trim(),
        read: false
      }]);

      if (error) throw error;
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Fehler beim Senden der Nachricht');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div className="chat-modal" onClick={(e)=>e.stopPropagation()}>
        <div className="chat-header">
          <h2>💬 {profile.name}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender_email === currentUserEmail ? 'sent' : 'received'}`}>
              <p className="message-text">{msg.message}</p>
              <span className="message-time">{new Date(msg.created_at).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e)=>setNewMessage(e.target.value)}
            onKeyPress={(e)=>e.key==='Enter'&&handleSend()}
            placeholder="Nachricht schreiben..."
            className="chat-input"
          />
          <button onClick={handleSend} className="send-button">Senden</button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .chat-modal {
          width: 600px;
          max-width: 90%;
          height: 700px;
          max-height: 85vh;
          background-color: white;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .chat-header {
          padding: 20px 24px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          border-radius: 20px 20px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chat-header h2 {
          font-size: 22px;
          font-weight: 700;
          color: white;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }
        .close-button {
          width: 40px;
          height: 40px;
          background-color: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .close-button:hover {
          background-color: rgba(255,255,255,0.3);
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .message {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 12px;
          font-family: "Outfit", sans-serif;
          word-wrap: break-word;
        }
        .message.sent {
          align-self: flex-end;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
        }
        .message.received {
          align-self: flex-start;
          background-color: #F3F4F6;
          color: #1F2937;
        }
        .message-text {
          font-size: 15px;
          line-height: 1.5;
          margin: 0 0 4px 0;
        }
        .message-time {
          font-size: 11px;
          opacity: 0.7;
        }
        .chat-input-container {
          padding: 16px 20px;
          background-color: #F9FAFB;
          border-top: 1px solid #E5E7EB;
          display: flex;
          gap: 12px;
        }
        .chat-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          font-size: 15px;
          font-family: "Outfit", sans-serif;
          outline: none;
        }
        .send-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .send-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.3);
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .chat-modal {
            width: 100% !important;
            max-width: 100% !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
          .chat-header {
            padding: 16px !important;
            border-radius: 0 !important;
          }
          .chat-header h2 {
            font-size: 18px !important;
          }
          .close-button {
            width: 32px !important;
            height: 32px !important;
            font-size: 20px !important;
          }
          .chat-messages {
            padding: 16px !important;
            gap: 10px !important;
          }
          .message {
            max-width: 80% !important;
            padding: 10px 12px !important;
          }
          .message-text {
            font-size: 14px !important;
          }
          .chat-input-container {
            padding: 12px !important;
            gap: 8px !important;
            box-sizing: border-box !important;
          }
          .chat-input {
            padding: 10px 12px !important;
            font-size: 14px !important;
            box-sizing: border-box !important;
            min-width: 0 !important;
          }
          .send-button {
            padding: 10px 14px !important;
            font-size: 13px !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatModal;
