const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find and replace the entire progress bar section
const oldProgress = /<div style=\{styles\.progress\}>\s*<div style=\{\{\.\.\.styles\.progressStep,[\s\S]*?<\/div>\s*<\/div>/;

const newProgress = `<div style={styles.progress}>
          <div style={{...styles.progressStep, ...(step >= 1 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>1</div>
            <span style={styles.progressLabel}>Date</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={{...styles.progressStep, ...(step >= 2 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>2</div>
            <span style={styles.progressLabel}>Time</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={{...styles.progressStep, ...(step >= 3 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>3</div>
            <span style={styles.progressLabel}>Address</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={{...styles.progressStep, ...(step >= 4 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>4</div>
            <span style={styles.progressLabel}>Confirm</span>
          </div>
        </div>`;

content = content.replace(oldProgress, newProgress);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Step 2: Progress bar updated to 4 steps!');
