import { useState } from 'react';

const SUGGESTIONS = [
  'How much does a parking permit cost at SU?',
  'How do I print using the SU print queue?',
  'How do I ship a package through SU Mailing Services?',
  'How do I get my SU Campus ID card?',
  'How do I get an Orca transit pass as an SU student?',
  'What is the emergency number for SU Public Safety?',
];

function WelcomeLogo() {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="welcome-logo-wrap">
      {imgOk ? (
        <img src="/logo.png" alt="Seattle University" onError={() => setImgOk(false)} />
      ) : (
        <span className="welcome-logo-text">SU</span>
      )}
    </div>
  );
}

function SuggestedQuestions({ onSelect }) {
  return (
    <div className="welcome-screen">
      <WelcomeLogo />

      <h2 className="welcome-title">Seattle University Campus Assistant</h2>
      <p className="welcome-sub">
        Get instant answers about campus services — parking, printing, mailing, ID cards, transit, and more.
      </p>

      <p className="suggestions-label">Try asking</p>

      <div className="suggestions-grid">
        {SUGGESTIONS.map((text) => (
          <button key={text} className="suggestion-btn" onClick={() => onSelect(text)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedQuestions;
