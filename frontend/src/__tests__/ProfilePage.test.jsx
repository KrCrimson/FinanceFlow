
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfilePage from '../pages/ProfilePage';

describe('ProfilePage', () => {
  it('muestra cargando mientras no hay perfil', () => {
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    render(<ProfilePage />);
    expect(screen.getByText(/Cargando perfil/i)).toBeInTheDocument();
  });
  it('muestra datos de perfil', () => {
    // Aquí deberías mockear el hook o servicio para devolver datos
  });
});
