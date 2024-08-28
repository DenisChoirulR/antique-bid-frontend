import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { format } from 'date-fns';

export default function BidOverview() {
    const [bids, setBids] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AppContext);

    async function getBidOverview() {
        try {
            const res = await fetch(`/api/overviews`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await res.json();

            if (res.ok) {
                setItems(data.data);
            } else {
                setError(data.data || "Failed to load bid overview.");
            }
        } catch (err) {
            setError("An error occurred while fetching the bid overview.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBidOverview();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const getStatusBadge = (status) => {
        let colorClass = "";
        switch (status) {
            case "won":
                colorClass = "bg-green-100 text-green-800";
                break;
            case "in progress":
                colorClass = "bg-yellow-100 text-yellow-800";
                break;
            case "lost":
                colorClass = "bg-red-100 text-red-800";
                break;
            default:
                colorClass = "bg-gray-100 text-gray-800";
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Bidding Overview</h2>
            {items.length === 0 ? (
                <div>No Items found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left border-b">Item</th>
                                <th className="px-4 py-2 text-left border-b">Current Price</th>
                                <th className="px-4 py-2 text-left border-b">End Time</th>
                                <th className="px-4 py-2 text-left border-b">Status</th>
                                <th className="px-4 py-2 text-left border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2 border-b">
                                        <Link
                                            to={`/items/${item.id}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        ${item.current_price}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {/* Format date as needed */}
                                        {format(new Date(item.end_time), 'PPP p')}
                                    </td>
                                    <td className="px-4 py-2 border-b capitalize">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {item.status === 'won' && (
                                            <Link
                                                to={`/bill/${item.id}`}
                                                className="text-green-500 hover:underline"
                                            >
                                                View Bill
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}