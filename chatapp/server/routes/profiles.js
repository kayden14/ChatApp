import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Profile not found' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { id, username } = req.body;
  if (!id || !username)
    return res.status(400).json({ error: 'id and username are required' });

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id, username })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/:id/presence', async (req, res) => {
  const { is_online } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .update({ is_online, last_seen: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;