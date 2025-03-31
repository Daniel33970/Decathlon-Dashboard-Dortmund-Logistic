import React, { useContext, useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/SendRounded';
import { AuthContext } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, onSnapshot, query, orderBy, where, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import { useTranslation } from "react-i18next"; // Import von useTranslation
import { SettingsContext } from '../context/SettingsContext';



export const News = () => {
  const { currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [team, setTeam] = useState('');
  const [teamleiter, setTeamleiter] = useState(null);
  const [userData, setUserData] = useState(null); // State, um die Firestore-Benutzerdaten zu speichern
  const messagesEndRef = useRef(null);
  const [showDeleteOption, setShowDeleteOption] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const [lastKnownTeamleiter, setLastKnownTeamleiter] = useState(null);
  const { t, i18n } = useTranslation();
  // const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
  const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen




  // Teamleiter-Daten abrufen
  useEffect(() => {
    if (team) {
      const fetchTeamleiterData = async () => {
        try {
          const teamleiterDoc = await getDoc(doc(db, 'Teamleiter', team));
          if (teamleiterDoc.exists()) {
            setLastKnownTeamleiter(teamleiterDoc.data());
          } else {
            console.error('Kein Teamleiter für dieses Team gefunden.');
            setLastKnownTeamleiter(null);
          }
        } catch (error) {
          console.error('Fehler beim Abrufen der Teamleiter-Daten:', error);
        }
      };

      fetchTeamleiterData();
    }
  }, [team]);



  


  const scrollToBottom = () => {
    // Überprüfen, ob die aktuelle Ansicht nicht mobil ist
    if (window.innerWidth > 1160) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.uid) {
        try {
          // Benutzerdaten aus Firestore abrufen
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data); // Firestore-Daten speichern
            setTeam(data.team); // Team setzen
            // setTheme(data.theme || 'Decathlon Light'); // Standard ist "Decathlon Light"
            setTeamleiter(data.teamleiter); // Teamleiter setzen
            const userLanguage = data.language || 'de'; // Standardsprache ist 'de'
            i18n.changeLanguage(userLanguage); // Setze die Sprache in i18next
          } else {
            console.error("Benutzer-Dokument existiert nicht!");
          }
        } catch (error) {
          console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    if (team) {
      // Teamleiter des Teams abrufen
      const fetchTeamleiter = async () => {
        const teamleiterQuery = query(
          collection(db, 'users'),
          where('team', '==', team),
          where('role', '==', 'Teamleiter')
        );

        const teamleiterSnapshot = await getDocs(teamleiterQuery);
        if (!teamleiterSnapshot.empty) {
          setTeamleiter(teamleiterSnapshot.docs[0].data());
        }
      };

      fetchTeamleiter();

      // Nachrichten des aktuellen Teams abrufen
      const messagesRef = collection(db, 'teams', team, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesList);
      });

      return () => unsubscribe(); // Abonnement beenden, wenn der Chat wechselt
    }
  }, [team]);

  

  

  useEffect(() => {
    if (messages.length > 0 && window.innerWidth > 1160) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async () => {
 
    if (newMessage.trim() === '' && !downloadURL) return;

    try {
      const messagesRef = collection(db, 'teams', team, 'messages');

      await addDoc(messagesRef, {
        text: newMessage || null,
        imageUrl: downloadURL || null,
        timestamp: new Date(),
        user: {
          uid: currentUser.uid,
          displayName: `${userData.firstName} ${userData.lastName}`,
        },
      });

      setNewMessage(''); // Eingabefeld zurücksetzen
      setDownloadURL("");
      if (window.innerWidth > 1160) {
        scrollToBottom(); // Scrollen nur auf nicht-mobilen Ansichten
      }
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
    }
  };

  // Event-Handler für das Drücken der Enter-Taste
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      const imageFile = e.target.files[0];

      setUploading(true);

      // Reference for the image location in Firebase Storage
      const imageRef = ref(storage, `messages/${team}/${imageFile.name}`);

      try {
        // Upload the image to Firebase Storage
        await uploadBytes(imageRef, imageFile);

        // Get the download URL of the uploaded image
        const url = await getDownloadURL(imageRef);
        setDownloadURL(url);

        console.log("Image successfully uploaded:", url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  
 

  const handleMarkAsRead = async () => {
    if (currentUser && team) {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        lastReadTimestamp: new Date(),
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      handleMarkAsRead(); // Markiere Nachrichten als gelesen, wenn Nachrichten geladen werden
    }
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prevMessages) => [...prevMessages]); // Setzt den Zustand neu, um eine Neu-Renderung zu erzwingen
    }, 60000); // Aktualisierung jede Minute
  
    return () => clearInterval(interval); // Timer beenden, wenn das Component unmountet
  }, []);

  const getContentHeight = () => {
    const role = userData?.role;
    const width = window.innerWidth;
  
    if (width >= 0 && width <= 344) {
      // iPhone SE
      if (role === 'Teammate') return 'calc(100% - 1380px)';
      if (role === 'Teamleiter') return 'calc(100% - 1530px)';
    } else if (width >= 345 && width <= 360) {
      // iPhone SE
      if (role === 'Teammate') return 'calc(100% - 1520px)';
      if (role === 'Teamleiter') return 'calc(100% - 1660px)';
    } else if (width >= 361 && width <= 375) {
      // iPhone SE
      if (role === 'Teammate') return 'calc(100% - 1600px)';
      if (role === 'Teamleiter') return 'calc(100% - 1720px)';
    } else if (width >= 376 && width <= 390) {
      // Samsung Galaxy S8+, Galaxy A51/A71
      if (role === 'Teammate') return 'calc(100% - 1420px)';
      if (role === 'Teamleiter') return 'calc(100% - 1560px)';
    } else if (width >= 391 && width <= 412) {
      // Samsung Galaxy S8+, Galaxy A51/A71
      if (role === 'Teammate') return 'calc(100% - 1350px)';
      if (role === 'Teamleiter') return 'calc(100% - 1500px)';
    } else if (width >= 413 && width <= 414) {
      // iPhone 14 Pro Max, Pixel 7
      if (role === 'Teammate') return 'calc(100% - 1520px)';
      if (role === 'Teamleiter') return 'calc(100% - 1520px)';
    } else if (width >= 415 && width <= 430) {
      // Samsung Galaxy S8+, Galaxy A51/A71
      if (role === 'Teammate') return 'calc(100% - 1350px)';
      if (role === 'Teamleiter') return 'calc(100% - 1480px)';
    } else if (width >= 431 && width <= 540) {
      // Samsung Galaxy S8+, Galaxy A51/A71
      if (role === 'Teammate') return 'calc(100% - 1520px)';
      if (role === 'Teamleiter') return 'calc(100% - 1680px)';
    } else if (width >= 541 && width <= 768) {
      // Kleine Tablets
      if (role === 'Teammate') return 'calc(100% - 1250px)';
      if (role === 'Teamleiter') return 'calc(100% - 1400px)';
    } else if (width >= 769 && width <= 912) {
      // Große Smartphones
      if (role === 'Teammate') return 'calc(100% - 950px)';
      if (role === 'Teamleiter') return 'calc(100% - 1090px)';
    } else if (width >= 913 && width <= 1025) {
      // Kleine Laptops
      if (role === 'Teammate') return 'calc(100% - 880px)';
      if (role === 'Teamleiter') return 'calc(100% - 1020px)';
    } else if (width >= 1026 && width <= 1066) {
      // Kleine Laptops
      if (role === 'Teammate') return 'calc(100% - 770px)';
      if (role === 'Teamleiter') return 'calc(100% - 1020px)';
    } else if (width >= 1160) {
      // Desktops
      if (role === 'Teammate') return 'calc(100% - 170px)';
      return 'calc(100% - 250px)'; // Standardwert für Teamleiter und andere
    }
  
    // Fallback für unbekannte Größen
    
  };
  
  // console.log("Aktuelle Breite:", window.innerWidth);

  const handleDeleteMessage = async (messageId) => {
    try {
      const messageRef = doc(db, "teams", team, "messages", messageId);
      await deleteDoc(messageRef);

      setShowDeleteOption(null); // Schließe das Kontextmenü
    } catch (error) {
      console.error("Fehler beim Löschen der Nachricht:", error);
    }
  };
  

  
  
  

  return (
    <div className='news'>
      <div className="newsHeader" style={theme === 'Dark Mode' ? { backgroundColor: '#000000' } : {}}>
        {lastKnownTeamleiter ? (
          <>
            <div className="headerText">
              <h1>{lastKnownTeamleiter.firstName} {lastKnownTeamleiter.lastName}</h1>
              <p>Teamleiter - {team}</p>
            </div>
            <div className="headerPhoto">
              <img src={lastKnownTeamleiter.photoURL || "user (1).png"} alt="Portrait" />
            </div>
          </>
        ) : (
          <p>Kein Teamleiter vorhanden...</p>
        )}
      </div>

      <div
  className="newsContent"
  style={{
    height: getContentHeight(),
  }}
>
        {/* Nachrichten werden weiterhin kommentiert */}
        {messages.map((msg) => (
          <div key={msg.id} 
          className="message"
          onContextMenu={(e) => {
            e.preventDefault();
            if (userData.role === "Teamleiter") {
              setShowDeleteOption(msg.id);
            }
          }}>
             {msg.text && <p>{msg.text}</p>}
            {msg.imageUrl && <img src={msg.imageUrl} alt="Uploaded" className="uploadedImage" 
            onClick={() => window.open(msg.imageUrl, '_blank')}
            style={{ cursor: 'pointer' }}/>}
            <span>{formatTimestamp(msg.timestamp, t)}</span> 
            {showDeleteOption === msg.id && (
              <div className="deleteMenu">
                <button onClick={() => handleDeleteMessage(msg.id)}>Löschen</button>
              </div>
            )}
          </div >
        ))}
        <div ref={messagesEndRef} />
      </div>

      {userData && userData.role === "Teamleiter" && (
        <div className="buttomField">
          <div className="textfield">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("writeAMessage")}
            />
            <input 
            type="file" 
            accept="image/*"  
            id="imageInput" 
            onChange={handleImageChange}
            style={{ display: "none" }} 
            />
            <button 
              onClick={() => document.getElementById("imageInput").click()} 
              className='uploadButtonIcon'
            >
              <AttachFileRoundedIcon />
            </button>
            {downloadURL && (
              <div className="imagePreview">
                <img src={downloadURL} alt="Preview" className="previewImage" />
                <button
                  onClick={() => setDownloadURL("")}
                  className="removeImageButton"
                >
                  Bild entfernen
                </button>
              </div>
            )}
              
          </div>
          <div className="sendButton">
          
            <button onClick={handleSendMessage} className='sendButtonIcon'>
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const formatTimestamp = (timestamp, t) => {
  if (!timestamp) return "";

  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();
  const diffInMs = now - date;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInSeconds < 60) {
    return t("sentSecondsAgo", { value: diffInSeconds });
  } else if (diffInHours < 1) {
    return t("sentMinutesAgo", { value: diffInMinutes });
  } else if (diffInHours < 12) {
    const hours = Math.floor(diffInHours);
    return hours === 1
      ? t("sentHourAgo")
      : t("sentHoursAgo", { value: hours });
  } else if (diffInHours < 24 && date.getDate() === now.getDate()) {
    return t("sentTodayAt", {
      time: `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`,
    });
  } else {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return t("sentOnDate", {
      date: `${day}.${month}.${year}`,
      time: `${hours}:${minutes}`,
    });
  }
};


