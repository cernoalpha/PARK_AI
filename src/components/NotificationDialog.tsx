import React from 'react';
import { Button } from './ui/button';

interface NotificationDialogProps {
    onClose: () => void;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ onClose }) => {
    return (
        <div className="fixed top-12 right-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-800">This is your notification dialog content.</p>
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
