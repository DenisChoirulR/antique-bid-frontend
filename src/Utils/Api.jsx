export async function fetchItems({ token, page, search, sortBy, sortOrder }) {
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

    if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch items');
    }

    return data;
}