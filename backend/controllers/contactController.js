const { supabase } = require('../config/supabase');

const mapId = (d) => ({ ...d, _id: d.id });

exports.getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    let query = supabase.from('contacts').select('*', { count: 'exact' });
    
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
    if (status) query = query.eq('status', status);

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;
    res.status(200).json({ success: true, count: data.length, total: count, data: data.map(mapId) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getContact = async (req, res) => {
  try {
    const { data, error } = await supabase.from('contacts').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Contact not found' });
    
    if (data.status === 'new') {
      await supabase.from('contacts').update({ status: 'read' }).eq('id', data.id);
      data.status = 'read';
    }

    res.status(200).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.replyContact = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ success: false, message: 'Please provide a reply' });

    const { data, error } = await supabase
      .from('contacts')
      .update({
        reply,
        status: 'replied',
        replied_at: new Date(),
        replied_by: req.user.id
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, subject, message }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: mapId(data) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
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

exports.deleteContact = async (req, res) => {
  try {
    const { error } = await supabase.from('contacts').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
