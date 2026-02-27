const fs = require('fs');
let content = fs.readFileSync('src/ReviewSection.jsx', 'utf8');

// Füge useCallback hinzu
content = content.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect, useCallback } from 'react';"
);

// Wrap fetchReviews mit useCallback
content = content.replace(
  `const fetchReviews = async () => {`,
  `const fetchReviews = useCallback(async () => {`
);

content = content.replace(
  `    }
  };

  const handleSubmit`,
  `    }
  }, [profileId]);

  const handleSubmit`
);

// Update useEffect dependency
content = content.replace(
  `}, [profileId]);`,
  `}, [fetchReviews]);`
);

fs.writeFileSync('src/ReviewSection.jsx', content);
console.log('✅ Warning fixed!');
