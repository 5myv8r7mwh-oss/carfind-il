import React from 'react';
import CarCard from './CarCard';

export default function ResultsPanel({ loading, result, error }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 460, gap: 18 }}>
        <div style={{
          width: 44, height: 44,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.85s linear infinite',
        }} />
        <div style={{ fontSize: 14, color: 'var(--muted2)', animation: 'fadePulse 1.5s ease-in-out infinite' }}>
          מנתח צרכים ומחפש רכבים מתאימים...
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadePulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        `}</style>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 460, textAlign: 'center', gap: 12, color: 'var(--muted2)' }}>
        <div style={{ fontSize: 64, opacity: 0.25 }}>🚘</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--muted)' }}>מוכן לחיפוש</h3>
        <p style={{ fontSize: 14, maxWidth: 240, lineHeight: 1.65 }}>מלא את הפרטים ונמצא לך את הרכבים המתאימים ביותר</p>
      </div>
    );
  }

  const cars = result.cars || [];
  if (!cars.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 460, textAlign: 'center', gap: 12 }}>
        <div style={{ fontSize: 64, opacity: 0.25 }}>🔍</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--muted)' }}>לא נמצאו תוצאות</h3>
        <p style={{ fontSize: 14, color: 'var(--muted2)' }}>נסה לשנות את הקריטריונים</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>🎯 {result.summary || 'תוצאות חיפוש'}</div>
        <div style={{
          fontSize: 12, color: 'var(--muted)',
          background: 'var(--white)',
          border: '1px solid var(--border)',
          padding: '4px 10px',
          borderRadius: 20,
          fontWeight: 600,
        }}>
          {cars.length} רכבים נמצאו
          {result.fromCache && ' · מהמטמון'}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {cars.map((car, i) => <CarCard key={i} car={car} index={i} />)}
      </div>
    </div>
  );
}
