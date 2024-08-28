import { useEffect, useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import NotificationList from "../Components/Notification/NotificationList";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AppContext);

    async function getNotifications() {
        try {
            const res = await fetch(`/api/notifications`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await res.json();

            if (res.ok) {
                setNotifications(data.data);
            } else {
                setError(data.data || "Failed to load notifications.");
            }
        } catch (err) {
            setError("An error occurred while fetching the notifications.");
        } finally {
            setLoading(false);
        }
    }

    async function markAllAsRead() {
        try {
            const res = await fetch(`/api/notifications/read-all`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!res.ok) {
                console.error("Failed to mark notifications as read.");
            }
        } catch (err) {
            console.error("An error occurred while marking notifications as read.");
        }
    }

    useEffect(() => {
        markAllAsRead();
        getNotifications();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <NotificationList notifications={notifications} />
        </div>
    );
}