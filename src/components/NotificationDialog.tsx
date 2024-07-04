import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface Location {
    lat: number;
    lng: number;
    name: string;
    description: string;
    free: number;
    floors: Record<string, string>;
}

interface NotificationDialogProps {
    onClose: () => void;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ onClose }) => {
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const storedLocations = localStorage.getItem('locations');
        if (storedLocations) {
            setLocations(JSON.parse(storedLocations));
            console.log(locations)
        }
    }, []);

    return (
        <div className="fixed top-12 right-6 bg-white p-4 rounded-lg shadow-md border border-gray-200 z-50">
            <p className="text-gray-800 font-bold mb-2">Notification</p>
            {locations.length > 0 ? (
                <ul>
                    {locations.map((location, index) => (
                        <li key={index} className="mb-2">
                            <div className="text-gray-800">
                                <span className="font-semibold">{location.name}:</span> {location.free} free slots
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">No locations available.</p>
            )}
            <Button
                variant='outline'
                onClick={onClose}
            >
                Close
            </Button>
        </div>
    );
};

export default NotificationDialog;