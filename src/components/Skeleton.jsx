import React from 'react';

const Skeleton = ({ width, height, borderRadius = '8px', className = '' }) => {
  return (
    <div 
      className={`skeleton-loader ${className}`}
      style={{ width, height, borderRadius }}
    >
      <style jsx="true">{`
        .skeleton-loader {
          background: linear-gradient(
            90deg, 
            var(--bg-main) 25%, 
            var(--border) 50%, 
            var(--bg-main) 75%
          );
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export const SurveyCardSkeleton = () => (
  <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
    <Skeleton width="100px" height="20px" borderRadius="20px" className="mb-4" />
    <Skeleton width="80%" height="24px" className="mb-2" />
    <Skeleton width="60%" height="16px" className="mb-4" />
    <div style={{ display: 'flex', gap: '10px' }}>
      <Skeleton width="32px" height="32px" borderRadius="8px" />
      <Skeleton width="32px" height="32px" borderRadius="8px" />
      <Skeleton width="32px" height="32px" borderRadius="8px" />
    </div>
    <style jsx="true">{`
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-4 { margin-bottom: 1rem; }
    `}</style>
  </div>
);

export default Skeleton;
