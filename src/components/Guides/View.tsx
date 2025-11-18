import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Guide {
  id: number;
  title: string;
  author_id: number;
  author_name: string;
  text: string;
  created_at: string;
}

interface ViewGuideProps {
  guide: Guide | null;
  loading: boolean;
  error: string | null;
  canDelete: boolean;
  onDelete: () => void;
}

export default function ViewGuide({ guide, loading, error, canDelete, onDelete }: ViewGuideProps) {

  const { user } = useAuth();
  const navigate = useNavigate();

  if(!user) {
    navigate('/login');
  }

  if(user?.role === "leader") {
    canDelete = true;
  }


  
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">{guide.title}</h1>
        {canDelete && (
          <button
            onClick={onDelete}
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete
          </button>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-2">By {guide.author_name}</p>
      <p className="text-gray-600 text-sm mb-4">Posted on {new Date(guide.created_at).toLocaleString()}</p>
      <div className="text-black leading-relaxed overflow-y-auto h-64 whitespace-pre-wrap">
        {guide.text}
      </div>
    </div>
  );
}