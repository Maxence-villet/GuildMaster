import React from 'react';

interface Guide {
  id: number;
  title: string;
  author_id: number;
  text: string;
  created_at: string;
}

interface ListTableProps {
  guides: Guide[];
  error?: string | null;
  loading?: boolean;
  onGuideClick: (id: number) => void;
}

export default function ListTable({ guides, error, loading, onGuideClick }: ListTableProps) {
  if (loading) {
    return <div className="text-black p-6 rounded-lg shadow">Loading...</div>;
  }

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
          onClick={() => onGuideClick(guide.id)}
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