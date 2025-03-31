import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { usePasswordToggle } from '../hooks/usePasswordToggle';

export const Register = () => {
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayFirstName = e.target[0].value.trim();
    const displayLastName = e.target[1].value.trim();
    const email = e.target[2].value.trim();
    const team = e.target[3].value;
    const password = e.target[4].value;
    const confirmPassword = e.target[5].value;

    // Überprüfen, ob alle Felder ausgefüllt sind
    if (!displayFirstName || !displayLastName || !email || !team || !password) {
      setErr(true);
      setErrMsg('Bitte fülle alle Felder aus.');

      // Fehlernachricht nach 3 Sekunden ausblenden
      setTimeout(() => {
        setErr(false);
        setErrMsg('');
      }, 3000);

      return;
    }

    // Überprüfen, ob die Passwörter übereinstimmen
    if (password !== confirmPassword) {
      alert('Die Passwörter stimmen nicht überein. Bitte überprüfe deine Eingabe.');
      return;
    }

    // Überprüfen, ob die E-Mail-Adresse eine Decathlon-Adresse ist
    if (!email.endsWith('@decathlon.com')) {
      setErr(true);
      setErrMsg('Bitte verwende eine Decathlon E-Mail-Adresse.');

      // Fehlernachricht nach 3 Sekunden ausblenden
      setTimeout(() => {
        setErr(false);
        setErrMsg('');
      }, 3000);

      return;
    }

    try {
      // Benutzer in Firebase Authentication erstellen
      const res = await createUserWithEmailAndPassword(auth, email, password);

     

      

      // // E-Mail-Verifizierung senden
      await sendEmailVerification(res.user);
      alert('Bitte bestätige deine E-Mail-Adresse über den Link, der an deine E-Mail gesendet wurde.');

      // Überwache den Verifizierungsstatus
      const interval = setInterval(async () => {
        await res.user.reload(); // Aktualisiere den Benutzerstatus
        if (res.user.emailVerified) {
          clearInterval(interval); // Stoppe die Überprüfung
        console.log("Email verified. Creating Firestore document...");

        try {
          // Firestore-Collection erstellen
          await createUserInFirestore(res.user, displayFirstName, displayLastName, email, team);
          alert("E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden.");
          navigate("/login");
        } catch (firestoreErr) {
          console.error("Error saving user to Firestore:", firestoreErr.message);
          alert("Es gab ein Problem beim Erstellen deines Kontos. Bitte kontaktiere den Support.");
        }
      }
    }, 3000); // Überprüfung alle 3 Sekunden
  } catch (err) {
    console.error("Error during registration:", err.message);
    setErr(true);
    setErrMsg("Fehler bei der Registrierung. Bitte versuche es erneut.");
    setTimeout(() => setErr(false), 3000);
  }
};
      
     


  const createUserInFirestore = async (user, firstName, lastName, email, team, retries = 3, delay = 2000) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        team: team,
        uid: user.uid,
        role: "Teammate",
        language: "de",
        assignedAt: serverTimestamp(),
      });
      console.log("User successfully created in Firestore.");
    } catch (err) {
      console.error("Error saving user to Firestore:", err.message);
      
      if (retries > 0) {
        console.log(`Retrying... Attempts left: ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, delay)); // Warten vor Wiederholung
        return createUserInFirestore(user, firstName, lastName, email, team, retries - 1, delay);
      } else {
        console.error("Failed to save user to Firestore after multiple attempts.");
        throw new Error("Failed to save user to Firestore.");
      }
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
            <input type="text" placeholder="Vorname" />
            <input type="text" placeholder="Nachname" />
            <input type="email" placeholder="Email" />
            <select>
              <option value="">Team auswählen</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
              <option value="Sorting">Sorting</option>
              <option value="U3">U3</option>
              <option value="U4">U4</option>
              <option value="U5">U5</option>
              <option value="U6">U6</option>
              <option value="U7">U7</option>
              <option value="Sperrgut">Sperrgut</option>
              <option value="ECOM">ECOM</option>
              <option value="Rezeption">Rezeption</option>
              <option value="Lagerleitung">Lagerleitung</option>
            </select>
            <div className="passwordInput">
            <input type={PasswordInputType} placeholder="Passwort" />
            <span className="password-toggle-icon">{ToggleIcon}</span>
            </div>
            <div className="passwordInput">
              <input type={PasswordInputType} placeholder="Passwort bestätigen" />
            </div>
            <button type="submit">SIGN UP</button>
            {err && <span>{errMsg}</span>}
          </form>
          <p><Link to="/login">Du bist schon registriert? Anmelden</Link></p>
          <p><a href="/google-login">Oder registriere dich mit Google</a></p>

        </div>
      </div>
    </div>
  );
};
