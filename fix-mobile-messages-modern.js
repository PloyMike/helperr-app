const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Add mobile-specific styles at the end of styles object, before the closing }
const mobileStyles = `
  
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
  }`;

// Find where to insert mobile styles - right before the last closing brace of styles
content = content.replace(
  /(sendButtonDisabled: \{[^}]+\})\s*\};/,
  `$1,${mobileStyles}\n};`
);

// Also increase touch targets on mobile by modifying conversationItem padding
content = content.replace(
  /conversationItem: \{ [^}]*padding: '14px 16px'/,
  `conversationItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 14, 
    padding: '16px 20px'`
);

// Make avatars slightly bigger on mobile
content = content.replace(
  /avatar: \{ [^}]*width: 52, [^}]*height: 52/,
  `avatar: { 
    width: 56, 
    height: 56`
);

// Make conversation name bigger and bolder
content = content.replace(
  /conversationName: \{ [^}]*fontSize: 15, [^}]*fontWeight: 700/,
  `conversationName: { 
    margin: 0, 
    fontSize: 16, 
    fontWeight: 800`
);

// Make last message text bigger and more readable
content = content.replace(
  /lastMessage: \{ [^}]*fontSize: 14,/,
  `lastMessage: { 
    margin: 0, 
    fontSize: 14.5,`
);

// Make timestamp more prominent
content = content.replace(
  /timestamp: \{ [^}]*fontSize: 12,/,
  `timestamp: { 
    fontSize: 12.5,`
);

// Add padding to sidebar on mobile
content = content.replace(
  /sidebar: \{ [^}]*width: 340,/,
  `sidebar: { 
    width: 340,`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Mobile messages list now modern!');
