import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {

    const [resetEmail, setResetEmail] = useState(''); // Für Passwort-Reset

    const handlePasswordReset = async () => {
        if (!resetEmail) {
          alert('Bitte geben Sie Ihre registrierte E-Mail-Adresse ein, um das Passwort zurückzusetzen.');
          return;
        }
      
        try {
          await sendPasswordResetEmail(auth, resetEmail);
          alert('Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet. Bitte überprüfen Sie Ihren Posteingang.');
          setResetEmail(''); // Eingabefeld zurücksetzen
        } catch (error) {
          console.error('Fehler beim Senden der Passwort-Reset-E-Mail:', error);
          alert('Fehler beim Senden der Passwort-Reset-E-Mail. Bitte überprüfen Sie die eingegebene E-Mail-Adresse und versuchen Sie es erneut.');
        }
      };
  return (
    <div className='forgotPassword'>
        <div className="forgotPasswordContainer">
            <img src="/Decathlon_Logo24.svg" alt="" />
            <div className="inputButtonContainer">
            <input
              type="email"
              placeholder="E-Mail für Passwort-Reset"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button onClick={handlePasswordReset}>Passwort zurücksetzen</button>
            </div>
            <div className="backToDashboardButton">
            <Link to="/login">
              <button>Zurück zum Login</button>
            </Link>
            </div>
            <p>Bitte gib deine E-Mail-Adresse ein, um dein Passwort zurückzusetzen.</p>
        </div>
    </div>
  )
}
