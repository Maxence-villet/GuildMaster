import React from 'react';
import { Toaster } from 'react-hot-toast';

interface AddGuideProps {
  title: string;
  text: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export default function AddGuide({ title, text, onTitleChange, onTextChange, onSubmit, loading }: AddGuideProps) {
  return (
    <div>
      <Toaster />
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="w-full flex flex-col mb-4 gap-5 items-center">
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full p-3 border border-gray-250 rounded-md"
            placeholder="title..."
            value={title}
            onChange={onTitleChange}
            disabled={loading}
          />
          <textarea
            name="text"
            id="text"
            className="block w-full p-3 border border-gray-250 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition h-48 duration-150 ease-in-out"
            placeholder="Text..."
            required
            value={text}
            onChange={onTextChange}
            disabled={loading}
          ></textarea>
          <button type="submit" className="w-[150px] bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}