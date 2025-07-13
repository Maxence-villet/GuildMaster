import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface Guide {
  id: number;
  title: string;
  author_id: number;
  authorName: string;
  text: string;
  created_at: string;
}

export default function ViewGuide() {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3001/api/guide';

  useEffect(() => {
    const fetchGuide = async () => {
      if (!id) {
        setError("Guide ID is missing from URL.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get<Guide>(`${API_BASE_URL}/${id}`);
        setGuide(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || "Failed to fetch guide.");
        } else {
          setError("An unexpected error occurred while fetching the guide.");
        }
        console.error("Error fetching guide:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  if (loading) {
    return <div className="bg-white p-6 rounded-lg shadow text-black">Loading guide...</div>;
  }

  if (error) {
    return <div className="bg-white p-6 rounded-lg shadow text-red-500">Error: {error}</div>;
  }

  if (!guide) {
    return <div className="bg-white p-6 rounded-lg shadow text-black">Guide not found.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Toaster />
      <h1 className="text-2xl font-bold text-black mb-4">{guide.title}</h1>
      <p className="text-gray-600 text-sm mb-2">By {guide.authorName}</p>
      <p className="text-gray-600 text-sm mb-4">Posted on {new Date(guide.created_at).toLocaleString()}</p>
      <div className="text-black leading-relaxed overflow-y-auto h-64 whitespace-pre-wrap">
        {guide.text}
      </div>
    </div>
  );
}