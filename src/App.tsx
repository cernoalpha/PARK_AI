import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from '@/components/MapComponents';
import GridPage from '@/components/GridPage';
import Navbar from '@/components/Navbar';
import Hero from './components/Hero';

interface Location {
  lat: number;
  lng: number;
  name: string;
  description: string;
  floors: { [floor: string]: boolean[] };
}

const fetchLocationsWithGridData = async (): Promise<Location[]> => {
  const generateRandomBooleanArray = (length: number): boolean[] => {
    return Array(length).fill(true).map(() => Math.random() > 0.5);
  };

  const locations: Location[] = [
    {
      lat: 12.9132462,
      lng: 77.5635128,
      name: 'New York City',
      description: 'The big apple.',
      floors: {
        '1': generateRandomBooleanArray(6),
        '2': generateRandomBooleanArray(6),
      },
    },
    {
      lat: 12.9094733,
      lng: 77.5644549,
      name: 'Los Angeles',
      description: 'The city of angels.',
      floors: {
        '1': generateRandomBooleanArray(6),
        '2': generateRandomBooleanArray(6),
      },
    },
  ];

  locations.forEach(location => {
    Object.keys(location.floors).forEach(floor => {
      if (Math.random() > 0.8) { 
        location.floors[floor] = generateRandomBooleanArray(6);
      }
    });
  });

  return locations;
};

const App: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLocationsWithGridData();
      setLocations(data);
      localStorage.setItem('locations', JSON.stringify(data)); 
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <>      <Navbar />
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/map" element={<MapComponent locations={locations} setSelectedLocation={setSelectedLocation} />} />
        <Route path="/grid" element={<GridPage selectedLocation={selectedLocation}/>} />
      </Routes>
    </Router>
    </>
  );
};

export default App;