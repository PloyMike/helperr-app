import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

export function useBadges() {
  const { user } = useAuth();
  const [messagesBadge, setMessagesBadge] = useState(0);
  const [myBookingsBadge, setMyBookingsBadge] = useState(0);
  const [providerBookingsBadge, setProviderBookingsBadge] = useState(0);

  const fetchCounts = async () => {
    if (!user) {
      setMessagesBadge(0);
      setMyBookingsBadge(0);
      setProviderBookingsBadge(0);
      return;
    }

    try {
      // My bookings (as customer) — pending
      const { count: myCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('customer_email', user.email)
        .eq('status', 'pending');
      setMyBookingsBadge(myCount || 0);

      // Provider bookings — pending
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, job')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (profile && profile.job) {
        const { count: providerCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', profile.id)
          .eq('status', 'pending');
        setProviderBookingsBadge(providerCount || 0);
      } else {
        setProviderBookingsBadge(0);
      }

      // Unread messages
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_email', user.email)
        .or('read.is.null,read.eq.false');
      setMessagesBadge(unreadCount || 0);
    } catch (error) {
      console.error('Badge fetch error:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Realtime updates
  useEffect(() => {
    if (!user) return;

    const messagesChannel = supabase
      .channel('bottomnav-messages-' + user.id)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `receiver_email=eq.${user.email}`
      }, () => fetchCounts())
      .subscribe();

    const bookingsChannel = supabase
      .channel('bottomnav-bookings-' + user.id)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, () => fetchCounts())
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(bookingsChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { messagesBadge, myBookingsBadge, providerBookingsBadge };
}
