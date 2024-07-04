import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '@/components/MapComponents';
import GridPage from '@/components/GridPage';
import Navbar from '@/components/Navbar';
import Hero from './components/Hero';

interface Location {
  lat: number;
  lng: number;
  name: string;
  free: number;
  description: string;
  floors: { [floor: string]: boolean[] };
}

const fetchLocationsWithGridData = async (): Promise<Location[]> => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/parking_status');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};

const App: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLocationsWithGridData();
        setLocations(data);
        localStorage.setItem('locations', JSON.stringify(data)); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/map" element={<MapComponent locations={locations} setSelectedLocation={setSelectedLocation} />} />
          <Route path="/grid" element={<GridPage selectedLocation={selectedLocation} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;