

export default function AddGuide() {
    return (
        <div>
            <form action="" className="bg-white p-6 rounded-lg shadow">
                <div className="w-full flex flex-col mb-4 gap-5 items-center">
                    <input type="text" name="title" id="title" className="block w-full p-3 border border-gray-250 rounded-md" placeholder="title..."></input>
                    <textarea name="text" id="text" className="block w-full p-3 border border-gray-250 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition h-48 duration-150 ease-in-out" placeholder="Text..." required></textarea>
                    <button className="w-[150px] bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">Add</button>
                </div>
            </form>
        </div>
    )
}