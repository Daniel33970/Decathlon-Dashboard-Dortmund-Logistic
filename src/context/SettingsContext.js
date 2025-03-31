import React, { createContext, useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from "react-i18next";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children, currentUser }) => {
  const [theme, setTheme] = useState("Decathlon Light"); // Standard-Theme setzen
  const [language, setLanguage] = useState("de"); // Standard-Sprache setzen
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchSettings = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setTheme(userData.theme || "Decathlon Light");
            const userLanguage = userData.language || "de";
            setLanguage(userLanguage);
            i18n.changeLanguage(userLanguage); // Sprache in i18n setzen
          } else {
            console.log("User document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user settings:", error);
        }
      }
    };

    fetchSettings();
  }, [currentUser, i18n]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};
