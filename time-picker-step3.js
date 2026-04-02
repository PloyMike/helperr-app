const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find step 2 section and replace it
const step2Match = content.match(/{step === 2 && \([\s\S]*?{step === 3 &&/);

if (step2Match) {
  const newStep2 = `{step === 2 && (
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
          )}
          {step === 3 &&`;
  
  content = content.replace(step2Match[0], newStep2);
  console.log('✅ Replaced step 2 with Apple-style time picker');
} else {
  console.log('❌ Could not find step 2 section');
}

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('Done!');
