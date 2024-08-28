export default function SortControls({ sortBy, sortOrder, onSortChange, onSortOrderChange }) {
    return (
        <div className="flex space-x-4">
            <select
                value={sortBy}
                onChange={onSortChange}
                className="border border-indigo-300 bg-white text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="current_price">Price</option>
                <option value="name">Name</option>
            </select>

            <select
                value={sortOrder}
                onChange={onSortOrderChange}
                className="border border-indigo-300 bg-white text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    );
}