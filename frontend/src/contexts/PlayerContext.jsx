import { createContext, useContext, useState } from 'react';

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
export function PlayerProvider({ children }) {
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

export default PlayerContext;