import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function BotAvatar() {
  const [imgOk, setImgOk] = useState(true);
  return imgOk ? (
    <div className="avatar bot-avatar">
      <img src="/logo.png" alt="" onError={() => setImgOk(false)} />
    </div>
  ) : (
    <div className="bot-avatar-fallback">SU</div>
  );
}

function ChatMessage({ message }) {
  const { role, text, citations } = message;
  const isBot = role === 'bot';

  return (
    <div className={`message ${isBot ? 'bot' : 'user'}`}>
      {isBot && <BotAvatar />}

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
