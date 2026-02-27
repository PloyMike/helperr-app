const fs = require('fs');
let content = fs.readFileSync('src/ChatModal.jsx', 'utf8');

// Füge useCallback Import hinzu
content = content.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect, useCallback } from 'react';"
);

// Wrap fetchMessages mit useCallback
content = content.replace(
  `const fetchMessages = async () => {`,
  `const fetchMessages = useCallback(async () => {`
);

content = content.replace(
  `    }
  };

  const sendMessage`,
  `    }
  }, [profile.id, currentUserEmail]);

  const sendMessage`
);

// Füge fetchMessages zu useEffect dependencies hinzu
content = content.replace(
  `}, [profile.id]);`,
  `}, [fetchMessages]);`
);

fs.writeFileSync('src/ChatModal.jsx', content);
console.log('✅ Warning fixed!');
