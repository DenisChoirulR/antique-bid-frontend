export default function ItemImage({ image }) {
    return (
        <div className="lg:col-span-3 w-full top-0 text-center">
            <div className="px-4 py-10 rounded-lg border-2 border-grey-300">
                <img src={image} alt="Product" className="w-3/4 rounded object-cover mx-auto" />
            </div>
        </div>
    );
}