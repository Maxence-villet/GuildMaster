import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUsers, faGamepad } from '@fortawesome/free-solid-svg-icons';

interface Guide {
  id: number;
  title: string;
  excerpt: string;
}

export default function LandingPage() {
  const navigate = useNavigate();

  // Sample guides
  const guides: Guide[] = [
    {
      id: 1,
      title: 'How to Optimize Your Weapons',
      excerpt: 'Learn the best ways to choose and upgrade your weapons for maximum performance in Pixel Gun 3D.',
    },
    {
      id: 2,
      title: 'Strategies for Battle Royale Mode',
      excerpt: 'Master the Battle Royale mode with expert strategies to outlast your opponents.',
    },
    {
      id: 3,
      title: 'Team Play Tactics',
      excerpt: 'Discover how to coordinate with your clan for victory in team-based modes.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="bg-white shadow-lg p-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon icon={faBook} className="text-blue-600 text-3xl" />
          <h1 className="text-3xl font-extrabold tracking-tight">GuildMaster</h1>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-transform duration-200 transform hover:scale-105"
        >
          Login
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-8">
        {/* Hero Section with Blue Gradient */}
        <section className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-2xl py-16 px-8 mb-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-opacity-10 bg-black opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 tracking-tight animate-fade-in">
              Welcome to the GuildMaster
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Your ultimate resource for managing your clan with exclusive tips and strategies tailored for our clan members.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition-transform duration-200 transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faGamepad} className="mr-2" />
                Explore Guides
              </button>
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section id="guides">
          <h3 className="text-3xl font-semibold mb-8 flex items-center">
            <FontAwesomeIcon icon={faBook} className="text-blue-600 mr-3" />
            Guides and Tips
          </h3>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 blur-sm">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h4 className="text-xl font-bold mb-3 text-blue-600">{guide.title}</h4>
                <p className="mb-4 text-gray-700 leading-relaxed">{guide.excerpt}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors duration-200"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-lg p-6 text-center">
        <p className="text-sm text-gray-600">© 2025 GuildMaster - All Rights Reserved</p>
        <p className="text-sm text-gray-600 flex items-center justify-center mt-2">
          <FontAwesomeIcon icon={faUsers} className="text-blue-600 mr-2" />
          Exclusive for Clan Members
        </p>
      </footer>
    </div>
  );
}