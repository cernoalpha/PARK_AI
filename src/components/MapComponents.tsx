import React, { useEffect, useState } from 'react';
import L, { LatLng } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

const windowHeight = window.innerHeight;
const height = 0.8* windowHeight
const containerStyle = {
  width: '95%',
  height: height,
};

interface Location {
  lat: number;
  lng: number;
  name: string;
  free: number;
  description: string;
  floors: { [floor: string]: boolean[] };
}

interface MapComponentProps {
  locations: Location[];
  setSelectedLocation: (location: Location) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ locations, setSelectedLocation }) => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const navigate = useNavigate();

  const MyLocationMarker = () => {
    const map = useMap();

    map.on('locationfound', (e) => {
      setCurrentPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });

    // useEffect(() => {
    //   map.locate();
    // }, [map]);

    const myLocationIcon = L.icon({
      iconUrl: '/public/map-pin.png',
      iconSize: [35, 35],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    return currentPosition === null ? null : (
      <Marker position={currentPosition} icon={myLocationIcon}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

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

  return (
    <div className='container mt-32 mb-auto flex justify-center align-items-center'>
      <MapContainer style={containerStyle} center={currentPosition ? [currentPosition.lat, currentPosition.lng] : [12.911086200957206, 77.5645624121842]} zoom={20}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MyLocationMarker />
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            eventHandlers={{
              click: () => {
                setSelectedLocation(location);
              },
            }}
          >
            <Popup>
              <div>
                <h2>{location.name}</h2>
                <p>{location.description}</p>
                <button onClick={() => {
                  setSelectedLocation(location);
                  navigate('/grid');
                }}>Show Parking</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;