import ReactMarkdown from 'react-markdown';

function ChatMessage({ message }) {
  const { role, text, citations } = message;
  const isBot = role === 'bot';

  return (
    <div className={`message ${isBot ? 'bot' : 'user'}`}>
      {isBot && <div className="avatar">SU</div>}
      <div className="bubble-wrapper">
        <div className="bubble">
          {isBot ? (
            <div className="markdown-body">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          ) : (
            text
          )}
        </div>
        {isBot && citations && citations.length > 0 && (
          <div className="citations">
            <span className="citations-label">Sources:</span>
            {citations.map((c, i) => (
              <span key={i} className="citation-tag" title={c.chunk}>
                {c.source}
              </span>
            ))}
          </div>
        )}
      </div>
      {!isBot && <div className="avatar user-avatar">You</div>}
    </div>
  );
}

export default ChatMessage;
