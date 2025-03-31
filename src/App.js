import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import "./style.scss";
import { NewsPage } from "./pages/NewsPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { SettingsPage } from "./pages/SettingsPage";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { UserRolePage } from "./pages/UserRolePage";
import { NoAccessPage } from "./pages/NoAccessPage";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase"; // Ihr Firestore-Setup
import { NoAccessPageMobile } from "./pages/NoAccessPageMobile";
import { signOut } from 'firebase/auth';
import { auth } from "./firebase";
import { GeneralNotificationsPage } from "./pages/GeneralNotificationsPage";
import { LinksPage } from "./pages/LinksPage";
import { ChooseLanguage } from "./pages/ChooseLanguage";
import { SettingsProvider } from "./context/SettingsContext";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ChooseLanguageFeedback } from "./pages/ChooseLanguageFeedback";
import { useCheckUserCollection } from "./components/checkUserCollection";
import { GoogleLogin } from "./pages/GoogleLogin";
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Dein gewünschtes Theme
import 'primereact/resources/primereact.min.css';                  // Core CSS
import 'primeicons/primeicons.css';   
import { InviteCodeManager, InviteCodeManagerPage } from "./pages/InviteCodeManagerPage";



function App() {

  const {currentUser} = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  // const [messages, setMessages] = useState([]); //
  // const { isLoading, isVerified } = useCheckUserCollection(currentUser);

  

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (currentUser && currentUser.uid) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchUserRole();
  }, [currentUser]);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const newsCollection = collection(db, "news");
  //       const newsSnapshot = await getDocs(newsCollection);
  //       const loadedMessages = newsSnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //         expiryDate: dayjs(doc.data().expiryDate), // Konvertiere das Datum
  //       }));
  //       setMessages(loadedMessages);
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };

    // const checkExpiryDates = async () => {
    //   const now = dayjs();
    //   messages.forEach(async (message) => {
    //     if (message.expiryDate.isBefore(now)) {
    //       try {
    //         await deleteDoc(doc(db, "news", message.id)); // Lösche abgelaufene Nachricht
    //         setMessages((prev) =>
    //           prev.filter((msg) => msg.id !== message.id)
    //         );
    //       } catch (error) {
    //         console.error("Error deleting message:", error);
    //       }
    //     }
    //   });
    // };

    // Nachrichten abrufen
    // fetchMessages();

    // Prüfen und löschen alle 10 Sekunden
  //   const interval = setInterval(checkExpiryDates, 10000);

  //   // Bereinige den Intervall beim Unmount
  //   return () => clearInterval(interval);
  // }, [messages]);


 
  
  
 






  useEffect(() => {
    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        if (currentUser) {
          signOut(auth) // Firebase signOut ausführen
            .then(() => {
              console.log("User has been signed out due to inactivity.");
            })
            .catch((error) => {
              console.error("Error signing out:", error);
            });
        }
      }, 4 * 60 * 60 * 1000); // 4 Stunden 
    };

    // Aktivitätsereignisse überwachen
    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    // Timer beim Laden der Seite starten
    resetTimer();

    // Aufräumen bei Komponentendemontage
    return () => {
      clearTimeout(logoutTimer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [currentUser]);

//   if (isLoading) {
//     // Ladebildschirm anzeigen
//     return (
//         <div className="loading-screen">
//             <h2>Loading...</h2>
//             {/* Optional: Zeige ein animiertes Icon */}
//             <div className="spinner"></div>
//         </div>
//     );
// }

// if (!isVerified) {
//     // Benutzer hat keine gültige Firestore-Collection -> Weiterleitung zur Login-Seite
//     return <Navigate to="/login" replace />;
// }


  


  
  const ProtectedRoute = ({ children, allowedOnMobile }) => {
    const [isVerified, setIsVerified] = useState(false);
  const isMobile = window.innerWidth <= 1160; // Definition für Mobilgeräte

  

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (isMobile && !allowedOnMobile) {
    return <Navigate to="/no-access-mobile" replace />;
  }

  return children;
};
  


  return (
    <SettingsProvider currentUser={currentUser}>
      <Routes>
        {/* Automatische Weiterleitung von "/" nach "/home" */}
        <Route path="/" element={<Navigate to="/home" />} />
        
        {/* Definiere die Haupt-Routen */}
        <Route path="home" element={<ProtectedRoute allowedOnMobile={true}> <Home /> </ProtectedRoute>} />
        {/* <Route path="login" element={<Login />} /> */}
        {/* <Route path="register" element={<Register />} /> */}
        <Route path="login" element={<GoogleLogin />} />
        <Route path="settings" element={<ProtectedRoute allowedOnMobile={false}> <SettingsPage /> </ProtectedRoute>} />
        <Route path="news" element={<ProtectedRoute allowedOnMobile={false}> <NewsPage /> </ProtectedRoute>} />
        <Route path="user-role" element={<ProtectedRoute allowedOnMobile={false}> <UserRolePage /> </ProtectedRoute>} />
        <Route path="no-access" element={<ProtectedRoute> <NoAccessPage /> </ProtectedRoute>} />
        <Route path="no-access-mobile" element={<ProtectedRoute allowedOnMobile={true}> <NoAccessPageMobile /> </ProtectedRoute>} />
        <Route path="general-notifications" element={<ProtectedRoute allowedOnMobile={false}> <GeneralNotificationsPage /> </ProtectedRoute>} />
        <Route path="links" element={<ProtectedRoute allowedOnMobile={false}> <LinksPage /> </ProtectedRoute>} />
        <Route path="invite-codes" element={<ProtectedRoute allowedOnMobile={false}> <InviteCodeManagerPage /> </ProtectedRoute>} />
        <Route path="choose-language" element={<ProtectedRoute allowedOnMobile={true}> <ChooseLanguage /> </ProtectedRoute>} />
        <Route path="choose-language-for-feedback" element={<ProtectedRoute allowedOnMobile={true}> <ChooseLanguageFeedback /> </ProtectedRoute>} />
        <Route path="forgot-password" element={ <ForgotPassword /> } />
      </Routes>
      </SettingsProvider>
  );
}

export default App;
