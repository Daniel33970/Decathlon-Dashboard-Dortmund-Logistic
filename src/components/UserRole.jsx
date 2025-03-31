import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDocs, updateDoc, collection, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { useTranslation } from "react-i18next"; // Import von useTranslation
import { SettingsContext } from '../context/SettingsContext';



export const UserRole = () => {
    const { currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]); // Gefilterte Benutzer
    const [searchTerm, setSearchTerm] = useState(''); // Suchbegriff
    const [roleFilter, setRoleFilter] = useState(''); // Rollenfilter
    const [teamFilter, setTeamFilter] = useState(''); // Teamfilter
    const { t, i18n } = useTranslation();
    // const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
    const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen

    



    
    const uniqueTeams = [...new Set(users.map(user => user.team))].filter(Boolean); // Einzigartige Teams ohne leere Werte


    useEffect(() => {
        // Alle Benutzer aus der Datenbank abrufen
        const fetchUsers = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersList = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUsers(usersList);
          } catch (err) {
            console.error('Error fetching users:', err);
            setError('Fehler beim Abrufen der Benutzerdaten.');
          }
        };
    
        fetchUsers();
      }, []);
    
      // Rolle des Benutzers ändern
      // Ursprünglicher funktionierender Code 
      // const handleRoleChange = async (userId, newRole) => {
      //   try {
      //     const userDocRef = doc(db, 'users', userId);
      //     const updates = { role: newRole };
      
      //     // Wenn die Rolle "Management" ist, setze das Team auf "Lagerleitung"
      //     if (newRole === 'Management') {
      //       updates.team = 'Lagerleitung';
      //     }
      
      //     await updateDoc(userDocRef, updates);
      //     setUsers((prevUsers) =>
      //       prevUsers.map((user) =>
      //         user.id === userId
      //           ? { ...user, role: newRole, ...(newRole === 'Management' && { team: 'Lagerleitung' }) }
      //           : user
      //       )
      //     );
      //     // Aktualisiere gefilterte Benutzer
      // setFilteredUsers((prevUsers) =>
      //   prevUsers.map((user) =>
      //     user.id === userId
      //       ? { ...user, role: newRole, ...(newRole === 'Management' && { team: 'Lagerleitung' }) }
      //       : user
      //   )
      // );
      //   } catch (error) {
      //     console.error('Error updating role:', error);
      //     setError('Fehler beim Ändern der Benutzerrolle.');
      //   }
      // };




      //Funktionierende Version

      // Rolle des Benutzers ändern
      // const handleRoleChange = async (userId, newRole) => {
      //   try {
      //     const userDocRef = doc(db, 'users', userId);
      //     const userSnapshot = await getDoc(userDocRef);
      
      //     if (!userSnapshot.exists()) {
      //       throw new Error(`User with ID ${userId} does not exist.`);
      //     }
      
      //     const userData = userSnapshot.data();
      //     const team = userData.team;
      //     const firstName = userData.firstName;
      //     const lastName = userData.lastName;
      //     const email = userData.email;
      //     const photoURL = userData.photoURL;
      
      //     const updates = { role: newRole };
      
      //     // Wenn die Rolle "Management" ist, setze das Team auf "Lagerleitung"
      //     if (newRole === 'Management') {
      //       updates.team = 'Lagerleitung';
      //     }
      
      //     // Rolle im User-Dokument aktualisieren
      //     await updateDoc(userDocRef, updates);
      
      //     // Wenn der neue Role "Teamleiter" ist, füge Daten zur "Teamleiter"-Collection hinzu
      //     if (newRole === 'Teamleiter' && team) {
      //       const teamleiterRef = doc(db, 'Teamleiter', team, 'Leiter', userId);
      
      //       // Lösche eventuell vorhandene alte Teamleiter für das gleiche Team
      //       const teamleiterSubcollectionRef = collection(db, 'Teamleiter', team, 'Leiter');
      //       const teamleiterSnapshot = await getDocs(teamleiterSubcollectionRef);
      //       for (const docSnapshot of teamleiterSnapshot.docs) {
      //         await deleteDoc(doc(db, 'Teamleiter', team, 'Leiter', docSnapshot.id));
      //       }
      
      //       // Erstelle oder aktualisiere das neue Teamleiter-Dokument
      //       await setDoc(teamleiterRef, {
      //         firstName,
      //         lastName,
      //         email,
      //         uid: userId,
      //         timestamp: new Date().toISOString(),
      //         photoURL
      //       });
      //     }
      
      //     setUsers((prevUsers) =>
      //       prevUsers.map((user) =>
      //         user.id === userId
      //           ? { ...user, role: newRole, ...(newRole === 'Management' && { team: 'Lagerleitung' }) }
      //           : user
      //       )
      //     );
      
      //     // Aktualisiere gefilterte Benutzer
      //     setFilteredUsers((prevUsers) =>
      //       prevUsers.map((user) =>
      //         user.id === userId
      //           ? { ...user, role: newRole, ...(newRole === 'Management' && { team: 'Lagerleitung' }) }
      //           : user
      //       )
      //     );
      //   } catch (error) {
      //     console.error('Error updating role:', error);
      //     setError('Fehler beim Ändern der Benutzerrolle.');
      //   }
      // };

      const handleRoleChange = async (userId, newRole) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userDocRef);
    
            if (!userSnapshot.exists()) {
                throw new Error(`User with ID ${userId} does not exist.`);
            }
    
            const userData = userSnapshot.data();
            const team = userData.team;
            const firstName = userData.firstName;
            const lastName = userData.lastName;
            const email = userData.email;
            const photoURL = userData.photoURL || "user (1).png"; // Fallback für Nutzer ohne photoURL
    
            const updates = { role: newRole };
    
            // Wenn die Rolle "Management" ist, setze das Team auf "Lagerleitung"
            if (newRole === 'Management') {
                updates.team = 'Lagerleitung';
            }
    
            // Rolle im User-Dokument aktualisieren
            await updateDoc(userDocRef, updates);
    
            // Wenn der neue Role "Teamleiter" ist, füge Daten zur "Teamleiter"-Collection hinzu
            if (newRole === 'Teamleiter' && team) {
                const teamleiterRef = doc(db, 'Teamleiter', team);
    
                // Überschreibe vorhandene Daten mit den neuen Daten
                await setDoc(teamleiterRef, {
                    firstName,
                    lastName,
                    email,
                    uid: userId,
                    timestamp: new Date().toISOString(),
                    photoURL, // Speichert entweder die vorhandene URL oder den Fallback
                });
            }
    
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? { ...user, role: newRole, ...(newRole === 'Management' && { team: 'Lagerleitung' }) }
                        : user
                )
            );
    
            // Aktualisiere gefilterte Benutzer
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? { ...user, role: newRole, ...(newRole === 'Management' && { team: 'Lagerleitung' }) }
                        : user
                )
            );
        } catch (error) {
            console.error('Error updating role:', error);
            setError('Fehler beim Ändern der Benutzerrolle.');
        }
    };


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
            }
          } catch (error) {
            console.error('Fehler beim Laden der Sprache:', error);
          }
        }
      };
  
      fetchAndSetLanguage();
    }, [currentUser, i18n]); // Läuft, wenn sich der Benutzer ändert

    

       // Filter und Suche anwenden
  const handleFilterAndSearch = () => {
    let filtered = [...users];

    // Rollenfilter anwenden
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (teamFilter) {
      filtered = filtered.filter((user) => user.team === teamFilter);
    }

    // Suchbegriff anwenden
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.team?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    handleFilterAndSearch(); // Filter und Suche immer anwenden, wenn sich Suchbegriff oder Rolle ändern
  }, [searchTerm, roleFilter, teamFilter, users]);


  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      'Möchten Sie diesen Benutzer wirklich löschen?'
    );
    if (!confirmDelete) return; // Abbrechen, wenn der Benutzer "Nein" wählt
  
    try {
      await deleteDoc(doc(db, 'users', userId)); // Benutzer aus Firebase löschen
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Benutzer aus der lokalen Liste entfernen
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      ); // Gefilterte Liste aktualisieren
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Fehler beim Löschen des Benutzers.');
    }
  };
  useEffect(() => {
    const sortUsers = () => {
      if (!users.length) return;
  
      // Sortiere, damit der aktuelle Benutzer immer zuerst kommt
      const sortedUsers = [...users].sort((a, b) => {
        if (a.id === currentUser.uid) return -1; // Aktueller Benutzer zuerst
        if (b.id === currentUser.uid) return 1;
        return 0;
      });
  
      setFilteredUsers(sortedUsers); // Aktualisiere die gefilterte Liste
    };
  
    sortUsers();
  }, [users, currentUser]);



  return (
    <div className='userRole' style={theme === 'Dark Mode' ? { backgroundColor:'#121212' } : {}}>
        <div className="userRoleContainer" style={theme === 'Dark Mode' ? { backgroundColor:'#1E1E1E', color:'#ffffff' } : {}}>
        <h2>{t("userAdministration")}</h2>
      {error && <p className="error">{error}</p>}
      {/* Suchfeld */}
      <div className="filters">
          <input
            type="text"
            placeholder={t("searchUsers")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={theme === 'Dark Mode' ? { backgroundColor:'#1E1E1E', color:'#3B82F6', border:'none', outline: 'none' } : {}}
          />

          {/* Rollenfilter */}
          <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} style={theme === 'Dark Mode' ? { backgroundColor:'#1E1E1E', color:'#3B82F6', border:'none', outline: 'none' } : {}}>
          <option value="">{t("allTeams")}</option>
            {uniqueTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={theme === 'Dark Mode' ? { backgroundColor:'#1E1E1E', color:'#3B82F6', border:'none', outline: 'none' } : {}}>
            <option value="">{t("allRoles")}</option>
            <option value="Teammate">Teammate</option>
            <option value="Teamleiter">Teamleiter</option>
            <option value="Permanent">Permanent</option>
            <option value="Management">Management</option>
          </select>
          {/* Teamfilter */}
          
            
        </div>
      <table>
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("email")}</th>
            <th>{t("team")}</th>
            <th>{t("role")}</th>
            <th>{t("actions")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
              <td>{user.email}</td>
              <td>{user.team}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={theme === 'Dark Mode' ? { backgroundColor:'#1E1E1E', color:'#3B82F6', border:'none' } : {}}
                >
                  <option value="Teammate">Teammate</option>
                  <option value="Teamleiter">Teamleiter</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Management">Management</option>
                </select>
                
              </td>
              <td>{/* Benutzer löschen */}
               {user.id !== currentUser.uid && (
                    <button onClick={() => handleDeleteUser(user.id)} style={theme === 'Dark Mode' ? { backgroundColor:'#7AFFA6', color:'#000000' } : {}}>{t("delete")}</button>
                  )}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    </div>
  )
}
