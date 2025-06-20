import React, { useEffect, useState, ChangeEvent } from 'react';
import { useStore } from '../store/useStore';
import { LoadingModal } from './LoadingModal';
import { useApiCall } from '../hooks/useApiCall';

interface SubredditManagementProps {
  sub_sov_id: string;
}

export const SubredditManagement: React.FC<SubredditManagementProps> = ({
  sub_sov_id,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subDescription, setSubDescription] = useState('');
  const { user, userSubs, fetchUserSubs, joinOrUnjoinSub } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const { execute: fetchSubData } = useApiCall(
    async () => {
      if (!user) throw new Error('User not authenticated');
      await fetchUserSubs(user.sov_id);
    },
    {
      successMessage: 'Subreddit data loaded successfully',
      errorMessage: 'Failed to load subreddit data',
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    }
  );

  const { execute: handleJoinOrUnjoin, isLoading: isJoining } = useApiCall(
    async () => {
      if (!user) throw new Error('User not authenticated');
      await joinOrUnjoinSub(user.sov_id, sub_sov_id);
      await fetchSubData();
    },
    {
      successMessage: 'Subreddit status updated successfully',
      errorMessage: 'Failed to update subreddit status',
    }
  );

  useEffect(() => {
    if (user) {
      fetchSubData();
    }
  }, [user, sub_sov_id]);

  const isJoined = userSubs.some((sub) => sub.sub_sov_id === sub_sov_id);

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSubDescription(e.target.value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Subreddit Management
            </h1>
            {user && (
              <button
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isJoined
                    ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                    : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                } ${isJoining ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleJoinOrUnjoin()}
                disabled={isJoining}
              >
                {isJoining ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  isJoined ? 'Leave Subreddit' : 'Join Subreddit'
                )}
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <LoadingModal isOpen={true} message="Loading subreddit data..." />
        ) : (
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Subreddit Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300">Subreddit ID: {sub_sov_id}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">Description: {subDescription}</p>
            </div>

            {isJoined && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
                onClick={openModal}
              >
                Edit Description
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Edit Subreddit Description
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={subDescription}
                  onChange={handleDescriptionChange}
                  placeholder="Enter subreddit description..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 