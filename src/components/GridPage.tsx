import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L, { LatLng } from "leaflet";
import axios from "axios";
import ParkingGrid from "./ParkingGrid";
import "leaflet/dist/leaflet.css";

import Loading from "./Loading";

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
  width: "100%",
  height: "500px",
};

const GridPage: React.FC<GridPageProps> = ({ selectedLocation }) => {
  const [currentFloor, setCurrentFloor] = useState<string>("1");
  const [parkingData, setParkingData] = useState<{
    [floor: string]: boolean[];
  }>({});
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [path, setPath] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8080/parking_frame', {
          responseType: 'arraybuffer'
        });
        const base64Image = btoa(
          new Uint8Array(response.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;
        setImageSrc(imageSrc);
      } catch (error) {
        console.error("Error fetching parking frame:", error);
      }

      try {
        const response = await axios.get('http://127.0.0.1:8080/parking_status');
        const locations: Location[] = response.data;
        console.log(locations)
        const updatedLocation = locations.find(
          (loc) => loc.name === selectedLocation?.name
        );
        if (updatedLocation) {
          setParkingData(updatedLocation.floors);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching parking status:", error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedLocation]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition(new L.LatLng(latitude, longitude));
      });
    } else {
      alert("Geolocation is not supported by this browser.");
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
          const coordinates = route.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );
          setPath(coordinates);
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      }
    };

    getRoute();
  }, [currentPosition, selectedLocation]);

  if (!selectedLocation) {
    return <div>Loading...</div>;
  }

  const { name, floors, lat, lng } = selectedLocation;

  return (
    <div className="container mt-20 ">
      <h1 className="text-2xl text-center">{name}</h1>
      <div className="mt-10 flex justify-around align-items-center">
        <div className="flex-1 mr-4">
          <MapContainer
            className="p-10"
            style={containerStyle}
            center={[lat, lng]}
            zoom={15}
          >
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
            {path.length > 0 && <Polyline positions={path} color="blue" />}
          </MapContainer>
        </div>
        <div className="flex-1">
          {loading ? (
            <Loading />
          ) : (
            parkingData[currentFloor] && (
              <>
                <ParkingGrid spaces={parkingData[currentFloor]} />
                <div className="flex justify-center align-items-center p-10">
                  {imageSrc && <img className='h-72' src={imageSrc} alt="Parking Frame" />}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default GridPage;