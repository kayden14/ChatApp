import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;

  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles(id, username, avatar_url)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { room_id, user_id, content } = req.body;
  if (!room_id || !user_id || !content)
    return res.status(400).json({ error: 'room_id, user_id and content are required' });

  const { data, error } = await supabase
    .from('messages')
    .insert({ room_id, user_id, content })
    .select('*, profiles(id, username, avatar_url)')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

export default router;