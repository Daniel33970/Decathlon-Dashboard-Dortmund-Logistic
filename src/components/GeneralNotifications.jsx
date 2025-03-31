import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { useTranslation } from "react-i18next"; // Import von useTranslation
import { AuthContext } from '../context/AuthContext';
import 'dayjs/locale/de'; // Importiere die deutsche Sprache
import 'dayjs/locale/uk'; // Importiere die 
import 'dayjs/locale/es'; // Importiere die 
import 'dayjs/locale/pl'; // Importiere die 
import 'dayjs/locale/ru'; // Importiere die 
import 'dayjs/locale/ro'; // Importiere die 
import 'dayjs/locale/tr'; // Importiere die 
import 'dayjs/locale/ar'; // Importiere die 
import 'dayjs/locale/sr'; // Importiere die 
import 'dayjs/locale/bg'; // Importiere die 
import 'dayjs/locale/fa'; // Importiere die 
import 'dayjs/locale/vi'; // Importiere die 
import 'dayjs/locale/zh'; // Importiere die 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SettingsContext } from '../context/SettingsContext';




export const GeneralNotifications = () => {
  const [messages, setMessages] = useState([]); // Bestehende Nachrichten
  const [newMessage, setNewMessage] = useState(''); // Neue Nachricht
  const [expiryTime, setExpiryTime] = useState(dayjs()); // Ablaufdatum der Nachricht
  const { t, i18n } = useTranslation();
  const { currentUser } = useContext(AuthContext);
  // const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
  const { theme, language } = useContext(SettingsContext); // Theme aus dem Kontext holen




  const fetchMessages = async () => {
    try {
      const newsCollection = collection(db, 'news');
      const newsSnapshot = await getDocs(newsCollection);
      const loadedMessages = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        expiryDate: dayjs(doc.data().expiryDate), // Konvertiere zu dayjs
      }));
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Fehler beim Abrufen der Nachrichten:', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, 'news', id));
      setMessages((prev) => prev.filter((message) => message.id !== id)); // Nachricht aus dem Zustand entfernen
    } catch (error) {
      console.error('Fehler beim Löschen der Nachricht:', error);
    }
  };

  useEffect(() => {
    if (language) {
      dayjs.locale(language); // Setzt die Day.js Sprache auf die Sprache aus dem SettingsContext
      console.log('Day.js Sprache wurde auf', language, 'gesetzt');
    }
  }, [language]); // Aktualisiert sich bei Änderungen der Sprache im Kontext

  const addMessage = async () => {
    if (!newMessage || !expiryTime) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }

    try {
      const newDoc = {
        message: newMessage,
        expiryDate: expiryTime.toISOString(), // Speichere als ISO-String in Firebase
      };

      const docRef = await addDoc(collection(db, 'news'), newDoc);

      setMessages((prev) => [
        ...prev,
        { id: docRef.id, ...newDoc, expiryDate: dayjs(newDoc.expiryDate) },
      ]);

      setNewMessage('');
      setExpiryTime(dayjs());
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Nachricht:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // useEffect(() => {
  //   const checkExpiryDates = () => {
  //     const now = dayjs();
  //     messages.forEach((message) => {
  //       if (message.expiryDate.isBefore(now)) {
  //         deleteMessage(message.id);
  //       }
  //     });
  //   };
  
  //   const interval = setInterval(checkExpiryDates, 2000); // Prüft alle 10 Sekunden
  //   return () => clearInterval(interval); // Bereinigt den Intervall
  // }, [messages]);



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
            // dayjs.locale(userLanguage); // Aktualisiere die Sprache für dayjs
          }
        } catch (error) {
          console.error('Fehler beim Laden der Sprache:', error);
        }
      }
    };

    fetchAndSetLanguage();
  }, [currentUser, i18n]); // Läuft, wenn sich der Benutzer ändert



  const dashboardTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        paper: '#121212', // Dunkler Hintergrund für Paper-Komponenten
        default: '#121212', // Standard-Hintergrund
      },
      text: {
        primary: '#FFFFFF', // Helle Schriftfarbe
      },
      primary: {
        main: '#7AFFA6', // Primäre Farbe
      },
    },
    
    components: {
      MuiCalendarPicker: {
        styleOverrides: {
          root: {
            backgroundColor: '#121212',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '10px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#121212', // Dunkler Hintergrund für alle Paper-Elemente
            color: '#FFFFFF',
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: '#FFFFFF',
            '&.Mui-selected': {
              backgroundColor: '#7AFFA6',
              color: '#000000',
            },
            '&:hover': {
              backgroundColor: '#2d2d2d',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#2d2d2d',
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: '#FFFFFF',
          },
        },
      },
    },
  });

  return (
    <div className="generalNotifications" style={theme === 'Dark Mode' ? { backgroundColor:'#121212' } : {}}>
  <div className="generalNotificationsContainer">
    <div className="messagesAndCalendarContainer">
      {/* Nachrichten Container */}
      

      {/* Kalender Container */}
      <div className="calendarInputContainer" >
        <h2 style={theme === 'Dark Mode' ? { color:'#FFFFFF'} : {}}>{t("addNewMessage")}</h2>
        <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t("writeMessage")}
              style={{ 
                marginLeft: '10px', 
                padding: '5px',
                backgroundColor: theme === 'Dark Mode' ? '#121212' : '#FFFFFF', // Hintergrundfarbe je nach Theme
                color: theme === 'Dark Mode' ? '#FFFFFF' : '#000000', // Textfarbe je nach Theme
               }}
            />
        </div>
        <div style={{ marginBottom: '10px' }}>
        {theme === 'Dark Mode' ? (
        <ThemeProvider theme={dashboardTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
            <StaticDatePicker
              orientation="landscape"
              value={expiryTime}
              onChange={(newValue) => setExpiryTime(newValue)}
              renderInput={(params) => (
                <TextField {...params} style={{ width: '100%' }} />
              )}
              inputFormat="DD.MM.YYYY"
              minDate={dayjs().add(1, 'day')}
              components={{
                ActionBar: () => null,
              }}
            />
          </LocalizationProvider>
        </ThemeProvider>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
          <StaticDatePicker
            orientation="landscape"
            value={expiryTime}
            onChange={(newValue) => setExpiryTime(newValue)}
            renderInput={(params) => (
              <TextField {...params} style={{ width: '100%' }} />
            )}
            inputFormat="DD.MM.YYYY"
            minDate={dayjs().add(1, 'day')}
            components={{
              ActionBar: () => null,
            }}
          />
        </LocalizationProvider>
      )}
        </div>
        <button onClick={addMessage} style={{ padding: '5px 10px', marginTop: '10px', backgroundColor: '#3643BA', borderRadius: '5px', cursor: 'pointer', color: theme === 'Dark Mode' ? '#000000' : 'white', backgroundColor: theme === 'Dark Mode' ? '#7AFFA6' : '#3643BA' }}>
        {t("addNotification")}
        </button>
      </div>

      <div className="messagesContainer">
        <h2 style={theme === 'Dark Mode' ? { color:'#FFFFFF'} : {}}>{t("existingNotifications")}</h2>
        <div className="messageInfo" style={theme === 'Dark Mode' ? { color:'#FFFFFF', scrollbarColor:'#7AFFA6 #000000' } : {}}>
        <ul>
          {messages.map((message) => (
            <li key={message.id} style={{ marginBottom: '10px', listStyleType: 'none' }}>
              <div className='messages' style={theme === 'Dark Mode' ? { color:'#FFFFFF', scrollbarColor:'#7AFFA6 #000000' } : {}}>
                <strong>{t("notification")}</strong> <div className="message-text" style={theme === 'Dark Mode' ? { color:'#FFFFFF'} : {}}>{message.message} </div>
              </div>
              <div>
                <strong>{t("expiryDate")}</strong> <div className="message-text" style={theme === 'Dark Mode' ? { color:'#FFFFFF'} : {}}>{message.expiryDate.format('DD.MM.YYYY') } </div>
              </div>
              <button onClick={() => deleteMessage(message.id)} style={{ marginTop: '5px', color: theme === 'Dark Mode' ? '#000000' : 'white', backgroundColor: theme === 'Dark Mode' ? '#7AFFA6' : '#3643BA'  }}>
              {t("delete")}
              </button>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};
