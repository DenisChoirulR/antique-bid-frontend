import { format } from 'date-fns';

export default function BiddingHistory({ bids }) {
    return (
        <div className="text-gray-800">
            <h3 className="text-lg font-bold mb-4">Bidding History</h3>
            <ul>
                {bids.length === 0 ? (
                    <p>No bids placed yet.</p>
                ) : (
                    <ul className="mt-4 space-y-4">
                        {bids.map((bid) => (
                            <li key={bid.id} className="border-t pt-2">
                                <p className="text-gray-600 text-sm">
                                    <strong>{bid.user}</strong> placed a bid of ${bid.bid_amount} on {format(new Date(bid.created_at), 'PPP p')}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </ul>
        </div>
    );
}