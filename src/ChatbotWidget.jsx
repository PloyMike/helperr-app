import React, { useState, useRef, useEffect } from 'react';

const FAQ_RESPONSES = {
  'book': 'To book a service:\n1. Search for a provider on the homepage\n2. Click on their profile\n3. Click "Book Now"\n4. Select date and time\n5. Confirm your booking! ✅',
  'provider': 'To become a provider:\n1. Click "Become a Provider" in the header\n2. Register or login\n3. Fill out your provider profile\n4. Done! Customers can now book you! 🚀',
  'cost': 'Helperr is completely FREE! 🎉\n- For customers: $0\n- For providers: $0\n- No hidden fees!',
  'cities': 'Available cities:\n🇹🇭 Bangkok, Phuket, Koh Samui, Chiang Mai\n🇻🇳 Ho Chi Minh, Hanoi\n🇮🇩 Bali, Jakarta\n🇵🇭 Manila, Cebu\n+ many more!',
  'contact': 'You can reach us at:\n📧 helperrapp@gmail.com\n\nWe respond within 24 hours!',
  'review': 'After a booking you can rate the provider:\n⭐ 1-5 stars\n💬 Write a review\nHelp other customers!',
  'message': 'You can contact providers directly:\n1. Go to "Messages" in the header\n2. Select a chat or start a new one\n3. Write your question! 💬',
  'favorites': 'Save your favorite providers:\n❤️ Click the heart icon on the profile\n📋 Find them under "Favorites" in the header',
  'payment': 'Payment is handled directly between you and the provider.\nHelperr takes no commission! 💰',
  'help': 'I can help you with:\n• Bookings\n• Becoming a provider\n• Costs & pricing\n• Available cities\n• Messages\n• Favorites\n\nAsk me a question! 😊'
};

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m your Helperr assistant.\n\nI can help you with:\n• Bookings\n• Becoming a provider\n• Costs & pricing\n• Available cities\n\nWhat would you like to know?' }
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
    
    const keywords = {
      'book': ['book', 'booking', 'reserve', 'appointment', 'schedule'],
      'provider': ['provider', 'become', 'join', 'register', 'seller'],
      'cost': ['cost', 'price', 'fee', 'expensive', 'charge', 'pay'],
      'cities': ['city', 'cities', 'location', 'where', 'available'],
      'contact': ['contact', 'email', 'support', 'help desk'],
      'review': ['review', 'rating', 'rate', 'feedback', 'star'],
      'message': ['message', 'chat', 'talk', 'contact provider'],
      'favorites': ['favorite', 'save', 'bookmark', 'heart'],
      'payment': ['payment', 'pay', 'money', 'transaction'],
      'help': ['help', 'what can you', 'how do', 'assist']
    };

    for (const [key, words] of Object.entries(keywords)) {
      if (words.some(word => input.includes(word))) {
        return FAQ_RESPONSES[key];
      }
    }

    return 'I\'m not sure about that. Try asking about:\n• Bookings\n• Becoming a provider\n• Costs\n• Available cities\n• Contact\n\nOr type "help" for all options! 😊';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const response = findBestMatch(input);
      const botMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* CHAT BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(6,95,70,0.3)',
            cursor: 'pointer',
            fontSize: 28,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          💬
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            height: 500,
            maxHeight: 'calc(100vh - 100px)',
            background: 'white',
            borderRadius: 20,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '"Outfit", sans-serif',
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
              color: 'white',
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 24 }}>💬</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Helperr Assistant</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>Online</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: 18,
                fontWeight: 700
              }}
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: '#F9FAFB'
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%'
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: msg.role === 'user' ? '#065f46' : 'white',
                    color: msg.role === 'user' ? 'white' : '#374151',
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div style={{ padding: 16, borderTop: '1px solid #E5E7EB', background: 'white' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '2px solid #E5E7EB',
                  borderRadius: 12,
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: '"Outfit", sans-serif'
                }}
                onFocus={(e) => {
                  if (e.target) {
                    e.target.style.borderColor = '#065f46';
                  }
                }}
                onBlur={(e) => {
                  if (e.target) {
                    e.target.style.borderColor = '#E5E7EB';
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={{
                  padding: '10px 16px',
                  background: input.trim() ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)' : '#E5E7EB',
                  color: input.trim() ? 'white' : '#9CA3AF',
                  border: 'none',
                  borderRadius: 12,
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: '"Outfit", sans-serif',
                  transition: 'all 0.2s'
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
