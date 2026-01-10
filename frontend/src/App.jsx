import { useState, createContext, useContext } from 'react';
import HomePage from './components/HomePage/HomePage';
import ClubSelection from './components/ClubSelection/ClubSelection';
import './App.css';

// Create a context for global player data
const PlayerContext = createContext();

// Custom hook to access player data from anywhere
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within PlayerProvider');
  }
  return context;
};

// Player Provider Component
function PlayerProvider({ children }) {
  const [players, setPlayers] = useState({});
  
  const updatePlayer = (playerNumber, data) => {
    setPlayers(prev => ({
      ...prev,
      [playerNumber]: { ...prev[playerNumber], ...data }
    }));
  };
  
  const getPlayer = (playerNumber) => players[playerNumber] || {};
  
  const getAllPlayers = () => players;
  
  const resetPlayers = () => setPlayers({});
  
  return (
    <PlayerContext.Provider value={{ players, updatePlayer, getPlayer, getAllPlayers, resetPlayers }}>
      {children}
    </PlayerContext.Provider>
  );
}

// Export the context and hook for use in other components
export { PlayerContext, PlayerProvider };

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
    // TODO: Navigate to draft screen
    // setCurrentScreen('draft');
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
      </div>
    </PlayerProvider>
  );
}

export default App;