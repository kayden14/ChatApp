import { useState } from 'react';

export default function Sidebar({ rooms, activeRoom, onSelectRoom, onCreateRoom, profile, onSignOut }) {
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setCreating(true);
    await onCreateRoom(roomName.trim(), roomDesc.trim());
    setRoomName('');
    setRoomDesc('');
    setShowForm(false);
    setCreating(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>💬 ChatApp</h2>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span>Rooms</span>
          <button className="icon-btn" onClick={() => setShowForm(!showForm)}>+</button>
        </div>

        {showForm && (
          <form className="create-room-form" onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={roomDesc}
              onChange={(e) => setRoomDesc(e.target.value)}
            />
            <button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        )}

        <ul className="room-list">
          {rooms.map((room) => (
            <li
              key={room.id}
              className={`room-item ${activeRoom?.id === room.id ? 'active' : ''}`}
              onClick={() => onSelectRoom(room)}
            >
              <span className="room-hash">#</span>
              <span className="room-name">{room.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {profile?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="user-details">
            <span className="user-name">{profile?.username || 'User'}</span>
            <span className="user-status">● Online</span>
          </div>
        </div>
        <button className="signout-btn" onClick={onSignOut} title="Sign out">↪</button>
      </div>
    </aside>
  );
}