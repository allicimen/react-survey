// src/components/ChatInterface.jsx
import React, { useEffect, useRef } from 'react';

const ChatInterface = ({ messages, inputText, setInputText, isTyping, handleAgentSend, surveyTitle }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>{surveyTitle}</h2>
        <div style={badgeStyle}>AI ANKET ASİSTANI</div>
      </div>

      <div style={chatAreaStyle}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ ...messageRowStyle, justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              ...bubbleStyle,
              backgroundColor: msg.sender === 'user' ? '#7c3aed' : '#ffffff',
              color: msg.sender === 'user' ? '#ffffff' : '#1f2937',
              borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '18px',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
              boxShadow: msg.sender === 'bot' ? '0 2px 4px rgba(0,0,0,0.05)' : '0 4px 12px rgba(124,58,237,0.2)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={typingStyle}>
            <span className="dot-animation">AI düşünüyor...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div style={inputAreaStyle}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAgentSend()}
          placeholder="Cevabınızı buraya yazın..."
          style={inputStyle}
          disabled={isTyping}
        />
        <button 
          onClick={handleAgentSend} 
          disabled={isTyping || !inputText.trim()}
          style={{ ...sendButtonStyle, opacity: (isTyping || !inputText.trim()) ? 0.6 : 1 }}
        >
          Gönder
        </button>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8fafc' };
const headerStyle = { padding: '20px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', textAlign: 'center' };
const titleStyle = { margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' };
const badgeStyle = { fontSize: '10px', color: '#7c3aed', fontWeight: '800', marginTop: '4px', letterSpacing: '1px' };
const chatAreaStyle = { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' };
const messageRowStyle = { display: 'flex', width: '100%' };
const bubbleStyle = { maxWidth: '80%', padding: '12px 18px', borderRadius: '18px', fontSize: '15px', lineHeight: '1.5', transition: 'all 0.2s' };
const typingStyle = { color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', paddingLeft: '10px' };
const inputAreaStyle = { padding: '20px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' };
const inputStyle = { flex: 1, padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px', transition: 'border 0.2s' };
const sendButtonStyle = { padding: '0 24px', backgroundColor: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.1s' };

export default ChatInterface;