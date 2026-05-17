const SUGGESTIONS = [
  { icon: '🚗', text: 'How much does a parking permit cost at SU?' },
  { icon: '🖨️', text: 'How do I print using the SU print queue?' },
  { icon: '📦', text: 'How do I ship a package through SU Mailing Services?' },
  { icon: '🪪', text: 'How do I get my SU Campus ID card?' },
  { icon: '🚌', text: 'How do I get an Orca transit pass as an SU student?' },
  { icon: '⚠️', text: 'What is the emergency number for SU Public Safety?' },
];

function SuggestedQuestions({ onSelect }) {
  return (
    <div className="suggested-questions">
      <div className="su-welcome">
        <div className="su-logo-mark">SU</div>
        <h2>Seattle University Campus Assistant</h2>
        <p>Ask me anything about SU campus services — parking, printing, mailing, ID cards, and more.</p>
      </div>
      <p className="suggestions-heading">Try asking...</p>
      <div className="suggestions-grid">
        {SUGGESTIONS.map(({ icon, text }) => (
          <button key={text} className="suggestion-btn" onClick={() => onSelect(text)}>
            <span className="suggestion-icon">{icon}</span>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedQuestions;
