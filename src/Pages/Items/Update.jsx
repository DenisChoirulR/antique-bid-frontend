import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

export default function Update() {
    const navigate = useNavigate();
    const { token, user } = useContext(AppContext);
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: null,
        description: "",
        starting_price: "",
        start_time: "",
        end_time: "",
    });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/"); // Redirect to home if the user is not an admin
        }
    }, [user, navigate]);

    const [errors, setErrors] = useState({});

    async function fetchItem() {
        const res = await fetch(`/api/items/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();

        if (res.ok) {
            setFormData({
                name: data.data.name || "",
                slug: data.data.slug || "",
                image: null,
                description: data.data.description || "",
                starting_price: data.data.starting_price || "",
                start_time: data.data.start_time || "",
                end_time: data.data.end_time || "",
            });
        } else {
            console.error('err', data);
        }
    }

    function handleInputChange(e) {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    }

    function formatDateTime(value) {
        const date = new Date(value);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    async function handleUpdate(e) {
        e.preventDefault();

        const form = new FormData();
        form.append("_method", "PUT");
        form.append("start_time", formatDateTime(formData.start_time));
        form.append("end_time", formatDateTime(formData.end_time));

        for (const key in formData) {
            if (key !== "start_time" && key !== "end_time" && formData[key]) {
                form.append(key, formData[key]);
            }
        }

        const res = await fetch(`/api/items/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: form,
        });

        const data = await res.json();
        console.log('res', data);

        if (!res.ok) {
            if (data.data) {
                setErrors(data.data);
            }
        } else {
            navigate("/");
        }
    }

    useEffect(() => {
        fetchItem();
    }, []);

    const formatDateTimeLocal = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <div className="py-10">
            <form
                onSubmit={handleUpdate}
                className="max-w-xl mx-auto p-8 bg-white shadow-md rounded-md"
            >

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.slug ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.slug && (
                        <p className="text-red-500 text-sm mt-1">{errors.slug[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="mt-1 block w-full text-gray-700"
                    />
                    {errors.image && (
                        <p className="text-red-500 text-sm mt-1">{errors.image[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.description ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    ></textarea>
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Starting Price</label>
                    <input
                        type="number"
                        name="starting_price"
                        value={formData.starting_price}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.starting_price
                            ? "border-red-500"
                            : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.starting_price && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.starting_price[0]}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Start Time</label>
                    <input
                        type="datetime-local"
                        name="start_time"
                        value={formatDateTimeLocal(formData.start_time)}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.start_time ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.start_time && (
                        <p className="text-red-500 text-sm mt-1">{errors.start_time[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">End Time</label>
                    <input
                        type="datetime-local"
                        name="end_time"
                        value={formatDateTimeLocal(formData.end_time)}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.end_time ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.end_time && (
                        <p className="text-red-500 text-sm mt-1">{errors.end_time[0]}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Update Item
                </button>
            </form>
        </div>
    );
}