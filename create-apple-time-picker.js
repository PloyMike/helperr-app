const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Add startTime and endTime states
content = content.replace(
  /const \[selectedTimeSlot, setSelectedTimeSlot\] = useState\(''\);/,
  `const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [startHour, setStartHour] = useState('10');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('11');
  const [endMinute, setEndMinute] = useState('00');`
);

// Add helper functions for time picker
content = content.replace(
  /const getMonthName = \(\) => \{[\s\S]*?\};/,
  `const getMonthName = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const getTimeString = () => {
    return \`\${startHour}:\${startMinute} - \${endHour}:\${endMinute}\`;
  };

  const isValidTimeRange = () => {
    const start = parseInt(startHour) * 60 + parseInt(startMinute);
    const end = parseInt(endHour) * 60 + parseInt(endMinute);
    return end > start;
  };`
);

// Replace Step 2 with Apple-style picker
content = content.replace(
  /\{step === 2 && \([\s\S]*?<\/div>\s+\)\}/m,
  `{step === 2 && (
            <div>
              <h3 style={styles.stepTitle}>Select Time</h3>
              <p style={styles.selectedInfo}>📅 {formatDateFull(new Date(selectedDate))}</p>
              
              <div style={styles.timePickerContainer}>
                <div style={styles.timePickerSection}>
                  <div style={styles.timePickerLabel}>Start Time</div>
                  <div style={styles.pickerRow}>
                    <select 
                      value={startHour} 
                      onChange={(e) => setStartHour(e.target.value)}
                      style={styles.timePicker}
                    >
                      {hours.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <span style={styles.pickerColon}>:</span>
                    <select 
                      value={startMinute} 
                      onChange={(e) => setStartMinute(e.target.value)}
                      style={styles.timePicker}
                    >
                      {minutes.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.timePickerArrow}>→</div>

                <div style={styles.timePickerSection}>
                  <div style={styles.timePickerLabel}>End Time</div>
                  <div style={styles.pickerRow}>
                    <select 
                      value={endHour} 
                      onChange={(e) => setEndHour(e.target.value)}
                      style={styles.timePicker}
                    >
                      {hours.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <span style={styles.pickerColon}>:</span>
                    <select 
                      value={endMinute} 
                      onChange={(e) => setEndMinute(e.target.value)}
                      style={styles.timePicker}
                    >
                      {minutes.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {!isValidTimeRange() && (
                <div style={styles.errorBox}>
                  ⚠️ End time must be after start time
                </div>
              )}

              <div style={styles.timePreview}>
                <div style={styles.timePreviewLabel}>Selected Time:</div>
                <div style={styles.timePreviewValue}>{getTimeString()}</div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={styles.btnBack}>
                  ← Back
                </button>
                <button 
                  onClick={() => {
                    setSelectedTimeSlot(getTimeString());
                    setStep(3);
                  }} 
                  disabled={!isValidTimeRange()} 
                  style={{
                    ...styles.btnNext, 
                    opacity: !isValidTimeRange() ? 0.5 : 1, 
                    cursor: !isValidTimeRange() ? 'not-allowed' : 'pointer'
                  }}
                >
                  Continue to Confirm →
                </button>
              </div>
            </div>
          )}`
);

// Add new styles for time picker
content = content.replace(
  /timeGrid: \{[^}]*\},/,
  `timePickerContainer: { background: '#f9fafb', padding: 24, borderRadius: 16, marginBottom: 20, border: '2px solid #e5e7eb' },
  timePickerSection: { flex: 1 },
  timePickerLabel: { fontSize: 14, fontWeight: 700, color: '#065f46', marginBottom: 12, textAlign: 'center' },
  pickerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  timePicker: { 
    fontSize: 32, 
    fontWeight: 700, 
    padding: '12px 16px', 
    border: '2px solid #065f46', 
    borderRadius: 12, 
    background: 'white', 
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    color: '#065f46',
    textAlign: 'center',
    minWidth: 80
  },
  pickerColon: { fontSize: 32, fontWeight: 700, color: '#065f46' },
  timePickerArrow: { fontSize: 24, color: '#6b7280', display: 'flex', alignItems: 'center', padding: '0 16px' },
  errorBox: { background: '#fee2e2', color: '#dc2626', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 600, marginBottom: 16, textAlign: 'center' },
  timePreview: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 20, borderRadius: 12, marginBottom: 20, textAlign: 'center' },
  timePreviewLabel: { fontSize: 12, color: '#d1fae5', fontWeight: 600, marginBottom: 8 },
  timePreviewValue: { fontSize: 24, color: 'white', fontWeight: 800 },`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Apple-style time picker created!');
