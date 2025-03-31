import React, { useState, useEffect, useContext } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext'; // Stelle sicher, dass du den AuthContext importierst
import { db } from '../firebase'; // Firestore-Instanz

export const Profile = () => {
  const { currentUser } = useContext(AuthContext); // Den aktuellen Benutzer aus dem AuthContext holen
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoURL, setPhotoURL] = useState('user (1).png');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser && currentUser.uid) { // Sicherstellen, dass currentUser und uid definiert sind
        try {
          const docRef = doc(db, 'users', currentUser.uid); // Referenz auf den User-Datensatz
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data(); // Benutzerinformationen auslesen
            setFirstName(userData.firstName); // Vornamen setzen
            setLastName(userData.lastName); // Nachnamen setzen
            if (userData.photoURL) {
              setPhotoURL(userData.photoURL); // Profilbild setzen
            } // Profilbild setzen
          } else {
            console.log('No such document!');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Fehler beim Abrufen der Benutzerdaten.');
        }
      }
    };

    fetchUserProfile(); // Funktion zum Abrufen der Benutzerinformationen aufrufen
  }, [currentUser]); // Die Abfrage nur dann ausführen, wenn sich currentUser ändert

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile">
      <div className="user">
        <img src={photoURL} alt="Profilbild" />
        {/* Vor- und Nachname des Benutzers anzeigen */}
        <span>{firstName} {lastName}</span>
      </div>
    </div>
  );
};
