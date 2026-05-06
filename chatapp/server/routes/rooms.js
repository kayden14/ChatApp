import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { name, description, created_by } = req.body;
  if (!name) return res.status(400).json({ error: 'Room name is required' });

  const { data, error } = await supabase
    .from('rooms')
    .insert({ name: name.toLowerCase().replace(/\s+/g, '-'), description, created_by })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

export default router;