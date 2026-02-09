import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockRoommates } from '../data/mockData';
import { Modal } from '../components/ui/Modal';

export const RoommateProfilePage = () => {
  const { id } = useParams();
  const [roommate, setRoommate] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const found = mockRoommates.find(rm => rm.id === id);
    setRoommate(found);
  }, [id]);

  if (!roommate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Roommate Profile</span>
        </div>

        <div className="card p-8">
          {/* Header */}
          <div className="flex items-start mb-8">
            <img
              src={roommate.profilePhoto}
              alt={roommate.name}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{roommate.name}</h1>
                {roommate.verified && (
                  <svg className="w-7 h-7 text-blue-500 ml-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <span>{roommate.age} years old</span>
                <span>•</span>
                <span>{roommate.gender}</span>
                <span>•</span>
                <span>{roommate.occupation}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {roommate.city}
              </div>
            </div>
            <button onClick={() => setShowContactModal(true)} className="btn-primary">
              Contact Roommate
            </button>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{roommate.about}</p>
          </div>

          {/* Looking For */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Looking For</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Room Type</span>
                <span className="font-semibold badge badge-info">{roommate.lookingFor.roomType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Budget Range</span>
                <span className="font-semibold">₹{roommate.lookingFor.budgetMin}k - ₹{roommate.lookingFor.budgetMax}k per month</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-2">Gender Preference</p>
                <span className="badge badge-info">{roommate.preferences.genderPreference}</span>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Lifestyle</p>
                <p className="font-medium text-gray-900">{roommate.preferences.lifestyle}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {roommate.preferences.interests.map((interest, idx) => (
                    <span key={idx} className="badge badge-success">{interest}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Verification */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Trust & Verification</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-green-800">
                    {roommate.verified ? 'Verified Profile' : 'Profile Not Verified'}
                  </p>
                  <p className="text-sm text-green-700">
                    {roommate.verified 
                      ? 'This user has been verified by RoomMateX' 
                      : 'Verification pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Contact Roommate">
        <div className="space-y-4">
          <p className="text-gray-700">You can contact this roommate using the details below:</p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-semibold">{roommate.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone Number</p>
              <a href={`tel:${roommate.phone}`} className="font-semibold text-primary-600 hover:text-primary-700">
                {roommate.phone}
              </a>
            </div>
          </div>
          <button onClick={() => setShowContactModal(false)} className="w-full btn-primary">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};
