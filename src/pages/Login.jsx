import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore"; // Import für Firestore
import { auth, db } from "../firebase"; // Firestore-Setup
import { usePasswordToggle } from "../hooks/usePasswordToggle";

export const Login = () => {
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [resetEmail, setResetEmail] = useState(""); // Für Passwort-Reset

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Überprüfe, ob die E-Mail verifiziert wurde
      if (!user.emailVerified) {
        setErr(true);
        setErrMsg("Bitte bestätige deine E-Mail-Adresse, um dich anzumelden.");
        await auth.signOut();
        return;
      }

      // Überprüfe, ob eine Firestore-Collection existiert
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        alert("Dein Konto ist nicht korrekt eingerichtet. Bitte kontaktiere den Support.");
        await auth.signOut(); // Benutzer sofort ausloggen
        return;
      }

      // Weiterleitung zur Home-Seite
      navigate("/home");
    } catch (error) {
      setErr(true);
      setErrMsg("Anmeldedaten sind ungültig. Bitte erneut versuchen.");
      setTimeout(() => {
        setErr(false);
        setErrMsg("");
      }, 3000);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      alert("Bitte geben Sie eine E-Mail-Adresse ein.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("Passwort-Reset-E-Mail wurde gesendet! Bitte überprüfen Sie Ihren Posteingang.");
      setResetEmail(""); // E-Mail-Feld zurücksetzen
    } catch (error) {
      console.error("Fehler beim Senden der Passwort-Reset-E-Mail:", error);
      alert("Fehler beim Senden der Passwort-Reset-E-Mail. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="register">
      <div className="container-register">
        <div className="image-side">
          <img src="/Login_Photo.jpg" alt="Mountain" />
        </div>
        <div className="form-side">
          <div className="logo">
            <img src="/Decathlon_Logo24.svg" alt="Decathlon Logo" />
          </div>
          <form onSubmit={handleSubmit} className="signup-form">
            <input type="email" placeholder="Email" />
            <div className="passwordInput">
              <input type={PasswordInputType} placeholder="Passwort" />
              <span className="password-toggle-icon">{ToggleIcon}</span>
            </div>
            <button type="submit">SIGN IN</button>
            {err && <span>{errMsg}</span>}
          </form>
          <p>
            <Link to="/forgot-password">Passwort vergessen?</Link>
          </p>
          <p>
            <Link to="/register">Du bist noch nicht registriert? Registrieren</Link>
          </p>
          <p><a href="/google-login">Mit Google anmelden</a></p>

        </div>
      </div>
    </div>
  );
};
