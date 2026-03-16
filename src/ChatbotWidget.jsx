import React, { useState, useRef, useEffect } from 'react';

const FAQ_RESPONSES = {
  'buchen': 'Um zu buchen:\n1. Suche einen Provider über die Startseite\n2. Klick auf sein Profil\n3. Klick "Jetzt buchen"\n4. Wähle Datum und Zeit\n5. Bestätige die Buchung! ✅',
  'provider': 'Um Provider zu werden:\n1. Klick im Header auf "Anbieter werden"\n2. Registriere dich oder logge dich ein\n3. Fülle dein Provider-Profil aus\n4. Fertig! Jetzt können Kunden dich buchen! 🚀',
  'kosten': 'Helperr ist komplett KOSTENLOS! 🎉\n- Für Kunden: 0€\n- Für Provider: 0€\n- Keine versteckten Gebühren!',
  'städte': 'Verfügbare Städte:\n🇹🇭 Bangkok, Phuket, Koh Samui, Chiang Mai\n🇩🇪 Berlin, München, Hamburg, Köln\n🇦🇹 Wien, Salzburg\n🇨🇭 Zürich, Bern\n+ viele mehr!',
  'kontakt': 'Du kannst uns erreichen unter:\n📧 helperrapp@gmail.com\n\nWir antworten innerhalb von 24 Stunden!',
  'bewertung': 'Nach einer Buchung kannst du den Provider bewerten:\n⭐ 1-5 Sterne\n💬 Schreibe eine Bewertung\nSo hilfst du anderen Kunden!',
  'nachrichten': 'Du kannst Provider direkt kontaktieren:\n1. Gehe zu "Nachrichten" im Header\n2. Wähle einen Chat oder starte einen neuen\n3. Schreibe deine Frage! 💬',
  'favoriten': 'Speichere deine Lieblings-Provider:\n❤️ Klick das Herz-Icon auf dem Profil\n📋 Finde sie unter "Favoriten" im Header',
  'zahlung': 'Zahlung läuft direkt zwischen dir und dem Provider.\nHelperr nimmt keine Provision! 💰',
  'hilfe': 'Ich kann dir helfen mit:\n• Buchungen\n• Provider werden\n• Kosten & Preise\n• Verfügbare Städte\n• Nachrichten\n• Favoriten\n\nStell mir eine Frage! 😊'
};

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 Ich bin dein Helperr-Assistent.\n\nIch kann dir helfen mit:\n• Buchungen\n• Provider werden\n• Kosten & Preise\n• Verfügbare Städte\n\nWas möchtest du wissen?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Keyword matching
    if (input.includes('buch') || input.includes('reserv') || input.includes('termin')) {
      return FAQ_RESPONSES.buchen;
    }
    if (input.includes('anbieter') || input.includes('provider') || input.includes('dienstleister')) {
      return FAQ_RESPONSES.provider;
    }
    if (input.includes('kost') || input.includes('preis') || input.includes('gebühr') || input.includes('zahlen')) {
      return FAQ_RESPONSES.kosten;
    }
    if (input.includes('stadt') || input.includes('städte') || input.includes('ort') || input.includes('wo')) {
      return FAQ_RESPONSES.städte;
    }
    if (input.includes('kontakt') || input.includes('email') || input.includes('erreichen')) {
      return FAQ_RESPONSES.kontakt;
    }
    if (input.includes('bewert') || input.includes('rating') || input.includes('sterne')) {
      return FAQ_RESPONSES.bewertung;
    }
    if (input.includes('nachricht') || input.includes('chat') || input.includes('schreiben')) {
      return FAQ_RESPONSES.nachrichten;
    }
    if (input.includes('favorit') || input.includes('speichern') || input.includes('merken')) {
      return FAQ_RESPONSES.favoriten;
    }
    if (input.includes('bezahl') || input.includes('zahlung') || input.includes('provision')) {
      return FAQ_RESPONSES.zahlung;
    }
    if (input.includes('hilfe') || input.includes('help') || input.includes('hallo') || input.includes('hi')) {
      return FAQ_RESPONSES.hilfe;
    }
    
    return 'Entschuldigung, das habe ich nicht ganz verstanden. 🤔\n\nIch kann dir helfen mit:\n• Buchungen\n• Provider werden\n• Kosten & Preise\n• Städte\n• Nachrichten\n• Favoriten\n\nOder schreib uns: helperrapp@gmail.com';
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    setTimeout(() => {
      const response = findBestMatch(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: '📅 Wie buche ich?', query: 'Wie buche ich einen Service?' },
    { label: '🚀 Provider werden', query: 'Wie werde ich Provider?' },
    { label: '💰 Kosten', query: 'Was kostet Helperr?' },
    { label: '📍 Städte', query: 'Welche Städte gibt es?' }
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      {/* FLOATING BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            zIndex: 9999,
            transition: 'all 0.3s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          💬
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 380,
          height: 550,
          background: 'white',
          borderRadius: 20,
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden',
          fontFamily: '"Outfit", sans-serif'
        }}>
          
          {/* HEADER */}
          <div style={{
            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
            padding: '20px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Helperr Support</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, opacity: 0.9 }}>Sofortige Antworten</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: 24,
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 20,
            background: '#F9FAFB'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: 16,
                  background: msg.role === 'user' ? '#14B8A6' : 'white',
                  color: msg.role === 'user' ? 'white' : '#374151',
                  fontSize: 14,
                  lineHeight: 1.5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* QUICK ACTIONS */}
            {messages.length === 1 && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>Schnellauswahl:</p>
                <div style={{ display: 'grid', gap: 8 }}>
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMessages(prev => [...prev, { role: 'user', content: action.query }]);
                        setTimeout(() => {
                          const response = findBestMatch(action.query);
                          setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                        }, 500);
                      }}
                      style={{
                        padding: '10px 14px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: 12,
                        fontSize: 13,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 500,
                        color: '#374151'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#F3F4F6';
                        e.target.style.borderColor = '#14B8A6';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#E5E7EB';
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div style={{
            padding: 16,
            borderTop: '1px solid #E5E7EB',
            background: 'white'
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Schreib eine Nachricht..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: '"Outfit", sans-serif'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                style={{
                  padding: '12px 20px',
                  background: input.trim() ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' : '#E5E7EB',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 20,
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          div[style*="width: 380px"] {
            width: calc(100vw - 40px) !important;
            height: calc(100vh - 100px) !important;
            bottom: 20px !important;
            right: 20px !important;
          }
        }
      `}</style>
    </>
  );
}

export default ChatbotWidget;
