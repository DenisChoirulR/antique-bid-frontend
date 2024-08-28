export default function NotificationItem({ notification }) {
    return (
        <div
            className={`border rounded-lg p-4 shadow-md ${notification.read_at === null ? "bg-gray-100" : "bg-white"}`}
        >
            <div className="text-lg font-bold">
                {notification.title}
            </div>
            <div className="text-sm text-gray-600">
                {notification.data.message}
            </div>
            <div className="text-sm text-gray-600">
                <span>Received: </span>
                <span>{new Date(notification.created_at).toLocaleString()}</span>
            </div>
        </div>
    );
}