import React from 'react';

interface Member {
  id: number,
  name: string,
  code: string
}



export default function AddMember() {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow flex flex-col gap-2">
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          placeholder="Name..."
          className="flex-1 p-2 border rounded bg-white text-black"
        />
        <button className="ml-auto w-[150] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Member
        </button>
      </div>
    </div>
  );
};
