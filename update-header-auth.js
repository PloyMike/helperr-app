const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Import useAuth
content = content.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport { useAuth } from './AuthContext';"
);

// Add useAuth hook
content = content.replace(
  "function Header() {",
  "function Header() {\n  const { user, signOut } = useAuth();"
);

// Ersetze den "Anbieter werden" Button mit Login/Logout
content = content.replace(
  /<button onClick=\{\(\)=>window\.navigateTo\('register'\)\}[\s\S]*?Anbieter werden<\/button>/,
  `{user ? (
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <span style={{fontSize:14,fontWeight:600,color:'white',fontFamily:'"Outfit",sans-serif'}}>👋 {user.user_metadata?.name || user.email}</span>
              <button onClick={async()=>{await signOut();window.navigateTo('home');}} style={{padding:'10px 20px',backgroundColor:'rgba(255,255,255,0.2)',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}>Logout</button>
            </div>
          ) : (
            <button onClick={()=>window.navigateTo('login')} style={{padding:'10px 20px',backgroundColor:'#F97316',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',boxShadow:'0 4px 12px rgba(249,115,22,0.3)',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}>Login</button>
          )}`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Header updated with auth!');
