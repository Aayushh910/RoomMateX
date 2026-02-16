import { useParams, Link } from 'react-router-dom';
import { mockRoommates } from '../data/mockData';
import { Navbar } from '../components/Navbar';

export const RoommateProfilePage = () => {
    const { id } = useParams();
    const roommate = mockRoommates.find(r => r.id === id);

    if (!roommate) {
        return <div className="p-8 text-center text-red-500">Roommate not found</div>;
    }

    return (
        <div className="min-h-screen flex flex-col pt-32">
            <Navbar />
            <div className="py-12 flex-1">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/rooms" className="text-gray-500 hover:text-gray-900 mb-6 inline-block">&larr; Back to Search</Link>

                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                        <div className="px-8 pb-8">
                            <div className="relative flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
                                <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg ring-1 ring-black/5 flex-shrink-0">
                                    <img src={roommate.profilePhoto} alt={roommate.name} className="w-full h-full object-cover rounded-xl" />
                                </div>
                                <div className="mb-2 flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                        {roommate.name}
                                        {roommate.verified && (
                                            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </h1>
                                    <p className="text-gray-500 text-lg">{roommate.occupation} • {roommate.age} years old</p>
                                </div>
                                <button className="mb-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-0.5">
                                    Connect Now
                                </button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-6">
                                    <div className="glass-panel p-6 rounded-2xl border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4">Details</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Gender</span>
                                                <span className="font-medium text-gray-900">{roommate.gender}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">City</span>
                                                <span className="font-medium text-gray-900">{roommate.city}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                        <h3 className="font-bold text-green-800 mb-4">Looking For</h3>
                                        <div className="space-y-2 text-sm">
                                            <p className="text-green-700"><span className="font-semibold">Type:</span> {roommate.lookingFor.roomType}</p>
                                            <p className="text-green-700"><span className="font-semibold">Budget:</span> ₹{roommate.lookingFor.budgetMin} - {roommate.lookingFor.budgetMax}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-8">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-3 text-lg">About Me</h3>
                                        <p className="text-gray-600 leading-relaxed">{roommate.about}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-3 text-lg">Preferences</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="w-full grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Roommate Gender</span>
                                                    <span className="font-medium text-gray-900">{roommate.preferences.genderPreference}</span>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                    <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Lifestyle</span>
                                                    <span className="font-medium text-gray-900">{roommate.preferences.lifestyle}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Interests</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {roommate.preferences.interests.map(interest => (
                                                        <span key={interest} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 hover:scale-105 transition-transform cursor-default">
                                                            {interest}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
