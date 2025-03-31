import React, { useContext, useRef } from 'react'
import EmailIcon from '@mui/icons-material/Email';
import { useState } from 'react';
import { useEffect } from 'react';
import { auth } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { getDoc, getDocs, collection } from 'firebase/firestore';
import { Switch } from '@mui/material';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { SettingsContext } from '../context/SettingsContext';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PreviewIcon from '@mui/icons-material/Preview';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TodayIcon from '@mui/icons-material/Today';
import AirIcon from '@mui/icons-material/Air';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMediaQuery } from '@mui/material';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add'; 


















export const Dashboard = () => {
    const [firstName, setFirstName] = useState(''); // State für den Vornamen
    const [team, setTeam] = useState('');
    const [isKaptainToolsVisible, setIsKaptainToolsVisible] = useState(false);
    const [role, setRole] = useState(null); 
    const [planningLink, setPlanningLink] = useState(''); // Dynamischer Link für Planung
    const [productivityLink, setProductivityLink] = useState(''); // Dynamischer Link für Productivity
    const [shiftingLink, setShiftingLink] = useState(''); // Dynamischer Link für Verschiebung
    const [handoverLink, setHandoverLink] = useState(''); // Dynamischer Link für Übergabe
    const [permplanLink, setPermplanLink] = useState(''); // Dynamischer Link für Perm Plan
    const [permsheetLink, setPermsheetLink] = useState(''); // Dynamischer Link für Perm Sheet
    const [permsupportLink, setPermsupportLink] = useState(''); // Dynamischer Link für Perm Support
    const [verladeplanLink, setVerladeplanLink] = useState(''); // Dynamischer Link für Verladeplan
    const [itMaterialLink, setItMaterialLink] = useState(''); // Dynamischer Link für Verladeplan
    const [traceabilityLink, setTraceabilityLink] = useState(''); // Dynamischer Link für E-COM Traceability
    const [skydecLink, setSkydecLink] = useState(''); // Dynamischer Link für Skydec
    const [loadingOverviewLink, setLoadingOverviewLink] = useState(''); // Dynamischer Link für Skydec
    const [tattooLink, setTattooLink] = useState(''); // Dynamischer Link für Skydec
    const [sortingDashboardLink, setSortingDashboardLink] = useState(''); // Dynamischer Link für Closing Pallets
    const [outboundPageLink, setOutboundPageLink] = useState(''); 
    const [transportplanLink, setTransportplanLink] = useState(''); 
    const [emailExists, setEmailExists] = useState(false);
    const [checkedSheets, setCheckedSheets] = useState([]);
    const [foundInSheets, setFoundInSheets] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;
    const [isLoading, setIsLoading] = useState(true); // Zustand für das Laden
    const [language, setLanguage] = useState("de"); // Standardsprache
const { i18n, t } = useTranslation(); // React-i18next verwenden
// const [theme, setTheme] = useState('Decathlon Light'); // Standard-Theme
const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen
const isLargeScreen = useMediaQuery('(min-width:1160px)');




const actions = [
  { icon: <PreviewIcon />, name: 'VIEW', link: 'https://view.dktapp.cloud/actions/myhome' },
  { icon: <LocalShippingIcon />, name: 'TATTOO', link: 'https://tattoo.dktapp.cloud/tattoo/' },
  { icon: <EventAvailableIcon />, name: 'VERLADEPLAN', link: 'https://docs.google.com/spreadsheets/d/1cFRVXdidLgZ_R1kkkWZKRf1QgfpQO8XNbGfCsJdIxK4/edit#gid=0' },
  { icon: <TodayIcon />, name: 'TRANSPORTPLAN', link: 'https://docs.google.com/spreadsheets/d/1P9leKjVlNYc_WmDRM3isaH_3VuNmoKfvzfy5QKoDM90/edit#gid=1095576528' },
  { icon: <AirIcon />, name: 'FLOWs', link: 'https://docs.google.com/spreadsheets/d/1toNnaS2Hgm5I2y3WtVkYsfJT7DPg1LVD7K9HrumqZNM/edit#gid=467715948' },
  { icon: <FilterDramaIcon />, name: 'SKYDEC', link: 'https://script.google.com/a/decathlon.com/macros/s/AKfycbyUba5OSgmqL61isFXcvcUR8qD1URilDt_d891fsbYofZ3RTn0_rH7b-cWpAOdnyxLs/exec?page=Index' },
  { icon: <WarehouseIcon />, name: 'WAREHOUSEBOX', link: 'https://whbox-pickingwavebox-eu.dktapp.cloud/W122/?date=2023-02-22&page=1&size=15' },
  { icon: <BackupTableIcon />, name: 'TABLEAU', link: 'https://prod-uk-a.online.tableau.com/#/site/dktunited/views/LOGISTICSPERFORMANCE-LeadtimeandShippingPromiseAnalysis/LeadtimeandShippingPromiseAnalysis?:iid=1' },
];







    const kontaktRef = useRef(null); // Ref für das Kontakt-Grid-Item
  const [hoverWidth, setHoverWidth] = useState(0); // Zustand für die dynamische Breite

  // Berechne die Breite des Kontakt-Grid-Items
  useEffect(() => {
    if (kontaktRef.current) {
      setHoverWidth(kontaktRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (kontaktRef.current) {
        setHoverWidth(kontaktRef.current.offsetWidth);
      }
    };

    // Füge einen Event-Listener für Fenstergrößenänderungen hinzu
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    


    const handleToggle = (event) => {
      setIsKaptainToolsVisible(event.target.checked);
    };


    const checkEmailInGoogleSheet = async (email, team, role) => {
      try {
        const response = await fetch(
          `${API_URL}?email=${email}&team=${team}&role=${role}`
        );
        if (!response.ok) {
          throw new Error(`HTTP-Error: ${response.status}`);
        }
        const data = await response.json();
        // console.log("API Response:", data); // Debugging
        // console.log("API Response Logs:", data.logs); // Debugging
        return data;
      } catch (error) {
        console.error("Error checking email:", error);
        return { exists: false, checkedSheets: [], foundInSheets: [], logs: [] };
      }
    };
    


    
    
    


    useEffect(() => {
      const checkEmail = async () => {
        setIsLoading(true); 
        if (!auth.currentUser) {
          console.log("Kein angemeldeter Benutzer gefunden");
          return;
        }
    
        // Warte, bis die Benutzerinformationen aus Firebase geladen sind
        const user = auth.currentUser;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          console.log("Benutzer-Dokument existiert nicht");
          return;
        }
    
        const userData = userDoc.data();
        const email = userData.email;
        const team = userData.team;
        const role = userData.role;
    
        // Überprüfe die E-Mail im Google Sheet
        const result = await checkEmailInGoogleSheet(email, team, role);
        setEmailExists(result.exists);
        setCheckedSheets(result.checkedSheets);
        setFoundInSheets(result.foundInSheets);
        setIsLoading(false); 
      };
    
      checkEmail();
    }, []);


    // useEffect(() => {
    //   const checkEmail = async () => {
    //     const user = { email: "test3@example.com", team: "ECOM", role: "Teamleiter" }; // Beispielwerte
    
    //     try {
    //       const result = await checkEmailInGoogleSheet(user.email, user.team, user.role);
    //       console.log("Email check completed. Result:", result);
          
    //       setEmailExists(result.exists);
    //       setCheckedSheets(result.checkedSheets);
    //       setFoundInSheets(result.foundInSheets);
    
    //     } catch (error) {
    //       console.error("Error during email check:", error);
    //     }
    //   };
    
    //   checkEmail();
    // }, []); // Leerer Dependency-Array, läuft nur einmal beim Laden der Komponente


    
    
    
    

    const teamLinks = {
      U3: 'https://docs.google.com/spreadsheets/d/1eI_Dil28pPHDgIbdxV92PD1WGl7USzZOd6X9J_m9MeM/edit?gid=181593510#gid=181593510',
      U4: 'https://docs.google.com/spreadsheets/d/19d873QgjsKUq6gO9zW7zihrkS9uYA4CiMWuM_EFf_PQ/edit?gid=1797723222#gid=1797723222',
      U5: 'https://docs.google.com/spreadsheets/d/1kxLkL-bFUp_dZZoHzqqgdmbFi9jMAcweJtPkVCIszdc/edit?gid=8224925#gid=8224925',
      U6: 'https://docs.google.com/spreadsheets/d/1mfApfiaiizbRX0RQB1hy303C2U0gRy_NysqBUfkb2ps/edit?gid=1011945078#gid=1011945078',
      U7: 'https://docs.google.com/spreadsheets/d/1zJHVU-rmZ1umo0HAxL-GFVlG1k6DUUSa9wgxRdeS1HI/edit?gid=256058942#gid=256058942',
      Sperrgut: 'https://docs.google.com/spreadsheets/d/15jymESlKv78AsTH0bQFQL77H6uft09C8H9b9G1CA6mo/edit?gid=1748393508#gid=1748393508',
      Inbound: 'https://docs.google.com/spreadsheets/d/1WRXlrEtoPYH5jQhLH4pBkzSexT0DlpSTns7r1rtq_9s/edit?gid=805416845#gid=805416845',
      Outbound: 'https://docs.google.com/spreadsheets/d/1CvuxubkfqSozZhfGLF2pXqo2Kamkrkp0sp4SoIXhySc/edit?gid=0#gid=0',
      Sorting: 'https://docs.google.com/spreadsheets/d/10tJMp-_YaMt4Upjbx9u72SIYURsdRQoMxh-KLmuUgzM/edit?gid=454160149#gid=454160149',
      ECOM: 'https://docs.google.com/spreadsheets/d/1N3-ecrXSb68nSj3KJFI9XD6HZxP8SuSwhuia0qmyM7Y/edit?gid=792957116#gid=792957116',
      Rezeption: 'https://docs.google.com/spreadsheets/d/1-nL7PX9BHFRiKzIYiQNW-ndlNMuai6pVHQ3fsiNNbYI/edit?gid=38586922#gid=38586922',
    };

    // Fetch Nachrichten und lösche abgelaufene
  const fetchMessages = async () => {
    try {
      const newsCollection = collection(db, 'news');
      const newsSnapshot = await getDocs(newsCollection);

      newsSnapshot.forEach(async (doc) => {
        const data = doc.data();
        const expiryDate = dayjs(data.expiryDate);

        // Prüfen, ob die Nachricht abgelaufen ist
        if (expiryDate.isBefore(dayjs())) {
          try {
            await deleteDoc(doc.ref); // Lösche die abgelaufene Nachricht
          } catch (error) {
            console.error('Fehler beim Löschen der Nachricht:', error);
          }
        } else if (data.message && !toast.isActive(data.message)) {
          // Zeige nur nicht-abgelaufene Nachrichten an
          toast.info(data.message, {
            toastId: data.message,
            autoClose: 7000,
            position: "bottom-right",
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Zoom,
          });
        }
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Nachrichten:', error);
    }
  };

  useEffect(() => {
    const fetchPlanningLink = async () => {
      if (team) {
        // Zugriff auf den Planungslink unter links -> planing -> teamlinks -> [team]
        const docRef = doc(db, 'links', 'Planing', 'teamLinks', team);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setPlanningLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchPlanningLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  useEffect(() => {
    const fetchShiftingLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Shifting', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setShiftingLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchShiftingLink();
  }, [team]); // Läuft, wenn das Team geladen ist


  useEffect(() => {
    const fetchPermplanLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Permplan', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setPermplanLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchPermplanLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  useEffect(() => {
    const fetchPermsheetLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Permsheet', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setPermsheetLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchPermsheetLink();
  }, [team]); // Läuft, wenn das Team geladen ist


  useEffect(() => {
    const fetchPermsupportLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Permsupport', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setPermsupportLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchPermsupportLink();
  }, [team]); // Läuft, wenn das Team geladen ist


  useEffect(() => {
    const fetchVerladeplanLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Verladeplan', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setVerladeplanLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchVerladeplanLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  


  useEffect(() => {
    const fetchTraceabilityLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Traceability', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setTraceabilityLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchTraceabilityLink();
  }, [team]); // Läuft, wenn das Team geladen ist



  


  useEffect(() => {
    const fetchSkydecLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Skydec', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setSkydecLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchSkydecLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  useEffect(() => {
    const fetchLoadingOverviewLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Loading-Overview', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setLoadingOverviewLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchLoadingOverviewLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  useEffect(() => {
    const fetchTattooLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Tattoo', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setTattooLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchTattooLink();
  }, [team]); // Läuft, wenn das Team geladen ist


  useEffect(() => {
    const fetchSortingDashboardLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Sorting-Dashboard', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setSortingDashboardLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchSortingDashboardLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  useEffect(() => {
    const fetchOutboundPageLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Outbound-Page', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setOutboundPageLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchOutboundPageLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  useEffect(() => {
    const fetchTransportplanLink = async () => {
      if (team) {
        
        const docRef = doc(db, 'links', 'Transportplan', 'singleLink', "linkDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setTransportplanLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchTransportplanLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  useEffect(() => {
    const fetchProductivityLink = async () => {
      if (team) {
        // Zugriff auf den Productivityslink unter links -> planing -> teamlinks -> [team]
        const docRef = doc(db, 'links', 'Productivity', 'teamLinks', team);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setProductivityLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchProductivityLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  useEffect(() => {
    const fetchItMaterialLink = async () => {
      if (team) {
        // Zugriff auf den Productivityslink unter links -> planing -> teamlinks -> [team]
        const docRef = doc(db, 'links', 'IT-MATERIAL', 'teamLinks', team);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setItMaterialLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchItMaterialLink();
  }, [team]); // Läuft, wenn das Team geladen ist


  useEffect(() => {
    const fetchHandoverLink = async () => {
      if (team) {
        // Zugriff auf den Productivityslink unter links -> planing -> teamlinks -> [team]
        const docRef = doc(db, 'links', 'Handover', 'teamLinks', team);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const linkData = docSnap.data();
          setHandoverLink(linkData.link); // Dynamischen Link setzen
        } else {
          console.log('No link found for team:', team);
        }
      }
    };

    fetchHandoverLink();
  }, [team]); // Läuft, wenn das Team geladen ist

  
    // useEffect, um Nachrichten beim Laden der Komponente zu holen
    useEffect(() => {
      fetchMessages();
    }, []);
  


    useEffect(() => {
        const fetchUserName = async () => {
          const user = auth.currentUser; // Den aktuell angemeldeten Benutzer holen
          if (user) {
            const docRef = doc(db, "users", user.uid); // Referenz auf den User-Datensatz
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
              const userData = docSnap.data(); // Daten aus dem Dokument extrahieren
              setFirstName(userData.firstName); // Vornamen setzen
              setTeam(userData.team); // Team setzen
              setRole(userData.role);
              // setTheme(userData.theme || 'Decathlon Light'); // Standard ist "Decathlon Light"
              setLanguage(userData.language || "de"); // Standardsprache auf Deutsch setzen
              i18n.changeLanguage(userData.language || "de"); // Sprache in i18next ändern
            } else {
              console.log("No such document!");
            }
          }
        };


        fetchUserName(); // Die Funktion zum Abrufen des Benutzernamens aufrufen
        }, []);


        // Dynamische Klasse für kleinere Schriftgröße
         const dashboardClassName = 
         role === "Permanent" && team === "Rezeption" 
           ? "dashboard small-font" 
           : "dashboard";





           const today = new Date();
           const dayName = t([
             "sunday",
             "monday",
             "tuesday",
             "wednesday",
             "thursday",
             "friday",
             "saturday",
           ][today.getDay()]);
           const day = today.getDate();
           const month = t([
             "january",
             "february",
             "march",
             "april",
             "may",
             "june",
             "july",
             "august",
             "september",
             "october",
             "november",
             "december",
           ][today.getMonth()]);
           const year = today.getFullYear();
           
           const getOrdinalSuffix = (day) => {
            if (day > 3 && day < 21) return "th"; // Sonderfall für 11-20
            switch (day % 10) {
              case 1:
                return "st";
              case 2:
                return "nd";
              case 3:
                return "rd";
              default:
                return "th";
            }
          };
          

          const dayWithSuffix =
          i18n.language === "en" ? `${day}${getOrdinalSuffix(day)}` : day;

          if (role === null) {
            return <div style={theme === 'Dark Mode' ? { backgroundColor: '#070707', flex: '5', height: '100vh' } : {backgroundColor: '#ffffff', flex: '5', height: '100vh'}}>
            </div>;
          }
           
        
        
    
  return (
    <div className={dashboardClassName} style={theme === 'Dark Mode' ? { backgroundColor: '#070707' } : {}}>
    <div className='dashboard' >
       <ToastContainer />
        <div className="dashboardHead">
            <div className="info">
                <h1 style={theme === 'Dark Mode' ? { color:'#ffffff' } : {}}>{t("hello")} {firstName}</h1>
                <span style={theme === 'Dark Mode' ? { color:'#ffffff' } : {}}>{t("todayIs")} {dayName}, {dayWithSuffix} {month} {year}</span>
            </div>
            <div className="rightSideContainer" >
            {(role === "Permanent" || role === "Management" || role === "Teamleiter") && (
          <>
            <div className="calendarContainer">
              <div className="calendarAndText">
            <span className="meetingRoomText" style={theme === 'Dark Mode' ? { color:'#ffffff' } : {}}>Konferenzseite</span>
                <a href="https://sites.google.com/decathlon.com/meetingrooms-dortmund/home" target="_blank" rel="noopener noreferrer" class="meetingseite">
                <CalendarMonthIcon style={theme === 'Dark Mode' ? { color:'#ffffff' } : {}}/>
                </a>
                </div>
            </div>
            </>
        )}
            <div className="mailContainer">
                <a href="https://mail.google.com/mail" target="_blank" rel="noopener noreferrer" >
                <EmailIcon style={theme === 'Dark Mode' ? { color:'#ffffff' } : {}}/>
                </a>
                </div>
                <div className="feedbackContainer">
                  <Link to="/choose-language-for-feedback" className="feedbackLink">
                    <RateReviewIcon style={theme === 'Dark Mode' ? { color:'#ffffff' } : {}}/>
                    <span className="feedbackText" style={theme === 'Dark Mode' ? { color:'#ffffff' } : {}}>Feedback</span>
                  </Link>
                </div>

                
            </div>
        </div>
        <div className="boxesContainer">
        <h2 style={theme === 'Dark Mode' ? { color:'#fff' } : {}}>{t("main")}</h2>
            <div className={`main ${theme === 'Dark Mode' ? 'dark-mode' : ''}`} >
                    <div className="atossBox">
                    <div className="atossElement">
                    <a href="https://decathlon.atoss.com/decathlonp/html" target="_blank" rel="noopener noreferrer">
                    <div className="grid-item atoss-grid-item"  style={{ padding: role === "Permanent" || team === "Rezeption" || isKaptainToolsVisible ? '20px' : '50px' }}>ATOSS</div>
                    </a>
                    </div>


                    <div className="hoverElement" /* style={{width: `${hoverWidth}px`}}*/> 
                    <a href="https://decathlon.atoss.com/decathlonp/html" target="_blank" rel="noopener noreferrer">
                    <div className="grid-item atoss"  style={{ padding: role === "Permanent" || team === "Rezeption" || isKaptainToolsVisible ? '20px 30px' : '50px 35px', borderRadius:'50%'}}>ATOSS</div>
                    </a>
                    <a href="https://docs.google.com/presentation/d/1MksnCPBrycqCWCbXiiaoMvkLR5TWqANzWrrWzoPYBA4/present" target="_blank" rel="noopener noreferrer">
                    <div className="grid-item info"  style={{ padding: role === "Permanent" || team === "Rezeption" || isKaptainToolsVisible ? '20px 30px' : '50px 35px', borderRadius:'50%' }}>INFOS</div>
                    </a>
                    </div>
                    </div>
                    
                    <a href="https://hcm2.accurat.net/D62913A" target="_blank" rel="noopener noreferrer">
                    <div className="grid-item" style={{ padding: role === "Permanent" || team === "Rezeption" || isKaptainToolsVisible ? '20px' : '50px' }}>ACCURAT</div>
                    </a>        
                    <a href="https://huddle.decathlon.de/" target="_blank" rel="noopener noreferrer">
                    <div className="grid-item"  style={{ padding: role === "Permanent" || team === "Rezeption" || isKaptainToolsVisible ? '20px' : '50px' }}>HUDDLE</div>
                    </a>
                    
                    <a href="https://sites.google.com/decathlon.com/wiki" target="_blank" rel="noopener noreferrer">
                    <div className="grid-item"  style={{ padding: role === "Permanent" || team === "Rezeption" || isKaptainToolsVisible ? '20px' : '50px' }}>WIKI</div>
                    </a>
                    <a href="https://sites.google.com/decathlon.com/kontakt" target="_blank" rel="noopener noreferrer" ref={kontaktRef}>
                    <div className="grid-item"  style={{ padding: role === "Permanent" || team === "Rezeption" || isKaptainToolsVisible ? '20px' : '50px' }}>{t("contacts")}</div>
                    </a>
                    <a href={planningLink} target="_blank" rel="noopener noreferrer">
                      <div className="grid-item"  style={{ padding: role === "Permanent" || team === "Rezeption" || isKaptainToolsVisible ? '20px' : '50px' }}>{t("planing")}</div>
                    </a>
                    </div>
                    
                {role !== "Management" && role !== "Permanent" && team !== "Rezeption" && team != "Lagerleitung" && (
          <>
            <h2 style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}>
            {t("captainTools")}
              <Switch
                checked={isKaptainToolsVisible}
                onChange={handleToggle}
                color="primary"
                inputProps={{ 'aria-label': 'Kaptain Tools Toggle' }}
              />
            </h2>
            {isKaptainToolsVisible && (
              <div className={`kaptainTools ${theme === 'Dark Mode' ? 'dark-mode' : ''}`}>
                {productivityLink && (
                <a href={productivityLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>{t("productivity")}</div>
                </a>
                )}
                {handoverLink && (
                <a href={handoverLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>{t("handover")}</div>
                </a>
                )}
                {itMaterialLink && (
                <a href={itMaterialLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>IT MATERIAL</div>
                </a>
                )}
                <a href={shiftingLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>{t("shifting")}</div>
                </a>
                {team === "Inbound" && (
                  <a href={skydecLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>SKYDEC</div>
                </a>
                )}
                {team === "Inbound" && (
                  <a href={tattooLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>TATTOO</div>
                </a>
                )}
                {team === "Outbound" && (
                  <a href={outboundPageLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>{t("homepage")}</div>
                </a>
                )}
                {team === "Outbound" && (
                  <a href={verladeplanLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>{t("loadingPlan")}</div>
                </a>
                )}
                {team === "Outbound" && (
                  <a href={transportplanLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>TRANSPORTPLAN</div>
                </a>
                )}
                {team === "Sorting" && (
                  <a href={sortingDashboardLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>DASHBOARD</div>
                </a>
                )}
                {team === "Sorting" && (
                  <a href={tattooLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>TATTOO</div>
                </a>
                )}
                {team === "Sorting" && (
                  <a href={verladeplanLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: isKaptainToolsVisible ? '20px' : '50px' }}>{t("loadingPlan")}</div>
                </a>
                )}
              </div>
            )}
          </>
        )}
        {role === "Permanent" && (
          <>
            <h2 style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}>
              Perm Tools
            </h2>
              <div className={`kaptainTools ${theme === 'Dark Mode' ? 'dark-mode' : ''}`}>
                <a href={permplanLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: '20px' }}>PERM PLAN</div>
                </a>
                <a href={permsheetLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: '20px' }}>PERM SHEET</div>
                </a>
                <a href={permsupportLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: '20px' }}>PERM SUPPORT</div>
                </a>
              </div>
          </>
        )}
        {team === "Rezeption" && (
          <>
            <h2 style={theme === 'Dark Mode' ? { color: '#ffffff' } : {}}>
            {t("receptionTools")}
            </h2>
              <div className={`kaptainTools ${theme === 'Dark Mode' ? 'dark-mode' : ''}`}>
                <a href="https://sites.google.com/decathlon.com/rezeption-dortmund" target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: '20px' }}>{t("homepage")}</div>
                </a>
                <a href={verladeplanLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: '20px' }}>{t("loadingPlan")}</div>
                </a>
                <a href={permplanLink} target="_blank" rel="noopener noreferrer">
                  <div className="grid-item" style={{ padding: '20px' }}>PERM PLAN</div>
                </a>
              </div>
          </>
        )}
        <div className="categories">
                    <div className={`category ${theme === 'Dark Mode' ? 'dark-mode' : ''}`}>
                        <h2 style={theme === 'Dark Mode' ? { color:'#fff' } : {}}>{t("security")}</h2>
                        <Link to="/choose-language">
                        <div className="grid-item">{t("safetyOperatingTest")}{" "}
                        {isLoading ? (
                          // Lade-Kreis anzeigen, solange `isLoading` true ist
                          <CircularProgress
                            size={15} // Größe des Kreises (15px passend zum Icon)
                            thickness={10} // Dicke des Kreises
                            style={{
                              verticalAlign: "middle", // Zentrierung
                              color: "#7AFFA6", // Farbe des Kreises
                            }}
                          />
                        ) : emailExists ? (
                          // Grünen Haken anzeigen, wenn die E-Mail gefunden wurde
                          <img
                            src="/akzeptieren.png"
                            alt="Grüner Haken"
                            style={{ width: "15px", height: "15px", verticalAlign: "middle" }}
                          />
                        ) : null}
                        </div>
                        </Link>
                        
                    </div>
                    <div className={`category ${theme === 'Dark Mode' ? 'dark-mode' : ''}`}>
                        <h2 style={theme === 'Dark Mode' ? { color:'#fff' } : {}}>{t("discounts")}</h2>
                        <a href="https://decathlon.mitarbeiterangebote.de/" target="_blank" rel="noopener noreferrer">
                        <div className="grid-item">{t("employeeBenefits")}</div>
                        </a>
                    </div>
                </div>
                
            </div>
            
        </div>
        {/* <QuarterCircleMenu /> */}
        {role === "Permanent" && isLargeScreen && (
        <SpeedDial
          ariaLabel="SpeedDial Dashboard"
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            '& .MuiFab-primary': {
      backgroundColor: theme === 'Dark Mode' ? '#1e1e2f' : '#3643ba', // Hauptfarbe des Buttons
      color: '#fff', // Icon-Farbe im Button
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        backgroundColor: '#7affa6', // Hover-Farbe
        color: '#000',
        boxShadow: theme === 'Dark Mode' ? '0 0 10px #007bff' : '0 0 15px rgba(0, 255, 90, 0.5)',
      },
    },
          }}
          icon={<MoreVertIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              sx={{
                backgroundColor: theme === 'Dark Mode' ? '#1e1e2f' : '#3643ba', // Hintergrundfarbe der Aktionen
                color: '#fff', // Icon-Farbe
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#7affa6', // Hover-Farbe der Aktionen
                  color: '#000', // Icon-Farbe im Hover-Zustand
                  boxShadow: theme === 'Dark Mode' ? '0 0 10px #007bff' : '0 0 15px rgba(0, 255, 90, 0.5)',
                },
              }}
              onClick={() => window.open(action.link, '_blank')}
            />
          ))}
        </SpeedDial>
         )}
         {(team === "Outbound"  || role === "Management" || team === "Lagerleitung") && isLargeScreen &&(
  <Tooltip title="BELADUNGSÜBERSICHT" arrow>
    <Fab
      color="primary"
      aria-label="open-outbound-tool"
      sx={{
        position: 'fixed',
        bottom: 30, // ein Stück über dem SpeedDial
        right: 30,
        backgroundColor: theme === 'Dark Mode' ? '#1e1e2f' : '#3643ba',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#7affa6',
          color: '#000',
          boxShadow: theme === 'Dark Mode'
            ? '0 0 10px #007bff'
            : '0 0 15px rgba(0, 255, 90, 0.5)',
        },
      }}
      onClick={() => {
        window.open(loadingOverviewLink, '_blank');
      }}
    >
      <LocalShippingIcon />
    </Fab>
  </Tooltip>
)}
        </div>
  )
}
