import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const Bill = () => {
    const { id } = useParams();
    const { token } = useContext(AppContext);
    const [billDetails, setBillDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBillDetails = async () => {
            try {
                const res = await fetch(`/api/items/${id}/bill`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await res.json();

                if (res.ok) {
                    setBillDetails(data.data);
                } else {
                    setError(data.data || "Failed to load bid overview.");
                }

            } catch (err) {
                setError("Failed to load bill details.");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBillDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8 mb-8">
            <h1 className="font-bold text-2xl my-4 text-center text-indigo-600">AntiqueBid</h1>
            <hr className="mb-2" />
            <div className="mb-8">
                <h1 className="text-lg font-bold">Invoice</h1>
                <div className="text-gray-700">
                    <div>Date: {new Date(billDetails.created_at).toLocaleDateString()}</div>
                    <div>Invoice: #{billDetails.id}</div>
                </div>
            </div>
            <div className="mb-8">
                <h2 className="text-lg font-bold">Status:</h2>
                <div className="text-gray-700">{billDetails.status}</div>
            </div>
            <div className="mb-8">
                <h2 className="text-lg font-bold">Bill To:</h2>
                <div className="text-gray-700">{billDetails.user.name}</div>
                <div className="text-gray-700">{billDetails.user.email}</div>
            </div>
            <table className="w-full mb-8">
                <thead>
                    <tr>
                        <th className="text-left font-bold text-gray-700">Item</th>
                        <th className="text-right font-bold text-gray-700">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-left text-gray-700">{billDetails.item.name}</td>
                        <td className="text-right text-gray-700">${billDetails.amount}</td>
                    </tr>
                </tbody>

            </table>
            <div className="text-gray-700 mb-2">Thank you for your business!</div>
            <div className="text-gray-700 text-sm">Please remit payment by {new Date(billDetails.payment_due_date).toLocaleDateString()}</div>
        </div>
    );
};

export default Bill;