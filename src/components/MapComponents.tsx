import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const containerStyle = {
  width: '100%',
  height: '400px'
};

interface Location {
  lat: number;
  lng: number;
  name: string;
  description: string;
}

interface MapComponentProps {
  locations: Location[];
}

const MapComponent: React.FC<MapComponentProps> = ({ locations }) => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

 

//   useEffect(() => {
//     map.locate();
//   }, [map]);
  
  const MyLocationMarker = () => {

    const map = useMap();

    map.on('locationfound', (e) => {
      setCurrentPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
    console.log("marker render")

    return currentPosition === null ? null : (
      <Marker position={currentPosition}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude)
        setCurrentPosition(new L.LatLng(latitude, longitude));
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <MapContainer style={containerStyle} center={currentPosition ? [currentPosition.lat, currentPosition.lng] : [12.911086200957206,77.5645624121842]} zoom={20}>
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
          {selectedLocation && selectedLocation.lat === location.lat && selectedLocation.lng === location.lng && (
            <Popup>
              <div>
                <h2>{location.name}</h2>
                <p>{location.description}</p>
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;