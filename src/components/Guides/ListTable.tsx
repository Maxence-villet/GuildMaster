import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Guide {
  id: number;
  title: string;
  author: string;
  date: string;
}



export default function ListTable () {
  const guides = [
    { id: 1, text: "Tips : Become 6th to 1st with bank system", date: "13/07/2025" },
    { id: 2, text: "Lorem Ipsum", date: "13/07/2025" },
    { id: 3, text: "Lorem Ipsum", date: "13/07/2025" },
    { id: 4, text: "Lorem Ipsum", date: "13/07/2025" },
  ];

  const navigate = useNavigate();

  function handleClick() {
    navigate("/guide/view");
  }


  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {guides.map((guide) => (
        <button className=" w-full items-center p-2 bg-white p-6 border rounded-lg py-5 mb-2 rounded" onClick={handleClick}>
        <div key={guide.id} className='flex justify-between'>
          <span>{guide.text}</span>
          <span className="text-gray-600">{guide.date}</span>
        </div>
        </button>
      ))}
    </div>
  );
};
