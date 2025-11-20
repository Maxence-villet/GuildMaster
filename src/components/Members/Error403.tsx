import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faList } from '@fortawesome/free-solid-svg-icons'; 
import { Link } from 'react-router-dom';

export default function Error403() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <FontAwesomeIcon 
        icon={faBan} 
        className="text-9xl text-red-600 mb-8"
      />
      <h1 className="text-5xl font-extrabold text-gray-900">403 Accès Refusé</h1>
      <p className="text-xl text-gray-700 mt-4 text-center">
        Tentative d'accès non autorisé. Vous n'avez **pas la permission** de voir cette page.
      </p>
      <p className="text-md text-gray-500 mt-2 text-center">
        Cette ressource est réservée à un rôle d'utilisateur spécifique.
      </p>

      <div className="flex space-x-4 mt-6">
        
        <Link 
          to="/guide/list"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center"
        >
          <FontAwesomeIcon icon={faList} className="mr-2" />
          Liste des Guides
        </Link>

        <Link 
          to="/" 
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
          Retourner à l'Accueil
        </Link>
      </div>
    </div>
  );
};