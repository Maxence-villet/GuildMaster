import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import ViewGuide from "../../../components/Guides/View";



export default function ViewGuidePage() {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row h-screen">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="w-[90%] mx-auto">
                        <ViewGuide />
                    </div>
                </main>
            </div>
        </div>
    )
}