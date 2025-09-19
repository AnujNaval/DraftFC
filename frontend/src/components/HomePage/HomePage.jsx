import { useState } from 'react';
import './HomePage.css';

function HomePage() {
  const [playerCount, setPlayerCount] = useState(2);
  
  const incrementPlayers = () => {
    if (playerCount < 22) {
      setPlayerCount(prev => prev + 1);
    }
  };
  
  const decrementPlayers = () => {
    if (playerCount > 1) {
      setPlayerCount(prev => prev - 1);
    }
  };
  
  const startGame = () => {
    console.log(`Starting game with ${playerCount} players`);
    // TODO: Add navigation to game screen
  };

  return (
    <div className="homepage">
      <h1 className="logo">DraftFC</h1>
      <p className="subtitle">Build Your Ultimate Football Team</p>
      
      <div className="game-setup">
        <div className="player-selection">
          <label>Select Number of Players</label>
          <div className="player-count-container">
            <button 
              className="count-btn"
              onClick={decrementPlayers}
              disabled={playerCount <= 1}
              aria-label="Decrease player count"
            >
              −
            </button>
            <span className="player-count">{playerCount}</span>
            <button 
              className="count-btn"
              onClick={incrementPlayers}
              disabled={playerCount >= 22}
              aria-label="Increase player count"
            >
              +
            </button>
          </div>
        </div>
        
        <button className="start-btn" onClick={startGame}>
          Start Draft
        </button>
      </div>
    </div>
  );
}

export default HomePage;