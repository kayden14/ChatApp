export default function Message({ message, isOwn }) {
  const { profiles: sender, content, created_at } = message;

  const time = new Date(created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
      {!isOwn && (
        <div className="message-avatar">
          {sender?.username?.[0]?.toUpperCase() || '?'}
        </div>
      )}
      <div className="message-body">
        {!isOwn && <span className="message-username">{sender?.username}</span>}
        <div className="message-bubble">
          <p>{content}</p>
          <span className="message-time">{time}</span>
        </div>
      </div>
    </div>
  );
}