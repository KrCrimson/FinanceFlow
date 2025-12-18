import React from 'react';

function LogoutButton({ onLogout }) {
  return <button onClick={onLogout}>Cerrar sesión</button>;
}

export default LogoutButton;
