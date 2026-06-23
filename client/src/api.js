export async function searchCars(params) {
  const base = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${base}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `שגיאת שרת ${res.status}`);
  }
  return res.json();
}
