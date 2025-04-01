import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useTranslation } from "react-i18next"; // Import von useTranslation
import CircularProgress from '@mui/material/CircularProgress';
import { SettingsContext } from '../context/SettingsContext';




export const ChooseLanguage = () => {

    const navigate = useNavigate();

    const [team, setTeam] = useState('');
    const [role, setRole] = useState('');
    const [germanLink, setGermanLink] = useState('');
    const [englishLink, setEnglishLink] = useState('');
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    // const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
    const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen
    const [managementLinkDE, setManagementLinkDE] = useState('');
const [pickingLinkDE, setPickingLinkDE] = useState('');
const [outboundLinkDE, setOutboundLinkDE] = useState('');
const [rezeptionLinkDE, setRezeptionLinkDE] = useState('');
const [inboundLinkDE, setInboundLinkDE] = useState('');
const [sperrgutLinkDE, setSperrgutLinkDE] = useState('');
const [ecomLinkDE, setEcomLinkDE] = useState('');
const [sortingLinkDE, setSortingLinkDE] = useState('');
const [safetyTestLinkDE, setSafetyTestLinkDE] = useState('');
const [managementLinkEN, setManagementLinkEN] = useState('');
const [pickingLinkEN, setPickingLinkEN] = useState('');
const [outboundLinkEN, setOutboundLinkEN] = useState('');
const [rezeptionLinkEN, setRezeptionLinkEN] = useState('');
const [inboundLinkEN, setInboundLinkEN] = useState('');
const [sperrgutLinkEN, setSperrgutLinkEN] = useState('');
const [ecomLinkEN, setEcomLinkEN] = useState('');
const [sortingLinkEN, setSortingLinkEN] = useState('');
const [safetyTestLinkEN, setSafetyTestLinkEN] = useState('');
const [areLinksLoaded, setAreLinksLoaded] = useState(false);



const fetchSafetyLink = async (collectionName) => {
  const docRef = doc(db, 'links', collectionName, 'securityTestLink', 'linkDoc');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().link;
  } else {
    console.warn(`Kein Link gefunden für: ${collectionName}`);
    return "#";
  }
};

useEffect(() => {
  const loadAllSafetyTestLinks = async () => {
    const linkMap = [
      { name: 'Management DE (Safety Test)', setter: setManagementLinkDE },
      { name: 'Picking DE (Safety Test)', setter: setPickingLinkDE },
      { name: 'Outbound DE (Safety Test)', setter: setOutboundLinkDE },
      { name: 'Rezeption DE (Safety Test)', setter: setRezeptionLinkDE },
      { name: 'Inbound DE (Safety Test)', setter: setInboundLinkDE },
      { name: 'Sperrgut DE (Safety Test)', setter: setSperrgutLinkDE },
      { name: 'E-COM DE (Safety Test)', setter: setEcomLinkDE },
      { name: 'Sorting DE (Safety Test)', setter: setSortingLinkDE },
      { name: 'Safety Test DE (Safety Test)', setter: setSafetyTestLinkDE },

      { name: 'Management EN (Safety Test)', setter: setManagementLinkEN },
      { name: 'Picking EN (Safety Test)', setter: setPickingLinkEN },
      { name: 'Outbound EN (Safety Test)', setter: setOutboundLinkEN },
      { name: 'Rezeption EN (Safety Test)', setter: setRezeptionLinkEN },
      { name: 'Inbound EN (Safety Test)', setter: setInboundLinkEN },
      { name: 'Sperrgut EN (Safety Test)', setter: setSperrgutLinkEN },
      { name: 'ECOM EN (Safety Test)', setter: setEcomLinkEN },
      { name: 'Sorting EN (Safety Test)', setter: setSortingLinkEN },
      { name: 'Safety Test EN (Safety Test)', setter: setSafetyTestLinkEN },
    ];

    await Promise.all(
      linkMap.map(async ({ name, setter }) => {
        const link = await fetchSafetyLink(name);
        setter(link);
      })
    );
    setAreLinksLoaded(true); 
  };

  loadAllSafetyTestLinks();
}, []);




useEffect(() => {
  if (!areLinksLoaded) return;

  const fetchUserDetails = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userLanguage = userData.language || 'de';
        i18n.changeLanguage(userLanguage);
        setTeam(userData.team);
        setRole(userData.role);

        if (userData.role === "Management" || userData.role === "Teamleiter" || userData.team === "Lagerleitung") {
          setGermanLink(managementLinkDE);
          setEnglishLink(managementLinkEN);
        } else if (userData.team === "Rezeption") {
          setGermanLink(rezeptionLinkDE);
          setEnglishLink(rezeptionLinkEN);
        } else if (userData.team === "Outbound") {
          setGermanLink(outboundLinkDE);
          setEnglishLink(outboundLinkEN);
        } else if (userData.team === "Inbound") {
          setGermanLink(inboundLinkDE);
          setEnglishLink(inboundLinkEN);
        } else if (userData.team === "Sorting") {
          setGermanLink(sortingLinkDE);
          setEnglishLink(sortingLinkEN);
        } else if (userData.team === "Sperrgut") {
          setGermanLink(sperrgutLinkDE);
          setEnglishLink(sperrgutLinkEN);
        } else if (userData.team === "ECOM") {
          setGermanLink(ecomLinkDE);
          setEnglishLink(ecomLinkEN);
        } else if (["U3", "U4", "U5", "U6", "U7"].includes(userData.team)) {
          setGermanLink(pickingLinkDE);
          setEnglishLink(pickingLinkEN);
        } else {
          setGermanLink("#");
          setEnglishLink("#");
        }
      } else {
        console.log("No such document!");
      }
    }
  };

  fetchUserDetails();
}, [areLinksLoaded]); // Nur starten, wenn Links geladen


      useEffect(() => {
        const loadSettingsData = async () => {
          // Simuliere das Laden von Daten (falls erforderlich)
          setTimeout(() => setIsLoading(false), 1000); // Dummy-Ladezeit
        };
    
        loadSettingsData();
      }, []);
    
      if (isLoading) {
        return (
          <div className="loading-container" style={theme === 'Dark Mode' ? { backgroundColor:'#121212' } : {}}>
            <CircularProgress color="primary" />
            <p style={theme === 'Dark Mode' ? { color: '#FFFFFF' } : {}}>{t("loadingPage")}</p>
          </div>
        );
      }




  return (
    <div className="chooseLanguage">
      <div className="chooseLanguageContainer">
        <h2>{t("chooseLanguage")}</h2>
        <div className="languageContainer">
          {/* Deutsch-Flagge */}
          <a 
            href={germanLink} 
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg" 
              alt="Deutsch" 
              style={{ width: '200px', margin: '10px' }} 
            />
          </a>

          {/* Englisch-Flagge */}
          <a 
            href={englishLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1920px-Flag_of_the_United_Kingdom_%283-5%29.svg.png" 
              alt="English" 
              style={{ width: '200px', margin: '10px' }} 
            />
          </a>
        </div>

        {/* Zurück zum Dashboard */}
        <div className="backButton">
          <button onClick={() => navigate('/home')}>
            {t("backToDashboard")}
          </button>
        </div>
      </div>
    </div>
  );
};
