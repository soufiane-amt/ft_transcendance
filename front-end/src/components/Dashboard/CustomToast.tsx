// components/CustomToast.tsx

import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import ToastCss from './module/CustomToast.module.css';

interface CustomToastProps {
  id: number;
  obj: {
    id_notif: any;
    id: any;
    user2Username: any;
    user2Avatar: any;
    type: string;
  };
  onClose: (id: number) => void;
}

const CustomToast: React.FC<CustomToastProps> = ({ id, obj, onClose }) => {
  const containerClassName = `max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${
    id ? 'animate-enter' : 'animate-leave'
  }`;

  return (
    <div className={containerClassName}>
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img
              className="h-10 w-10 rounded-full"
              src={obj.user2Avatar}
              alt=""
              id={ToastCss.img}
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {obj.user2Username}
            </p>
            {obj.type === "ACCEPTED_INVITATION" && (
                <p className="mt-1 text-sm text-gray-500">
                send Friend Notification
                </p>
            )}
            {obj.type === "IN_GAME" && (
                <p className="mt-1 text-sm text-gray-500">
                send Friend Notification
                </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => onClose(id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          id={ToastCss.button}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
