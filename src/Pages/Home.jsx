import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { AppContext } from "../Context/AppContext";
import SearchBar from "../Components/Home/SearchBar"
import SortControls from "../Components/Home/SortControls";
import ItemCard from "../Components/Home/ItemCard";
import { fetchItems } from "../utils/api";

export default function Home() {
    const { token, user } = useContext(AppContext);
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("current_price");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    useEffect(() => {
        async function loadItems() {
            const { data, meta } = await fetchItems({
                token,
                page: currentPage,
                search,
                sortBy,
                sortOrder
            });
            setItems(data);
            setTotalPages(meta.last_page);
            setCurrentPage(meta.current_page);
        }
        loadItems();
    }, [currentPage, search, sortBy, sortOrder, token]);

    const handlePageClick = (data) => setCurrentPage(data.selected + 1);
    const handleSearch = (e) => { setSearch(e.target.value); setCurrentPage(1); };
    const handleSortChange = (e) => { setSortBy(e.target.value); setCurrentPage(1); };
    const handleSortOrderChange = (e) => { setSortOrder(e.target.value); setCurrentPage(1); };

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
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                <SearchBar value={search} onChange={handleSearch} />
                <SortControls
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                    onSortOrderChange={handleSortOrderChange}
                />
            </div>

            {items.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                user={user}
                                onDelete={() => handleDelete(item.id)}
                                navigate={navigate}
                            />
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
    );
}