import { useState } from 'react';
import HomePage from './components/HomePage/HomePage';
import ClubSelection from './components/ClubSelection/ClubSelection';
import AuctionPage from './components/AuctionPage/AuctionPage';
import { PlayerProvider } from './contexts/PlayerContext';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [gameSettings, setGameSettings] = useState({
    playerCount: 2
  });

  const handleStartGame = (playerCount) => {
    setGameSettings({ playerCount });
    setCurrentScreen('clubSelection');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleClubSelectionComplete = (selectedClubs) => {
    console.log('All clubs selected:', selectedClubs);
    setCurrentScreen('auction');
  };

  return (
    <PlayerProvider>
      <div className="App">
        {currentScreen === 'home' && (
          <HomePage onStartGame={handleStartGame} />
        )}
        {currentScreen === 'clubSelection' && (
          <ClubSelection
            totalPlayers={gameSettings.playerCount}
            onBack={handleBackToHome}
            onComplete={handleClubSelectionComplete}
          />
        )}
        {currentScreen === 'auction' && (
          <AuctionPage onBack={handleBackToHome} />
        )}
      </div>
    </PlayerProvider>
  );
}

export default App;