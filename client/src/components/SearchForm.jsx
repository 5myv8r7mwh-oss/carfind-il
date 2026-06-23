import React from 'react';

function Chip({ label, active, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        padding: '7px 13px',
        borderRadius: 'var(--r-sm)',
        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border2)'}`,
        background: active ? 'var(--accentbg2)' : 'var(--bg)',
        color: active ? 'var(--accent2)' : 'var(--muted)',
        fontSize: 13,
        fontWeight: active ? 700 : 600,
        fontFamily: 'Assistant, sans-serif',
        cursor: 'pointer',
        userSelect: 'none',
        lineHeight: 1,
        transition: 'all 0.15s',
      }}
    >{label}</span>
  );
}

export default function SearchForm({ s }) {
  const {
    budget, setBudget,
    types, toggleType,
    uses, toggleUse,
    gears, toggleGear,
    year, setYear,
    priority, togglePriority,
    extra, setExtra,
    years,
    loading, error,
    search,
  } = s;

  const panelStyle = {
    background: 'var(--white)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r)',
    padding: '24px 22px',
    boxShadow: 'var(--shadow)',
    position: 'sticky',
    top: 74,
  };

  const fieldStyle = { marginBottom: 20 };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 9,
  };

  const dividerStyle = {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '18px 0',
  };

  return (
    <div style={panelStyle}>
      <div style={{
        fontSize: 14, fontWeight: 700, color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: 20, paddingBottom: 14,
        borderBottom: '1px solid var(--border)',
      }}>🔍 פרטי החיפוש</div>

      {/* Budget */}
      <div style={fieldStyle}>
        <span style={labelStyle}>תקציב מקסימלי</span>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', lineHeight: 1, marginBottom: 12 }}>
          ₪{Number(budget).toLocaleString('he-IL')}
        </div>
        <input
          type="range" min={20000} max={400000} step={5000} value={budget}
          onChange={e => setBudget(Number(e.target.value))}
          style={{ width: '100%', height: 4, accentColor: 'var(--accent)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted2)', marginTop: 7 }}>
          <span>₪20K</span><span>₪400K+</span>
        </div>
      </div>

      <hr style={dividerStyle} />

      {/* Car type */}
      <div style={fieldStyle}>
        <span style={labelStyle}>סוג רכב</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {[
            { label: 'הכל', v: 'כל סוג' },
            { label: 'סדאן', v: 'סדאן' },
            { label: "האצ'בק", v: "האצ'בק" },
            { label: 'SUV', v: 'קרוסאובר SUV' },
            { label: 'מיניוון', v: 'מיניוון' },
            { label: "ג'יפ", v: "ג'יפ" },
            { label: 'מיני', v: 'מיני' },
          ].map(({ label, v }) => (
            <Chip key={v} label={label} active={types.includes(v)} onClick={() => toggleType(v)} />
          ))}
        </div>
      </div>

      {/* Use */}
      <div style={fieldStyle}>
        <span style={labelStyle}>שימוש עיקרי (ניתן לבחור כמה)</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {[
            { label: '🏙️ נסיעות בעיר', v: 'נסיעות עיר יומיומיות' },
            { label: '🛣️ בין עירוני', v: 'נסיעות בין עירוניות ארוכות' },
            { label: '👨‍👩‍👧 משפחתי', v: 'רכב משפחתי עם ילדים' },
            { label: '🌄 שטח', v: 'שטח ושבילים לא סלולים' },
            { label: '🔧 הובלת ציוד', v: 'רכב מסחרי או הסעת כלים וציוד' },
          ].map(({ label, v }) => (
            <Chip key={v} label={label} active={uses.includes(v)} onClick={() => toggleUse(v)} />
          ))}
        </div>
      </div>

      {/* Gears */}
      <div style={fieldStyle}>
        <span style={labelStyle}>תיבת הילוכים</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {[
            { label: 'לא משנה', v: 'כל סוג גיר' },
            { label: 'אוטומטי', v: 'אוטומטית בלבד' },
            { label: 'ידני', v: 'ידנית בלבד' },
          ].map(({ label, v }) => (
            <Chip key={v} label={label} active={gears.includes(v)} onClick={() => toggleGear(v)} />
          ))}
        </div>
      </div>

      {/* Year */}
      <div style={fieldStyle}>
        <span style={labelStyle}>שנת ייצור מינימלית</span>
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg)',
            border: '1.5px solid var(--border2)',
            borderRadius: 'var(--r-sm)',
            color: 'var(--text)',
            fontFamily: 'Assistant, sans-serif',
            fontSize: 14,
            padding: '10px 12px',
            outline: 'none',
            direction: 'rtl',
          }}
        >
          {years.map(y => <option key={y} value={y}>{y === 'לא חשוב' ? 'לא חשוב' : y.replace(' ומעלה', '+')}</option>)}
        </select>
      </div>

      <hr style={dividerStyle} />

      {/* Priorities */}
      <div style={fieldStyle}>
        <span style={labelStyle}>עדיפויות (ניתן לבחור כמה)</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {[
            { label: 'אמינות', v: 'אמינות גבוהה' },
            { label: 'תחזוקה זולה', v: 'תחזוקה זולה' },
            { label: 'חסכוני', v: 'חסכוני בדלק' },
            { label: 'מרווח', v: 'מרחב פנימי גדול' },
            { label: 'בטיחות', v: 'בטיחות גבוהה' },
            { label: 'ביצועים', v: 'ביצועים' },
            { label: 'טכנולוגיה', v: 'טכנולוגיה ומסך גדול' },
            { label: 'קומפקטי', v: 'קל לחנייה בעיר' },
          ].map(({ label, v }) => (
            <Chip key={v} label={label} active={priority.includes(v)} onClick={() => togglePriority(v)} />
          ))}
        </div>
      </div>

      {/* Free text */}
      <div style={fieldStyle}>
        <span style={labelStyle}>הערות נוספות (אופציונלי)</span>
        <textarea
          value={extra}
          onChange={e => setExtra(e.target.value)}
          placeholder="לדוגמה: לא רוצה DSG, יש לי 3 ילדים, נוסע הרבה לאילת..."
          style={{
            width: '100%',
            background: 'var(--bg)',
            border: '1.5px solid var(--border2)',
            borderRadius: 'var(--r-sm)',
            color: 'var(--text)',
            fontFamily: 'Assistant, sans-serif',
            fontSize: 14,
            padding: '11px 12px',
            outline: 'none',
            resize: 'vertical',
            minHeight: 76,
            lineHeight: 1.6,
            direction: 'rtl',
          }}
        />
      </div>

      <button
        onClick={search}
        disabled={loading}
        style={{
          width: '100%',
          padding: 14,
          background: loading ? 'var(--muted2)' : 'var(--accent)',
          border: 'none',
          borderRadius: 'var(--r-sm)',
          color: 'white',
          fontSize: 15,
          fontWeight: 800,
          fontFamily: 'Assistant, sans-serif',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 3px 16px rgba(74,124,89,0.3)',
          opacity: loading ? 0.65 : 1,
          letterSpacing: '0.01em',
        }}
      >
        {loading ? 'מחפש...' : '🔍 מצא לי רכב'}
      </button>

      {error && (
        <div style={{
          marginTop: 12,
          background: 'rgba(184,64,64,0.07)',
          border: '1px solid rgba(184,64,64,0.2)',
          borderRadius: 'var(--r-sm)',
          padding: '11px 14px',
          fontSize: 13,
          color: 'var(--red)',
          lineHeight: 1.5,
        }}>
          שגיאה: {error}
        </div>
      )}
    </div>
  );
}
