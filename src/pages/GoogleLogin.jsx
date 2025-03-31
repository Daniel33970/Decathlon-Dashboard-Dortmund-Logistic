import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import Button from '@mui/material/Button';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export const GoogleLogin = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔴 Überprüfen, ob die E-Mail mit "@decathlon.com" endet
      if (!user.email.endsWith("@decathlon.com")) {
        alert("Bitte verwende eine Decathlon E-Mail-Adresse.");
        await signOut(auth); // Nutzer sofort ausloggen
        return;
      }

      // 🔵 Firestore-Dokument für den Nutzer abrufen
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // 🔵 Falls der Nutzer neu ist, Team auswählen lassen
      if (!userSnap.exists()) {
        setCurrentUser(user);
        setShowTeamSelection(true); // Dropdown anzeigen
      } else {
        // ✅ Falls Nutzer bereits existiert, direkt weiterleiten
        navigate("/home");
      }
    } catch (error) {
      console.error("Fehler beim Google-Login:", error.message);
      alert("Fehler beim Anmelden. Bitte versuche es erneut.");
    }
  };

  const handleSaveTeam = async () => {
    if (!selectedTeam) {
      alert("Bitte wähle ein Team aus.");
      return;
    }

    if (selectedTeam === "Lagerleitung") {
      const inviteCode = prompt("Bitte gib den Einladungscode ein:");
      if (!inviteCode) return;
  
      const codeRef = doc(db, "inviteCodes", "activeCode");
      const codeSnap = await getDoc(codeRef);
  
      if (!codeSnap.exists() || codeSnap.data().code !== inviteCode) {
        alert("Ungültiger oder abgelaufener Einladungscode.");
        return;
      }
    

   
    // Code ist korrekt → Nutzer registrieren
    await setDoc(doc(db, "users", currentUser.uid), {
      firstName: currentUser.displayName.split(" ")[0] || "",
      lastName: currentUser.displayName.split(" ")[1] || "",
      email: currentUser.email,
      team: "Lagerleitung",
      uid: currentUser.uid,
      role: "Management",
      language: "de",
      assignedAt: serverTimestamp(),
    });

    // Code aus Firestore entfernen, da er jetzt verwendet wurde
    await deleteDoc(codeRef);

    alert("Erfolgreich als Lagerleiter registriert!");
    navigate("/home");
  } else {
    // Normale Registrierung für andere Teams
    await setDoc(doc(db, "users", currentUser.uid), {
      firstName: currentUser.displayName.split(" ")[0] || "",
      lastName: currentUser.displayName.split(" ")[1] || "",
      email: currentUser.email,
      team: selectedTeam,
      uid: currentUser.uid,
      role: "Teammate",
      language: "de",
      assignedAt: serverTimestamp(),
    });

    navigate("/home");
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

          {!showTeamSelection ? (
            <img
            src="/web_light_rd_ctn@4x.png" // Bild aus public-Ordner
            alt="Sign in with Google"
            className="google-login-button"
            onClick={handleGoogleSignIn} // Klick-Event
            style={{
              cursor: "pointer",
              width: "200px", // Größe anpassen
              display: "block",
              margin: "20px auto",
            }}
          />
          ) : (
            <div className="team-selection">
              <h3>Wähle dein Team</h3>
              <FormControl fullWidth variant="outlined">
                  <InputLabel id="team-select-label">Team auswählen</InputLabel>
                  <Select
                    label="Team auswählen"  // ✅ Label direkt im Select gesetzt
                    labelId="team-select-label"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                  >
                    <MenuItem value="Inbound">Inbound</MenuItem>
                    <MenuItem value="Outbound">Outbound</MenuItem>
                    <MenuItem value="Sorting">Sorting</MenuItem>
                    <MenuItem value="U3">U3</MenuItem>
                    <MenuItem value="U4">U4</MenuItem>
                    <MenuItem value="U5">U5</MenuItem>
                    <MenuItem value="U6">U6</MenuItem>
                    <MenuItem value="U7">U7</MenuItem>
                    <MenuItem value="Sperrgut">Sperrgut</MenuItem>
                    <MenuItem value="ECOM">ECOM</MenuItem>
                    <MenuItem value="Rezeption">Rezeption</MenuItem>
                    <MenuItem value="Lagerleitung">Lagerleitung</MenuItem>
                  </Select>
                </FormControl>

              <Button onClick={handleSaveTeam} variant="contained">Speichern und fortfahren</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
