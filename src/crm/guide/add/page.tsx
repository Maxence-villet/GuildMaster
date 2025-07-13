import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddGuide from "../../../components/Guides/Add";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


export default function AddGuidePage() {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row h-screen">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="w-[90%] mx-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
                            <span>Add Guide</span>
                        </h2>
                    </div>
                    <div className="w-[90%] mx-auto">
                        <AddGuide />
                    </div>
                </main>
            </div>
        </div>
    )
}