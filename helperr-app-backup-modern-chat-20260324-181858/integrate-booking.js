const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Import BookingCalendar hinzufügen
content = content.replace(
  /import ReviewsSection from '\.\/ReviewsSection';/,
  "import ReviewsSection from './ReviewsSection';\nimport BookingCalendar from './BookingCalendar';"
);

// showBooking state hinzufügen
content = content.replace(
  /const \[selected, setSelected\] = useState\(null\);/,
  "const [selected, setSelected] = useState(null);\n  const [showBooking, setShowBooking] = useState(false);"
);

// Book Now Button nach Contact Info hinzufügen
content = content.replace(
  /{selected\.line_id && <p style=\{\{ margin: '8px 0 0', fontSize: 14 \}\}>💬 LINE: \{selected\.line_id\}<\/p>\}/,
  `{selected.line_id && <p style={{ margin: '8px 0 0', fontSize: 14 }}>💬 LINE: {selected.line_id}</p>}
              </div>

              {/* BOOK NOW BUTTON */}
              <button 
                onClick={() => setShowBooking(true)} 
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: '"Outfit", sans-serif',
                  marginTop: 20,
                  boxShadow: '0 4px 12px rgba(6,95,70,0.3)'
                }}
              >
                📅 Book Now
              </button>
              
              <div style={{ marginTop: 20, padding: 16, background: '#f9fafb', borderRadius: 12 }}>
                <p style={{ margin: 0, fontSize: 14 }}>📞 {selected.phone}</p>
                {selected.line_id && <p style={{ margin: '8px 0 0', fontSize: 14 }}>💬 LINE: {selected.line_id}</p>}`
);

// BookingCalendar Component am Ende vor </div> hinzufügen
content = content.replace(
  /{\/\* REVIEWS SECTION \*\/}\s*<ReviewsSection profileId=\{selected\.id\} onReviewAdded=\{\(\) => fetchProfiles\(\)\} \/>/,
  `{/* REVIEWS SECTION */}
              <ReviewsSection profileId={selected.id} onReviewAdded={() => fetchProfiles()} />
            </div>
          </div>
        </div>
      )}

      {/* BOOKING CALENDAR */}
      {showBooking && selected && (
        <BookingCalendar 
          profile={selected} 
          onClose={() => setShowBooking(false)} 
        />
      )}
    </div>
  );
}`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Booking Calendar integrated!');
