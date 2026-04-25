import React, { useState } from 'react';
import { supabase } from './supabase';

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    bio: '',
    country: 'Thailand',
    city: '',
    category: '',
    subcategory: '',
    job: '',
    priceAmount: '',
    currency: 'EUR',
    priceType: 'hour',
    tags: '',
    languages: '',
    available: true
  });

  const subcategories = {
    'Massage & Wellness': ['Traditional Thai Massage', 'Oil Massage', 'Foot Massage', 'Aromatherapy', 'Deep Tissue', 'Sports Massage'],
    'Tours & Adventures': ['Island Tours', 'Snorkeling', 'Diving', 'Kayaking', 'Hiking', 'Food Tours', 'Cultural Tours'],
    'Yoga & Fitness': ['Vinyasa Yoga', 'Yin Yoga', 'Hatha Yoga', 'Personal Training', 'Pilates', 'Beach Yoga'],
    'Cooking Classes': ['Thai Cooking', 'Vegetarian Cooking', 'Street Food', 'Desserts', 'Market Tours'],
    'Beauty & Spa': ['Manicure/Pedicure', 'Hair Styling', 'Facials', 'Makeup', 'Waxing'],
    'Photography': ['Wedding', 'Portrait', 'Events', 'Product', 'Travel'],
    'Teaching & Tutoring': ['English', 'Thai Language', 'Music', 'Art', 'Math/Science'],
    'Home Services': ['Cleaning', 'Repairs', 'Gardening', 'Pet Care', 'Babysitting'],
    'Transportation': ['Airport Transfer', 'Car Rental', 'Motorbike Rental', 'Private Driver'],
    'Diving & Water Sports': ['PADI Courses', 'Snorkeling', 'Kayaking', 'Paddleboarding'],
    'Other': ['Custom Service']
  };

  const categories = Object.keys(subcategories);
  const citiesByCountry = {
    'Afghanistan': ['Kabul', 'Herat', 'Kandahar'],
    'Albania': ['Tirana', 'Durres', 'Vlore'],
    'Algeria': ['Algiers', 'Oran', 'Constantine'],
    'Andorra': ['Andorra la Vella', 'Escaldes-Engordany'],
    'Argentina': ['Bariloche', 'Buenos Aires', 'Cordoba', 'Mar del Plata', 'Mendoza', 'Rosario', 'Salta', 'San Miguel de Tucuman', 'Ushuaia'],
    'Armenia': ['Yerevan', 'Gyumri'],
    'Aruba': ['Oranjestad', 'San Nicolas'],
    'Australia': ['Adelaide', 'Alice Springs', 'Brisbane', 'Byron Bay', 'Cairns', 'Canberra', 'Darwin', 'Gold Coast', 'Hobart', 'Melbourne', 'Newcastle', 'Perth', 'Port Douglas', 'Sunshine Coast', 'Sydney', 'Townsville', 'Whitsundays', 'Wollongong'],
    'Austria': ['Graz', 'Innsbruck', 'Salzburg', 'Vienna'],
    'Azerbaijan': ['Baku', 'Ganja', 'Sumqayit'],
    'Bahamas': ['Nassau', 'Freeport', 'Paradise Island'],
    'Bahrain': ['Manama', 'Muharraq'],
    'Bangladesh': ['Chittagong', 'Dhaka'],
    'Barbados': ['Bridgetown', 'Holetown'],
    'Belgium': ['Antwerp', 'Bruges', 'Brussels', 'Ghent'],
    'Belize': ['Belize City', 'San Pedro', 'Caye Caulker'],
    'Bhutan': ['Thimphu', 'Paro', 'Punakha'],
    'Bolivia': ['Cochabamba', 'La Paz', 'Santa Cruz', 'Sucre'],
    'Bosnia and Herzegovina': ['Sarajevo', 'Mostar', 'Banja Luka'],
    'Botswana': ['Gaborone', 'Maun', 'Kasane'],
    'Brazil': ['Belo Horizonte', 'Brasilia', 'Campinas', 'Curitiba', 'Florianopolis', 'Fortaleza', 'Manaus', 'Porto Alegre', 'Recife', 'Rio de Janeiro', 'Salvador', 'Sao Paulo'],
    'Brunei': ['Bandar Seri Begawan', 'Kuala Belait'],
    'Bulgaria': ['Plovdiv', 'Sofia', 'Varna'],
    'Cambodia': ['Battambang', 'Kampot', 'Kep', 'Koh Rong', 'Phnom Penh', 'Siem Reap', 'Sihanoukville'],
    'Canada': ['Banff', 'Calgary', 'Charlottetown', 'Edmonton', 'Fredericton', 'Halifax', 'Kelowna', 'Kingston', 'Montreal', 'Niagara Falls', 'Ottawa', 'Quebec City', 'Regina', 'Saskatoon', 'St. Johns', 'Toronto', 'Vancouver', 'Victoria', 'Whistler', 'Winnipeg'],
    'Chile': ['Antofagasta', 'Concepcion', 'La Serena', 'Puerto Montt', 'Puerto Varas', 'Santiago', 'Temuco', 'Valparaiso', 'Vina del Mar'],
    'China': ['Beijing', 'Chengdu', 'Chongqing', 'Dalian', 'Guangzhou', 'Hangzhou', 'Harbin', 'Hong Kong', 'Nanjing', 'Qingdao', 'Shanghai', 'Shenzhen', 'Suzhou', 'Tianjin', 'Wuhan', 'Xi\'an', 'Xiamen', 'Zhengzhou'],
    'Colombia': ['Barranquilla', 'Bogota', 'Bucaramanga', 'Cali', 'Cartagena', 'Cucuta', 'Ibague', 'Medellin', 'Pereira', 'Santa Marta'],
    'Costa Rica': ['Manuel Antonio', 'Puerto Viejo', 'San Jose'],
    'Croatia': ['Dubrovnik', 'Split', 'Zagreb'],
    'Curacao': ['Willemstad', 'Westpunt'],
    'Cyprus': ['Limassol', 'Nicosia', 'Paphos'],
    'Czech Republic': ['Brno', 'Ostrava', 'Prague'],
    'Denmark': ['Aarhus', 'Copenhagen', 'Odense'],
    'Dominican Republic': ['Puerto Plata', 'Punta Cana', 'Santo Domingo'],
    'Ecuador': ['Cuenca', 'Galapagos', 'Guayaquil', 'Quito'],
    'Egypt': ['Alexandria', 'Aswan', 'Cairo', 'Giza', 'Hurghada', 'Luxor', 'Sharm el-Sheikh'],
    'El Salvador': ['San Salvador', 'Santa Ana'],
    'Estonia': ['Tallinn', 'Tartu'],
    'Ethiopia': ['Addis Ababa', 'Bahir Dar', 'Dire Dawa', 'Gondar', 'Mekele'],
    'Fiji': ['Nadi', 'Suva', 'Denarau'],
    'Finland': ['Helsinki', 'Tampere', 'Turku'],
    'France': ['Bordeaux', 'Cannes', 'Grenoble', 'Lille', 'Lyon', 'Marseille', 'Montpellier', 'Nantes', 'Nice', 'Paris', 'Reims', 'Rennes', 'Strasbourg', 'Toulon', 'Toulouse', 'Tours', 'Versailles', 'Villeurbanne'],
    'Georgia': ['Tbilisi', 'Batumi', 'Kutaisi'],
    'Germany': ['Augsburg', 'Berlin', 'Bonn', 'Bremen', 'Cologne', 'Dortmund', 'Dresden', 'Düsseldorf', 'Essen', 'Frankfurt', 'Hamburg', 'Hanover', 'Karlsruhe', 'Leipzig', 'Mannheim', 'Munich', 'Nuremberg', 'Stuttgart', 'Wiesbaden', 'Wuppertal'],
    'Ghana': ['Accra', 'Cape Coast', 'Kumasi', 'Tamale'],
    'Greece': ['Athens', 'Crete', 'Mykonos', 'Santorini', 'Thessaloniki'],
    'Guatemala': ['Antigua', 'Guatemala City', 'Lake Atitlan'],
    'Haiti': ['Port-au-Prince', 'Cap-Haitien'],
    'Honduras': ['Tegucigalpa', 'Roatan', 'San Pedro Sula'],
    'Hong Kong': ['Hong Kong'],
    'Hungary': ['Budapest', 'Debrecen'],
    'Iceland': ['Akureyri', 'Reykjavik'],
    'India': ['Agra', 'Ahmedabad', 'Amritsar', 'Bangalore', 'Chandigarh', 'Chennai', 'Cochin', 'Delhi', 'Goa', 'Hyderabad', 'Jaipur', 'Jodhpur', 'Kolkata', 'Lucknow', 'Mumbai', 'Mysore', 'Pune', 'Udaipur', 'Varanasi', 'Vizag'],
    'Indonesia': ['Bali', 'Bandung', 'Batam', 'Denpasar', 'Gili Islands', 'Jakarta', 'Labuan Bajo', 'Lombok', 'Makassar', 'Medan', 'Nusa Penida', 'Seminyak', 'Semarang', 'Surabaya', 'Ubud', 'Yogyakarta'],
    'Iran': ['Tehran', 'Isfahan', 'Shiraz', 'Mashhad'],
    'Iraq': ['Baghdad', 'Erbil', 'Basra'],
    'Ireland': ['Cork', 'Dublin', 'Galway'],
    'Italy': ['Bari', 'Bologna', 'Catania', 'Florence', 'Genoa', 'Milan', 'Naples', 'Padua', 'Palermo', 'Rome', 'Trieste', 'Turin', 'Venice', 'Verona', 'Vicenza'],
    'Jamaica': ['Kingston', 'Montego Bay', 'Negril'],
    'Japan': ['Fukuoka', 'Hiroshima', 'Kobe', 'Kyoto', 'Nagoya', 'Nara', 'Okinawa', 'Osaka', 'Sapporo', 'Sendai', 'Tokyo', 'Yokohama', 'Yokosuka', 'Kawasaki', 'Kanazawa'],
    'Jordan': ['Amman', 'Aqaba', 'Petra'],
    'Kazakhstan': ['Almaty', 'Astana', 'Shymkent'],
    'Kenya': ['Eldoret', 'Kisumu', 'Malindi', 'Mombasa', 'Nairobi', 'Nakuru'],
    'Kosovo': ['Pristina', 'Prizren'],
    'Kuwait': ['Hawally', 'Kuwait City'],
    'Kyrgyzstan': ['Bishkek', 'Osh', 'Karakol'],
    'Laos': ['Luang Prabang', 'Pakse', 'Savannakhet', 'Vang Vieng', 'Vientiane'],
    'Latvia': ['Jurmala', 'Riga'],
    'Lebanon': ['Beirut', 'Byblos'],
    'Liechtenstein': ['Vaduz', 'Schaan'],
    'Lithuania': ['Kaunus', 'Vilnius'],
    'Luxembourg': ['Luxembourg City'],
    'Macedonia': ['Skopje', 'Ohrid', 'Bitola'],
    'Madagascar': ['Antananarivo', 'Nosy Be', 'Andasibe'],
    'Malaysia': ['Johor Bahru', 'Kuala Lumpur', 'Langkawi', 'Malacca', 'Penang'],
    'Maldives': ['Male', 'Maafushi', 'Hulhumale'],
    'Malta': ['Sliema', 'St. Julians', 'Valletta'],
    'Mauritius': ['Port Louis', 'Grand Baie', 'Flic en Flac'],
    'Mexico': ['Acapulco', 'Cabo San Lucas', 'Cancun', 'Cozumel', 'Guadalajara', 'Guanajuato', 'Mazatlan', 'Merida', 'Mexico City', 'Monterrey', 'Oaxaca', 'Playa del Carmen', 'Puerto Vallarta', 'Tulum', 'Zihuatanejo'],
    'Moldova': ['Chisinau', 'Tiraspol'],
    'Mongolia': ['Ulaanbaatar', 'Erdenet'],
    'Montenegro': ['Podgorica', 'Kotor', 'Budva'],
    'Morocco': ['Agadir', 'Casablanca', 'Chefchaouen', 'Essaouira', 'Fes', 'Marrakech', 'Meknes', 'Rabat', 'Tangier'],
    'Myanmar': ['Bagan', 'Inle Lake', 'Mandalay', 'Naypyidaw', 'Ngapali Beach', 'Yangon'],
    'Namibia': ['Windhoek', 'Swakopmund', 'Walvis Bay'],
    'Nepal': ['Kathmandu', 'Pokhara'],
    'Netherlands': ['Almere', 'Amsterdam', 'Eindhoven', 'Groningen', 'Haarlem', 'Nijmegen', 'Rotterdam', 'The Hague', 'Tilburg', 'Utrecht'],
    'New Zealand': ['Auckland', 'Christchurch', 'Dunedin', 'Hamilton', 'Napier', 'Queenstown', 'Rotorua', 'Taupo', 'Tauranga', 'Wellington'],
    'Nicaragua': ['Managua', 'Granada', 'San Juan del Sur'],
    'Nigeria': ['Abuja', 'Benin City', 'Ibadan', 'Kaduna', 'Kano', 'Lagos', 'Port Harcourt'],
    'North Korea': ['Pyongyang', 'Kaesong'],
    'Norway': ['Bergen', 'Oslo', 'Stavanger', 'Trondheim'],
    'Oman': ['Muscat', 'Salalah'],
    'Pakistan': ['Islamabad', 'Karachi', 'Lahore'],
    'Panama': ['Bocas del Toro', 'Panama City'],
    'Papua New Guinea': ['Port Moresby', 'Lae'],
    'Paraguay': ['Asuncion', 'Ciudad del Este', 'Encarnacion'],
    'Peru': ['Arequipa', 'Cusco', 'Lima', 'Puno', 'Trujillo'],
    'Philippines': ['Bantayan Island', 'Bohol', 'Boracay', 'Camiguin', 'Cebu', 'Coron', 'Davao', 'El Nido', 'Iloilo', 'Manila', 'Palawan', 'Puerto Galera', 'Puerto Princesa', 'Siargao', 'Siquijor', 'Tagaytay', 'Vigan', 'Zambales'],
    'Poland': ['Bialystok', 'Bydgoszcz', 'Gdansk', 'Katowice', 'Krakow', 'Lodz', 'Lublin', 'Poznan', 'Rzeszow', 'Szczecin', 'Warsaw', 'Wroclaw'],
    'Portugal': ['Albufeira', 'Faro', 'Lisbon', 'Porto'],
    'Qatar': ['Al Wakrah', 'Doha'],
    'Romania': ['Brasov', 'Bucharest', 'Cluj-Napoca'],
    'Russia': ['Ekaterinburg', 'Irkutsk', 'Kazan', 'Krasnodar', 'Moscow', 'Nizhny Novgorod', 'Novosibirsk', 'Rostov-on-Don', 'Samara', 'Sochi', 'St. Petersburg', 'Ufa', 'Vladivostok', 'Volgograd', 'Yekaterinburg'],
    'Rwanda': ['Kigali', 'Butare'],
    'Samoa': ['Apia', 'Salelologa'],
    'Saudi Arabia': ['Jeddah', 'Mecca', 'Riyadh'],
    'Senegal': ['Dakar', 'Saint-Louis', 'Saly'],
    'Serbia': ['Belgrade', 'Novi Sad'],
    'Singapore': ['Singapore'],
    'Slovakia': ['Bratislava', 'Kosice', 'Presov'],
    'Slovenia': ['Ljubljana', 'Bled', 'Piran'],
    'South Africa': ['Bloemfontein', 'Cape Town', 'Durban', 'East London', 'Johannesburg', 'Kimberley', 'Knysna', 'Nelspruit', 'Port Elizabeth', 'Pretoria', 'Stellenbosch'],
    'South Korea': ['Busan', 'Daegu', 'Daejeon', 'Gwangju', 'Incheon', 'Jeju', 'Jeonju', 'Pohang', 'Seoul', 'Suwon'],
    'Spain': ['Alicante', 'Barcelona', 'Bilbao', 'Granada', 'Ibiza', 'Madrid', 'Malaga', 'Marbella', 'Murcia', 'Palma', 'Seville', 'Toledo', 'Valencia', 'Valladolid', 'Zaragoza'],
    'Sri Lanka': ['Colombo', 'Galle', 'Kandy'],
    'St. Lucia': ['Castries', 'Soufriere', 'Rodney Bay'],
    'Sweden': ['Gothenburg', 'Malmö', 'Stockholm'],
    'Switzerland': ['Basel', 'Bern', 'Geneva', 'Lucerne', 'Zurich'],
    'Syria': ['Damascus', 'Aleppo'],
    'Taiwan': ['Kaohsiung', 'Taichung', 'Taipei'],
    'Tajikistan': ['Dushanbe', 'Khujand'],
    'Tanzania': ['Arusha', 'Dar es Salaam', 'Dodoma', 'Mwanza', 'Zanzibar'],
    'Thailand': ['Ayutthaya', 'Bangkok', 'Chiang Mai', 'Chiang Rai', 'Hat Yai', 'Hua Hin', 'Kanchanaburi', 'Khao Lak', 'Koh Chang', 'Koh Lanta', 'Koh Phangan', 'Koh Phi Phi', 'Koh Samui', 'Koh Tao', 'Krabi', 'Nakhon Ratchasima', 'Pai', 'Pattaya', 'Phuket', 'Railay', 'Sukhothai', 'Ubon Ratchathani', 'Udon Thani'],
    'Timor-Leste': ['Dili', 'Baucau'],
    'Trinidad and Tobago': ['Port of Spain', 'San Fernando', 'Tobago'],
    'Tunisia': ['Tunis', 'Sousse', 'Hammamet'],
    'Turkey': ['Ankara', 'Antalya', 'Bodrum', 'Bursa', 'Cappadocia', 'Fethiye', 'Istanbul', 'Izmir', 'Kas', 'Kusadasi', 'Marmaris', 'Pamukkale', 'Side', 'Trabzon'],
    'Turkmenistan': ['Ashgabat', 'Turkmenabat'],
    'UAE': ['Abu Dhabi', 'Dubai', 'Sharjah'],
    'Uganda': ['Kampala', 'Entebbe', 'Jinja'],
    'Ukraine': ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv'],
    'United Kingdom': ['Bath', 'Belfast', 'Birmingham', 'Brighton', 'Bristol', 'Cambridge', 'Cardiff', 'Edinburgh', 'Glasgow', 'Leeds', 'Liverpool', 'London', 'Manchester', 'Newcastle', 'Nottingham', 'Oxford', 'Sheffield', 'York'],
    'Uruguay': ['Colonia del Sacramento', 'Montevideo', 'Punta del Este', 'Salto'],
    'USA': ['Albuquerque', 'Anchorage', 'Atlanta', 'Austin', 'Baltimore', 'Boise', 'Boston', 'Buffalo', 'Charleston', 'Charlotte', 'Chicago', 'Cincinnati', 'Cleveland', 'Columbus', 'Dallas', 'Denver', 'Detroit', 'Fort Lauderdale', 'Honolulu', 'Houston', 'Indianapolis', 'Jacksonville', 'Kansas City', 'Las Vegas', 'Los Angeles', 'Memphis', 'Miami', 'Milwaukee', 'Minneapolis', 'Nashville', 'New Orleans', 'New York', 'Oklahoma City', 'Orlando', 'Philadelphia', 'Phoenix', 'Pittsburgh', 'Portland', 'Raleigh', 'Richmond', 'Sacramento', 'Salt Lake City', 'San Antonio', 'San Diego', 'San Francisco', 'San Jose', 'Seattle', 'Tampa', 'Tucson', 'Washington DC'],
    'Uzbekistan': ['Tashkent', 'Samarkand', 'Bukhara'],
    'Vanuatu': ['Port Vila', 'Luganville'],
    'Venezuela': ['Barquisimeto', 'Caracas', 'Maracaibo', 'Maracay', 'Valencia'],
    'Vietnam': ['Can Tho', 'Da Lat', 'Da Nang', 'Haiphong', 'Halong Bay', 'Hanoi', 'Ho Chi Minh City', 'Hoi An', 'Hue', 'Mui Ne', 'Nha Trang', 'Phan Thiet', 'Phu Quoc', 'Quy Nhon', 'Sapa', 'Vung Tau'],
    'Yemen': ['Sanaa', 'Aden'],
    'Zambia': ['Lusaka', 'Livingstone', 'Ndola']
  };
  const countries = Object.keys(citiesByCountry);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if user is already logged in
      const { data: { user: existingUser } } = await supabase.auth.getUser();
      
      let userId;
      let isNewUser = false;
      
      if (existingUser) {
        // User is already logged in - just create provider profile
        userId = existingUser.id;
      } else {
        // New user - create auth account first
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;
        userId = authData.user.id;
        isNewUser = true;
      }

      // 2. Insert provider profile
      const { error: insertError } = await supabase.from('profiles').insert([{
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        country: formData.country,
        city: formData.city,
        category: formData.category,
        subcategory: formData.subcategory,
        job: formData.job,
        price_amount: formData.priceAmount,
        currency: formData.currency,
        price_type: formData.priceType,
        price: `${formData.priceAmount} ${formData.currency}/${formData.priceType}`,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        available: formData.available,
        verified: false,
        rating: 0,
        review_count: 0,
        total_bookings: 0,
        user_id: userId
      }]);

      if (insertError) throw insertError;

      if (isNewUser) {
        alert('✅ Registration successful! Please check your email to verify your account.');
      } else {
        alert('✅ Provider profile created successfully!');
      }
      if (isNewUser) {
        window.navigateTo('login');
      } else {
        window.navigateTo('dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: '40px 20px', fontFamily: '"Outfit", sans-serif' },
    card: { maxWidth: 800, margin: '0 auto', background: 'white', borderRadius: 20, padding: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    title: { fontSize: 32, fontWeight: 800, marginBottom: 12, color: '#1F2937', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 40, textAlign: 'center' },
    section: { marginBottom: 40 },
    sectionTitle: { fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1F2937' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
    label: { display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: '#374151' },
    input: { width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 15, fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box' },
    btn: { width: '100%', padding: 16, background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 18, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
    backBtn: { background: 'transparent', border: 'none', color: '#065f46', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }
  };

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={styles.card}>
        <button onClick={() => window.navigateTo('home')} style={styles.backBtn}>
          ← Back to Home
        </button>

        <h1 style={styles.title}>Become a Provider</h1>
        <p style={styles.subtitle}>Create your account and start offering services</p>

        <form onSubmit={handleSubmit}>
          {/* ACCOUNT */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Account</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Password *</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} />
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Basic Info</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Languages *</label>
                <input type="text" required value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} style={styles.input} placeholder="English, German, Thai" />
              </div>
              <div>
                <label style={styles.label}>Country *</label>
                <select required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value, city: '' })} style={styles.input}>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>City *</label>
                <select required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} style={styles.input}>
                  <option value="">-- Select City --</option>
                  {citiesByCountry[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>About You *</label>
                <textarea required value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} style={{ ...styles.input, minHeight: 100, resize: 'vertical' }} />
              </div>
            </div>
          </div>

          {/* SERVICE */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Service</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Category *</label>
                <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })} style={styles.input}>
                  <option value="">-- Select Category --</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Subcategory *</label>
                <select required value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} style={styles.input} disabled={!formData.category}>
                  <option value="">-- Select Subcategory --</option>
                  {formData.category && subcategories[formData.category]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Job Title *</label>
                <input type="text" required value={formData.job} onChange={(e) => setFormData({ ...formData, job: e.target.value })} style={styles.input} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Pricing *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '4fr 4fr 4fr', gap: 16 }}>
                  <input type="number" required value={formData.priceAmount} onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })} style={styles.input} placeholder="Amount (e.g. 50)" />
                                    <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} style={styles.input} required>
                    <option value="AED">AED (UAE Dirham)</option>
                    <option value="ARS">ARS (Argentine Peso)</option>
                    <option value="AUD">AUD $ (Australian Dollar)</option>
                    <option value="BRL">BRL (Brazilian Real)</option>
                    <option value="CAD">CAD $ (Canadian Dollar)</option>
                    <option value="CHF">CHF (Swiss Franc)</option>
                    <option value="CNY">CNY ¥ (Chinese Yuan)</option>
                    <option value="CZK">CZK (Czech Koruna)</option>
                    <option value="DKK">DKK (Danish Krone)</option>
                    <option value="EGP">EGP (Egyptian Pound)</option>
                    <option value="EUR">EUR € (Euro)</option>
                    <option value="GBP">GBP £ (British Pound)</option>
                    <option value="HKD">HKD $ (Hong Kong Dollar)</option>
                    <option value="HUF">HUF (Hungarian Forint)</option>
                    <option value="IDR">IDR (Indonesian Rupiah)</option>
                    <option value="ILS">ILS ₪ (Israeli Shekel)</option>
                    <option value="INR">INR ₹ (Indian Rupee)</option>
                    <option value="JPY">JPY ¥ (Japanese Yen)</option>
                    <option value="KRW">KRW ₩ (South Korean Won)</option>
                    <option value="MXN">MXN $ (Mexican Peso)</option>
                    <option value="MYR">MYR (Malaysian Ringgit)</option>
                    <option value="NOK">NOK (Norwegian Krone)</option>
                    <option value="NZD">NZD $ (New Zealand Dollar)</option>
                    <option value="PHP">PHP ₱ (Philippine Peso)</option>
                    <option value="PLN">PLN (Polish Zloty)</option>
                    <option value="RUB">RUB ₽ (Russian Ruble)</option>
                    <option value="SAR">SAR (Saudi Riyal)</option>
                    <option value="SEK">SEK (Swedish Krona)</option>
                    <option value="SGD">SGD $ (Singapore Dollar)</option>
                    <option value="THB">THB ฿ (Thai Baht)</option>
                    <option value="TRY">TRY ₺ (Turkish Lira)</option>
                    <option value="TWD">TWD $ (Taiwan Dollar)</option>
                    <option value="USD">USD $ (US Dollar)</option>
                    <option value="VND">VND ₫ (Vietnamese Dong)</option>
                    <option value="ZAR">ZAR (South African Rand)</option>
                  </select>
                  <select value={formData.priceType} onChange={(e) => setFormData({ ...formData, priceType: e.target.value })} style={styles.input} required>
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                  </select>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Skills/Tags (comma-separated)</label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} style={styles.input} placeholder="Thai Massage, Deep Tissue, Hot Stone" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Creating Account...' : 'Create Provider Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
