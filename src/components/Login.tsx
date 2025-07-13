


export default function Login() {
    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Login
            </h2>
            <div className="space-y-6">
                <div>
                    <p className="block text-sm font-medium text-gray-700">Username</p>
                    <input type="email" name="email" id="email"className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out" required/>
                </div>
                <div>
                    <p className="block text-sm font-medium text-gray-700">Code</p>
                    <input type="password" name="password" id="password" className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out" required/>
                </div>
            </div>
            <button className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out mt-5">
                Login
            </button>

        </div>
    );
};
