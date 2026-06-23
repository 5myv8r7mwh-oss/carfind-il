import { useState } from 'react';
import { searchCars } from '../api';

const CURRENT_YEAR = new Date().getFullYear();

export function useSearch() {
  const [budget, setBudget] = useState(80000);
  const [types, setTypes] = useState(['כל סוג']);
  const [uses, setUses] = useState(['נסיעות עיר יומיומיות']);
  const [gears, setGears] = useState(['כל סוג גיר']);
  const [year, setYear] = useState('2017 ומעלה');
  const [priority, setPriority] = useState([]);
  const [extra, setExtra] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function toggleSingle(setter, value) {
    setter([value]);
  }

  function toggleMulti(setter, value) {
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  async function search() {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await searchCars({ budget, types, uses, gears, year, priority, extra });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const years = ['לא חשוב'];
  for (let y = CURRENT_YEAR; y >= 2005; y--) years.push(`${y} ומעלה`);

  return {
    budget, setBudget,
    types, toggleType: v => toggleSingle(setTypes, v),
    uses, toggleUse: v => toggleMulti(setUses, v),
    gears, toggleGear: v => toggleSingle(setGears, v),
    year, setYear,
    priority, togglePriority: v => toggleMulti(setPriority, v),
    extra, setExtra,
    years,
    loading, result, error,
    search,
  };
}
