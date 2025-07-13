import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function AddGuide() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  // In a real application, authorId would likely come from user authentication context
  const authorId = 1; 

  const API_URL = 'http://localhost:3001/api/guide/add';

  const handleAddGuide = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !text.trim()) {
      toast.error('Title and text cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(API_URL, { title, author_id: authorId, text });
      toast.success('Guide added successfully!');
      setTitle('');
      setText('');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Error: ${error.response.data.message || 'Something went wrong.'}`);
      } else {
        toast.error('An unexpected error occurred.');
      }
      console.error('Error adding guide:', error);
    }
  };

  return (
    <div>
      <Toaster />
      <form onSubmit={handleAddGuide} className="bg-white p-6 rounded-lg shadow">
        <div className="w-full flex flex-col mb-4 gap-5 items-center">
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full p-3 border border-gray-250 rounded-md"
            placeholder="title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            name="text"
            id="text"
            className="block w-full p-3 border border-gray-250 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition h-48 duration-150 ease-in-out"
            placeholder="Text..."
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button type="submit" className="w-[150px] bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">Add</button>
        </div>
      </form>
    </div>
  );
}