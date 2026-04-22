import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function ProviderDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0
  });
  const [analytics, setAnalytics] = useState({
    viewsToday: 0,
    viewsThisWeek: 0,
    viewsThisMonth: 0,
    viewsTotal: 0,
    conversionRate: 0,
    topTimeSlots: []
  });
  const [recentBookings, setRecentBookings] = useState([]);

  const fetchDashboard = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData);

        // Fetch bookings
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('created_at', { ascending: false });

        const totalBookings = bookingsData?.length || 0;
        const pendingBookings = bookingsData?.filter(b => b.status === 'pending').length || 0;
        const confirmedBookings = bookingsData?.filter(b => b.status === 'confirmed').length || 0;

        setStats({
          totalBookings,
          pendingBookings,
          confirmedBookings,
          totalRevenue: 0
        });

        setRecentBookings(bookingsData?.slice(0, 5) || []);

        // Fetch Analytics
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total views
        const { data: allViews } = await supabase
          .from('profile_views')
          .select('created_at')
          .eq('profile_id', profileData.id);

        const viewsTotal = allViews?.length || 0;
        const viewsToday = allViews?.filter(v => new Date(v.created_at) >= today).length || 0;
        const viewsThisWeek = allViews?.filter(v => new Date(v.created_at) >= weekAgo).length || 0;
        const viewsThisMonth = allViews?.filter(v => new Date(v.created_at) >= monthAgo).length || 0;

        // Conversion rate
        const conversionRate = viewsTotal > 0 ? ((totalBookings / viewsTotal) * 100).toFixed(1) : 0;

        // Top time slots
        const timeSlotCounts = {};
        bookingsData?.forEach(booking => {
          const slot = booking.time_slot;
          timeSlotCounts[slot] = (timeSlotCounts[slot] || 0) + 1;
        });

        const topTimeSlots = Object.entries(timeSlotCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([slot, count]) => ({ slot, count }));

        setAnalytics({
          viewsToday,
          viewsThisWeek,
          viewsThisMonth,
          viewsTotal,
          conversionRate,
          topTimeSlots
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.emptyState}>
            <h2>No Profile Found</h2>
            <p>Please complete your profile first.</p>
            <button onClick={() => window.navigateTo('edit-profile')} style={styles.btnPrimary}>
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />
      
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.dashboardHeader}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Welcome back, {profile.name}!</p>
          </div>
          <button 
            onClick={() => window.navigateTo('edit-profile')} 
            style={{
              ...styles.editBtn,
              padding: window.innerWidth <= 768 ? '10px 12px' : '12px 24px',
              fontSize: window.innerWidth <= 768 ? 14 : 15
            }}
          >
            Edit Profile
          </button>
        </div>

        {/* Analytics Section */}
        <div style={styles.analyticsSection}>
          <h2 style={styles.sectionTitle}>Analytics</h2>
          <div style={styles.statsGrid}>
            <div style={{ ...styles.statCard, ...styles.statCardPink }}>
              
              <div>
                <div style={styles.statValue}>{analytics.viewsToday}</div>
                <div style={styles.statLabel}>Views Today</div>
              </div>
            </div>

            <div style={{ ...styles.statCard, ...styles.statCardOrange }}>
              
              <div>
                <div style={styles.statValue}>{analytics.viewsThisWeek}</div>
                <div style={styles.statLabel}>Views This Week</div>
              </div>
            </div>

            <div style={{ ...styles.statCard, ...styles.statCardTeal }}>
              
              <div>
                <div style={styles.statValue}>{analytics.viewsThisMonth}</div>
                <div style={styles.statLabel}>Views This Month</div>
              </div>
            </div>

            <div style={{ ...styles.statCard, ...styles.statCardIndigo }}>
              
              <div>
                <div style={styles.statValue}>{analytics.conversionRate}%</div>
                <div style={styles.statLabel}>Conversion Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
            
            <div>
              <div style={styles.statValue}>{stats.totalBookings}</div>
              <div style={styles.statLabel}>Total Bookings</div>
            </div>
          </div>

          <div style={{ ...styles.statCard, ...styles.statCardYellow }}>
            
            <div>
              <div style={styles.statValue}>{stats.pendingBookings}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
          </div>

          <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
            
            <div>
              <div style={styles.statValue}>{stats.confirmedBookings}</div>
              <div style={styles.statLabel}>Confirmed</div>
            </div>
          </div>

          <div style={{ ...styles.statCard, ...styles.statCardPurple }}>
            
            <div>
              <div style={styles.statValue}>{profile.rating || '5.0'}</div>
              <div style={styles.statLabel}>Rating</div>
            </div>
          </div>
        </div>

        {/* Top Time Slots */}
        {analytics.topTimeSlots.length > 0 && (
          <div style={styles.timeSlotCard}>
            <h3 style={styles.sectionTitle}>Most Popular Time Slots</h3>
            <div style={styles.timeSlotList}>
              {analytics.topTimeSlots.map((item, index) => (
                <div key={item.slot} style={styles.timeSlotItem}>
                  <div style={styles.timeSlotRank}>#{index + 1}</div>
                  <div style={styles.timeSlotInfo}>
                    <div style={styles.timeSlotTime}>{item.slot}</div>
                    <div style={styles.timeSlotCount}>{item.count} bookings</div>
                  </div>
                  <div style={styles.timeSlotBar}>
                    <div style={{
                      ...styles.timeSlotBarFill,
                      width: `${(item.count / analytics.topTimeSlots[0].count) * 100}%`
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Info Card */}
        <div style={styles.profileCard}>
          <h3 style={styles.sectionTitle}>Your Profile</h3>
          <div style={styles.profileGrid}>
            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>Category</span>
              <span style={styles.profileValue}>{profile.category}</span>
            </div>
            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>Subcategory</span>
              <span style={styles.profileValue}>{profile.subcategory}</span>
            </div>
            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>Location</span>
              <span style={styles.profileValue}>{profile.city}, {profile.country}</span>
            </div>
            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>Price</span>
              <span style={styles.profileValue}>{profile.price}</span>
            </div>
            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>Status</span>
              <span style={{
                ...styles.statusBadge,
                background: profile.available ? '#d1fae5' : '#fee2e2',
                color: profile.available ? '#065f46' : '#dc2626'
              }}>
                {profile.available ? '● Available' : '● Busy'}
              </span>
            </div>
            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>Reviews</span>
              <span style={styles.profileValue}>{profile.review_count || 0} reviews</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div style={styles.bookingsCard}>
            <h3 style={styles.sectionTitle}>Recent Bookings</h3>
            <div style={styles.bookingsList}>
              {recentBookings.map(booking => (
                <div key={booking.id} style={styles.bookingItem}>
                  <div style={styles.bookingInfo}>
                    <div style={styles.bookingName}>{booking.customer_name}</div>
                    <div style={styles.bookingDate}>
                      {new Date(booking.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      {' • '}
                      {booking.time_slot}
                    </div>
                  </div>
                  <div style={{
                    ...styles.bookingStatus,
                    background: booking.status === 'confirmed' ? '#d1fae5' : booking.status === 'pending' ? '#fef3c7' : '#fee2e2',
                    color: booking.status === 'confirmed' ? '#065f46' : booking.status === 'pending' ? '#92400e' : '#dc2626'
                  }}>
                    {booking.status === 'confirmed' ? '✓ Confirmed' : booking.status === 'pending' ? '⏳ Pending' : '✕ Cancelled'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { 
    fontFamily: '"Outfit", sans-serif', 
    background: '#f9fafb', 
    minHeight: '100vh', 
    paddingTop: 70 
  },
  loading: { 
    minHeight: '60vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: 18 
  },
  container: { 
    maxWidth: 1200, 
    margin: '0 auto', 
    padding: '40px 20px' 
  },
  dashboardHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 32 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 800, 
    margin: 0, 
    color: '#111827' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#6b7280', 
    margin: '8px 0 0' 
  },
  editBtn: { 
    padding: '12px 16px', 
    background: '#fff', 
    color: '#065f46', 
    border: '2px solid #065f46', 
    borderRadius: 12, 
    fontSize: 15, 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontFamily: '"Outfit", sans-serif',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(6, 95, 70, 0.15)'
  },
  analyticsSection: {
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
    color: '#111827'
  },
  statsGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: 20, 
    marginBottom: 32 
  },
  statCard: { 
    background: '#fff', 
    borderRadius: 16, 
    padding: 24, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 16,
    border: '2px solid',
    transition: 'all 0.2s',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
  },
  statCardGreen: { 
    borderColor: '#d1fae5', 
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' 
  },
  statCardYellow: { 
    borderColor: '#fef3c7', 
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' 
  },
  statCardBlue: { 
    borderColor: '#dbeafe', 
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' 
  },
  statCardPurple: { 
    borderColor: '#e9d5ff', 
    background: 'linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)' 
  },
  statCardPink: {
    borderColor: '#fce7f3',
    background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)'
  },
  statCardOrange: {
    borderColor: '#fed7aa',
    background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)'
  },
  statCardTeal: {
    borderColor: '#99f6e4',
    background: 'linear-gradient(135deg, #f0fdfa 0%, #99f6e4 100%)'
  },
  statCardIndigo: {
    borderColor: '#c7d2fe',
    background: 'linear-gradient(135deg, #eef2ff 0%, #c7d2fe 100%)'
  },
  statIcon: { 
    fontSize: 40 
  },
  statValue: { 
    fontSize: 32, 
    fontWeight: 800, 
    color: '#111827', 
    lineHeight: 1 
  },
  statLabel: { 
    fontSize: 14, 
    color: '#6b7280', 
    marginTop: 4, 
    fontWeight: 500 
  },
  timeSlotCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    marginBottom: 32,
    border: '1px solid #e5e7eb',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
  },
  timeSlotList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  timeSlotItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  timeSlotRank: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700,
    flexShrink: 0
  },
  timeSlotInfo: {
    minWidth: 150
  },
  timeSlotTime: {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827'
  },
  timeSlotCount: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2
  },
  timeSlotBar: {
    flex: 1,
    height: 8,
    background: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden'
  },
  timeSlotBarFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    borderRadius: 4,
    transition: 'width 0.3s ease'
  },
  profileCard: { 
    background: '#fff', 
    borderRadius: 16, 
    padding: 32, 
    marginBottom: 32, 
    border: '1px solid #e5e7eb',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
  },
  bookingsCard: { 
    background: '#fff', 
    borderRadius: 16, 
    padding: 32, 
    border: '1px solid #e5e7eb',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
  },
  profileGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: 20 
  },
  profileItem: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 6 
  },
  profileLabel: { 
    fontSize: 13, 
    color: '#6b7280', 
    fontWeight: 500 
  },
  profileValue: { 
    fontSize: 16, 
    color: '#111827', 
    fontWeight: 600 
  },
  statusBadge: { 
    display: 'inline-block', 
    padding: '6px 12px', 
    borderRadius: 20, 
    fontSize: 13, 
    fontWeight: 600, 
    width: 'fit-content' 
  },
  bookingsList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 12 
  },
  bookingItem: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    background: '#f9fafb', 
    borderRadius: 12, 
    border: '1px solid #e5e7eb' 
  },
  bookingInfo: { 
    flex: 1 
  },
  bookingName: { 
    fontSize: 15, 
    fontWeight: 600, 
    color: '#111827' 
  },
  bookingDate: { 
    fontSize: 13, 
    color: '#6b7280', 
    marginTop: 4 
  },
  bookingStatus: { 
    padding: '6px 12px', 
    borderRadius: 20, 
    fontSize: 12, 
    fontWeight: 600 
  },
  emptyState: { 
    textAlign: 'center', 
    padding: '80px 20px' 
  },
  btnPrimary: { 
    padding: '14px 24px', 
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 12, 
    fontSize: 16, 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontFamily: '"Outfit", sans-serif',
    marginTop: 16
  }
};

export default ProviderDashboard;
