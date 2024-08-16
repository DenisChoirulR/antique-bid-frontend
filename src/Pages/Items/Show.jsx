import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { format } from 'date-fns';

export default function Show() {
    const { id } = useParams();
    const { token, user } = useContext(AppContext); // Assuming user context includes role information
    const [item, setItem] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState("");
    const [autoBidMaxAmount, setAutoBidMaxAmount] = useState("");
    const [bidAlertPercentage, setBidAlertPercentage] = useState("");
    const [errors, setErrors] = useState({});
    const [bidSuccess, setBidSuccess] = useState(null);  // Success message for Place Bid
    const [autoBidSuccess, setAutoBidSuccess] = useState(null);  // Success message for Auto-Bid

    async function getItem() {
        const res = await fetch(`/api/items/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();
        if (res.ok) {
            setItem(data.data);
            setBids(data.data.bids);

            setAutoBidMaxAmount(data.data.auto_bid?.max_bid_amount);
            setBidAlertPercentage(data.data.auto_bid?.bid_alert_percentage)
        } else {
            console.error(data.message);
        }
    }

    async function placeBid(e) {
        e.preventDefault();

        const res = await fetch(`/api/bids`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                item_id: id,
                bid_amount: bidAmount,
            }),
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            setBidSuccess("Bid placed successfully!");  // Set success message for Place Bid
            setErrors({});
            getItem();
        } else {
            setErrors(data.data);
        }
    }

    async function activateAutoBid(e) {
        e.preventDefault();

        const res = await fetch(`/api/bids/activate-auto-bid`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                item_id: id,
                max_bid_amount: autoBidMaxAmount,
                bid_alert_percentage: bidAlertPercentage,
            }),
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            setAutoBidSuccess("Auto-bid activated successfully!");  // Set success message for Auto-Bid
            setErrors({});
            getItem();
        } else {
            setErrors(data.data);
        }
    }

    useEffect(() => {
        getItem();
    }, [id]);

    if (!item) return <div>Loading...</div>;

    return (
        <div className="font-sans bg-white">
            <div className="p-4 lg:max-w-7xl max-w-4xl mx-auto">
                {/* Main Content */}
                <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 rounded-lg">
                    {/* Image Section */}
                    <div className="lg:col-span-3 w-full top-0 text-center">
                        <div className="px-4 py-10 rounded-lg border-2 border-grey-300">
                            <img src={item.image_full_path} alt="Product" className="w-3/4 rounded object-cover mx-auto" />
                        </div>
                    </div>

                    {/* Details and Actions Section */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-extrabold text-gray-800">{item.name}</h2>

                        <div className="gap-4 mt-8">
                            <p className="text-gray-400 text-base">Start Price <span className="font-bold">${item.starting_price}</span></p>
                            <p className="text-gray-800 text-3xl">Current Price <span className="font-bold">${item.current_price || item.starting_price}</span></p>
                        </div>

                        {/* Item Description, Start Time, and End Time */}
                        <div className="mt-4 text-gray-600 text-sm">
                            <p>{item.description}</p>
                            <p className="mt-2"><strong>Start Time:</strong> {format(new Date(item.start_time), 'PPP p')}</p>
                            <p><strong>End Time:</strong> {format(new Date(item.end_time), 'PPP p')}</p>
                        </div>

                        {/* Place Bid Form - User Only */}
                        {user.role !== 'admin' && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-gray-800">Place Your Bid</h3>
                                <form onSubmit={placeBid} className="space-y-4 mt-4">
                                    <div>
                                        <label
                                            htmlFor="bidAmount"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Enter Your Bid
                                        </label>
                                        <input
                                            id="bidAmount"
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder="Enter your bid"
                                            className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-4 py-2"
                                        />
                                        {errors.bid_amount && (
                                            <p className="text-red-500 text-sm mt-2">{errors.bid_amount[0]}</p>
                                        )}
                                        {errors.item_id && (
                                            <p className="text-red-500 text-sm mt-2">{errors.item_id[0]}</p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded"
                                    >
                                        Place Bid
                                    </button>
                                    {bidSuccess && (
                                        <p className="text-green-500 text-sm mt-2">{bidSuccess}</p>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Auto-Bid Form - User Only */}
                        {user && user.role !== "admin" && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-gray-800">Activate Auto-Bid</h3>
                                <form onSubmit={activateAutoBid} className="space-y-4 mt-4">
                                    <div>
                                        <label
                                            htmlFor="autoBidMaxAmount"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Max Bid Amount
                                        </label>
                                        <input
                                            id="autoBidMaxAmount"
                                            type="number"
                                            value={autoBidMaxAmount}
                                            onChange={(e) => setAutoBidMaxAmount(e.target.value)}
                                            placeholder="Enter your max bid amount"
                                            className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-4 py-2"
                                        />
                                        {errors.max_bid_amount && (
                                            <p className="text-red-500 text-sm mt-2">{errors.max_bid_amount[0]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="bidAlertPercentage"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Bid Alert Percentage
                                        </label>
                                        <input
                                            id="bidAlertPercentage"
                                            type="number"
                                            value={bidAlertPercentage}
                                            onChange={(e) => setBidAlertPercentage(e.target.value)}
                                            placeholder="Enter bid alert percentage"
                                            className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-4 py-2"
                                        />
                                        {errors.bid_alert_percentage && (
                                            <p className="text-red-500 text-sm mt-2">{errors.bid_alert_percentage[0]}</p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded"
                                    >
                                        Save
                                    </button>
                                    {autoBidSuccess && (
                                        <p className="text-green-500 text-sm mt-2">{autoBidSuccess}</p>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-800">Bidding History</h3>
                    {bids.length === 0 ? (
                        <p>No bids placed yet.</p>
                    ) : (
                        <ul className="mt-4 space-y-4">
                            {bids.map((bid) => (
                                <li key={bid.id} className="border-t pt-2">
                                    <p className="text-gray-600 text-sm">
                                        <strong>{bid.user.name}</strong> placed a bid of ${bid.amount} on {format(new Date(bid.created_at), 'PPP p')}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}