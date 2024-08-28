import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContext } from "./Context/AppContext";
import { useContext } from "react";

import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Create from "./Pages/Items/Create";

import Show from "./Pages/Items/Show";
import Update from "./Pages/Items/Update";
import "./App.css";
import BidHistory from "./Pages/Bids/BidHistory";
import Notifications from "./Pages/Notification";
import BidOverview from "./Pages/Bids/BidOverview";
import Bill from "./Pages/Bids/Bill";

export default function App() {
    const { user } = useContext(AppContext);

    return (
        <BrowserRouter>
            <div className="w-full min-h-full absolute bg-gray-50 dark:bg-gray-900">
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/items/create" element={<Create />} />
                        <Route path="/items/:id" element={<Show />} />
                        <Route path="/items/:id/edit" element={<Update />} />
                        <Route path="/bids" element={<BidHistory />} />
                        <Route path="/bidding-overview" element={<BidOverview />} />
                        <Route path="/bill/:id" element={<Bill />} />
                        <Route path="/notifications" element={<Notifications />} />
                    </Route>

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
