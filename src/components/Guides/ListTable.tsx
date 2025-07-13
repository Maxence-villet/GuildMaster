import React from 'react';

export default function ListTable () {
  const tasks = [
    { id: 1, text: "Tips : Become 6th to 1st with bank system", date: "07/12/2025" },
    { id: 2, text: "Lorem Ipsum", date: "07/12/2025" },
    { id: 3, text: "Lorem Ipsum", date: "07/12/2025" },
    { id: 4, text: "Lorem Ipsum", date: "07/12/2025" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {tasks.map((task) => (
        <button className=" w-full items-center p-2 bg-white p-6 border rounded-lg py-5 mb-2 rounded">
        <div key={task.id} className='flex justify-between'>
          <span>{task.text}</span>
          <span className="text-gray-600">{task.date}</span>
        </div>
        </button>
      ))}
    </div>
  );
};
