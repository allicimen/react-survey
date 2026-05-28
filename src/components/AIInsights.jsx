import React from 'react';
import { Sparkles, Lightbulb, Zap, Target, RefreshCw } from 'lucide-react';

const AIInsights = ({ data, onRetry }) => {
  if (!data) return null;

  return (
    <div className="ai-insights-box card">
      <div className="insights-header">
        <div className="ai-badge"><Sparkles size={14} /> AI SMART INSIGHTS</div>
        {data.sentiment && typeof data.sentiment === 'object' ? (
          <div className="sentiment-bar-wrapper">
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Genel Duygu:</span>
            <div className="sentiment-bar">
              <div className="bar-segment pos" style={{ width: `${data.sentiment.positive || 0}%` }} title={`Olumlu: %${data.sentiment.positive || 0}`}></div>
              <div className="bar-segment neu" style={{ width: `${data.sentiment.neutral || 0}%` }} title={`Nötr: %${data.sentiment.neutral || 0}`}></div>
              <div className="bar-segment neg" style={{ width: `${data.sentiment.negative || 0}%` }} title={`Olumsuz: %${data.sentiment.negative || 0}`}></div>
            </div>
            <div className="sentiment-legend">
              <span className="leg-pos">{(data.sentiment.positive || 0).toFixed(0)}% Olumlu</span>
              <span className="leg-neu">{(data.sentiment.neutral || 0).toFixed(0)}% Nötr</span>
              <span className="leg-neg">{(data.sentiment.negative || 0).toFixed(0)}% Olumsuz</span>
            </div>
          </div>
        ) : (
          <div className="sentiment-tag">Duygu: {typeof data.sentiment === 'string' ? data.sentiment : 'Analiz Ediliyor...'}</div>
        )}
      </div>

      <div className="insights-content">
        <section className="insight-section">
          <h4><Lightbulb size={16} style={{display:'inline', marginRight:'0.4rem', verticalAlign:'middle'}} /> Ana Bulgular</h4>
          <ul>
            {data.findings?.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </section>

        <section className="insight-section">
          <h4><Zap size={16} style={{display:'inline', marginRight:'0.4rem', verticalAlign:'middle'}} /> Önerilen Aksiyonlar</h4>
          <div className="recommendations">
            {data.recommendations?.map((r, i) => (
              <div key={i} className="rec-item">
                <span className="rec-icon"><Target size={15} /></span>
                <p>{r}</p>
              </div>
            ))}
          </div>
        </section>

        {data.wordCloud && data.wordCloud.length > 0 && (
          <section className="insight-section word-cloud-section" style={{ gridColumn: '1 / -1' }}>
            <h4><Sparkles size={16} style={{display:'inline', marginRight:'0.4rem', verticalAlign:'middle'}} /> Sık Geçen Kelimeler (Kelime Bulutu)</h4>
            <div className="word-cloud">
              {data.wordCloud.map((w, i) => {
                const maxVal = Math.max(...data.wordCloud.map(x => x.value), 1);
                const size = 0.85 + (w.value / maxVal) * 1.5; 
                const op = 0.5 + (w.value / maxVal) * 0.5;
                const colors = ['#7c3aed', '#ec4899', '#2563eb', '#10b981', '#f59e0b'];
                const color = colors[i % colors.length];
                return (
                  <span key={i} className="cloud-word" style={{ fontSize: `${size}rem`, opacity: op, color: color, animationDelay: `${i * 0.05}s` }}>
                    {w.text}
                  </span>
                )
              })}
            </div>
          </section>
        )}
      </div>

      <button onClick={onRetry} className="btn btn-outline btn-refresh"><RefreshCw size={15} /> Analizi Yenile</button>

      <style jsx="true">{`
        .ai-insights-box { 
          background: var(--bg-card); 
          border: 1px solid var(--border); 
          padding: 2rem; 
          margin-bottom: 2.5rem; 
          animation: slideDown 0.4s ease-out; 
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .insights-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .ai-badge { font-weight: 800; font-size: 0.75rem; color: var(--primary); letter-spacing: 0.1em; }
        
        .sentiment-bar-wrapper { display: flex; flex-direction: column; gap: 0.35rem; min-width: 200px; text-align: right; }
        .sentiment-bar { display: flex; height: 10px; width: 100%; border-radius: 6px; overflow: hidden; background: #e2e8f0; }
        .bar-segment { height: 100%; transition: width 1s ease-out; }
        .bar-segment.pos { background: #10b981; }
        .bar-segment.neu { background: #94a3b8; }
        .bar-segment.neg { background: #ef4444; }
        .sentiment-legend { display: flex; justify-content: flex-end; gap: 0.75rem; font-size: 0.7rem; font-weight: 700; }
        .leg-pos { color: #10b981; }
        .leg-neu { color: #64748b; }
        .leg-neg { color: #ef4444; }

        .sentiment-tag { padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.8rem; background: var(--bg-main); color: var(--text-main); font-weight: 600; }

        .insights-content { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        
        .insight-section h4 { font-size: 1rem; margin-bottom: 1rem; color: var(--text-main); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }
        .insight-section ul { padding-left: 1.2rem; margin: 0; }
        .insight-section li { margin-bottom: 0.75rem; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; }

        .recommendations { display: flex; flex-direction: column; gap: 0.75rem; }
        .rec-item { 
          display: flex; 
          gap: 0.75rem; 
          background: var(--bg-main); 
          padding: 1rem; 
          border-radius: 12px; 
          border: 1px solid var(--border); 
          box-shadow: var(--shadow-sm); 
        }
        .rec-icon { font-size: 1.2rem; }
        .rec-item p { margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--primary); }

        .word-cloud-section { margin-top: 1rem; padding-top: 1.5rem; border-top: 1px dashed var(--border); }
        .word-cloud { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: center; padding: 1.5rem; background: var(--bg-main); border-radius: 16px; border: 1px solid var(--border); }
        .cloud-word { font-weight: 800; line-height: 1; transition: transform 0.2s; cursor: default; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
        .cloud-word:hover { transform: scale(1.1); opacity: 1 !important; z-index: 10; }

        @keyframes popIn { 0% { opacity: 0; transform: scale(0.5); } 100% { transform: scale(1); } }

        .btn-refresh { margin-top: 2rem; }

        @media (max-width: 768px) { .insights-content { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default AIInsights;
