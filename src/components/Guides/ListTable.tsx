import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Guide {
  id: number;
  title: string;
  author_id: number;
  text: string;
  created_at: string;
}

export default function ListTable() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get<Guide[]>('http://localhost:3001/api/guide/list'); // Use axios.get
        setGuides(response.data); // Axios puts the response data in .data
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || "Failed to fetch guides.");
        } else {
          setError("An unexpected error occurred while fetching guides.");
        }
        console.error("Error fetching guides:", err);
      }
    };

    fetchGuides();
  }, []);

  const handleGuideClick = (id: number) => {
    navigate(`/guide/view/${id}`);
  };

  if (error) {
    return <div className="text-red-500 p-6 rounded-lg shadow">{error}</div>;
  }

  if (guides.length === 0) {
    return <div className="text-black p-6 rounded-lg shadow">No guides found.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {guides.map((guide) => (
        <button
          key={guide.id}
          className="w-full items-center p-2 bg-white p-6 border rounded-lg py-5 mb-2 rounded"
          onClick={() => handleGuideClick(guide.id)}
        >
          <div className='flex justify-between'>
            <span>{guide.title}</span>
            <span className="text-gray-600">{new Date(guide.created_at).toLocaleDateString()}</span>
          </div>
        </button>
      ))}
    </div>
  );
}