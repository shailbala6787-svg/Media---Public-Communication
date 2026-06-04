const { supabase } = require('../config/supabase');

const mapId = (d) => ({ ...d, _id: d.id });

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = supabase.from('users').select('id, name, email, role, is_active, created_at', { count: 'exact' });
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    res.status(200).json({ success: true, count: data.length, total: count, data: data.map(mapId) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { name, email, password, role, isActive } = req.body;
    
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role: role || 'editor', is_active: isActive !== undefined ? isActive : true }])
      .select('id, name, email, role, is_active, created_at')
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const { data, error } = await supabase
      .from('users')
      .update({ name, email, role, is_active: isActive })
      .eq('id', req.params.id)
      .select('id, name, email, role, is_active, created_at')
      .single();

    if (error) throw error;
    res.status(200).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
