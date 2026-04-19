const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find customerName state and add address state after it
const oldCustomerName = /const \[customerName, setCustomerName\] = useState\(''\);/;
const newStates = `const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    notes: ''
  });`;

content = content.replace(oldCustomerName, newStates);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Step 1: Address state added!');
