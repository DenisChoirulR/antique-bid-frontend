import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context/AppContext";

export default function Layout() {
    const { user, token, setUser, setToken, loading } = useContext(AppContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!loading && user == null) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        async function fetchUnreadNotifications() {
            const res = await fetch("/api/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                const unreadCount = data.data.filter(notification => notification.is_read === 0).length;
                setUnreadCount(unreadCount);
            }
        }

        if (user) {
            fetchUnreadNotifications();
        }
    }, [user, token]);

    async function handleLogout(e) {
        e.preventDefault();

        const res = await fetch("/api/auth/logout", {
            method: "post",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            navigate("/login");
        }
    }

    return (
        <>
            <header className="flex justify-between items-center text-black py-6 px-8 md:px-32 bg-white drop-shadow-md">
                <a href="#" className="text-2xl hover:scale-105 transition-all">
                    AntiqueBid <p className="text-slate-400 text-xs"></p>
                </a>

                <div className="flex items-center gap-12 font-semibold text-base">
                    {/* Display a welcome message with the user's name */}
                    {user && (
                        <p className="hidden xl:block text-indigo-600">
                            Welcome, <span className="font-bold">{user.name}</span>!
                        </p>
                    )}

                    <ul className="hidden xl:flex items-center gap-12">
                        <Link to="/" className="p-3 hover:bg-indigo-600 hover:text-white rounded-md transition-all cursor-pointer">
                            Home
                        </Link>

                        {/* Conditionally render Create Item link if user is an admin */}
                        {user && user.role === 'admin' && (
                            <Link to="/items/create" className="p-3 hover:bg-indigo-600 hover:text-white rounded-md transition-all cursor-pointer">
                                Create Item
                            </Link>
                        )}

                        {user && user.role !== 'admin' && (
                            <>
                                <Link to="/bids" className="p-3 hover:bg-indigo-600 hover:text-white rounded-md transition-all cursor-pointer">
                                    Bid History
                                </Link>

                                <Link to="/notifications" className="relative p-3 hover:bg-indigo-600 hover:text-white rounded-md transition-all cursor-pointer">
                                    <i className="bx bx-bell text-2xl"></i>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

                        <li className="p-3 hover:bg-indigo-600 hover:text-white rounded-md transition-all cursor-pointer">
                            <form onSubmit={handleLogout}>
                                <button>Logout</button>
                            </form>
                        </li>
                    </ul>

                    <i onClick={() => setIsMenuOpen(!isMenuOpen)} className="bx bx-menu xl:hidden block text-5xl cursor-pointer"></i>
                </div>

                {isMenuOpen ? (
                    <div
                        className="absolute xl:hidden top-24 left-0 w-full bg-white flex flex-col items-center gap-6 font-semibold text-lg transform transition-transform opacity-100"
                        style={{ transition: "transform 0.3s ease", zIndex: 9999 }}
                    >
                        {user && (
                            <p className="w-full text-center p-4">
                                Welcome, <span className="font-bold">{user.name}</span>!
                            </p>
                        )}

                        <Link to="/" className="list-none w-full text-center p-4 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                            Home
                        </Link>

                        {/* Conditionally render Create Item link if user is an admin */}
                        {user && user.role === 'admin' && (
                            <Link to="/items/create" className="list-none w-full text-center p-4 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                                Create Item
                            </Link>
                        )}

                        {user && user.role !== 'admin' && (
                            <>
                                <Link to="/bids" className="list-none w-full text-center p-4 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                                    Bid History
                                </Link>
                                <Link to="/notifications" className="relative list-none w-full text-center p-4 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                                    Notifications
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

                        <li className="list-none w-full text-center p-4 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                            <form onSubmit={handleLogout}>
                                <button>Logout</button>
                            </form>
                        </li>
                    </div>
                ) : ``}
            </header >

            <main>
                <Outlet />
            </main>
        </>
    );
}