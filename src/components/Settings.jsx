import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from "react-i18next";
import i18n from '../i18n';
import { SettingsContext } from '../context/SettingsContext';

export const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [photoURL, setPhotoURL] = useState('user (1).png'); 
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState({ firstName: false, lastName: false, team: false });
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState("de"); // Standardsprache Deutsch
  const { i18n, t } = useTranslation(); // React-i18next verwenden
  // const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
  const { setLanguage: updateContextLanguage } = useContext(SettingsContext);
  const { setTheme: updateContextTheme } = useContext(SettingsContext);
  const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen
  const [role, setRole] = useState(null); 
  

  


  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setRole(userData.role);
            setEmail(userData.email);
            setTeam(userData.team);
            // setTheme(userData.theme || 'Decathlon Light'); // Standard ist "Decathlon Light"
            setLanguage(userData.language || "de"); // Standardsprache auf Deutsch setzen
            i18n.changeLanguage(userData.language || "de"); // Sprache in i18next ändern
            if (userData.photoURL) {
              setPhotoURL(userData.photoURL);
            }
          } else {
            console.log('No such document!');
          }
          
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Fehler beim Abrufen der Benutzerdaten.');
        }
      }
    };

    fetchUserProfile();
  }, [currentUser, i18n]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setMessage('');
    }, 3000); // Löscht nach 3 Sekunden

    return () => clearTimeout(timer); // Timer bei jedem Aufruf zurücksetzen
  }, [error, message]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && currentUser) {
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, { photoURL: downloadURL });
        setPhotoURL(downloadURL);
      } catch (error) {
        console.error('Error uploading the image:', error);
        setError('Fehler beim Hochladen des Bildes.');
      }
    }
  };

  

  const handleLanguageChange = async (lng) => {
    setLanguage(lng);
    updateContextLanguage(lng); // Kontext aktualisieren
    i18n.changeLanguage(lng); // Sprache in i18next ändern

    if (currentUser && currentUser.uid) {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { language: lng }); // Sprache in Firebase speichern
    }
  };


  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // Prüfe, ob der Klick nicht innerhalb der Einstellungen erfolgt
  //     if (!event.target.closest(".settingsContainer")) {
  //       setIsEditing({ firstName: false, lastName: false, email: false, team: false, password: false });
  //     }
  //   };
  
  //   // Füge den Klick-Listener hinzu
  //   document.addEventListener("click", handleClickOutside);
  
  //   return () => {
  //     // Entferne den Klick-Listener, wenn die Komponente unmountet
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);
  

  // Funktion zur Reauthentifizierung und E-Mail-Änderung
  const handleSave = async (field) => {
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      
      


      await updateDoc(userDocRef, { [field]: eval(field) });
      setIsEditing((prev) => ({ ...prev, [field]: false }));
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setError('Das eingegebene Passwort ist falsch.');
      } else {
        console.error('Error updating data:', error);
        setError('Fehler beim Speichern der Daten. Bitte überprüfen Sie die neue E-Mail-Adresse und stellen Sie sicher, dass sie gültig ist.');
      }
    }
  };


  const handleThemeChange = async (newTheme) => {
    // setTheme(newTheme); // Lokalen State aktualisieren
    updateContextTheme(newTheme); // Kontext aktualisieren

    if (currentUser && currentUser.uid) {
      const userDocRef = doc(db, "users", currentUser.uid);

      try {
        await updateDoc(userDocRef, { theme: newTheme }); // Theme in Firestore speichern
        // console.log("Theme updated in Firestore to:", newTheme);
      } catch (error) {
        console.error('Error updating theme:', error);
        setError('Fehler beim Aktualisieren des Themes.');
      }
    }
  };

  return (
    <div className='settings' style={theme === 'Dark Mode' ? { backgroundColor: '#070707', color: '#ffffff' } : {}}>
      <div className="settingsContainer">
        <h2 style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}>{t("settings")}</h2>
        <div className="userPhoto">
          <label htmlFor="imageUpload">
            <img src={photoURL} alt="Portrait" style={{ cursor: 'pointer' }} />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>
        <div className="info-section">
          {['firstName', 'lastName'].map((field) => (
            <div key={field} className="info-row">
                <div className="infoSection">
                  <p className="label" style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}> {field === 'firstName' ? t("firstName") : t("lastName")}</p>
                {isEditing[field] ? (
                  <>
                    <input
                      type="text"
                      value={eval(field)}
                      onChange={(e) => eval(`set${field.charAt(0).toUpperCase() + field.slice(1)}`)(e.target.value)}
                      autoFocus
                    />
                    
                  </>
                ) : (
                  <p className="value" style={theme === 'Dark Mode' ? { color: '#ffffff80' } : {}}>{eval(field)}</p>
                )}
              </div>
              {(role === "Teamleiter" || role === "Management" || role === "Permanent") && (
  isEditing[field] ? (
    <div className="button-container">
      <button 
        className="confirm-button" 
        onClick={() => handleSave(field)}
      >
        {t("confirm")}
      </button>
    </div>
  ) : (
    <a href="#" 
       className="edit-link" 
       onClick={(e) => { e.preventDefault(); setIsEditing((prev) => ({ ...prev, [field]: true })); }} 
       style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}
    >
      {t("edit")}
    </a>
  )
)}
            </div>
          ))}
          <div className="info-row">
            <div className="infoSection">
              <p className="label" style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}>{t("email")}</p>
              <p className="value" style={theme === 'Dark Mode' ? { color: '#ffffff80' } : {}}>{email}</p>
            </div>
          </div>
          
          <div className="info-row">
            <div className="infoSection">
              <p className="label" style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}>{t("team")}</p>
              {isEditing.team ? (
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  autoFocus
                  style={theme === 'Dark Mode' ? { backgroundColor: '#7AFFA6', color: '#000000', border: 'none' } : {}}
                >
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
              ) : (
                <p className="value" style={theme === 'Dark Mode' ? { color: '#ffffff80' } : {}}>{team}</p>
              )}
            </div>
            {(role === "Teamleiter" || role === "Management" || role === "Permanent") && (
              isEditing.team ? (
                <div className="button-container">
                  <button 
                    className="confirm-button" 
                    onClick={() => handleSave('team')}
                  >
                    {t("confirm")}
                  </button>
                </div>
              ) : (
                <a href="#" 
                   className="edit-link" 
                   onClick={(e) => { e.preventDefault(); setIsEditing((prev) => ({ ...prev, team: true })); }} 
                   style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}
                >
                  {t("edit")}
                </a>
              )
            )}
          </div>
          <div className="info-row">
            <div className="infoSection">
              
            </div>
            
          </div>
          
          <div className="info-row">
            <div className="infoSection" >
            <label style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}>{t("chooseLanguage")}:</label>
        <select value={language} onChange={(e) => handleLanguageChange(e.target.value)} style={theme === 'Dark Mode' ? { backgroundColor: '#7AFFA6', color: '#000000', border: 'none' } : {}}>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="es">Español</option>
          <option value="pl">Polski</option>
          <option value="fr">Français</option>
          <option value="ru">Русский</option>
          <option value="ro">Română</option>
          <option value="tr">Türkçe</option>
          <option value="ar">العربية</option>
          <option value="sr">Српски</option>
          <option value="uk">Українська</option>
          <option value="bg">Български</option>
          <option value="fa">فارسی</option>
          <option value="vi">Tiếng Việt</option>
          <option value="zh">中文</option>
        </select>
            </div>
          </div>
          
          <div className="info-row">
            <div className="infoSection">
            <label style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}>Theme</label>
        <select value={theme}
                onChange={(e) => handleThemeChange(e.target.value)} style={theme === 'Dark Mode' ? { backgroundColor: '#7AFFA6', color: '#000000', border:'none' } : {}}>
          <option>Decathlon Light</option>
          <option>Dark Mode</option>
        </select>
            </div>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};
