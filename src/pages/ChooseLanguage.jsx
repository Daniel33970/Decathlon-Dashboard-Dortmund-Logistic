import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useTranslation } from "react-i18next"; // Import von useTranslation
import CircularProgress from '@mui/material/CircularProgress';
import { SettingsContext } from '../context/SettingsContext';




export const ChooseLanguage = () => {

    const navigate = useNavigate();

    const [team, setTeam] = useState('');
    const [role, setRole] = useState('');
    const [germanLink, setGermanLink] = useState('');
    const [englishLink, setEnglishLink] = useState('');
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    // const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
    const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen






    useEffect(() => {
        const fetchUserDetails = async () => {
          const user = auth.currentUser; // Den aktuell angemeldeten Benutzer holen
          if (user) {
            const docRef = doc(db, "users", user.uid); // Referenz auf den User-Datensatz
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
              const userData = docSnap.data(); // Daten aus dem Dokument extrahieren
              const userLanguage = userData.language || 'de'; // Standardsprache ist 'de'
              i18n.changeLanguage(userLanguage); // Setze die Sprache in i18next
              setTeam(userData.team); // Team setzen
              setRole(userData.role);
              // setTheme(userData.theme || 'Decathlon Light');
    
              // Dynamischen Link für Deutsch setzen
              if (userData.role === "Management" || userData.role === "Teamleiter") {
                setGermanLink("https://forms.gle/mtHXLeXt5YEFdfBX9");
                setEnglishLink("https://forms.gle/k7FHYixmJ9benRm86");
              } else if (userData.team === "Rezeption") {
                setGermanLink("https://forms.gle/TsG6UTAPZtfwGqRj7");
                setEnglishLink("https://forms.gle/EDR4HD29ZBjaaJpW6");
              } else if (userData.team === "Outbound" || userData.team === "Inbound" || userData.team === "Sorting") {
                setGermanLink("https://forms.gle/NxjW9BmjHhoeQYZE8");
                setEnglishLink("https://forms.gle/tHRLyyFvs27iVxhx9");
              } else if (userData.team === "Sperrgut") {
                setGermanLink("https://forms.gle/ePM7XwHtVBsGXC4UA");
                setEnglishLink("https://forms.gle/gpiicUNRGny96qxD8");
              } else if (userData.team === "ECOM") {
                setGermanLink("https://forms.gle/t8z4ocJ1v9AfsVSq5");
                setEnglishLink("https://forms.gle/J9LYmCB6fVp8jnHVA");
              } else if (["U3", "U4", "U5", "U6", "U7"].includes(userData.team)) {
                setGermanLink("https://forms.gle/BAhA9kHm1RdifQFM8");
                setEnglishLink("https://forms.gle/Sumz2rKWTSXVfq3x8");
              } else {
                setGermanLink("#"); // Standardlink, falls keine Bedingung zutrifft
                setEnglishLink("#");
              }
            } else {
              console.log("No such document!");
            }
          }
        };
    
        fetchUserDetails(); // Benutzerinformationen abrufen
      }, []);

      useEffect(() => {
        const loadSettingsData = async () => {
          // Simuliere das Laden von Daten (falls erforderlich)
          setTimeout(() => setIsLoading(false), 1000); // Dummy-Ladezeit
        };
    
        loadSettingsData();
      }, []);
    
      if (isLoading) {
        return (
          <div className="loading-container" style={theme === 'Dark Mode' ? { backgroundColor:'#121212' } : {}}>
            <CircularProgress color="primary" />
            <p style={theme === 'Dark Mode' ? { color: '#FFFFFF' } : {}}>{t("loadingPage")}</p>
          </div>
        );
      }




  return (
    <div className="chooseLanguage">
      <div className="chooseLanguageContainer">
        <h2>{t("chooseLanguage")}</h2>
        <div className="languageContainer">
          {/* Deutsch-Flagge */}
          <a 
            href={germanLink} 
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg" 
              alt="Deutsch" 
              style={{ width: '200px', margin: '10px' }} 
            />
          </a>

          {/* Englisch-Flagge */}
          <a 
            href={englishLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1920px-Flag_of_the_United_Kingdom_%283-5%29.svg.png" 
              alt="English" 
              style={{ width: '200px', margin: '10px' }} 
            />
          </a>
        </div>

        {/* Zurück zum Dashboard */}
        <div className="backButton">
          <button onClick={() => navigate('/home')}>
            {t("backToDashboard")}
          </button>
        </div>
      </div>
    </div>
  );
};
