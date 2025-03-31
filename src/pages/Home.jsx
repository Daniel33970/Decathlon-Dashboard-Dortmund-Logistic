import React, { useState, useEffect, useContext } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Dashboard } from '../components/Dashboard';
import CircularProgress from '@mui/material/CircularProgress';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from "react-i18next"; // Import von useTranslation
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';


export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { t, i18n } = useTranslation();
  const { currentUser } = useContext(AuthContext);
  const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen



  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          
          setUserData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      }
      // Verzögerung um 1 Sekunde hinzufügen
      setTimeout(() => setLoading(false), 1000);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchAndSetLanguage = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
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

  if (loading) {
    return (
      <div className="loading-container" style={theme === 'Dark Mode' ? { backgroundColor:'#121212' } : {}}>
        <CircularProgress color="primary" />
        <p style={theme === 'Dark Mode' ? { color: '#FFFFFF' } : {}}>{t("loadingPage")}</p>
      </div>
    );
  }

  return (
    <div className='home'>
      <div className="container-home">
        <Sidebar userData={userData} /> {/* Daten an Sidebar übergeben */}
        <Dashboard userData={userData} /> {/* Daten an Dashboard übergeben */}
      </div>
    </div>
  );
};
