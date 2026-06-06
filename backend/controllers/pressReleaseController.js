const { supabase } = require('../config/supabase');

const mapId = (d) => ({ ...d, _id: d.id, author: d.author_id ? { name: d.author_name } : null });

exports.getPressReleases = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, category } = req.query;
    
    // We join users to get author name
    let query = supabase
      .from('press_releases')
      .select(`
        *,
        users ( name )
      `, { count: 'exact' });
    
    if (search) query = query.ilike('title', `%${search}%`);
    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    const formatted = data.map(d => ({
      ...d, _id: d.id, author: d.users ? { name: d.users.name } : null, createdAt: d.created_at
    }));

    res.status(200).json({ success: true, count: data.length, total: count, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPressRelease = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('press_releases')
      .select('*, users(name)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    
    await supabase.from('press_releases').update({ views: data.views + 1 }).eq('id', data.id);

    res.status(200).json({ success: true, data: { ...data, _id: data.id, author: data.users ? { name: data.users.name } : null } });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Press release not found' });
  }
};

exports.createPressRelease = async (req, res) => {
  try {
    const attachments = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const tags = req.body.tags && req.body.tags.trim() ? req.body.tags.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const { data, error } = await supabase
      .from('press_releases')
      .insert([{
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        category: req.body.category || 'General',
        status: req.body.status || 'draft',
        author_id: req.user.id,
        tags,
        attachments
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePressRelease = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.trim() ? updateData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
    }

    const { data, error } = await supabase
      .from('press_releases')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePressRelease = async (req, res) => {
  try {
    const { error } = await supabase.from('press_releases').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
