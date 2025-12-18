import { useState, useEffect } from 'react';
import { getMovimientos } from '../services/movimientosService';

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getMovimientos()
      .then(setMovimientos)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { movimientos, loading, error };
}
