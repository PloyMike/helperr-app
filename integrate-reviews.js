const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Import ReviewsSection hinzufügen
content = content.replace(
  /import Header from '\.\/Header';/,
  "import Header from './Header';\nimport ReviewsSection from './ReviewsSection';"
);

// ReviewsSection im Modal hinzufügen - nach den Skills
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*\)\s*\}\)/,
  `</div>
              </div>
              
              {/* REVIEWS SECTION */}
              <div style={{ marginTop: 24, borderTop: '1px solid #f3f4f6', paddingTop: 24 }}>
                <ReviewsSection profileId={selected.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Reviews integrated into profile modal!');
