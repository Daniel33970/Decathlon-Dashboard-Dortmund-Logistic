import React, { useState, useEffect, useContext } from "react";
import { Profile } from './Profile'
import { SidebarData } from './SidebarData'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { getDoc, doc, getDocs, collection, query, orderBy, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import von useTranslation
import { SettingsContext } from '../context/SettingsContext';



export const Sidebar = () => {

  

  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate(); // React Router Navigation
  const { t, i18n } = useTranslation();
  // const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
  const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1160);



  

  useEffect(() => {

    const fetchUserRole = async () => {
      if (currentUser && currentUser.uid) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
          // setTheme(userData.theme || 'Decathlon Light'); // Standard ist "Decathlon Light"
          const userLanguage = userData.language || 'de'; // Standardsprache ist 'de'
              i18n.changeLanguage(userLanguage); // Setze die Sprache in i18next
        }
      }
    };
    const checkUnreadMessages = async () => {
      if (currentUser && currentUser.uid) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const lastReadTimestamp = userData.lastReadTimestamp?.toMillis() || 0;

          const messagesRef = collection(db, "teams", userData.team, "messages");
          const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

          const messagesSnapshot = await getDocs(messagesQuery);
          const hasUnread = messagesSnapshot.docs.some(
            (msg) => msg.data().timestamp.toMillis() > lastReadTimestamp
          );

          setHasUnreadMessages(hasUnread);
        }
      }
    };
    
    fetchUserRole();
    checkUnreadMessages();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1160);
    };
  
    // Event Listener für Fenstergröße hinzufügen
    window.addEventListener("resize", handleResize);
  
    // Beim ersten Laden direkt prüfen
    handleResize();
  
    // Cleanup-Funktion: Event Listener entfernen, wenn Komponente unmountet wird
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentUser, i18n]);

  const handleNewsClick = async () => {
    if (currentUser && currentUser.uid) {
      try {
        // Update `lastReadTimestamp` im Firestore
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          lastReadTimestamp: serverTimestamp(),
        });

        // Entferne den grünen Punkt lokal
        setHasUnreadMessages(false);

        // Navigiere zur News-Seite
        navigate("/news");
      } catch (error) {
        console.error("Fehler beim Aktualisieren des Zeitstempels:", error);
      }
    }
  };

  const sidebarItems = SidebarData(t);
  const sidebarStyle = {
    backgroundColor: theme === 'Dark Mode' ? '#000000' : '',
    overflowY: isMobile ? 'hidden' : 'auto', // Scrollbar aktivieren
    scrollbarWidth: isMobile ? 'none' : 'thin', // Firefox Scrollbar dünn machen
    scrollbarColor: theme === 'Dark Mode' ? '#000 #1e1e2f' : '#3643ba #ffffff'
  };


  return (
    <div className='sidebar' style={sidebarStyle}>
      <Profile />
      <ul className='sidebarlist'>
        {sidebarItems.map((val, key) => {
          if (
            (userRole === "Management" && key === 1) ||
            (userRole !== "Management" && key === 4) ||
            (userRole === "Permanent" && key === 1) ||
            (userRole === "Teammate" && key === 3) ||
            (userRole === "Teammate" && key === 5) ||
            (userRole === "Teammate" && key === 6) ||
            (userRole === "Teamleiter" && key === 6) ||
            (userRole === "Permanent" && key === 6) ||
            (userRole === null && key === 3) ||
            (userRole === null && key === 5) ||
            (userRole === null && key === 1) ||
            (userRole === null && key === 2) ||
            (userRole === null && key === 6) 
            
          ) {
            return null;
          }
          const isNews = val.title === t("news");
          const title = isNews && hasUnreadMessages
            ? (
              <>
                {t("news")} <span className="green-dot">•</span>
              </>
            )
            : val.title;

          return (
            <li
              key={key}
              className="row"
              id={window.location.pathname === val.link ? "active" : ""}
              onClick={() => {
                if (isNews) {
                  handleNewsClick();
                } else {
                  navigate(val.link); // Anstelle von `window.location.pathname`
                }
              }}
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{title}</div>
            </li>
          );
        })}
      </ul>
      <div className="logoutButton">
        <button onClick={() => signOut(auth)}>{t("logout")}</button>
      </div>
      <style>
        {`
          .sidebar::-webkit-scrollbar {
            width: 8px;
          }
          
          .sidebar::-webkit-scrollbar-track {
            background: ${theme === 'Dark Mode' ? '#1e1e2f' : '#ffffff'};
            border-radius: 10px;
          }

          .sidebar::-webkit-scrollbar-thumb {
            background: ${theme === 'Dark Mode' ? '#000' : '#3643ba'};
            border-radius: 10px;
          }

          .sidebar::-webkit-scrollbar-thumb:hover {
            background: ${theme === 'Dark Mode' ? '#333' : '#7AffA6'};
          }
        `}
      </style>
    </div>
  );
};