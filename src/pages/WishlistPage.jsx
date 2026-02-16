import { Navbar } from '../components/Navbar';

export const WishlistPage = () => {
    return (
        <div className="min-h-screen flex flex-col pt-32">
            <Navbar />
            <div className="p-8 flex items-center justify-center flex-1">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
                    <p className="text-gray-500 mt-2">Currently empty. Start adding rooms you like!</p>
                </div>
            </div>
        </div>
    );
};
