import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center">
                <button onClick={() => navigate('/')}>
                    <h1 className="text-2xl font-bold text-blue-600">GuildMaster</h1>
                </button>
            </div>
        </header>
    );
}
