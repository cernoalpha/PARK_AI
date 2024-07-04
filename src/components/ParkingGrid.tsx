import React from 'react';

interface ParkingGridProps {
  spaces: boolean[]; // Boolean array indicating free or occupied spaces
}

const ParkingGrid: React.FC<ParkingGridProps> = ({ spaces }) => {
  const cols = 6; // Fixing columns to 6
  // const rows = Math.ceil(spaces.length / cols);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '10px', // Increased gap for clearer separation
    padding: '10px',
    justifyItems: 'center', // Centering items
  };

  const spaceStyle = {
    width: '40px', // Adjust size for a better parking space look
    height: '80px',
    border: '2px solid #000', // Outline to simulate parking space lines
    backgroundColor: 'white', // Background for the space
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '2px 2px 6px rgba(0,0,0,0.2)', // Shadow for depth effect
    borderRadius: '5px', // Rounded corners
  };

  const occupiedStyle = {
    ...spaceStyle,
    backgroundColor: 'red', // Occupied space color
  };

  const freeStyle = {
    ...spaceStyle,
    backgroundColor: 'green', // Free space color
  };

  return (
    <div style={gridStyle}>
      {spaces.map((isFree, index) => (
        <div key={index} style={isFree ? freeStyle : occupiedStyle}>
         
        </div>
      ))}
    </div>
  );
};

export default ParkingGrid;
