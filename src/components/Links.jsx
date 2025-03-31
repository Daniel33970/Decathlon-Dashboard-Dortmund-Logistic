import React, { useContext, useEffect, useState } from 'react';
import { doc, collection, setDoc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from "react-i18next"; // Import von useTranslation
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';





export const Links = () => {
  const [data, setData] = useState({});
  const { currentUser } = useContext(AuthContext);

  const { t, i18n } = useTranslation();
  const categoriesWithTeams = ["Productivity", "Planing", "Handover", "IT-MATERIAL"];
  const categoriesSingleLink = ["Shifting", "Permplan", "Permsheet", "Permsupport", "Verladeplan", "ECOM-Traceability", "Sperrgut-Pilotage", "Skydec", "Tattoo", "Sorting-Dashboard", "Material-Sheet", "Transportplan", "Outbound-Page", "Loading-Overview"];
  const teams = ["Inbound", "Outbound", "Sorting", "U3", "U4", "U5", "U6", "U7", "Sperrgut", "ECOM", "Rezeption", "Lagerleitung"];
  // const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
  const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen


  useEffect(() => {
    const fetchData = async () => {
      const linksData = {};

      // Kategorien mit Teams
      for (const category of categoriesWithTeams) {
        const categoryCollection = collection(db, "links", category, "teamLinks");
        const snapshot = await getDocs(categoryCollection);
        linksData[category] = {};
        snapshot.forEach((doc) => {
          linksData[category][doc.id] = doc.data().link;
        });
      }

      // Kategorien mit nur einem Link
      for (const category of categoriesSingleLink) {
        const docRef = doc(db, "links", category);
        const snapshot = await getDocs(collection(db, "links", category, "singleLink"));
        snapshot.forEach((doc) => {
          linksData[category] = doc.data().link;
        });
      }

      setData(linksData);
    };
    fetchData();
  }, []);

  const handleUpdateTeamLink = async (category, team, newLink) => {
    const docRef = doc(db, "links", category, "teamLinks", team);
    await setDoc(docRef, { link: newLink });
    setData((prevData) => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        [team]: newLink,
      },
    }));
  };

  const handleUpdateSingleLink = async (category, newLink) => {
    const docRef = doc(db, "links", category, "singleLink", "linkDoc");
    await setDoc(docRef, { link: newLink });
    setData((prevData) => ({
      ...prevData,
      [category]: newLink,
    }));
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


  return (
    <div className="links" style={theme === 'Dark Mode' ? { backgroundColor:'#121212' } : {}}>
      <div className="linksContainer" style={theme === 'Dark Mode' ? { backgroundColor:'#121212', border: 'none' } : {}}>
        <div className="linksBox">
        {/* Kategorien mit Teams */}
        {categoriesWithTeams.map((category) => (
          <div key={category} className="category" style={theme === 'Dark Mode' ? { backgroundColor:'#1E1E2F', border: 'none' } : {}}>
            <h3 style={theme === 'Dark Mode' ? { color: '#FFFFFF' } : {}}>{category}</h3>
            {teams.map((team) => (
              <div key={team} className="team">
                <label style={theme === 'Dark Mode' ? { color: '#FFFFFF' } : {}}>{team}</label>
                <input
                  type="text"
                  value={data[category]?.[team] || ""}
                  onChange={(e) => handleUpdateTeamLink(category, team, e.target.value)}
                  style={theme === 'Dark Mode' ? { backgroundColor:'#000000', color: '#FFFFFF', border: 'none' } : {}}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Kategorien mit nur einem Link */}
        {categoriesSingleLink.map((category) => (
          <div key={category} className="category" style={theme === 'Dark Mode' ? { backgroundColor:'#1E1E2F', border: 'none' } : {}}>
            <h3 style={theme === 'Dark Mode' ? { color: '#FFFFFF' } : {}}>{category}</h3>
            <input
              type="text"
              value={data[category] || ""}
              onChange={(e) => handleUpdateSingleLink(category, e.target.value)}
              style={theme === 'Dark Mode' ? { backgroundColor:'#000000', color: '#FFFFFF', border: 'none' } : {}}
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};
