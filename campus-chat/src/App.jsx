import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://jo99t24vj9.execute-api.us-west-2.amazonaws.com/chat';

/* Checks if logo.png exists in /public — falls back to text */
function HeaderLogo({ onClick }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <button className="header-logo-btn" onClick={onClick} aria-label="Go to home">
      {imgOk ? (
        <img
          src="/logo.png"
          alt="Seattle University"
          onError={() => setImgOk(false)}
        />
      ) : (
        <span style={{
          fontSize: '0.82rem', fontWeight: 800, color: '#fff',
          fontFamily: "'Georgia', serif", letterSpacing: '0.04em',
          border: '2px solid rgba(255,255,255,.6)', borderRadius: 6,
          padding: '3px 7px'
        }}>SU</span>
      )}
    </button>
  );
}

function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0 || isLoading) scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (question) => {
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data.sessionId) setSessionId(data.sessionId);

      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: data.answer, citations: data.citations || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.', citations: [] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => {
    setMessages([]);
    setSessionId(null);
    setIsLoading(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <HeaderLogo onClick={goHome} />
          <div className="header-text">
            <h1>Campus Services Assistant</h1>
            <p>Seattle University</p>
          </div>
        </div>
        <div className="header-status">
          <span className="status-dot" />
          Online
        </div>
      </header>

      <main className="chat-container">
        {messages.length === 0 && !isLoading && (
          <SuggestedQuestions onSelect={sendMessage} />
        )}

        <div className="messages-list">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {isLoading && (
            <div className="message bot">
              <BotAvatar />
              <div className="typing-bubble">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="input-footer">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </footer>
    </div>
  );
}

/* Small avatar used next to bot messages */
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

export { BotAvatar };
export default App;
