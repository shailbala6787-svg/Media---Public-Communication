const { supabase } = require('../config/supabase');

const mapId = (d) => ({ ...d, _id: d.id, body: d.content, targetAudience: d.target_audience, expiresAt: d.expires_at, scheduledAt: d.scheduled_at });

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
    const insertData = { ...req.body };
    if (insertData.body !== undefined) { insertData.content = insertData.body; delete insertData.body; }
    if (insertData.targetAudience !== undefined) { insertData.target_audience = insertData.targetAudience; delete insertData.targetAudience; }
    if (insertData.expiresAt !== undefined) { insertData.expires_at = insertData.expiresAt || null; delete insertData.expiresAt; }
    if (insertData.scheduledAt !== undefined) { insertData.scheduled_at = insertData.scheduledAt || null; delete insertData.scheduledAt; }

    const { data, error } = await supabase
      .from('announcements')
      .insert([insertData])
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
    const updateData = { ...req.body };
    if (updateData.body !== undefined) { updateData.content = updateData.body; delete updateData.body; }
    if (updateData.targetAudience !== undefined) { updateData.target_audience = updateData.targetAudience; delete updateData.targetAudience; }
    if (updateData.expiresAt !== undefined) { updateData.expires_at = updateData.expiresAt || null; delete updateData.expiresAt; }
    if (updateData.scheduledAt !== undefined) { updateData.scheduled_at = updateData.scheduledAt || null; delete updateData.scheduledAt; }

    const { data, error } = await supabase
      .from('announcements')
      .update(updateData)
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
