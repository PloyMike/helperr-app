import re

# Read the file
with open('src/Helperr.jsx', 'r') as f:
    content = f.read()

# 1. Add import if not there
if 'import ProviderRegistration' not in content:
    content = content.replace(
        "import { supabase } from './supabase';",
        "import { supabase } from './supabase';\nimport ProviderRegistration from './ProviderRegistration';"
    )

# 2. Add state after first useState
if 'showRegistration' not in content:
    content = re.sub(
        r'(const Helperr = \(\) => \{[^}]*?useState[^;]+;)',
        r'\1\n  const [showRegistration, setShowRegistration] = useState(false);',
        content,
        count=1
    )

# 3. Make "+ Anbieter werden" button open modal
content = content.replace(
    'Anbieter werden</button>',
    'Anbieter werden</button>'.replace('</button>', '</button>').replace(
        'Anbieter werden</button>',
        'Anbieter werden</button>'.replace('<button', '<button onClick={() => setShowRegistration(true)}')
    )
)

# Simpler approach for button
content = re.sub(
    r'(<button[^>]*>.*?\+ Anbieter werden.*?</button>)',
    lambda m: m.group(0).replace('<button', '<button onClick={() => setShowRegistration(true)}') if 'onClick' not in m.group(0) else m.group(0),
    content
)

# 4. Add modal before closing div
if '<ProviderRegistration' not in content:
    content = content.replace(
        'export default Helperr;',
        '''      <ProviderRegistration 
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
    </div>
  );
}

export default Helperr;'''
    )

# Write back
with open('src/Helperr.jsx', 'w') as f:
    f.write(content)

print("✅ Helperr.jsx updated successfully!")
