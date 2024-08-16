import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { format } from 'date-fns';

export default function BidHistory() {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AppContext);

    async function getBidHistory() {
        try {
            const res = await fetch(`/api/bids`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await res.json();

            if (res.ok) {
                setBids(data.data);
            } else {
                setError(data.data || "Failed to load bid history.");
            }
        } catch (err) {
            setError("An error occurred while fetching the bid history.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBidHistory();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Your Bid History</h2>
            {bids.length === 0 ? (
                <div>No bids found.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {bids.map((bid) => (
                        <div key={bid.id} className="border rounded-lg p-4 bg-white shadow-md">
                            <Link to={`/items/${bid.item.id}`} className="text-lg font-bold text-blue-500 hover:underline">
                                {bid.item.name}
                            </Link>
                            <div className="text-sm text-gray-600">
                                <span>Bid Amount: </span>
                                <span>${bid.bid_amount}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                <span>Bid Placed: </span>
                                <span>{format(new Date(bid.created_at), 'PPP p')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}