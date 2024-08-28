import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications }) {
    return (
        <div className="grid grid-cols-1 gap-4">
            {notifications.length === 0 ? (
                <div>No notifications found.</div>
            ) : (
                notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                    />
                ))
            )}
        </div>
    );
}