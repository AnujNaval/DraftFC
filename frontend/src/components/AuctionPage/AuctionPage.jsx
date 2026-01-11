import { useState } from 'react';
import './AuctionPage.css';

const POSITIONS = [
  { id: 1, name: 'GK', fullName: 'Goalkeeper', color: '#FFD700' },
  { id: 2, name: 'CB', fullName: 'Centre Back', color: '#4CAF50' },
  { id: 3, name: 'RB', fullName: 'Right Back', color: '#2196F3' },
  { id: 4, name: 'LB', fullName: 'Left Back', color: '#9C27B0' },
  { id: 5, name: 'CM', fullName: 'Central Midfielder', color: '#FF9800' },
  { id: 6, name: 'CAM', fullName: 'Attacking Midfielder', color: '#F44336' },
  { id: 7, name: 'LW', fullName: 'Left Winger', color: '#00BCD4' },
  { id: 8, name: 'RW', fullName: 'Right Winger', color: '#E91E63' },
  { id: 9, name: 'ST', fullName: 'Striker', color: '#FF5722' },
];

function AuctionPage({ onBack }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);

  // 1. Generate the Conic Gradient String for the wheel background
  const segmentAngle = 360 / POSITIONS.length;
  const gradientString = `conic-gradient(
    ${POSITIONS.map((pos, index) => 
      `${pos.color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`
    ).join(', ')}
  )`;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setCurrentPlayer(null); 
    setSelectedPosition(null); 
    
    const randomIndex = Math.floor(Math.random() * POSITIONS.length);
    const selectedPos = POSITIONS[randomIndex];
    
    // Calculate angle to center of the selected segment
    const segmentCenterAngle = (randomIndex * segmentAngle) + (segmentAngle / 2);
    
    // Calculate rotation needed to bring that center to 0 degrees (top)
    const extraRotations = 5; 
    const finalRotation = (360 * extraRotations) + (360 - segmentCenterAngle);
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setSelectedPosition(selectedPos);
      setIsSpinning(false);
    }, 4000);
  };

  const selectRandomPlayer = async () => {
    if (!selectedPosition || isLoadingPlayer) return;

    setIsLoadingPlayer(true);

    try {
      // Dynamic import based on position name
      const positionFile = await import(`../../players/${selectedPosition.name.toLowerCase()}.json`);
      const players = positionFile.default;
      
      // Select random player
      let randomIndex = Math.floor(Math.random() * players.length);
      let newPlayer = players[randomIndex];

      // Optional: Prevent selecting the exact same player immediately again
      if (currentPlayer && players.length > 1) {
        while (newPlayer.name === currentPlayer.name) {
          randomIndex = Math.floor(Math.random() * players.length);
          newPlayer = players[randomIndex];
        }
      }

      setCurrentPlayer(newPlayer);
    } catch (error) {
      console.error('Error loading player data:', error);
      alert(`No players found for position ${selectedPosition.name}`);
    } finally {
      setIsLoadingPlayer(false);
    }
  };

  const resetWheel = () => {
    setRotation(0);
    setSelectedPosition(null);
    setCurrentPlayer(null);
  };

  return (
    <div className="auction-page">
      <div className="auction-header">
        <h1 className="auction-title">Player Auction</h1>
        <p className="auction-subtitle">Spin the wheel to select a position</p>
      </div>

      <div className="auction-container">
        {/* Left Side - Picker Wheel */}
        <div className="wheel-section">
          <div className="wheel-container">
            <div className="wheel-pointer">▼</div>
            <div 
              className="wheel"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                background: gradientString 
              }}
            >
              {POSITIONS.map((position, index) => {
                const textRotation = (segmentAngle * index) + (segmentAngle / 2);
                
                return (
                  <div
                    key={position.id}
                    className="wheel-segment"
                    style={{
                      transform: `rotate(${textRotation}deg)`,
                    }}
                  >
                    <div className="segment-content">
                      <span className="segment-name">{position.name}</span>
                      <span className="segment-full-name">{position.fullName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="wheel-controls">
            <button 
              className="spin-btn"
              onClick={spinWheel}
              disabled={isSpinning}
            >
              {isSpinning ? 'Spinning...' : 'Spin Wheel'}
            </button>
            {selectedPosition && !isSpinning && (
              <button className="reset-btn" onClick={resetWheel}>Reset</button>
            )}
          </div>

          {selectedPosition && !isSpinning && (
            <div className="selected-position">
              <h3>Selected Position</h3>
              <div className="position-badge" style={{ backgroundColor: selectedPosition.color }}>
                {selectedPosition.fullName} ({selectedPosition.name})
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Player Card */}
        <div className="player-section">
          {currentPlayer ? (
            <div className="player-card-container">
              <h2 className="player-section-title">Player on Auction</h2>
              <div className="player-card-display">
                <div className="fifa-card-image">
                  <img 
                    src={currentPlayer.imagePath} 
                    alt={currentPlayer.name}
                    onError={(e) => { e.target.src = '/placeholder-card.png'; }}
                  />
                </div>
                <div className="player-info-simple">
                  <h3 className="player-name-large">{currentPlayer.name}</h3>
                  <div className="base-price-large">
                    <span className="price-label">Base Price</span>
                    <span className="price-value">${currentPlayer.basePrice}M</span>
                  </div>
                </div>
              </div>
              
              <div className="auction-actions">
                <button className="start-bidding-btn">
                  Start Bidding
                </button>
                <button 
                  className="change-player-btn"
                  onClick={selectRandomPlayer}
                  disabled={isLoadingPlayer}
                >
                  {isLoadingPlayer ? '...' : 'Change Player'}
                </button>
              </div>

            </div>
          ) : selectedPosition && !isSpinning ? (
            <div className="select-player-state">
              <div className="select-icon">🎲</div>
              <p className="select-text">Position selected: <strong>{selectedPosition.fullName}</strong></p>
              <button 
                className="select-player-btn"
                onClick={selectRandomPlayer}
                disabled={isLoadingPlayer}
              >
                {isLoadingPlayer ? 'Loading Player...' : 'Select Random Player'}
              </button>
            </div>
          ) : (
            <div className="waiting-state">
              <div className="waiting-icon">⚽</div>
              <p>Spin the wheel to select a position</p>
            </div>
          )}
        </div>
      </div>

      <div className="auction-footer">
        <button className="back-to-home-btn" onClick={onBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AuctionPage;