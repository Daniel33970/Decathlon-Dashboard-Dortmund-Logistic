import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NoAccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className='noAccess'>
      <h1>Sie haben keinen Zugriff auf diese Seite</h1>
      <button onClick={() => navigate('/home')}>Zurück zum Dashboard</button>
    </div>
  );
};
