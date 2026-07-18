import { Capacitor } from '@capacitor/core';
import React, { useState, useRef, useEffect } from 'react';

// Multi-Language FAQ
const FAQ = {
  en: {
    booking: { keywords: ['book', 'booking', 'reserve', 'appointment'], answer: 'To book an expert:\n\n1. Search for services\n2. Choose an expert\n3. Pick date & time\n4. Enter your location\n5. Confirm & pay\n\nYour booking will be visible in "My Bookings".' },
    provider: { keywords: ['provider', 'expert', 'become', 'register', 'sign up as'], answer: 'To become an expert:\n\n1. Sign up as a customer first\n2. Go to Menu → Provider Registration\n3. Fill out your profile\n4. Set your service area & rates\n5. Wait for approval\n\nYou can start earning right after approval!' },
    price: { keywords: ['price', 'cost', 'fee', 'expensive', 'cheap', 'money'], answer: 'Prices vary by expert and service.\n\n• Hourly rates from ฿300\n• Day rates from ฿2000\n• Helperr takes a small service fee\n• Payment via card or PromptPay\n\nCheck each expert profile for specific pricing.' },
    cities: { keywords: ['city', 'cities', 'where', 'location', 'available', 'bangkok', 'chiang mai'], answer: 'Helperr is available in:\n\n• Bangkok\n• Chiang Mai\n• Phuket\n• Pattaya\n• And 15+ more cities!\n\nSearch your city on the homepage to see available experts.' },
    contact: { keywords: ['contact', 'support', 'help', 'issue', 'problem'], answer: 'Need human help?\n\n• Email: support@helperr.co\n• Contact form in Menu → Contact Us\n\nOur team responds within 24 hours.' },
    default: 'I can help with:\n\n• Bookings\n• Becoming a provider\n• Pricing\n• Available cities\n• Contact support\n\nWhat would you like to know?'
  },
  de: {
    booking: { keywords: ['buchen', 'buchung', 'reservieren', 'termin'], answer: 'So buchst du einen Experten:\n\n1. Nach Services suchen\n2. Expert auswählen\n3. Datum & Zeit wählen\n4. Adresse eingeben\n5. Bestätigen & zahlen\n\nDie Buchung erscheint in "My Bookings".' },
    provider: { keywords: ['anbieter', 'expert', 'werden', 'registrieren'], answer: 'So wirst du Experte:\n\n1. Erst als Kunde registrieren\n2. Menü → Provider Registration\n3. Profil ausfüllen\n4. Servicebereich & Preise\n5. Auf Freigabe warten\n\nNach Freigabe kannst du sofort starten!' },
    price: { keywords: ['preis', 'kosten', 'gebühr', 'teuer', 'geld'], answer: 'Preise variieren je nach Experte:\n\n• Stundensätze ab ฿300\n• Tagessätze ab ฿2000\n• Kleine Servicegebühr von Helperr\n• Zahlung: Karte oder PromptPay\n\nSchau ins Expert-Profil für Details.' },
    cities: { keywords: ['stadt', 'wo', 'ort', 'verfügbar', 'bangkok'], answer: 'Helperr ist verfügbar in:\n\n• Bangkok\n• Chiang Mai\n• Phuket\n• Pattaya\n• Und 15+ weitere Städte!\n\nSuche auf der Homepage nach deiner Stadt.' },
    contact: { keywords: ['kontakt', 'support', 'hilfe', 'problem'], answer: 'Menschliche Hilfe?\n\n• Email: support@helperr.co\n• Menü → Contact Us\n\nUnser Team antwortet innerhalb 24h.' },
    default: 'Ich kann dir helfen mit:\n\n• Buchungen\n• Als Expert registrieren\n• Preisen\n• Verfügbaren Städten\n• Kontakt Support\n\nWas möchtest du wissen?'
  },
  th: {
    booking: { keywords: ['จอง', 'นัด', 'reserve'], answer: 'วิธีจองผูเชี่ยวชาญ:\n\n1. ค้นหาบริการ\n2. เลือกผู้เชี่ยวชาญ\n3. เลือกวนและเวลา\n4. ใส่ที่อยู่\n5. ยืนยันและชำระเงิน\n\nการจองจะแสดงใน "My Bookings"' },
    provider: { keywords: ['ผู้ให้บริการ', 'expert', 'สมัคร'], answer: 'วิธีเป็นผู้เชี่ยวชาญ:\n\n1. สมัครเป็นลูกค้าก่อน\n2. เมนู → Provider Registration\n3. กรอกโปรไฟล์\n4. กำหนดพื้นที่และราคา\n5. รอการอนุมัติ' },
    price: { keywords: ['ราคา', 'ค่าใช้จ่าย', 'เท่าไหร่'], answer: 'ราคาแตกต่างกันไปตามผู้เชี่ยวชาญ:\n\n• รายชั่วโมง เริ่มต้น ฿300\n• รายวัน เริ่มต้น ฿2000\n• ค่าธรรมเนียมเล็กน้อยจาก Helperr\n• จ่ายผ่านบัตรหรือ PromptPay' },
    cities: { keywords: ['เมือง', 'ที่ไหน', 'กรุงเทพ'], answer: 'Helperr ให้บริการใน:\n\n• กรุงเทพ\n• เชียงใหม่\n• ภูเก็ต\n• พัทยา\n• และอีก 15+ เมือง!' },
    contact: { keywords: ['ติดต่อ', 'ช่วยเหลอ', 'สนับสนุน'], answer: 'ต้องการความช่วยเหลือ?\n\n• Email: support@helperr.co\n• เมนู → Contact Us\n\nทีมของเราตอบภายใน 24 ชั่วโมง' },
    default: 'ฉันช่วยคุณเรื่อง:\n\n• การจอง\n• เป็นผู้เชี่ยวชาญ\n• ราคา\n• เมืองที่ให้บริการ\n• ติดต่อ Support\n\nอยากรู้อะไรครบ?'
  }
};

