export default function BidPopup({ bidAmount, setBidAmount, placeBid, errors, setIsBidPopupOpen }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Place Your Bid</h2>
                <form onSubmit={placeBid}>
                    <div className="mb-4">
                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">Bid Amount</label>
                        <input
                            type="number"
                            id="bidAmount"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-4 py-2"
                        />
                        {errors.bid_amount && <p className="text-red-500 text-xs mt-2">{errors.bid_amount}</p>}
                    </div>
                    <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded">
                        Submit Bid
                    </button>
                </form>
                <button
                    onClick={() => setIsBidPopupOpen(false)}
                    className="mt-4 w-full py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
}