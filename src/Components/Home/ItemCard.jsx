import { Link } from "react-router-dom";
import { format } from 'date-fns';

export default function ItemCard({ item, user, onDelete, navigate }) {
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
        <div className="flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
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
                    {truncateText(item.description, 100)}
                </p>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-600">
                    Start Time: {format(new Date(item.start_time), 'PPP p')}
                </p>
                <p className={`block font-sans text-sm antialiased font-normal leading-normal mb-4 ${new Date(item.end_time) < new Date() ? 'text-red-600' : 'text-green-500'}`}>
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
                {user && user.role === "admin" && (
                    <div className="flex mt-4">
                        <Link to={`/items/${item.id}/edit`} className="text-sm text-yellow-500 font-medium mr-5 hover:underline">
                            Edit
                        </Link>
                        <button
                            onClick={onDelete}
                            className="text-sm text-red-500 font-medium hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}