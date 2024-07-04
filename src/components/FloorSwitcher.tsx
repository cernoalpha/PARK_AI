import React from 'react';

interface FloorSwitcherProps {
  floors: string[];
  currentFloor: string;
  onFloorChange: (floor: string) => void;
}

const FloorSwitcher: React.FC<FloorSwitcherProps> = ({ floors, currentFloor, onFloorChange }) => {
  return (
    <div>
      <select value={currentFloor} onChange={(e) => onFloorChange(e.target.value)}>
        {floors.map((floor) => (
          <option key={floor} value={floor}>
            Floor {floor}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FloorSwitcher;