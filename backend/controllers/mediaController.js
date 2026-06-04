const { supabase } = require('../config/supabase');
const path = require('path');

const mapId = (d) => ({ ...d, _id: d.id });

exports.getMediaItems = async (req, res) => {
  try {
    const { search, type, limit = 100 } = req.query;
    let query = supabase.from('media_items').select('*').order('created_at', { ascending: false }).limit(limit);
    
    if (search) query = query.ilike('title', `%${search}%`);
    if (type) query = query.eq('type', type);

    const { data, error } = await query;
    if (error) throw error;
    res.status(200).json({ success: true, count: data.length, data: data.map(mapId) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a file' });

    let type = 'document';
    if (req.file.mimetype.startsWith('image')) type = 'image';
    else if (req.file.mimetype.startsWith('video')) type = 'video';
    else if (req.file.mimetype.startsWith('audio')) type = 'audio';

    const { data, error } = await supabase
      .from('media_items')
      .insert([{
        title: req.file.originalname,
        type,
        url: `/uploads/${req.file.filename}`,
        file_path: req.file.path,
        size: req.file.size,
        mime_type: req.file.mimetype,
        uploaded_by: req.user.id
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const { error } = await supabase.from('media_items').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
