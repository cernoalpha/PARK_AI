import React from 'react';

interface ParkingGridProps {
  spaces: boolean[]; 
  rows: number;
  cols: number;
}

const ParkingGrid: React.FC<ParkingGridProps> = ({ spaces, rows, cols }) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '5px',
  };

  return (
    <div style={gridStyle}>
      {spaces.map((isFree, index) => (
        <div
          key={index}
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: isFree ? 'green' : 'red',
          }}
        />
      ))}
    </div>
  );
};

export default ParkingGrid;