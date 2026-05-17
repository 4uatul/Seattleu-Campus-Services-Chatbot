import { useState, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://YOUR_API_URL/chat';

function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (question) => {
    const userMsg = { role: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.sessionId) setSessionId(data.sessionId);

      const botMsg = {
        role: 'bot',
        text: data.answer,
        citations: data.citations || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.', citations: [] },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="header-su">SU</span>
          <div>
            <h1>Campus Services Assistant</h1>
            <p>Seattle University · Ask about parking, printing, mailing &amp; more</p>
          </div>
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
              <div className="bubble typing-indicator">
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

export default App;
