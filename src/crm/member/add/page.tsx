import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddMember from "../../../components/Members/Add";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


export default function AddMemberPage() {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row h-screen">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="w-[90%] mx-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
                            <span>Add Member</span>
                        </h2>
                    </div>
                    <div className="w-[90%] mx-auto">
                        <AddMember />
                    </div>
                </main>
            </div>
        </div>
    )
}