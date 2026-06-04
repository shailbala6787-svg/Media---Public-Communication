const { supabase } = require('../config/supabase');

const mapId = (d) => ({ ...d, _id: d.id });

exports.getAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, priority } = req.query;
    
    let query = supabase.from('announcements').select('*', { count: 'exact' });
    
    if (search) query = query.ilike('title', `%${search}%`);
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);

    const { data, count, error } = await query
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;
    res.status(200).json({ success: true, count: data.length, total: count, data: data.map(mapId) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnnouncement = async (req, res) => {
  try {
    const { data, error } = await supabase.from('announcements').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { error } = await supabase.from('announcements').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
