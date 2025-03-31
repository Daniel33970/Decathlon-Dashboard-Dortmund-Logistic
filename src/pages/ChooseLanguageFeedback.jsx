import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { SettingsContext } from '../context/SettingsContext';
import { CircularProgress } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';

export const ChooseLanguageFeedback = () => {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const { theme } = useContext(SettingsContext); // Theme aus dem Kontext holen
    const navigate = useNavigate(); // Korrekte Verwendung von useNavigate


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
    <div className='chooseLanguageFeedback'>
        <div className="chooseLanguageFeedbackContainer">
        <h2>{t("chooseLanguage")}</h2>
        <div className="languageContainer">
          {/* Deutsch-Flagge */}
          <a 
            href='https://docs.google.com/forms/d/e/1FAIpQLSffk9g542NRkzos8v_RiPvZI4EhhjN6ZhHCOunduJ5GEesUHA/viewform?usp=sf_link' 
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
            href='https://docs.google.com/forms/d/e/1FAIpQLSeU1WeJU4tLGemWrEmQMaHTrMSFZDPjwQS7ytJlgcrkodc-gA/viewform?usp=sf_link'
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
  )
}
