const { supabase } = require('../config/supabase');

const mapId = (d) => ({ ...d, _id: d.id, description: d.content, noticeNumber: d.notice_number, isPublic: d.is_public });

exports.getPublicNotices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, priority } = req.query;
    
    let query = supabase.from('public_notices').select('*', { count: 'exact' });
    
    if (search) query = query.ilike('title', `%${search}%`);
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;
    res.status(200).json({ success: true, count: data.length, total: count, data: data.map(mapId) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicNotice = async (req, res) => {
  try {
    const { data, error } = await supabase.from('public_notices').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.status(200).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPublicNotice = async (req, res) => {
  try {
    const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const insertData = { ...req.body };
    if (insertData.description !== undefined) { insertData.content = insertData.description; delete insertData.description; }
    if (insertData.noticeNumber !== undefined) { insertData.notice_number = insertData.noticeNumber; delete insertData.noticeNumber; }
    if (insertData.isPublic !== undefined) { insertData.is_public = insertData.isPublic === 'true' || insertData.isPublic === true; delete insertData.isPublic; }
    if (attachmentUrl) insertData.attachment_url = attachmentUrl;

    const { data, error } = await supabase
      .from('public_notices')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePublicNotice = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.description !== undefined) { updateData.content = updateData.description; delete updateData.description; }
    if (updateData.noticeNumber !== undefined) { updateData.notice_number = updateData.noticeNumber; delete updateData.noticeNumber; }
    if (updateData.isPublic !== undefined) { updateData.is_public = updateData.isPublic === 'true' || updateData.isPublic === true; delete updateData.isPublic; }

    const { data, error } = await supabase
      .from('public_notices')
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

exports.deletePublicNotice = async (req, res) => {
  try {
    const { error } = await supabase.from('public_notices').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
