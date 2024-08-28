import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import ItemImage from "../../Components/Items/ItemImage";
import ItemDetails from "../../Components/Items/ItemDetails";
import BiddingHistory from "../../Components/Items/BiddingHistory";
import BidPopup from "../../Components/Items/BidPopup";
import AutoBidPopup from "../../Components/Items/AutoBidPopup";

export default function Show() {
    const { id } = useParams();
    const { token, user } = useContext(AppContext);
    const [item, setItem] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState("");
    const [autoBid, setAutoBid] = useState("");
    const [autoBidMaxAmount, setAutoBidMaxAmount] = useState("");
    const [bidAlertPercentage, setBidAlertPercentage] = useState("");
    const [errors, setErrors] = useState({});
    const [bidSuccess, setBidSuccess] = useState(null);
    const [autoBidSuccess, setAutoBidSuccess] = useState(null);
    const [isBidPopupOpen, setIsBidPopupOpen] = useState(false);
    const [isAutoBidPopupOpen, setIsAutoBidPopupOpen] = useState(false);

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
            setAutoBid(data.data.auto_bid);
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
        if (res.ok) {
            setBidSuccess("Bid placed successfully!");
            setErrors({});
            getItem();
            setIsBidPopupOpen(false);
        } else {
            setErrors(data.data);
        }
    }

    async function activateAutoBid(e) {
        e.preventDefault();

        const res = await fetch(`/api/bids/auto-bid`, {
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
        if (res.ok) {
            setAutoBidSuccess("Auto-bid activated successfully!");
            setErrors({});
            getItem();
            setIsAutoBidPopupOpen(false);
        } else {
            setErrors(data.data);
        }
    }

    async function deactivateAutoBid() {
        const res = await fetch(`/api/bids/auto-bid/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (res.ok) {
            setAutoBidSuccess("Auto-bid deactivated successfully!");
            getItem();
        } else {
            console.error("Failed to deactivate auto-bid");
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
                    <ItemImage image={item.image_full_path} />

                    {/* Details and Actions Section */}
                    <ItemDetails
                        item={item}
                        bids={bids}
                        user={user}
                        setIsBidPopupOpen={setIsBidPopupOpen}
                        setIsAutoBidPopupOpen={setIsAutoBidPopupOpen}
                        autoBid={autoBid}
                        deactivateAutoBid={deactivateAutoBid}
                    />
                </div>
                <div className="mt-5 grid-cols-1 lg:grid-cols-5 gap-12 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 rounded-lg">
                    <BiddingHistory bids={bids} />
                </div>
            </div>

            {/* Popup for Place Bid */}
            {isBidPopupOpen && (
                <BidPopup
                    bidAmount={bidAmount}
                    setBidAmount={setBidAmount}
                    placeBid={placeBid}
                    errors={errors}
                    setIsBidPopupOpen={setIsBidPopupOpen}
                />
            )}

            {/* Popup for Activate Auto-Bid */}
            {isAutoBidPopupOpen && (
                <AutoBidPopup
                    autoBidMaxAmount={autoBidMaxAmount}
                    bidAlertPercentage={bidAlertPercentage}
                    setAutoBidMaxAmount={setAutoBidMaxAmount}
                    setBidAlertPercentage={setBidAlertPercentage}
                    activateAutoBid={activateAutoBid}
                    errors={errors}
                    setIsAutoBidPopupOpen={setIsAutoBidPopupOpen}
                />
            )}
        </div>
    );
}