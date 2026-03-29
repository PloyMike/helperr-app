const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Add scroll state
content = content.replace(
  /const \[submittingReview, setSubmittingReview\] = useState\(false\);/,
  `const [submittingReview, setSubmittingReview] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);`
);

// Add scroll listener
content = content.replace(
  /useEffect\(\(\) => \{[\s\S]*?checkProfile\(\);/,
  `useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('email', user.email)
          .single();
        
        setUserProfile(data);
        if (data?.name) {
          setReviewForm(prev => ({ ...prev, author_name: data.name }));
        }
      }
    };
    checkProfile();`
);

// Update Header prop
content = content.replace(
  /<Header transparent=\{true\} \/>/g,
  '<Header transparent={true} isScrolled={isScrolled} />'
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ Scroll effect added to My Bookings!');
