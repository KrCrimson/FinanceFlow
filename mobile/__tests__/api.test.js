import { API_URL } from '../src/config/env';

describe('Mobile Config & API Environment', () => {
  it('debería tener la URL del backend de Render configurada en producción', () => {
    expect(API_URL).toBe('https://financeflow-backend-4fbw.onrender.com/api');
  });
});
