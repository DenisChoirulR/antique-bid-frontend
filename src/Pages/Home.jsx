import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { AppContext } from "../Context/AppContext";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { token, user } = useContext(AppContext); // Assuming 'user' contains the user's role
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("current_price");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    async function getItems(page = 1) {
        const query = new URLSearchParams({
            page: page,
            search: search,
            sort_by: sortBy,
            sort_order: sortOrder
        }).toString();

        const res = await fetch(`/api/items?${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();

        if (res.ok) {
            setItems(data.data);
            setTotalPages(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
        }
    }

    useEffect(() => {
        getItems(currentPage);
    }, [currentPage, search, sortBy, sortOrder]);

    function handlePageClick(data) {
        setCurrentPage(data.selected + 1);
    }

    function handleSearch(e) {
        setSearch(e.target.value);
        setCurrentPage(1);
    }

    function handleSortChange(e) {
        setSortBy(e.target.value);
        setCurrentPage(1);
    }

    function handleSortOrderChange(e) {
        setSortOrder(e.target.value);
        setCurrentPage(1);
    }

    async function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            const res = await fetch(`/api/items/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log(res);

            if (res.ok) {
                setItems(prevItems => prevItems.filter(item => item.id !== id));
            }
        }
    }

    return (
        <>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <div className="hidden md:flex items-center justify-center gap-3">
                        <input type="text" className="py-2 pl-4 rounded-xl border-2 border-indigo-300 focus:bg-slate-100 focus:outline-sky-500" value={search} onChange={handleSearch} placeholder="Search items..." />
                    </div>
                    <div className="flex space-x-4">
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="border border-indigo-300 bg-white text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="current_price">Price</option>
                            <option value="name">Name</option>
                        </select>

                        <select
                            value={sortOrder}
                            onChange={handleSortOrderChange}
                            className="border border-indigo-300 bg-white text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>

                {items.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {items.map(item => (
                                <div key={item.id} className="flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
                                    <div className="mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-96">
                                        <img
                                            src={item.image_full_path}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-grow p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                                                {item.name}
                                            </p>
                                            <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                                                ${item.current_price}
                                            </p>
                                        </div>
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75 mb-4">
                                            {item.description}
                                        </p>
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-600">
                                            Start Time: {format(new Date(item.start_time), 'PPP p')}
                                        </p>
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-600 mb-4">
                                            End Time: {format(new Date(item.end_time), 'PPP p')}
                                        </p>
                                    </div>
                                    <div className="p-6 pt-0 mt-auto">
                                        <button
                                            onClick={() => navigate(`/items/${item.id}`)}
                                            className="align-middle w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            type="button">
                                            Bid Now
                                        </button>
                                        {user && user.role === "admin" && ( // Check if user is defined and role is admin
                                            <div className="flex mt-4">
                                                <Link to={`/items/${item.id}/edit`} className="text-sm text-yellow-500 font-medium mr-5 hover:underline">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-sm text-red-500 font-medium hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-6">
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={totalPages}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination flex gap-2"}
                                activeClassName={"bg-indigo-600 text-white"}
                                pageClassName={"px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300"}
                                previousClassName={"px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300"}
                                nextClassName={"px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300"}
                                disabledClassName={"disabled"}
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">No items found.</p>
                )}
            </div>
        </>
    );
}