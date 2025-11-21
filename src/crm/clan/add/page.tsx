import AddClan from "../../../components/Clans/Add";
import Navbar from "../../../components/Navbar";


export default function AddClanPage() {
    return (
        <>
        <Navbar />
        <header className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
                <AddClan />
            </div>
        </header>
        </>
    )
}