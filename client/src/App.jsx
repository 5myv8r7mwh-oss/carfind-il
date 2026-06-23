import React from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultsPanel from './components/ResultsPanel';
import { useSearch } from './hooks/useSearch';

export default function App() {
  const s = useSearch();

  return (
    <>
      <Header />
      <div style={{
        maxWidth: 1120,
        margin: '0 auto',
        padding: '28px 20px 60px',
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: 22,
        alignItems: 'start',
      }}>
        <SearchForm s={s} />
        <ResultsPanel loading={s.loading} result={s.result} error={s.error} />
      </div>
    </>
  );
}
