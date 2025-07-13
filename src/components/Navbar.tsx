
interface NavbarProps {
    isRegisterPage: boolean
}

const Navbar = ({ isRegisterPage}: NavbarProps) => {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">VA5 Family</h1>
            </div>
        </header>
    );
}

export default Navbar;