import { useEffect, useRef, useState } from 'react';
import supabase from '../supabase';
import Message from './Message';

const API = import.meta.env.VITE_API_URL;

export default function ChatWindow({ room, user, profile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!room) return;
    setMessages([]);
    fetchMessages();

    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` },
        async (payload) => {
          const { data } = await supabase
            .from('messages')
            .select('*, profiles(id, username, avatar_url)')
            .eq('id', payload.new.id)
            .single();
          if (data) setMessages((prev) => [...prev, data]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [room.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const res = await fetch(`${API}/messages/${room.id}`);
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);

    await fetch(`${API}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: room.id, user_id: user.id, content: input.trim() }),
    });

    setInput('');
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) sendMessage(e);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span className="chat-room-name"># {room.name}</span>
        {room.description && <span className="chat-room-desc">{room.description}</span>}
      </div>

      <div className="messages-area">
        {messages.length === 0 && (
          <div className="messages-empty">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        )}
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} isOwn={msg.user_id === user.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="message-form" onSubmit={sendMessage}>
        <textarea
          className="message-input"
          placeholder={`Message #${room.name}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button type="submit" className="send-btn" disabled={!input.trim() || sending}>
          ➤
        </button>
      </form>
    </div>
  );
}