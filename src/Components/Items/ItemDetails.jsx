import { format } from 'date-fns';

export default function ItemDetails({
    item,
    bids,
    user,
    setIsBidPopupOpen,
    setIsAutoBidPopupOpen,
    autoBid,
    deactivateAutoBid
}) {
    return (
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">{item.name}</h2>
            <p>{item.description}</p>

            <div className="gap-4 mt-3 text-gray-600 text-sm">
                <p>Start Price: <strong>${item.starting_price}</strong></p>

                {bids.length > 0 && (
                    <p>Highest Bid: <span className="font-bold text-2xl">${item.current_price || item.starting_price} <span className="text-indigo-600">({bids[0].user})</span></span></p>
                )}
            </div>

            <div className="text-gray-600 text-sm">
                <p className="mt-2">Start Time: <strong>{format(new Date(item.start_time), 'PPP p')}</strong></p>
                <p>End Time: <strong>{format(new Date(item.end_time), 'PPP p')}</strong></p>
            </div>

            {user && user.role !== "admin" && item.status === 'in progress' ? (
                <>
                    <div className="mt-8">
                        <button
                            onClick={() => setIsBidPopupOpen(true)}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded"
                        >
                            Place Bid
                        </button>
                    </div>

                    <div className="mt-2">
                        {autoBid ? (
                            <div>
                                <p className="text-gray-800">Auto-bid is activated with a max amount of ${autoBid.max_bid_amount} and alert at {autoBid.bid_alert_percentage}%</p>
                                <button
                                    onClick={deactivateAutoBid}
                                    className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
                                >
                                    Deactivate Auto-Bid
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAutoBidPopupOpen(true)}
                                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded"
                            >
                                Activate Auto-Bid
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className="mt-8">
                    {user && user.role !== "admin" && (
                        <p className="text-red-600">The bidding is closed.</p>
                    )}
                </div>
            )}
        </div>
    );
}