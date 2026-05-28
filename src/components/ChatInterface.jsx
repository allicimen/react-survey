import React, { useEffect, useRef } from 'react';
import { Bot, User, Send } from 'lucide-react';

const ChatInterface = ({ messages, inputText, setInputText, isTyping, handleAgentSend, surveyTitle }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-content">
          <div className="bot-avatar-large"><Bot size={22} /></div>
          <div>
            <h2>{surveyTitle}</h2>
            <span className="status-tag">AI Asistan Aktif</span>
          </div>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.sender}`}>
            {msg.sender === 'bot' && <div className="avatar"><Bot size={16} /></div>}
            <div className="bubble">
              {msg.text}
            </div>
            {msg.sender === 'user' && <div className="avatar user"><User size={16} /></div>}
          </div>
        ))}
        
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="avatar"><Bot size={16} /></div>
            <div className="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="chat-input-wrapper">
        <div className="input-box">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAgentSend()}
            placeholder="Cevabınızı buraya yazın..."
            disabled={isTyping}
          />
          <button 
            onClick={handleAgentSend} 
            disabled={isTyping || !inputText.trim()}
            className="send-btn"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f1f5f9;
          background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .chat-header {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-content { display: flex; align-items: center; gap: 1rem; max-width: 800px; width: 100%; }
        .bot-avatar-large { width: 45px; height: 45px; background: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
        .header-content h2 { margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--text-main); }
        .status-tag { font-size: 0.7rem; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em; }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .message-wrapper { display: flex; gap: 0.75rem; align-items: flex-end; max-width: 85%; }
        .message-wrapper.bot { align-self: flex-start; }
        .message-wrapper.user { align-self: flex-end; }

        .avatar { width: 32px; height: 32px; border-radius: 50%; background: white; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .avatar.user { background: #e0e7ff; }

        .bubble {
          padding: 0.85rem 1.25rem;
          border-radius: 18px;
          font-size: 0.95rem;
          line-height: 1.5;
          box-shadow: var(--shadow-sm);
        }

        .bot .bubble { background: white; color: var(--text-main); border-bottom-left-radius: 4px; border: 1px solid var(--border); }
        .user .bubble { background: var(--primary); color: white; border-bottom-right-radius: 4px; font-weight: 500; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }

        /* Typing Animation */
        .bubble.typing { display: flex; gap: 4px; padding: 1rem; }
        .bubble.typing span { width: 6px; height: 6px; background: #cbd5e1; border-radius: 50%; animation: typing 1s infinite; }
        .bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
        .bubble.typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        .chat-input-wrapper {
          padding: 1.5rem;
          display: flex;
          justify-content: center;
          background: linear-gradient(to top, #f1f5f9 60%, transparent);
        }

        .input-box {
          max-width: 800px;
          width: 100%;
          background: white;
          padding: 0.5rem;
          border-radius: 18px;
          display: flex;
          gap: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          border: 1px solid var(--border);
        }

        .input-box input { flex: 1; border: none; outline: none; padding: 0.75rem 1rem; font-size: 1rem; background: transparent; }
        .send-btn { width: 45px; height: 45px; border-radius: 14px; background: var(--primary); color: white; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
        .send-btn:hover:not(:disabled) { background: var(--primary-hover); transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 600px) {
          .message-wrapper { max-width: 95%; }
          .bubble { font-size: 0.9rem; }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;