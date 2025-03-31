import React, { useContext, useEffect, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { GeneralNotifications } from '../components/GeneralNotifications'
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from "react-i18next"; // Import von useTranslation
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';




export const GeneralNotificationsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const { currentUser } = useContext(AuthContext);
  // const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
  const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchAndSetLanguage = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userLanguage = userData.language || 'de'; // Standardsprache ist 'de'
            i18n.changeLanguage(userLanguage); // Setze die Sprache in i18next
            // setTheme(userData.theme || 'Decathlon Light');
          }
        } catch (error) {
          console.error('Fehler beim Laden der Sprache:', error);
        }
      }
    };

    fetchAndSetLanguage();
  }, [currentUser, i18n]); // Läuft, wenn sich der Benutzer ändert

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (currentUser && currentUser.uid) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            console.log('Benutzer existiert nicht in Firestore');
          }
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Rolle:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000); // Verzögerung um 1 Sekunde
      }
    };

    fetchUserRole();
  }, [currentUser]);



  useEffect(() => {
    const loadSettingsData = async () => {
      // Simuliere das Laden von Daten (falls erforderlich)
      setTimeout(() => setIsLoading(false), 1000); // Dummy-Ladezeit
    };

    loadSettingsData();
  }, []);

  // useEffect(() => {
  //   if (!isLoading && (userRole === 'Teammate' || userRole === undefined || userRole === null || userRole === "")) {
      
  //     navigate('/no-access');
  //   }
  // }, [isLoading, userRole, navigate]);

  useEffect(() => {
    if (!isLoading && userRole !== 'Management') {
      navigate('/no-access');
    }
  }, [isLoading, userRole, navigate]);
  
  


  

  if (isLoading) {
    return (
      <div className="loading-container" style={theme === 'Dark Mode' ? { backgroundColor:'#121212' } : {}}>
        <CircularProgress color="primary" />
        <p style={theme === 'Dark Mode' ? { color: '#FFFFFF' } : {}}>{t("loadingPage")}</p>
      </div>
    );
  }

  return (
    <div className='generalNotificationsPage'>
        <div className="generalNotificationsPageContainer">
            <Sidebar/>
            <GeneralNotifications/>
        </div>
    </div>
  )
}
