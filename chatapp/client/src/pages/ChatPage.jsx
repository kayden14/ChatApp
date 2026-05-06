import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const API = import.meta.env.VITE_API_URL;

export default function ChatPage() {
  const { user, profile, signOut } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await fetch(`${API}/rooms`);
    const data = await res.json();
    setRooms(data);
    if (data.length > 0) setActiveRoom(data[0]);
  };

  const createRoom = async (name, description) => {
    const res = await fetch(`${API}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, created_by: user.id }),
    });
    const newRoom = await res.json();
    if (!newRoom.error) {
      setRooms((prev) => [...prev, newRoom]);
      setActiveRoom(newRoom);
    }
    return newRoom;
  };

  return (
    <div className="chat-layout">
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onSelectRoom={setActiveRoom}
        onCreateRoom={createRoom}
        profile={profile}
        onSignOut={signOut}
      />
      <main className="chat-main">
        {activeRoom ? (
          <ChatWindow room={activeRoom} user={user} profile={profile} />
        ) : (
          <div className="chat-empty">
            <span>💬</span>
            <p>Select a room to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}