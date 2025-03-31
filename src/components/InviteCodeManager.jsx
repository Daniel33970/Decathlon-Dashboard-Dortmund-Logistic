import React, { useContext, useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Icon für Code kopieren
import { SettingsContext } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";

export const InviteCodeManager = () => {
  const [inviteCode, setInviteCode] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const currentUser = auth.currentUser;
  const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen
  const { t, i18n } = useTranslation();
  
  

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUser) return;

      // Nutzerrolle abrufen
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserRole(userSnap.data().role);
      }
    };

    fetchUserRole();
    fetchActiveCode();
  }, []);

  const fetchActiveCode = async () => {
    const codeRef = doc(db, "inviteCodes", "activeCode");
    const codeSnap = await getDoc(codeRef);

    if (codeSnap.exists()) {
      setInviteCode(codeSnap.data().code);
    } else {
      setInviteCode(null);
    }
  };

  const generateInviteCode = async () => {
    if (userRole !== "Management") {
      alert("Nur Manager dürfen Einladungscodes erstellen.");
      return;
    }

    // Neuen Einladungscode generieren
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // Zufälliger Code

    // Alten Code überschreiben (falls vorhanden)
    await setDoc(doc(db, "inviteCodes", "activeCode"), {
      code: newCode,
      createdBy: currentUser.uid,
      createdAt: new Date(),
    });

    setInviteCode(newCode);
    alert(`Neuer Einladungscode erstellt: ${newCode}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    alert("Einladungscode kopiert!");
  };

   useEffect(() => {
        const fetchAndSetLanguage = async () => {
          if (currentUser && currentUser.uid) {
            try {
              const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                // setTheme(userData.theme || 'Decathlon Light'); // Standard ist "Decathlon Light"
                const userLanguage = userData.language || 'de'; // Standardsprache ist 'de'
                i18n.changeLanguage(userLanguage); // Setze die Sprache in i18next
              }
            } catch (error) {
              console.error('Fehler beim Laden der Sprache:', error);
            }
          }
        };
    
        fetchAndSetLanguage();
      }, [currentUser, i18n]); // Läuft, wenn sich der Benutzer ändert


  return (
    <div className="inviteCodeManager" style={theme === 'Dark Mode' ? { backgroundColor:'#121212' } : {}}>
      <div className="inviteCodeManagerContainer" style={theme === 'Dark Mode' ? { backgroundColor:'#1E1E1E', color:'#ffffff' } : {}}>
        <h2>🔑 {t("inviteCodeManagement")}</h2>
          <Paper className="inviteBox">
            <Typography variant="h6">
            {inviteCode ? `${t("currentInviteCode")} ${inviteCode}` : `❌ ${t("noActiveCode")}`}
            </Typography>
            {inviteCode && (
              <Button 
                variant="outlined" 
                startIcon={<ContentCopyIcon />} 
                onClick={copyToClipboard} 
                className="copyButton"
              >
                {t("copyCode")}
              </Button>
            )}
            <Button
              variant="contained"
              onClick={generateInviteCode}
              className="generateButton"
            >
              {t("generateNewCode")}
            </Button>
          </Paper>
      </div>
    </div>
  );
};
