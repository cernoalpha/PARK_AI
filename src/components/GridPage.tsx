import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParkingGrid from './ParkingGrid';
import FloorSwitcher from './FloorSwitcher';
import 'leaflet/dist/leaflet.css';

interface Location {
  name: string;
  lat: number;
  lng: number;
  floors: { [floor: string]: boolean[] };
}

interface GridPageProps {
  selectedLocation: Location | null;
}

const containerStyle = {
  width: '100%',
  height: '700px',
};

const GridPage: React.FC<GridPageProps> = ({ selectedLocation }) => {
  const [currentFloor, setCurrentFloor] = useState<string>('1');
  const [parkingData, setParkingData] = useState<{ [floor: string]: boolean[] }>({});
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [path, setPath] = useState<[number, number][]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const storedLocations = localStorage.getItem('locations');
      if (storedLocations) {
        const locations: Location[] = JSON.parse(storedLocations);
        const updatedLocation = locations.find(loc => loc.name === selectedLocation?.name);
        if (updatedLocation) {
          setParkingData(updatedLocation.floors);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedLocation]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition(new L.LatLng(latitude, longitude));
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const getRoute = async () => {
      if (currentPosition && selectedLocation) {
        try {
          const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${currentPosition.lng},${currentPosition.lat};${selectedLocation.lng},${selectedLocation.lat}?geometries=geojson`
          );
          const route = response.data.routes[0];
          const coordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
          setPath(coordinates);
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      }
    };

    getRoute();
  }, [currentPosition, selectedLocation]);

  if (!selectedLocation) {
    return <div>Loading...</div>;
  }

  const { name, floors, lat, lng } = selectedLocation;

  const handleFloorChange = (floor: string) => {
    setCurrentFloor(floor);
  };

  return (
    <div>
      <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>
        Back to Map
      </button>
      <h1>{name}</h1>
      <FloorSwitcher
        floors={Object.keys(floors)}
        currentFloor={currentFloor}
        onFloorChange={handleFloorChange}
      />
      <MapContainer style={containerStyle} center={[lat, lng]} zoom={15}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]}>
          <Popup>{name}</Popup>
        </Marker>
        {currentPosition && (
          <Marker position={[currentPosition.lat, currentPosition.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {path.length > 0 && (
          <Polyline positions={path} color="blue" />
        )}
      </MapContainer>
      {parkingData[currentFloor] && (
        <ParkingGrid
          spaces={parkingData[currentFloor]}
          rows={10}
          cols={10}
        />
        
      )}
    </div>
  );
};

export default GridPage;