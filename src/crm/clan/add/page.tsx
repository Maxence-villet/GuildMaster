import { useState } from "react";
import AddClan from "../../../components/Clans/Add";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";


export default function AddClanPage() {
    const navigate = useNavigate();
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