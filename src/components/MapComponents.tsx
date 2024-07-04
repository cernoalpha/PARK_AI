import React, { useEffect, useRef, useState } from "react";
import L, { LatLng } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { filterParkingSpaces } from "@/hooks/ParkingSpaceFilter"
import { geocodeLocation } from '@/hooks/geocode'
import Loading from "./Loading";

const containerStyle = {
  width: "95%",
  height: "550px",
  zIndex: 1 // or any other appropriate value
};

interface Location {
  lat: number;
  lng: number;
  name: string;
  description: string;
  floors: { [floor: string]: boolean[] };
}

interface MapComponentProps {
  locations: Location[];
  setSelectedLocation: (location: Location) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  locations,
  setSelectedLocation,
}) => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);
  const [searchLocation, setSearchLocation] = useState<LatLng | null>(null);
  const [radius, setRadius] = useState<number>(5); // Example radius in kilometers
  const navigate = useNavigate();
  const mapRef = useRef<L.Map>(null);

  const MyLocationMarker = () => {
    const map = useMap();

    map.on("locationfound", (e) => {
      setCurrentPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });

    // useEffect(() => {
    //   map.locate();
    // }, [map]);

    const myLocationIcon = L.icon({
      iconUrl: "/public/map-pin.png",
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition(new L.LatLng(latitude, longitude));
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // handle input
  const [searchText, setSearchText] = useState<string>(""); 
  const [textLoading, setTextLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (searchText) {
      const geocodedLocation = await geocodeLocation(searchText);
      if (geocodedLocation) {
        const { lat, lng } = geocodedLocation;
        const filtered = filterParkingSpaces(
          locations,
          { lat, lng },
          10 // Adjust the radius as needed (in kilometers)
        );
        setTextLoading(false)
        setFilteredLocations(filtered);
        if (filtered.length > 0 && mapRef.current) {
          const firstMatch = filtered[0];
          const latLng = new L.LatLng(firstMatch.lat, firstMatch.lng);
          mapRef.current.flyTo(latLng, 17); // Adjust zoom level as needed
        }
      } else {
        setTextLoading(false)
        alert("Place not found. Please enter a valid location name.");
      }
    } else {
      setTextLoading(false)
      setFilteredLocations(locations);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setTextLoading(true)
      handleSearch();
    }
  };
  
  return (
    <> 
      <div className="container">
      <div className="mt-20 flex justify-between container">
          {textLoading ? (
            <div>Loading...</div>
          ) : (
            <Input
              className=""
              placeholder="search here.."
              value={searchText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          )}
          <Button
            className=""
            onClick={() => {
              if (mapRef.current && currentPosition) {
                mapRef.current.flyTo(currentPosition, 17); 
              }
            }}
          >
            My location
          </Button>
        </div>
        <div className=" mt-5 mb-auto flex justify-center align-items-center">
          <MapContainer
            style={containerStyle}
            center={
              currentPosition
                ? [currentPosition.lat, currentPosition.lng]
                : [12.911086200957206, 77.5645624121842]
            }
            zoom={20}
            ref={mapRef}
          >
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
                    navigate("/grid");
                  },
                }}
              >
                <Popup>
                  <div>
                    <h2>{location.name}</h2>
                    <p>{location.description}</p>
                    <button
                      onClick={() => {
                        setSelectedLocation(location);
                        navigate("/grid");
                      }}
                    >
                      Show Parking
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default MapComponent;
