import { useState } from "react";
import Login from "../../components/Login";


export default function LoginPage() {
    
    return (
        <>
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">VA5 Family</h1>
            </div>

        </header>
        <header className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
                <Login />
            </div>
        </header>
        </>
    )
}