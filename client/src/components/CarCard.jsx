import React from 'react';

const SEV_CLASS = { good: 'tag-good', warn: 'tag-warn', bad: 'tag-bad' };
const SEV_ICON  = { good: '✅', warn: '⚠️', bad: '❌' };
const RANKS     = ['🥇', '🥈', '🥉', '4️⃣'];

const tagBase = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '5px 11px',
  borderRadius: 6,
  fontSize: 12.5,
  fontWeight: 600,
  lineHeight: 1,
};

const tagStyles = {
  'tag-good': { background: 'rgba(45,122,79,0.09)',  color: 'var(--green)',   border: '1px solid rgba(45,122,79,0.2)' },
  'tag-warn': { background: 'rgba(176,125,42,0.09)', color: 'var(--yellow)',  border: '1px solid rgba(176,125,42,0.2)' },
  'tag-bad':  { background: 'rgba(184,64,64,0.09)',  color: 'var(--red)',     border: '1px solid rgba(184,64,64,0.2)' },
  'tag-info': { background: 'var(--accentbg)',        color: 'var(--accent2)', border: '1px solid rgba(74,124,89,0.2)' },
};

function Tag({ cls, children }) {
  return <span style={{ ...tagBase, ...tagStyles[cls] }}>{children}</span>;
}

export default function CarCard({ car, index }) {
  const sc = car.matchScore || 85;

  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ height: 3, background: 'var(--accent)' }} />

      {/* Header */}
      <div style={{
        padding: '18px 20px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
            {RANKS[index] || ''} המלצה {index + 1}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em' }}>{car.name}</div>
          {car.subtitle && <div style={{ fontSize: 13, color: 'var(--muted2)', marginTop: 3 }}>{car.subtitle}</div>}
        </div>
        <div style={{
          background: 'var(--accentbg2)',
          border: '1px solid rgba(74,124,89,0.25)',
          color: 'var(--accent2)',
          padding: '7px 13px',
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 800,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {car.priceRange}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Match bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--accentbg)',
          border: '1px solid rgba(74,124,89,0.15)',
          borderRadius: 'var(--r-sm)',
          padding: '11px 14px',
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', flexShrink: 0, minWidth: 48 }}>{sc}%</div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: 'var(--accent)', width: `${sc}%`, transition: 'width 0.8s' }} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>{car.matchReason}</div>
          </div>
        </div>

        {/* Live price from yad2 */}
        {car.livePrice && car.livePrice.count > 0 && (
          <div style={{
            background: 'rgba(74,124,89,0.06)',
            border: '1px solid rgba(74,124,89,0.2)',
            borderRadius: 'var(--r-sm)',
            padding: '11px 14px',
            fontSize: 13,
          }}>
            <span style={{ color: 'var(--muted)', fontWeight: 500 }}>📊 מחיר שוק ביד2 ({car.livePrice.count} מודעות): </span>
            <span style={{ color: 'var(--accent2)', fontWeight: 800 }}>
              {car.livePrice.min} – {car.livePrice.max}
            </span>
            {car.livePrice.median && (
              <span style={{ color: 'var(--muted)', fontWeight: 500 }}> · חציון {car.livePrice.median}</span>
            )}
          </div>
        )}

        {/* Specs */}
        {car.specs && Object.keys(car.specs).length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>
              ⚙️ מפרט טכני
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 8 }}>
              {Object.entries(car.specs).map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 11px' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted2)', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yitzchak Levy */}
        {car.yitzchakLevy && (
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', padding: '11px 14px',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, flexWrap: 'wrap',
          }}>
            <span style={{ color: 'var(--muted)', fontWeight: 500 }}>📋 מחירון יצחק לוי (הערכה):</span>
            <span style={{ color: 'var(--accent2)', fontWeight: 800 }}>{car.yitzchakLevy}</span>
          </div>
        )}

        {/* Equipment */}
        {car.equipment && car.equipment.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>
              🎛️ אבזור נפוץ
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {car.equipment.map((e, i) => <Tag key={i} cls="tag-info">🔹 {e}</Tag>)}
            </div>
          </div>
        )}

        {/* Issues */}
        {car.issues && car.issues.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>
              🔧 נקודות לתשומת לב
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {car.issues.map((iss, i) => (
                <Tag key={i} cls={SEV_CLASS[iss.sev] || 'tag-info'}>
                  {SEV_ICON[iss.sev] || '•'} {iss.text}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        {car.tip && (
          <div style={{
            background: 'var(--bg2)',
            borderRight: '3px solid var(--accent)',
            borderRadius: '0 var(--r-sm) var(--r-sm) 0',
            padding: '11px 14px',
            fontSize: 13,
            color: 'var(--muted)',
            lineHeight: 1.55,
          }}>
            <strong style={{ color: 'var(--text)', fontWeight: 700 }}>💡 טיפ לפני קנייה:</strong> {car.tip}
          </div>
        )}
      </div>
    </div>
  );
}
