import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <FontAwesomeIcon 
        icon={faExclamationTriangle} 
        className="text-9xl text-red-500 mb-8"
      />
      <h1 className="text-4xl font-bold text-gray-800">404 Not Found</h1>
      <p className="text-lg text-gray-600 mt-4">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
};
