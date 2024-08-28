export default function SearchBar({ value, onChange }) {
    return (
        <input
            type="text"
            className="py-2 pl-4 rounded-xl border-2 border-indigo-300 focus:bg-slate-100 focus:outline-sky-500"
            value={value}
            onChange={onChange}
            placeholder="Search items..."
        />
    );
}