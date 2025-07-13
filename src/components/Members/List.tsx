import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Member {
    id: number,
    name: string,
    code: string
}

interface Members {
    members: Member[]
}

export default function ListMembers(){
  const items = ['Ma', 'SamuelPuppet', 'HyJinkz', 'Lorem Ipsum', 'Lorem Ipsum'];

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded shadow"
        >
          <span className="text-black">{item}</span>
          <div className="flex space-x-2"> 
            {/* copy code */}
            <button className="text-blue-600 hover:text-gray-700">
              <FontAwesomeIcon icon={faCopy} />
            </button>
            {/* delete member */}
            <button className="text-red-500 hover:text-red-700">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