const QUICK_REPLIES = {
  en: ['How to book?', 'Become an expert', 'Pricing info', 'Which cities?', 'Contact support'],
  de: ['Wie buchen?', 'Expert werden', 'Preise', 'Welche Städte?', 'Support kontaktieren'],
  th: ['จองอย่างไร?', 'เป็นผู้เชี่ยวชาญ', 'ราคา', 'เมืองไหนบ้าง?', 'ติดต่อ Support']
};

function detectLanguage(text) {
  if (/[ก-๙]/.test(text)) return 'th';
  const germanWords = ['ich', 'du', 'wie', 'wo', 'was', 'kann', 'werden', 'buchen', 'preis'];
  const lowerText = text.toLowerCase();
  if (germanWords.some(w => lowerText.includes(w))) return 'de';
  return 'en';
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: FAQ.en.default, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const findAnswer = (userInput) => {
    const detectedLang = detectLanguage(userInput);
    setLang(detectedLang);
    const faq = FAQ[detectedLang];
    const inputLower = userInput.toLowerCase();
    
    for (const key of Object.keys(faq)) {
      if (key === 'default') continue;
      const item = faq[key];
      if (item.keywords.some(kw => inputLower.includes(kw))) {
        return item.answer;
      }
    }
    return faq.default;
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = findAnswer(text);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
    }, 900);
  };

  const handleQuickReply = (text) => sendMessage(text);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const bottomOffset = Capacitor.isNativePlatform() ? 'calc(90px + env(safe-area-inset-bottom))' : 24;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          style={{
            position: 'fixed', bottom: bottomOffset, right: 20, zIndex: 999,
            width: 60, height: 60, borderRadius: '50%', border: 'none',
            background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
            boxShadow: '0 8px 24px rgba(6,95,70,0.35)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, animation: 'chatbotPulse 2s ease-in-out infinite'
          }}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div
          style={{
            position: 'fixed', bottom: bottomOffset, right: 20, zIndex: 999,
            width: 340, maxWidth: 'calc(100vw - 40px)', height: 520, maxHeight: 'calc(100vh - 200px)',
            background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            fontFamily: '"Outfit", sans-serif',
            animation: 'chatbotSlideUp 0.3s ease-out'
          }}
        >
          {/* HEADER */}
          <div style={{
            padding: '14px 16px', background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
            color: 'white', display: 'flex', alignItems: 'center', gap: 12
          }}>
            <img
              src="/logo.jpeg" alt="Helperr"
              style={{
                width: 40, height: 40, borderRadius: '50%', objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.9)'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Helperr Assistant</div>
              <div style={{ fontSize: 12, opacity: 0.9, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }}></span>
                Online now
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)} aria-label="Close chat"
              style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
                fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column',
            gap: 10, background: '#F9FAFB'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%', display: 'flex', flexDirection: 'column',
                  gap: 3,
                  animation: 'chatbotBubble 0.3s ease-out'
                }}
              >
                <div style={{
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #065f46 0%, #10b981 100%)'
                    : 'white',
                  color: msg.role === 'user' ? 'white' : '#111827',
                  fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-line',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  border: msg.role === 'user' ? 'none' : '1px solid #E5E7EB'
                }}>
                  {msg.content}
                </div>
                <div style={{
                  fontSize: 10, color: '#9CA3AF',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  padding: '0 4px'
                }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '60%' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
                  background: 'white', border: '1px solid #E5E7EB',
                  display: 'flex', gap: 4, alignItems: 'center'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF', animation: 'chatbotDot 1.4s infinite ease-in-out 0s' }}></span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF', animation: 'chatbotDot 1.4s infinite ease-in-out 0.2s' }}></span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF', animation: 'chatbotDot 1.4s infinite ease-in-out 0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK REPLIES */}
          {messages.length <= 2 && !isTyping && (
            <div style={{
              padding: '8px 16px', display: 'flex', gap: 6,
              overflowX: 'auto', background: '#F9FAFB',
              borderTop: '1px solid #E5E7EB'
            }}>
              {QUICK_REPLIES[lang].map((reply, i) => (
                <button
                  key={i} onClick={() => handleQuickReply(reply)}
                  style={{
                    padding: '6px 12px', background: 'white', border: '1.5px solid #10b981',
                    color: '#065f46', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                    fontFamily: 'inherit'
                  }}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <div style={{ padding: 12, borderTop: '1px solid #E5E7EB', background: 'white' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={lang === 'de' ? 'Frage stellen...' : lang === 'th' ? 'ถามได้เลย...' : 'Ask me anything...'}
                style={{
                  flex: 1, padding: '10px 14px', border: '1.5px solid #E5E7EB',
                  borderRadius: 20, fontSize: 16, outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={() => sendMessage(input)} disabled={!input.trim()}
                aria-label="Send"
                style={{
                  width: 40, height: 40, borderRadius: '50%', border: 'none',
                  background: input.trim() ? 'linear-gradient(135deg, #065f46 0%, #10b981 100%)' : '#E5E7EB',
                  color: 'white', cursor: input.trim() ? 'pointer' : 'not-allowed',
                  fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatbotSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes chatbotBubble {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes chatbotDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes chatbotPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(6,95,70,0.35); }
          50% { transform: scale(1.05); box-shadow: 0 12px 32px rgba(6,95,70,0.5); }
        }
      `}</style>
    </>
  );
}

export default ChatbotWidget;
