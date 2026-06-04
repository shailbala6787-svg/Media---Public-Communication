const { supabase } = require('../config/supabase');

exports.getDashboardStats = async (req, res) => {
  try {
    const totals = {};
    const getCount = async (table) => {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      return count || 0;
    };

    totals.pressReleases = await getCount('press_releases');
    totals.publicNotices = await getCount('public_notices');
    totals.mediaItems = await getCount('media_items');
    totals.announcements = await getCount('announcements');
    totals.contacts = await getCount('contacts');
    totals.users = await getCount('users');

    const highlights = {
      newContacts: 0,
      activeAnnouncements: 0,
      publishedPR: 0,
      activeNotices: 0
    };

    // Calculate highlights
    let resH = await supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'new');
    highlights.newContacts = resH.count || 0;

    resH = await supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('status', 'active');
    highlights.activeAnnouncements = resH.count || 0;

    resH = await supabase.from('press_releases').select('*', { count: 'exact', head: true }).eq('status', 'published');
    highlights.publishedPR = resH.count || 0;

    resH = await supabase.from('public_notices').select('*', { count: 'exact', head: true }).eq('status', 'active');
    highlights.activeNotices = resH.count || 0;

    const charts = { monthlyPR: [], contactStats: [], mediaTypes: [] };
    
    // For charts we'll do simple group by in JS since PostgREST RPC is needed for advanced aggregation, 
    // or we fetch all and aggregate here. For simplicity we'll fetch recently created
    const { data: allPR } = await supabase.from('press_releases').select('created_at');
    if (allPR) {
      const monthly = Array(12).fill(0);
      allPR.forEach(pr => {
        const month = new Date(pr.created_at).getMonth();
        monthly[month]++;
      });
      charts.monthlyPR = monthly.map((count, i) => ({ _id: { month: i + 1 }, count })).filter(c => c.count > 0);
    }

    const { data: allContacts } = await supabase.from('contacts').select('status');
    if (allContacts) {
      const counts = {};
      allContacts.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
      charts.contactStats = Object.keys(counts).map(status => ({ _id: status, count: counts[status] }));
    }

    const { data: recentPRs } = await supabase.from('press_releases').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5);
    const { data: recentContacts } = await supabase.from('contacts').select('id, name, subject, status, created_at').order('created_at', { ascending: false }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        totals,
        highlights,
        charts,
        recent: {
          pressReleases: (recentPRs || []).map(d => ({ ...d, _id: d.id, createdAt: d.created_at })),
          contacts: (recentContacts || []).map(d => ({ ...d, _id: d.id, createdAt: d.created_at }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
