import { useState } from "react";
import "./ClubSelection.css";

const CLUBS = [
  { id: 1, name: "Real Madrid", logo: "/logos/real-madrid.png" },
  { id: 2, name: "FC Barcelona", logo: "/logos/barcelona.png" },
  { id: 3, name: "Manchester United", logo: "/logos/manutd.png" },
  { id: 4, name: "Liverpool", logo: "/logos/liverpool.png" },
  { id: 5, name: "Bayern Munich", logo: "/logos/bayern.png" },
  { id: 6, name: "AC Milan", logo: "/logos/ac-milan.png" },
  { id: 7, name: "Juventus", logo: "/logos/juventus.png" },
  { id: 8, name: "Inter Milan", logo: "/logos/inter.png" },
  { id: 9, name: "Chelsea", logo: "/logos/chelsea.png" },
  { id: 10, name: "Arsenal", logo: "/logos/arsenal.png" },
  { id: 11, name: "Manchester City", logo: "/logos/man-city.png" },
  { id: 12, name: "Paris Saint-Germain", logo: "/logos/psg.png" },
  { id: 13, name: "Borussia Dortmund", logo: "/logos/dortmund.png" },
  { id: 14, name: "Atlético Madrid", logo: "/logos/atletico.png" },
  { id: 15, name: "Tottenham Hotspur", logo: "/logos/spurs.png" },
  { id: 16, name: "Ajax", logo: "/logos/ajax.png" },
  { id: 17, name: "Benfica", logo: "/logos/benfica.png" },
  { id: 18, name: "FC Porto", logo: "/logos/porto.png" },
  { id: 19, name: "AS Roma", logo: "/logos/roma.png" },
  { id: 20, name: "Napoli", logo: "/logos/napoli.png" },
];

function ClubSelection({ totalPlayers = 2, onBack, onComplete }) {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedClubs, setSelectedClubs] = useState({});
  const [currentSelection, setCurrentSelection] = useState(null);

  const handleClubSelect = (clubId) => {
    // Check if club is already taken by another player
    const isClubTaken = Object.values(selectedClubs).includes(clubId);
    if (isClubTaken) return;

    setCurrentSelection(clubId);
  };

  const handleNext = () => {
    if (currentSelection) {
      const newSelectedClubs = {
        ...selectedClubs,
        [currentPlayer]: currentSelection,
      };
      setSelectedClubs(newSelectedClubs);

      if (currentPlayer < totalPlayers) {
        setCurrentPlayer(currentPlayer + 1);
        setCurrentSelection(null);
      } else {
        // All players have selected their clubs
        onComplete?.(newSelectedClubs);
      }
    }
  };

  const handleBack = () => {
    if (currentPlayer > 1) {
      const newSelectedClubs = { ...selectedClubs };
      delete newSelectedClubs[currentPlayer - 1];
      setSelectedClubs(newSelectedClubs);
      setCurrentPlayer(currentPlayer - 1);
      setCurrentSelection(selectedClubs[currentPlayer - 1] || null);
    } else {
      onBack?.();
    }
  };

  const isClubTaken = (clubId) => {
    return Object.entries(selectedClubs).some(
      ([player, club]) => club === clubId && parseInt(player) !== currentPlayer
    );
  };

  const getTakenByPlayer = (clubId) => {
    const entry = Object.entries(selectedClubs).find(
      ([player, club]) => club === clubId && parseInt(player) !== currentPlayer
    );
    return entry ? parseInt(entry[0]) : null;
  };

  const progressPercentage = ((currentPlayer - 1) / totalPlayers) * 100;

  return (
    <div className="club-selection">
      <div className="page-header">
        <h1 className="page-title">Choose Your Club</h1>
        <p className="page-subtitle">
          Each player must select their favorite football club
        </p>
        <p className="current-player">
          Player {currentPlayer} - Make Your Choice
        </p>
      </div>

      <div className="progress-indicator">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span>
          {currentPlayer - 1} of {totalPlayers} players completed
        </span>
      </div>

      <div className="clubs-grid">
        {CLUBS.map((club) => {
          const isTaken = isClubTaken(club.id);
          const isSelected = currentSelection === club.id;
          const takenByPlayer = getTakenByPlayer(club.id);

          return (
            <div
              key={club.id}
              className={`club-option ${isSelected ? "selected" : ""} ${
                isTaken ? "disabled" : ""
              }`}
              onClick={() => handleClubSelect(club.id)}
            >
              <div className="club-logo">
                <img src={club.logo} alt={club.name} />
              </div>

              <div className="club-name">{club.name}</div>
              {isTaken && (
                <div className="taken-badge">Player {takenByPlayer}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="controls">
        <button className="back-btn" onClick={handleBack}>
          {currentPlayer === 1 ? "Back to Home" : "Previous Player"}
        </button>

        <button
          className="next-btn"
          onClick={handleNext}
          disabled={!currentSelection}
        >
          {currentPlayer === totalPlayers ? "Start Game" : "Next Player"}
        </button>
      </div>
    </div>
  );
}

export default ClubSelection;
